import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { ChatHistoryResultDto } from './dto/chat-history.dto'
import { UpdateChatDto } from './dto/update-chat.dto'
import { NewChatDto } from './dto/new-chat.dto'
import { SetSeenDto } from './dto/set-seen.dto'
import { ChatConnectionsResultDto } from './dto/chat-connections.dto'
import { GetBlockedResultDto } from './dto/get-blocked.dto'
import { SearchUsersResultDto } from './dto/search-users.dto'
import { ChatsGateway } from './chats.gateway'
import * as fs from 'fs'

@Injectable()
export class ChatsService {
  constructor(
    private prisma: PrismaService,
    private gateway: ChatsGateway
  ) {}

  async getChatHistory(chatUnion: number): Promise<ChatHistoryResultDto | boolean> {
    try {
      const output: ChatHistoryResultDto = await this.prisma.chat_union.findUniqueOrThrow({
        where: {
          unionId: chatUnion
        },
        include: {
          client2: {
            select: {
              userName: true,
              profile_pics: {
                select: {
                  avatar: true
                }
              }
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
              deliveryStatus: true
            }
          }
        }
      })
      return output
    } catch (error) {
      return false
    }
  }

  async updateChats(chatPayload: UpdateChatDto[]): Promise<boolean> {
    for (const singleChatKey in chatPayload) {
      const singleChatObject: UpdateChatDto = chatPayload[singleChatKey]
      if (singleChatObject.deliveryStatus === 'pending') {
        if ((await this.insertMsgToDb(singleChatObject)) === false) {
          return false
        } else {
          return true
        }
      }
    }
  }
  private insertMsgToDb = async (singleChatObject: UpdateChatDto): Promise<boolean> => {
    try {
      const status1: { blockStatus: boolean } = await this.prisma.chat_union.findUniqueOrThrow({
        where: {
          unionId: singleChatObject.unionId
        },
        select: {
          blockStatus: true
        }
      })
      if (status1.blockStatus === true) {
        throw new Error('Blocked from messaging')
      }

      const status2: { blockStatus: boolean } = await this.prisma.chat_union.findUniqueOrThrow({
        where: {
          unionId: singleChatObject.unionIdOther
        },
        select: {
          blockStatus: true
        }
      })
      if (status2.blockStatus === true) {
        throw new Error('Blocked from messaging')
      }
    } catch (error) {
      return false
    }

    const filterRegex = /[^a-zA-Z\d?@!üöäßÜÖÄ ,.'^\n]/gi
    if (singleChatObject.outgoing.replace(filterRegex, '').length === 0) return false
    if (singleChatObject.outgoing.match(/^ädäeäcäläiänäeä$|^äaäcäcäeäpätä$/)) {
      await this.prisma.chat_history.updateMany({
        where: {
          unionId: singleChatObject.unionId,
          incoming: 'äiänäväiätäeä'
        },
        data: {
          incoming: singleChatObject.outgoing
        }
      })
      await this.prisma.chat_history.updateMany({
        where: {
          unionId: singleChatObject.unionIdOther,
          outgoing: 'äiänäväiätäeä'
        },
        data: {
          outgoing: singleChatObject.outgoing
        }
      })
    } else {
      await this.prisma.chat_history.createMany({
        data: [
          {
            unionId: singleChatObject.unionId,
            outgoing: singleChatObject.outgoing.replace(filterRegex, ''),
            time: singleChatObject.time,
            deliveryStatus: 'sent'
          },
          {
            unionId: singleChatObject.unionIdOther,
            incoming: singleChatObject.outgoing.replace(filterRegex, ''),
            time: singleChatObject.time,
            deliveryStatus: 'sent'
          }
        ]
      })
    }

    await this.prisma.chat_union.update({
      where: {
        unionId: singleChatObject.unionIdOther
      },
      data: {
        unreadCount: {
          increment: 1
        }
      }
    })

    await this.prisma.chat_union.update({
      where: {
        unionId: singleChatObject.unionId
      },
      data: {
        unionId: singleChatObject.unionId
      }
    })
    this.gateway.emitToAll('new-chat-event', singleChatObject.unionIdOther)
    this.gateway.emitToAll('new-chat-event', singleChatObject.unionId)
  }

  async newChat(newChat: NewChatDto, senderId: number): Promise<boolean> {
    try {
      await this.prisma.user.findUniqueOrThrow({
        where: {
          id: senderId
        }
      })
      await this.prisma.user.findUniqueOrThrow({
        where: {
          id: newChat.receiverId
        }
      })
    } catch (error) {
      return false
    }

    let alreadyExisting: number = 0
    let senderIdUnionId: number = 0
    let receiverIdUnionId: number = 0
    await this.prisma.chat_union
      .findMany({
        where: {
          client1Id: senderId,
          client2Id: newChat.receiverId
        },
        select: {
          unionId: true,
          unionIdOther: true
        }
      })
      .then((data) => {
        if (data.length) {
          alreadyExisting += 1
          senderIdUnionId = data[0].unionId
          receiverIdUnionId = data[0].unionIdOther
        }
      })

    await this.prisma.chat_union
      .findMany({
        where: {
          client1Id: newChat.receiverId,
          client2Id: senderId
        },
        include: {}
      })
      .then((data) => {
        if (data.length) {
          alreadyExisting += 1
        }
      })

    if (alreadyExisting == 1) {
      return false
    }

    if (alreadyExisting == 0) {
      await this.prisma.chat_union
        .create({
          data: {
            client1Id: senderId,
            client2Id: newChat.receiverId,
            unionIdOther: 0
          },
          select: {
            unionId: true
          }
        })
        .then((data) => {
          senderIdUnionId = data.unionId
        })

      await this.prisma.chat_union
        .create({
          data: {
            client2Id: senderId,
            client1Id: newChat.receiverId,
            unionIdOther: senderIdUnionId
          },
          select: {
            unionId: true
          }
        })
        .then((data) => {
          receiverIdUnionId = data.unionId
        })

      await this.prisma.chat_union.update({
        where: {
          unionId: senderIdUnionId
        },
        data: {
          unionIdOther: receiverIdUnionId
        }
      })
    }

    const filterRegex = /[^a-zA-Z\d?@!üöäßÜÖÄ ,.'^\n]/gi
    if (newChat.msg.replace(filterRegex, '').length === 0) return false
    const chatToObject: UpdateChatDto = {
      outgoing: newChat.msg.replace(filterRegex, ''),
      time: new Date().toISOString(),
      deliveryStatus: 'sent',
      unionId: senderIdUnionId,
      unionIdOther: receiverIdUnionId
    }
    if ((await this.insertMsgToDb(chatToObject)) === false) {
      return false
    }
    this.gateway.emitToAll('new-chat-event', 0)
  }

  async setSeen(chatDetails: SetSeenDto): Promise<boolean> {
    try {
      await this.prisma.chat_history.updateMany({
        where: {
          unionId: chatDetails.theySender,
          incoming: null,
          deliveryStatus: {
            in: ['sent', 'delivered']
          }
        },
        data: {
          deliveryStatus: 'seen'
        }
      })

      const unreadCnt: { unreadCount: number } = await this.prisma.chat_union.findUniqueOrThrow({
        where: {
          unionId: chatDetails.meReceiver
        },
        select: {
          unreadCount: true
        }
      })
      if (unreadCnt.unreadCount > 0) {
        await this.prisma.chat_union.update({
          where: {
            unionId: chatDetails.meReceiver
          },
          data: {
            unreadCount: 0
          }
        })
        this.gateway.emitToAll('new-chat-event', 0)
      }
    } catch (error) {
      return false
    }
  }

  async deleteChatHistory(union: number): Promise<boolean> {
    try {
      await this.prisma.chat_history.deleteMany({
        where: {
          unionId: union
        }
      })
      this.gateway.emitToAll('new-chat-event', union)
    } catch (error) {
      return false
    }
  }

  async chatConnections(userId: number): Promise<ChatConnectionsResultDto[]> {
    const connections = await this.prisma.chat_union.findMany({
      where: {
        client1Id: {
          equals: userId
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
            // updatedAt: true,
            profile_pics: {
              select: {
                avatar: true
              }
            }
          }
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
            deliveryStatus: true
          }
        }
      }
    })

    for (const key in connections) {
      const myUnionId = connections[key].unionId
      const otherUnionId = connections[key].unionIdOther

      if (connections[key].chat_historys[0]) {
        if (
          connections[key].chat_historys[0].deliveryStatus === 'sent' &&
          connections[key].chat_historys[0].incoming
        ) {
          await this.prisma.chat_history.updateMany({
            where: {
              unionId: {
                in: [myUnionId, otherUnionId]
              },
              deliveryStatus: 'sent'
            },
            data: {
              deliveryStatus: 'delivered'
            }
          })
        }
      } else {
        delete connections[key]
      }
    }

    const result: ChatConnectionsResultDto[] = []
    for (const key in connections) {
      if (connections[key] != null) result.push(connections[key])
    }
    return result
  }

