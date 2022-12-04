import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { SocketService } from '../../socket/socket.service'
import { Server } from 'socket.io'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'
import { Role } from 'src/auth/role.decorator'

@WebSocketGateway({
  cors: {
    origin: [ process.env.FRONTEND_URL ],
    credentials: true
  },
  transports: ['websocket', 'polling']
})
@UseGuards(AuthGuard)
export class ChannelsGateway {
  constructor(private socketService: SocketService) {}

  @WebSocketServer()
  server: Server

  emitToAll(event: string, code: number) {
    // console.log("hey buddy")
    this.server.emit(event, code)
  }
}
