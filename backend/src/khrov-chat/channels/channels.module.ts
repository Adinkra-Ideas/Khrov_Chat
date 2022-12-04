import { Module } from '@nestjs/common'
import { ChannelsController } from './channels.controller'
import { ChannelsService } from './channels.service'
import { ChannelsGateway } from './channels.gateway'
import { PrismaModule } from '../../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [ChannelsController],
  providers: [ChannelsService, ChannelsGateway],
  exports: [ChannelsService]
})
export class ChannelsModule {}
