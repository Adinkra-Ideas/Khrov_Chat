import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { Chat_union, Chat_history, User } from '@prisma/client'; 
import UpdateChatDTO from './dto/update-chat.dto';
import NewChatDTO from './dto/new-chat.dto';
import SetSeenDTO from './dto/set-seen.dto';


@Injectable()
export class ChatHistoryService {
  constructor(private prisma: PrismaService) {}

  async getChatHistory(chatUnion: number): Promise<Chat_union | boolean> {
    try {
     const resolve: Chat_union = await this.prisma.chat_union.findUniqueOrThrow({
        where: {
          unionId: chatUnion,
        },
        include: {
          client2: {
            select: {
              userName: true,
              profile_pics: {
                select: {
                  avatar: true,
                },
              },
            }
          },
          chat_historys: {
            orderBy: {
              time: 'desc'
            },
            select: {
              outgoing: true,
              incoming: true,
              time: true,
              deliveryStatus: true,
            },
          },
        },  
      });
      return resolve;
    } catch (error) {
      return false;
    }
  }

  async updateChats(chatPayload : UpdateChatDTO[]): Promise<boolean> {
    for( let singleChatKey in chatPayload ) {
      let singleChatObject: UpdateChatDTO = chatPayload[singleChatKey];
      if ( singleChatObject.deliveryStatus === 'pending' )
        if ( await this.insertMsgToDb(singleChatObject) === false )
          return false;
    }
    return true;
  }
  private insertMsgToDb = async (singleChatObject: UpdateChatDTO): Promise<boolean> => {
    // calling .findUniqueOrThrow() in a try catch block to throw error 
    // incase findUniqueOrThrow() or our setup sub conditions are not met
    try {
      // verify that singleChatObject.unionId exists in Chat_union Table
      // and its block status is false
      const status1: {blockStatus: boolean} = await this.prisma.chat_union.findUniqueOrThrow({
        where: {
          unionId: singleChatObject.unionId,
        },
        select: {
          blockStatus: true,
        }
      });
      if ( status1.blockStatus === true ) {
        throw new Error('Blocked from messaging');
      }
      // verify that singleChatObject.unionIdOther exists in Chat_union Table
      // and its block status is false
      const status2: {blockStatus: boolean} = await this.prisma.chat_union.findUniqueOrThrow({
        where: {
          unionId: singleChatObject.unionIdOther,
        },
        select: {
          blockStatus: true,
        }
      });
      if ( status2.blockStatus === true ) {
        throw new Error('Blocked from messaging');
      }
    } catch(error) {
      return false;
    }
    // inserting two copies of the chat into Chat_history
    // first insert directly for sender using clientUnionID,
    // then insert indirectly for receiver using oppositeClientUnionId
    const insert: { count: number } = await this.prisma.chat_history.createMany({
      data: [
        { 
          unionId: singleChatObject.unionId,
          outgoing: singleChatObject.outgoing,
          time: singleChatObject.time,
          deliveryStatus: 'sent'
        },
        {
          unionId: singleChatObject.unionIdOther,
          incoming: singleChatObject.outgoing,
          time: singleChatObject.time,
          deliveryStatus: 'sent'
        }
      ]
    })
    // then increment by 1 the unreadcount of oppositeClientUnionId. Signalling +1 new unread
    // we do not have to worry about prisma.update() exception coz already handled above
    await this.prisma.chat_union.update({
      where: { 
        unionId: singleChatObject.unionIdOther, 
      },
      data: {
        unreadCount: {
          increment: 1,
        },
      }
    });
    // Then refresh my unionId in chat history so that the createdAt column will refresh
    // for the ordering of listed conversation in my view screen
    await this.prisma.chat_union.update({
      where: { 
        unionId: singleChatObject.unionId 
      },
      data: {
        unionId: singleChatObject.unionId
      }
    });
  }

