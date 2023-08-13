import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { User, Chat_union } from '@prisma/client'; 
import SearchUsersDTO from './dto/search-users.dto';

@Injectable()
export class SearchUsersService {
  constructor(private prisma: PrismaService) {}

// : Promise<User[]>  : User[] 
  async searchUsers(details: SearchUsersDTO) {
    // get all matching details.key details
    const output = await this.prisma.user.findMany({
      where: {
        OR: [ 
          { 
            userName: {
              startsWith: details.key,
            },
          },
          {
            name: {
              startsWith: details.key,
            }
          },
          {
            displayName: {
              startsWith: details.key,
            }
          },
        ],
        NOT: {
          id: details.searcherId
        },
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10,
      select: {
        id: true,
        userName: true,
        createdAt: true,
        profile_pics: {
          select: {
            avatar: true
          }
        },
      }, 
    });

    // We need to filter out those users who the searcher
    // has blocked or who blocked searcher, from output
    let i: number = 0;
    for (let key in output) {
      const other = output[key];
      const otherId = other.id;
      try {
        await this.prisma.chat_union.findFirstOrThrow({
          where: {
            client1Id: details.searcherId,
            client2Id: otherId,
            blockStatus: true,
          },
          include: {},
        });
        // if blocking exist(AKA no throw occured), delete the key from output
        output.splice(i, 1);
      } catch (error){}
      i++;
    }

    return output;
  }
}
