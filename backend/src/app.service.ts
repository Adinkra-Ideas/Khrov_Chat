import { Injectable } from '@nestjs/common'
import { SocketService } from './socket/socket.service'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AppService {
  constructor(
    private socketService: SocketService,
    private prisma: PrismaService
  ) {}

  //TODO error handling if user not there
  async connectedUser(userId: number, socketId: string) {
    const user = await this.prisma.channel.findUnique({
      where: {
        id: userId
      },
      include: {}
    })
    if (!user) return
    try {
      this.socketService.addClient(userId, socketId)
    } catch (error) {
      console.log(error)
    }
  }

  async disconnectedUser(userId: number) {
    const user = await this.prisma.channel.findUnique({
      where: {
        id: userId
      },
      include: {}
    })
    if (!user) return
    try {
      this.socketService.removeClient(userId)
    } catch (error) {
      console.log(error)
    }
  }
}