  async getBlocked(userId: number): Promise<GetBlockedResultDto[]> {
    return await this.prisma.chat_union.findMany({
      where: {
        client1Id: userId,
        blockStatus: true,
        allowedToUnblock: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        client2: {
          select: {
            userName: true,
            profile_pics: {
              select: {
                avatar: true
              }
            }
          }
        }
      }
    })
  }

  async blockUser(blockedId: number, blockerId: number): Promise<boolean> {
    if ((await this.verifyUserIDs(blockedId, blockerId)) === false) {
      return false
    }

    let [blockerUnionId, blockedUnionId] = await this.verifyUnionIDs(blockedId, blockerId)

    if (!blockerUnionId || !blockedUnionId) {
      ;[blockerUnionId, blockedUnionId] = await this.createUnionIDs(blockedId, blockerId)

      if (!blockerUnionId || !blockedUnionId) {
        return false
      }
    }

    await this.prisma.chat_union.update({
      where: {
        unionId: blockerUnionId
      },
      data: {
        blockStatus: true,
        allowedToUnblock: true
      }
    })
    const final = await this.prisma.chat_union.update({
      where: {
        unionId: blockedUnionId
      },
      data: {
        blockStatus: true
      }
    })
    if (final) {
      this.gateway.emitToAll('new-chat-event', blockedUnionId)
      this.gateway.emitToAll('new-chat-event', blockerUnionId)
      return true
    }
  }
  async unblockUser(blockedId: number, blockerId: number): Promise<boolean> {
    if ((await this.verifyUserIDs(blockedId, blockerId)) === false) {
      return false
    }

    const [blockerUnionId, blockedUnionId] = await this.verifyUnionIDs(blockedId, blockerId)

    if (!blockerUnionId || !blockedUnionId) {
      return false
    }

    try {
      await this.prisma.chat_union.update({
        where: {
          unionId: blockerUnionId,
          blockStatus: true,
          allowedToUnblock: true
        },
        data: {
          blockStatus: false,
          allowedToUnblock: false
        }
      })
      await this.prisma.chat_union.update({
        where: {
          unionId: blockedUnionId
        },
        data: {
          blockStatus: false,
          allowedToUnblock: false
        }
      })
      this.gateway.emitToAll('new-chat-event', blockedUnionId)
      this.gateway.emitToAll('new-chat-event', blockerUnionId)
    } catch (error) {
      return false
    }
  }

