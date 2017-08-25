import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { SocketService } from '../../socket/socket.service'
import { Server } from 'socket.io'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'

@WebSocketGateway({
  cors: {
    origin: [ process.env.FRONTEND_URL ],
    credentials: true
  },
  transports: ['websocket', 'polling']
})
@UseGuards(AuthGuard)
export class ChatsGateway {
  constructor(private socketService: SocketService) {}

  @WebSocketServer()
  server: Server

  emitToAll(event: string, code: number) {
    // console.log("hey buddy")
    this.server.emit(event, code)
  }
}
