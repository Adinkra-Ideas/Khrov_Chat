import { Injectable } from '@nestjs/common'
import { Server } from 'socket.io'

@Injectable()
export class SocketService {
  public socket: Server = null
  private readonly connectedClients: Map<number, string> = new Map()
  getSocketId(userId: number) {
    return this.connectedClients.get(userId)
  }

  addClient(userId: number, socketId: string) {
    this.connectedClients.set(userId, socketId)
  }
  removeClient(userId: number) {
    this.connectedClients.delete(userId)
  }
}