  // Performs the actions required to make a new message
  // from two people who are not yet friends 
  async newChat(newChat: NewChatDTO): Promise<boolean> {
    try {
      // if senderId or receiverId not present in 'user' table, throw
      await this.prisma.user.findUniqueOrThrow({
        where: {
          id: newChat.senderId,
        },
      });
      await this.prisma.user.findUniqueOrThrow({
        where: {
          id: newChat.receiverId,
        },
      });
    } catch(error) {
      return false;
    }
    //if (senderId is client1Id where receiverId is client2Id in 'Chat_union' Table), count+=1
    let alreadyExisting: number = 0;
    let senderIdUnionId: number = 0;
    let receiverIdUnionId: number = 0;
    await this.prisma.chat_union.findMany({
      where: {
          client1Id: newChat.senderId,
          client2Id: newChat.receiverId,
        },
      select: {
          unionId: true,
          unionIdOther: true,
        },
      })
      .then(data => {
        if (data.length) {
          alreadyExisting+=1;
          senderIdUnionId = data[0].unionId;
          receiverIdUnionId = data[0].unionIdOther;
        }
      })
    //if (receiverId is client1Id where senderId is client2Id in 'Chat_union' Table), count+=1
    await this.prisma.chat_union.findMany({
      where: {
          client1Id: newChat.receiverId,
          client2Id: newChat.senderId,
        },
      include: {
        },
      })
      .then(data => {
        if (data.length) {
          alreadyExisting+=1;
        }
      });
    // if alreadyExisting == 1, it means there is an error in Chat_union table
    if ( alreadyExisting == 1 ){
      return false;
    }
    // if already existing == 0, we have to create Chat_union for both
    // then and retrieve their UnionIDs respectively.
    // Here we are creating Chat_union for senderId, using a placeholder
    // value of 0, to suspend unionIdOther coz receiverId has no unionId yet
    if ( alreadyExisting == 0 ) {
      await this.prisma.chat_union.create({
        data: { 
          client1Id: newChat.senderId,
          client2Id: newChat.receiverId,
          unionIdOther: 0
        },
        select: {
          unionId: true,
        }
      })
      .then(data => {senderIdUnionId = data.unionId});
      // Here we are creating Chat_union forreceiverId, using senderId's newly-
      // created unionId as value of unionIdOther column
      await this.prisma.chat_union.create({
        data: { 
          client2Id: newChat.senderId,
          client1Id: newChat.receiverId,
          unionIdOther: senderIdUnionId
        },
        select: {
          unionId: true,
        }
      })
      .then(data => {receiverIdUnionId = data.unionId});
      // Here we are replacing placeholder value of 0 that we placed in senderId's
      // unionIdOther column in the earlier part, with newly-created receiverIdUnionId
      await this.prisma.chat_union.update({
        where: { 
          unionId: senderIdUnionId, 
        },
        data: {
          unionIdOther: receiverIdUnionId,
        }
      });
    }
    // At this point both senderId and receiverId are guaranteed to have their
    // union established in chat_union table already. with
    // senderIdUnionId and receiverIdUnionId storing the unionIDs respectively
    // so we simply call this.insertMsgToDb() function to insert the message
    // according to its set rules
    const chatToObject: UpdateChatDTO = {
      outgoing: newChat.msg,
      time: new Date().toISOString(),
      deliveryStatus: 'sent',
      unionId: senderIdUnionId,
      unionIdOther: receiverIdUnionId,
    }
    if ( await this.insertMsgToDb(chatToObject) === false ){
      return false;
    }
  }

  // **************************************************************************
  // The SetSeenDTO.meReceiver is the unionId of the client who               *
  // just 'seen' the message.                                                 *
  // The SetSeenDTO.theySender is the unionId of the client who               *
  // sent the message.                                                        *
  // This function sets the SetSeenDTO.theySender copy of chat_history        *
  // deliveryStatus to seen. So that they can see that SetSeenDTO.meReceiver  *
  // has seen their message.                                                  *
  // Then It sets the SetSeenDTO.meReceiver notification of new message       *
  // about their conversation with SetSeenDTO.theySender to 0                 *
  // **************************************************************************
  async setSeen(chatDetails: SetSeenDTO): Promise<boolean> {
    try{
      // As I step into my msg view, set all the union in chat_history where I am incoming
      // (meaning where I am the msg receiver) to 'Seen' (affects nobody in front view)
      // await this.prisma.chat_history.updateMany({
      //   where: {
      //     unionId: chatDetails.meReceiver,
      //     outgoing: null,
      //     deliveryStatus: {
      //       in: ['sent', 'delivered']
      //     },
      //   },
      //   data: {
      //     deliveryStatus: 'seen'
      //   },
      // });
      // set all the union in chat_history where oppositeunion is outgoing to 'Seen'
      // meaning they will see that their outgoing message to me has been seen
      await this.prisma.chat_history.updateMany({
        where: {
          unionId: chatDetails.theySender,
          incoming: null,
          deliveryStatus: {
            in: ['sent', 'delivered']
          },
        },
        data: {
          deliveryStatus: 'seen'
        },
      });
      // if unreadcount of my union in chat_union is greater than 0,
      // reset unreadcount of my union in chat_union to 0
      // meaning this conversation wont count among my unreadCount notif
      const unreadCnt: {unreadCount: number} = await this.prisma.chat_union.findUniqueOrThrow({
            where: {
              unionId: chatDetails.meReceiver,
            },
            select: {
              unreadCount: true,
            }
          });
      if ( unreadCnt.unreadCount > 0 ) {
        await this.prisma.chat_union.update({
          where: { 
            unionId: chatDetails.meReceiver, 
          },
          data: {
            unreadCount: 0
          }
        });
      }

    } catch (error) {
      return false;
    }
  }

  async deleteChatHistory(union: number): Promise<boolean> {
    try {
      await this.prisma.chat_history.deleteMany({
        where: { 
          unionId: union,
        },
      })
    } catch (error) {
      return false;
    }
  }

}
