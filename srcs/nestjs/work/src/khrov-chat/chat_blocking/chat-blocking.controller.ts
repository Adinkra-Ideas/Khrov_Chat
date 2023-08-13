import { Controller, Get, Post, Put, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ChatBlockingService } from './chat-blocking.service';
import { Chat_union} from '@prisma/client'; 
import BlockingDTO from './dto/blocking.dto';
import GetBlockedDTO from './dto/get-blocked.dto'

@Controller('chat-blocking')
export class ChatBlockingController {
  constructor(private chatBlockingService: ChatBlockingService){}

  @Get('/:userId')
  async getBlocked (@Param() id: GetBlockedDTO){
    const blockedList: Chat_union[] = await this.chatBlockingService.getBlocked(id.userId);
    return blockedList;
  }

  // This blocks a user
  @Put('/:flag')
  async blockUser ( @Body() blockDetails : BlockingDTO ){
    const status: boolean = await this.chatBlockingService.blockUser(blockDetails);
    if (status === false) {
      throw new HttpException('UNABLE TO EXECUTE BLOCK REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  // This unblocks a user
  @Put()
  async unblockUser ( @Body() blockDetails : BlockingDTO ){
    const status: boolean = await this.chatBlockingService.unblockUser(blockDetails);
    if (status === false) {
      throw new HttpException('UNABLE TO EXECUTE UNBLOCK REQUEST', HttpStatus.BAD_REQUEST);
    }
  }
}