  private async createUnionIDs(blockedId: number, blockerId: number): Promise<number[]> {
    try {
      let blockerUnionId: number = 0
      let blockedUnionId: number = 0
      await this.prisma.chat_union
        .create({
          data: {
            client1Id: blockerId,
            client2Id: blockedId,
            unionIdOther: 0
          },
          select: {
            unionId: true
          }
        })
        .then((data) => {
          blockerUnionId = data.unionId
        })
      await this.prisma.chat_union
        .create({
          data: {
            client2Id: blockerId,
            client1Id: blockedId,
            unionIdOther: blockerUnionId
          },
          select: {
            unionId: true
          }
        })
        .then((data) => {
          blockedUnionId = data.unionId
        })

      await this.prisma.chat_union.update({
        where: {
          unionId: blockerUnionId
        },
        data: {
          unionIdOther: blockedUnionId
        }
      })
      return [blockerUnionId, blockedUnionId]
    } catch (error) {
      return [0, 0]
    }
  }

  private async verifyUnionIDs(blockedId: number, blockerId: number): Promise<number[]> {
    let blockerUnionId: number = 0
    let blockedUnionId: number = 0
    try {
      await this.prisma.chat_union
        .findFirstOrThrow({
          where: {
            client1Id: blockerId,
            client2Id: blockedId
          },
          select: {
            unionId: true,
            unionIdOther: true
          }
        })
        .then((data) => {
          blockerUnionId = data.unionId
          blockedUnionId = data.unionIdOther
        })
      return [blockerUnionId, blockedUnionId]
    } catch (error) {
      return [0, 0]
    }
  }

