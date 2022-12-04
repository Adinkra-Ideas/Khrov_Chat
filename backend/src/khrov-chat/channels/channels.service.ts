import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { AddChannelDto } from './dto/add-channel.dto'
import { SuggestedChannelsResultDto } from './dto/suggested-channels.dto'
import { SearchChannelsResultDto } from './dto/search-channels.dto'
import { JoinOrExitChannelDto } from './dto/join-or-exit-channel.dto'
import { ChannConnectionsResultDto } from './dto/chann-connections.dto'
import { ChannHistoryResultDto } from './dto/chann-history.dto'
import { UpdateChannDto } from './dto/update-chann.dto'
import { SetSeenDto } from './dto/set-seen.dto'
import * as bcrypt from 'bcrypt'
import { ErrorValue } from './enums/error-value.enum'
import { ModerateUsersDto } from './dto/moderate-users.dto'
import { GetMemberIdDto } from './dto/get-member-id.dto'
import { PendingApprovalsDto, PendingApprovalsResultDto } from './dto/pending-approvals.dto'
import { ApproveOrRejectDto } from './dto/approve-or-reject.dto'
import { ModifyChannelDto } from './dto/modify-channel.dto'
import { ChannelsGateway } from './channels.gateway'

@Injectable()
export class ChannelsService {
  constructor(
    private prisma: PrismaService,
    private gateway: ChannelsGateway
  ) {}

