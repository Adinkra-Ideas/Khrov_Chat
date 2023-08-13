import { Module } from '@nestjs/common';
import { ChatConnectionsController } from './chat-connections.controller';
import { ChatConnectionsService } from './chat-connections.service';
import { PrismaModule } from '../../db/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers:[ChatConnectionsController],
  providers: [ChatConnectionsService]
})
export class ChatConnectionsModule{}