  private async verifyUserIDs(blockedId: number, blockerId: number): Promise<boolean> {
    try {
      await this.prisma.user.findUniqueOrThrow({
        where: {
          id: blockerId
        }
      })
      await this.prisma.user.findUniqueOrThrow({
        where: {
          id: blockedId
        }
      })
    } catch (error) {
      return false
    }
  }

  async searchUsers(key: string, searcherId: number): Promise<SearchUsersResultDto[]> {
    const searchKeyFilterRegex = /[^a-zA-Z\d]/gi
    const searchKey = key.replace(searchKeyFilterRegex, '')

    const output: SearchUsersResultDto[] = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            userName: {
              startsWith: searchKey,
              mode: 'insensitive'
            }
          },
          {
            name: {
              startsWith: searchKey,
              mode: 'insensitive'
            }
          },
        ],
        NOT: {
          id: searcherId
        }
      },
      // orderBy: {
      //   updatedAt: 'desc'
      // },
      take: 10,
      select: {
        id: true,
        userName: true,
        // createdAt: true,
        profile_pics: {
          select: {
            avatar: true
          }
        }
      }
    })

    let i: number = 0
    for (const key in output) {
      const other = output[key]
      const otherId = other.id
      try {
        await this.prisma.chat_union.findFirstOrThrow({
          where: {
            client1Id: searcherId,
            client2Id: otherId,
            blockStatus: true
          },
          include: {}
        })

        output.splice(i, 1)
      } catch (error) {}
      i++
    }

    return output
  }

  private async chatAvatarHealth() {
    const allUsers = await this.prisma.user.findMany({
      where: {},
      orderBy: { id: 'desc' },
      take: 100, // last 100 users will be checked // MIGHT CONSIDER REDUCING THIS NUMMBER IN FUTURE
      select: {
        id: true
      }
    })
    for (const key in allUsers) {
      const oneUser = allUsers[key]
      try {
        await this.prisma.profile_pic.findFirstOrThrow({
          where: { userId: oneUser.id }
        })
      } catch (error) {
        await this.prisma.profile_pic.create({ data: { userId: oneUser.id } })
      }
    }
  }
  // async chatHealth(avatarId: number, userId: number) {
  //   const avatarPath = await this.prisma.userAvatar
  //     .findFirst({
  //       where: { id: avatarId },
  //       select: { filename: true }
  //     })
  //     .then((data) => {
  //       return data ? data.filename : null
  //     })
  //   if (avatarPath) {
  //     try {
  //       const fullPath = './files/' + avatarPath + '.jpg'
  //       const base64Img = `data:image/gif;base64, ${fs.readFileSync(fullPath, {
  //         encoding: 'base64'
  //       })}`
  //       await this.prisma.profile_pic.upsert({
  //         where: { userId: userId },
  //         update: { avatar: base64Img },
  //         create: {
  //           userId: userId,
  //           avatar: base64Img
  //         }
  //       })
  //     } catch {
  //       console.log(`Error reading ./files/${avatarPath}.jpg`)
  //     }
  //   }
  //   const totalUsers = await this.prisma.user.count()
  //   const chatAppUsers = await this.prisma.profile_pic.count()
  //   if (totalUsers > chatAppUsers) this.chatAvatarHealth()
  // }
}
