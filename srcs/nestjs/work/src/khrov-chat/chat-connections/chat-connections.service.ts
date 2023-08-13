import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { Chat_union, Chat_history } from '@prisma/client';  

@Injectable()
export class ChatConnectionsService {

  constructor(private prisma: PrismaService) {}

  async chatConnections(userId: number ): Promise<object | boolean> { 
    // first we generate the objects for our chat_preview listings
    // and store it to connections variable 
    const connections: object = await this.prisma.chat_union.findMany({
      where: {
        client1Id: {
          equals: userId,
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        client2: {
          select: {
            userName: true,
            email: true,
            name: true,
            updatedAt: true,
            profile_pics: {
              select: {
                avatar: true,
              },
            },
          },
        },
        chat_historys: {
          orderBy: {
            time: 'desc'
          },
          take: 1,
          select: {
            unionId: true,
            outgoing: true,
            incoming: true,
            time: true,
            deliveryStatus: true,
          },
        },
      },
    });


    // *********************************************************
    // Lets change the status of all downloaded chat messages  *
    // from 'sent' to 'delivered'                              *
    // *********************************************************
    // const Destconnections: object = {};
    // let flag: boolean = false;
    for (let key in connections) {
      const myUnionId = connections[key].unionId;
      const otherUnionId = connections[key].unionIdOther;
      // If the message 'was sent to me' (AKA 'incoming' != null), 
      // and the deliverystatus == sent
      // replace all messages between me and the sender 
      // in chat_history table with deliverystatus=='delivered'
      if (connections[key].chat_historys[0]) // if this is false, means there is no message between I and this unionId. Will have to drop this block in else statement
      {
        if (connections[key].chat_historys[0].deliveryStatus === 'sent'
          && connections[key].chat_historys[0].incoming ){
          await this.prisma.chat_history.updateMany({
            where: {
              unionId: {
                in: [myUnionId, otherUnionId]
              },
              deliveryStatus: 'sent'
            },
            data: {
              deliveryStatus: 'delivered'
            },
          });
        }
      } else // meaning this block has no conversations yet. will have to drop it from the 'connectiong' object to avoid error in the frontend
      {
        delete connections[key];
      }      
    }    

    // Because deleting members from object leaves thos nodes as 'null'
    // this will create problem for frontend when iterating over object
    // we need to clean the 'null' nodes out of our object
    let cleaned = Object.fromEntries(Object.entries(connections).filter(([_, v]) => v != null));
    
    return cleaned;
  }
}
