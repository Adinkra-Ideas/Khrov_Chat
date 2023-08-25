import { Module } from '@nestjs/common'
import { ChatsController } from './chats.controller'
import { ChatsService } from './chats.service'
import { ChatsGateway } from './chats.gateway'
import { PrismaModule } from '../../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsGateway],
  exports: [ChatsService]
})
export class ChatsModule {}