  async suggestedChannels(userId: number): Promise<SuggestedChannelsResultDto[] | ErrorValue> {
    try {
      await this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId
        }
      })
    } catch (error) {
      return ErrorValue.NO_USER
    }

    const output: any[] = await this.prisma.channel_link.findMany({
      where: {},
      orderBy: {
        updatedAt: 'desc'
      },
      take: 500,
      include: {
        ch: {
          select: {
            id: true,
            name: true,
            desc: true,
            visibility: true
          }
        }
      }
    })

    const ourCache = {}
    for (const key in output) {
      const outputElem = output[key]

      const banned = await this.prisma.channel_link.findFirst({
        where: {
          userId: userId,
          chId: outputElem.chId,
          linkStatus: 'banned'
        },
        include: {}
      })
      if (banned) {
        continue
      }

      const chKey: number = outputElem.chId
      const tmp = {
        id: outputElem.chId,
        name: outputElem.ch.name,
        desc: outputElem.ch.desc,
        visibility: outputElem.ch.visibility,
        role: ''
      }

      ourCache[chKey] = tmp

      if (Object.keys(ourCache).length == 20) {
        break
      }
    }

    for (const key in ourCache) {
      const uniqueChannel = ourCache[key]
      try {
        const output = await this.prisma.channel_link.findFirstOrThrow({
          where: {
            chId: uniqueChannel.id,
            userId: userId
          },
          select: {
            role: true
          }
        })

        ourCache[key].role = output.role
      } catch (error) {
        ourCache[key].role = 'not'
      }
    }

    const result: SuggestedChannelsResultDto[] = []
    for (const key in ourCache) {
      result.push(ourCache[key])
    }

    return result
  }

  async joinOrExitChannel(requestProps: JoinOrExitChannelDto, userId: number): Promise<string> {
    const theChannel = await this.prisma.channel.findUnique({
      where: {
        id: requestProps.chId
      },
      include: {}
    })
    if (!theChannel) {
      return `Unknown Channel!`
    }

    if (requestProps.joinOrExit === false) {
      const deleteLink = await this.prisma.channel_link.deleteMany({
        where: {
          userId: userId,
          chId: requestProps.chId
        }
      })

      if (deleteLink.count > 0) {
        await this.prisma.channel_history.create({
          data: {
            chId: requestProps.chId,
            userId: userId,
            outgoing: '',
            deliveryStatus: 'exited'
          }
        })
        this.gateway.emitToAll('new-channel-event', 0)
        return `You have left channel ${theChannel.name} Successfully`
      } else {
        return `Nothing to process!`
      }
    } else if (requestProps.joinOrExit === true) {
      try {
        const checkBanned = await this.prisma.channel_link.findFirstOrThrow({
          where: {
            chId: requestProps.chId,
            userId: userId
          }
        })

        if (checkBanned.linkStatus == 'banned') {
          return `You are banned from ${theChannel.name} channel`
        } else {
          return `You are already a member of ${theChannel.name} channel`
        }
      } catch (error) {}

      try {
        await this.prisma.channel_pending.findFirstOrThrow({
          where: {
            chId: requestProps.chId,
            userId: userId
          }
        })

        return `Your previous request to join ${theChannel.name} channel is still under moderation!`
      } catch (error) {}

      if (theChannel.visibility == 'public') {
        await this.prisma.channel_link.create({
          data: {
            chId: requestProps.chId,
            userId: userId,
            role: 'user',
            linkStatus: 'good',
            channel_historys: {
              create: [
                {
                  chId: requestProps.chId,
                  userId: userId,
                  outgoing: 'joined',
                  deliveryStatus: 'joined'
                }
              ]
            }
          }
        })
        this.gateway.emitToAll('new-channel-event', 0)
        return `You are now a member of ${theChannel.name} channel`
      } else if (theChannel.visibility == 'password') {
        const isMatch = await bcrypt.compare(requestProps.password, theChannel.password)
        if (!isMatch) {
          return `Please contact ${theChannel.name} channel Admins for right access password`
        }
        await this.prisma.channel_link.create({
          data: {
            chId: requestProps.chId,
            userId: userId,
            role: 'user',
            linkStatus: 'good',
            channel_historys: {
              create: [
                {
                  chId: requestProps.chId,
                  userId: userId,
                  outgoing: 'joined',
                  deliveryStatus: 'joined'
                }
              ]
            }
          }
        })
        this.gateway.emitToAll('new-channel-event', 0)
        return `You are now a member of ${theChannel.name} channel`
      } else if (theChannel.visibility == 'private') {
        await this.prisma.channel_pending.create({
          data: {
            chId: requestProps.chId,
            userId: userId
          }
        })
        this.gateway.emitToAll('new-channel-event', 0)
        return `Your request to join ${theChannel.name} channel is now awaiting moderation`
      }
    }
    return 'Your request was not understood!'
  }

  async searchChannels(
    key: string,
    userId: number
  ): Promise<SearchChannelsResultDto[] | ErrorValue> {
    try {
      await this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId
        }
      })
    } catch (error) {
      return ErrorValue.NO_USER
    }

    const searchKeyFilterRegex = /[^a-zA-Z\d]/gi
    const searchKey = key.replace(searchKeyFilterRegex, '')

    const output = await this.prisma.channel.findMany({
      where: {
        OR: [
          {
            name: {
              startsWith: searchKey,
              mode: 'insensitive'
            }
          },
          {
            desc: {
              contains: searchKey,
              mode: 'insensitive'
            }
          }
        ]
      },
      take: 10,
      select: {
        id: true,
        name: true,
        desc: true,
        visibility: true
      }
    })

    const ourCache = {}
    for (const key in output) {
      const uniqueChannel = output[key]
      try {
        const result = await this.prisma.channel_link.findFirstOrThrow({
          where: {
            chId: uniqueChannel.id,
            userId: userId
          },
          select: {
            role: true,
            linkStatus: true
          }
        })

        if (result.linkStatus != 'banned') {
          ourCache[uniqueChannel.id] = uniqueChannel
          ourCache[uniqueChannel.id].role = result.role
        }
      } catch (error) {
        ourCache[uniqueChannel.id] = uniqueChannel
        ourCache[uniqueChannel.id].role = 'not'
      }
    }

    const result: SearchChannelsResultDto[] = []
    for (const key in ourCache) {
      result.push(ourCache[key])
    }

    return result
  }

  async addChannel(addChannelDto: AddChannelDto, userId: number): Promise<ErrorValue> {
    try {
      await this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId
        }
      })
    } catch (error) {
      return ErrorValue.NO_USER
    }

    try {
      await this.prisma.channel.findUniqueOrThrow({
        where: {
          name: addChannelDto.name
        }
      })
      return ErrorValue.CHANNEL_EXISTS
    } catch (error) {}

    const saltOrRounds = 10
    const hash = await bcrypt.hash(addChannelDto.password, saltOrRounds)

    let channelId: number
    const result = await this.prisma.channel
      .create({
        data: {
          name: addChannelDto.name,
          desc: addChannelDto.desc,
          visibility: addChannelDto.visibility,
          password: hash
        },
        select: {
          id: true
        }
      })
      .then((data) => {
        channelId = data.id
        return ErrorValue.SUCCESS
      })
      .catch(() => {
        return ErrorValue.CREATION_ERROR
      })

    if (result === ErrorValue.CREATION_ERROR) {
      return ErrorValue.CREATION_ERROR
    }

    const linkResult = await this.prisma.channel_link
      .create({
        data: {
          chId: channelId,
          userId: userId,
          role: 'owner',
          linkStatus: 'good'
        },
        select: {
          chId: true
        }
      })
      .then((data) => {
        return data.chId
      })

    if (linkResult) {
      this.gateway.emitToAll('new-channel-event', 0)
      return ErrorValue.SUCCESS
    }
  }

  async channConnections(userId: number): Promise<ChannConnectionsResultDto[] | ErrorValue> {
    try {
      await this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId
        }
      })
    } catch (error) {
      return ErrorValue.NO_USER
    }

    const connections: ChannConnectionsResultDto[] = await this.prisma.channel_link.findMany({
      where: {
        userId: {
          equals: userId
        },
        NOT: {
          linkStatus: 'banned'
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      select: {
        chId: true,
        role: true,
        linkStatus: true,
        mutedUntil: true,
        unreadCount: true,
        ch: {
          select: {
            name: true,
            desc: true,
            visibility: true
          }
        }
      }
    })

    return connections
  }

  async channHistory(userId: number, chId: number): Promise<ChannHistoryResultDto[] | boolean> {
    try {
      await this.prisma.channel_link.findFirstOrThrow({
        where: {
          chId: chId,
          userId: userId,
          NOT: {
            linkStatus: 'banned'
          }
        }
      })
    } catch (error) {
      return false
    }

    const history: ChannHistoryResultDto[] = await this.prisma.channel_history.findMany({
      where: {
        chId: chId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        outgoing: true,
        createdAt: true,
        deliveryStatus: true,
        user: {
          select: {
            userName: true,
            id: true
          }
        }
      }
    })

    try {
      const muteExpire = await this.prisma.channel_link.findFirstOrThrow({
        where: {
          chId: chId,
          userId: userId,
          linkStatus: 'muted'
        },
        select: {
          updatedAt: true,
          mutedUntil: true
        }
      })

      if (new Date() >= muteExpire.mutedUntil) {
        await this.prisma.channel_link.updateMany({
          where: {
            chId: chId,
            userId: userId,
            linkStatus: 'muted'
          },
          data: {
            linkStatus: 'good'
          }
        })
      }
    } catch (error) {}

    return this.filterBlockedUsers(history, userId)
  }
  private filterBlockedUsers = async (
    history: ChannHistoryResultDto[],
    userId: number
  ): Promise<ChannHistoryResultDto[]> => {
    // get the id of all userid in a block with this.user
    const blocked = await this.prisma.chat_union.findMany({
      where: {
        client1Id: userId,
        blockStatus: true
      },
      select: {
        client2Id: true
      }
    })
    const blockedIds: number[] = []
    // put their ids into an array
    for (const key in blocked) {
      blockedIds.push(blocked[key].client2Id)
    }
    const historyNoBlocked: ChannHistoryResultDto[] = []
    // iterate through each msg from a userid and if they are not part of blocked, copy them to historyNoBan
    for (const key in history) {
      const posterId = history[key].user.id
      if (!blockedIds.includes(posterId)) {
        historyNoBlocked.push(history[key])
      }
    }
    return historyNoBlocked
  }

  async updateChanns(channPayload: UpdateChannDto[], userId: number) {
    for (const singleChannKey in channPayload) {
      const singleChannObject: UpdateChannDto = channPayload[singleChannKey]

      try {
        await this.prisma.channel_link.findFirstOrThrow({
          where: {
            chId: singleChannObject.chId,
            userId: userId,
            OR: [
              {
                linkStatus: 'good'
              },
              {
                role: 'owner'
              }
            ]
          }
        })
      } catch (error) {
        continue
      }

      const filterRegex = /[^a-zA-Z\d?@!üöäßÜÖÄ ,.'^\n]/gi
      if (singleChannObject.msg.replace(filterRegex, '').length === 0) continue
      await this.prisma.channel_history.create({
        data: {
          chId: singleChannObject.chId,
          userId: userId,
          outgoing: singleChannObject.msg.replace(filterRegex, ''),
          createdAt: singleChannObject.time
        }
      })

      await this.prisma.channel_link.updateMany({
        where: {
          chId: singleChannObject.chId,
          NOT: {
            OR: [
              {
                userId: userId
              },
              {
                linkStatus: 'banned'
              }
            ]
          }
        },
        data: {
          unreadCount: {
            increment: 1
          }
        }
      })

      await this.prisma.channel_link.updateMany({
        where: {
          chId: singleChannObject.chId,
          userId: userId
        },
        data: {
          userId: userId
        }
      })
      this.gateway.emitToAll('new-channel-event', singleChannObject.chId)
    }
  }

  async setSeen(channDetails: SetSeenDto, userId: number) {
    await this.prisma.channel_link.updateMany({
      where: {
        chId: channDetails.chId,
        userId: userId
      },
      data: {
        unreadCount: 0
      }
    })
    this.gateway.emitToAll('new-channel-event', channDetails.chId)
  }

  async getMemberId(getMemberId: GetMemberIdDto, adminId: number): Promise<string> {
    const moderator = await this.prisma.channel_link.findFirst({
      where: {
        userId: adminId,
        chId: getMemberId.chId,
        linkStatus: 'good',
        OR: [
          {
            role: 'owner'
          },
          {
            role: 'admin'
          }
        ]
      },
      include: {}
    })
    if (!moderator) {
      return `Unauthorized Action!`
    }

    const user = await this.prisma.user.findUnique({
      where: {
        userName: getMemberId.userName
      },
      select: {
        id: true
      }
    })
    if (!user) {
      return 'Unknown username'
    }
    return `UserId for ${getMemberId.userName} is ${user.id}`
  }

  async pendingApprovals(
    pendingProp: PendingApprovalsDto,
    adminId: number
  ): Promise<PendingApprovalsResultDto[] | null> {
    const moderator = await this.prisma.channel_link.findFirst({
      where: {
        userId: adminId,
        chId: pendingProp.chId,
        linkStatus: 'good',
        OR: [
          {
            role: 'owner'
          },
          {
            role: 'admin'
          }
        ]
      },
      include: {}
    })
    if (!moderator) {
      return null
    }

    const output: PendingApprovalsResultDto[] = await this.prisma.channel_pending.findMany({
      where: {
        chId: pendingProp.chId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      select: {
        userId: true,
        chId: true,
        user: {
          select: {
            userName: true
          }
        }
      }
    })
    return output
  }

  async moderateUsers(moderateProp: ModerateUsersDto, adminId: number): Promise<string> {
    if (adminId === moderateProp.userId) {
      return 'You cannot moderate yourself!'
    }

    const moderator = await this.prisma.channel_link.findFirst({
      where: {
        userId: adminId,
        chId: moderateProp.chId,
        linkStatus: 'good',
        OR: [
          {
            role: 'owner'
          },
          {
            role: 'admin'
          }
        ]
      },
      select: {
        role: true
      }
    })
    if (!moderator) {
      return `Unauthorized Action!`
    }

    const member = await this.prisma.channel_link.findFirst({
      where: {
        userId: moderateProp.userId,
        chId: moderateProp.chId
      },
      include: {
        user: {
          select: {
            userName: true
          }
        }
      }
    })
    if (!member) {
      return `Member ID not found on this Channel!`
    } else if (member.role == 'owner') {
      return `Channel owners cannot be moderated!`
    }

    if (moderator.role === 'owner' && moderateProp.action === 'setAsAdmin') {
      const updatedCount = await this.prisma.channel_link.updateMany({
        where: {
          userId: moderateProp.userId,
          chId: moderateProp.chId,
          NOT: {
            linkStatus: 'banned'
          }
        },
        data: {
          role: 'admin'
        }
      })
      if (updatedCount.count > 0) {
        return `Success! ${member.user.userName} is now an Admin on this channel`
      } else {
        return 'Unknown Error'
      }
    } else if (moderator.role !== 'owner' && moderateProp.action === 'setAsAdmin') {
      return `Only Channel Owner can Assign Admin Role`
    } else if (moderateProp.action === 'ban') {
      const updatedCount = await this.prisma.channel_link.updateMany({
        where: {
          userId: moderateProp.userId,
          chId: moderateProp.chId
        },
        data: {
          linkStatus: 'banned'
        }
      })
      if (updatedCount.count > 0) {
        return `Success! ${member.user.userName} is now banned from this channel`
      } else {
        return 'Unknown Error'
      }
    } else if (moderateProp.action === 'kick') {
      const updatedCount = await this.prisma.channel_link.deleteMany({
        where: {
          userId: moderateProp.userId,
          chId: moderateProp.chId
        }
      })
      if (updatedCount.count > 0) {
        return `Success! ${member.user.userName} has been kicked out of this channel`
      } else {
        return 'Unknown Error'
      }
    } else if (moderateProp.action === 'mute') {
      const updatedCount = await this.prisma.channel_link.updateMany({
        where: {
          userId: moderateProp.userId,
          chId: moderateProp.chId,
          NOT: {
            linkStatus: 'banned'
          }
        },
        data: {
          linkStatus: 'muted',
          mutedUntil: moderateProp.mutedUntil
        }
      })
      if (updatedCount.count > 0) {
        return `Success! ${member.user.userName} is now muted until ${moderateProp.mutedUntil}`
      }

      return 'Unknown Error'
    }
  }

  async approveOrReject(moderateProp: ApproveOrRejectDto, adminId: number): Promise<string> {
    const moderator = await this.prisma.channel_link.findFirst({
      where: {
        userId: adminId,
        chId: moderateProp.chId,
        linkStatus: 'good',
        role: {
          in: ['owner', 'admin']
        }
      },
      include: {}
    })
    if (!moderator) {
      return 'Unauthorized Access!'
    }

    const deleted = await this.prisma.channel_pending.deleteMany({
      where: {
        chId: moderateProp.chId,
        userId: moderateProp.memberId
      }
    })
    if (deleted.count < 1) {
      return 'Unknown Error!'
    }

    if (moderateProp.action === false) {
      return 'Success!'
    }

    if (moderateProp.action === true) {
      const linkResult = await this.prisma.channel_link.create({
        data: {
          chId: moderateProp.chId,
          userId: moderateProp.memberId,
          role: 'user',
          linkStatus: 'good',
          channel_historys: {
            create: [
              {
                chId: moderateProp.chId,
                userId: moderateProp.memberId,
                outgoing: 'joined',
                deliveryStatus: 'joined'
              }
            ]
          }
        }
      })

      if (linkResult) {
        return 'Success!'
      }
    }
  }

  async modifyChannel(newChannelProp: ModifyChannelDto, adminId: number): Promise<string> {
    const moderator = await this.prisma.channel_link.findFirst({
      where: {
        userId: adminId,
        chId: newChannelProp.chId,
        linkStatus: 'good',
        role: 'owner'
      },
      include: {}
    })
    if (!moderator) {
      return 'Unauthorized Access!'
    }

    await this.prisma.channel.update({
      where: {
        id: newChannelProp.chId
      },
      data: {
        visibility: newChannelProp.newVisibility
      }
    })

    if (newChannelProp.newVisibility === 'password') {
      const saltOrRounds = 10
      const hash = await bcrypt.hash(newChannelProp.password, saltOrRounds)

      await this.prisma.channel.update({
        where: {
          id: newChannelProp.chId
        },
        data: {
          password: hash
        }
      })
    }
    return 'Success!'
  }
}
