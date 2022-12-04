import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { SocketService } from './socket/socket.service'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { parse } from 'cookie'
import { AuthService } from './auth/auth.service'
import { AppService } from './app.service'

@WebSocketGateway({
  cors: {
    origin: [ process.env.FRONTEND_URL ], 
    credentials: true
  },
  transports: ['websocket', 'polling']
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private socketService: SocketService,
    private authService: AuthService,
    private appService: AppService
  ) {}

  @WebSocketServer() public server: Server
  private logger: Logger = new Logger('AppGateWay')

  afterInit(server: Server) {
    this.socketService.socket = server
  }

  async handleConnection(client: Socket, ...args: any[]) {
    //TODO error handling
    //TODO run via refresh if auth token invalid
    if (!client.handshake.headers.cookie) client.disconnect()
    else {
      try {
        const { 'auth-cookie': token } = parse(client.handshake.headers.cookie)
        if (token) {
          const test = await this.authService.verifyJwt(token)
          if (!test) {
            this.server.emit('failed_con')
            return client.disconnect()
          }
          client.data.userId = test.userId
          this.appService.connectedUser(test.userId, client.id)
          args
          this.logger.log('Client connected ' + client.id)
        }
      } catch (error) {
        console.log(error)
        client.disconnect()
      }
    }
  }

  async handleDisconnect(client: Socket) {
    //TODO error handling
    if (client.data.userId) {
      this.appService.disconnectedUser(client.data.userId)
      this.logger.log('Client disconnected ' + client.data.userId)
    } else this.logger.log('Unknown Client disconnected ' + client.id)
    client.disconnect()
  }
}
