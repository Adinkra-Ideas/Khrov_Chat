import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { validate } from './config/env.validation'
import { MulterModule } from '@nestjs/platform-express'
import { SocketModule } from './socket/socket.module'
import { ChatsModule } from './khrov-chat/chats/chats.module'
import { ChannelsModule } from './khrov-chat/channels/channels.module'
import { AppGateway } from './app.gateway'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'env-sample'],
      validate
    }),
    MulterModule.register({
      dest: './files'
    }),
    PrismaModule,
    AuthModule,
    SocketModule,
    ChatsModule,
    ChannelsModule
  ],
  controllers: [],
  providers: [AppGateway, AppService]
})
export class AppModule {}
