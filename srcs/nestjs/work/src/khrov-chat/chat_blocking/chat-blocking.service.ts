import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { Chat_union, User } from '@prisma/client'; 
import BlockingDTO from './dto/blocking.dto';

@Injectable()
export class ChatBlockingService {
  constructor(private prisma: PrismaService){}

  async getBlocked(userId: number): Promise<Chat_union[]> {
    return await this.prisma.chat_union.findMany({
      where: {
        client1Id: userId,
        blockStatus: true,
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
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async blockUser(blockDetails: BlockingDTO ): Promise<boolean> {
    // check if users exist
    if (await this.verifyUserIDs(blockDetails) === false){
      return false;
    }
    // get unionIds of both users
    let [blockerUnionId, blockedUnionId] = await this.verifyUnionIDs(blockDetails);
    // If no existing unionIDs, 
    if (!blockerUnionId || !blockedUnionId) {
      // we need to create for them so we can block them preemptively
      [blockerUnionId, blockedUnionId] = await this.createUnionIDs(blockDetails);
      // If unionIDs creation failed,
      if (!blockerUnionId || !blockedUnionId){
        return false;
      }
    }
    // Everything is ready. Now we just block them
    await this.prisma.chat_union.update({
      where: { 
        unionId: blockerUnionId, 
      },
      data: {
        blockStatus: true,
        allowedToUnblock: true,
      }
    });
    await this.prisma.chat_union.update({
      where: { 
        unionId: blockedUnionId, 
      },
      data: {
        blockStatus: true,
      }
    });
  }

  async unblockUser(blockDetails: BlockingDTO ): Promise<boolean> {
    // check if users exist
    if (await this.verifyUserIDs(blockDetails) === false){
      return false;
    }
    // get unionIds of both users
    let [blockerUnionId, blockedUnionId] = await this.verifyUnionIDs(blockDetails);
    // If no existing unionIDs, just return, as there is nothing to do now
    if (!blockerUnionId || !blockedUnionId) {
      return false;
    }
    // Everything is ready. Now we just unblock them
    try {
      await this.prisma.chat_union.update({
        where: { 
          unionId: blockerUnionId, 
        },
        data: {
          blockStatus: false,
          allowedToUnblock: false,
        }
      });
      await this.prisma.chat_union.update({
        where: { 
          unionId: blockedUnionId, 
        },
        data: {
          blockStatus: false,
          allowedToUnblock: false,
        }
      });
    } catch (error) {
      return false;
    }
  }

  // ******************************************************************
  // We will create unionID for both UserID's present in blockDetails *
  // Return value is the UnionIDs created or 0, 0 on failure          *
  // ******************************************************************
  private async createUnionIDs(blockDetails: BlockingDTO): Promise<number[]> {
    try {
      let blockerUnionId: number = 0;
      let blockedUnionId: number = 0;
      await this.prisma.chat_union.create({
        data: { 
          client1Id: blockDetails.blockerId,
          client2Id: blockDetails.blockedId,
          unionIdOther: 0,  // placeholder value. Will later be replaced
        },
        select: {
          unionId: true,
        }
      })
      .then(data => {blockerUnionId = data.unionId});
      await this.prisma.chat_union.create({
        data: { 
          client2Id: blockDetails.blockerId,
          client1Id: blockDetails.blockedId,
          unionIdOther: blockerUnionId
        },
        select: {
          unionId: true,
        }
      })
      .then(data => {blockedUnionId = data.unionId});
      // replacing placeholder value set in the above sentence
      await this.prisma.chat_union.update({
        where: { 
          unionId: blockerUnionId, 
        },
        data: {
          unionIdOther: blockedUnionId,
        }
      });
      return [blockerUnionId, blockedUnionId];
    } catch (error) {
      return [0, 0];
    }
  }

  // **********************************************************************
  // Get union IDs of both blockerId and blockedId from Chat_union table  *
  // Return value is the UnionIDs created or 0, 0 on failure              *
  // **********************************************************************
  private async verifyUnionIDs(blockDetails: BlockingDTO): Promise<number[]> {
    let blockerUnionId: number = 0;
    let blockedUnionId: number = 0;
    try {
      // attempt to Get union IDs of both blockerId and blockedId
      await this.prisma.chat_union.findFirstOrThrow({
        where: {
            client1Id: blockDetails.blockerId,
            client2Id: blockDetails.blockedId,
          },
        select: {
            unionId: true,
            unionIdOther: true,
          },
        })
      .then(data => {
        blockerUnionId = data.unionId;
        blockedUnionId = data.unionIdOther;
      })
      return [blockerUnionId, blockedUnionId];
    } catch (error) {
      return [0, 0];
    }
  }

  // ******************************************************
  // function to verify that the two parties involved are *
  // valid users in the User table. Returns false if no   *
  // ******************************************************
  private async verifyUserIDs(blockDetails: BlockingDTO): Promise<boolean> {
    try {
      // if blockerId or blockedId not present in 'user' table, throw
      await this.prisma.user.findUniqueOrThrow({
        where: {
          id: blockDetails.blockerId,
        },
      });
      await this.prisma.user.findUniqueOrThrow({
        where: {
          id: blockDetails.blockedId,
        },
      });
    } catch(error) {
      return false;
    }
  }
}
