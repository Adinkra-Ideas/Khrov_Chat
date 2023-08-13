import { Controller, Get, Post, Put, Body, Param, ParseArrayPipe, HttpException, HttpStatus, Delete } from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { Chat_union } from '@prisma/client'; 
import ChatHistoryDTO from './dto/chat-history.dto';
import UpdateChatDTO from './dto/update-chat.dto';
import NewChatDTO from './dto/new-chat.dto';
import SetSeenDTO from './dto/set-seen.dto';
import DeleteHistoryDTO from './dto/delete-history.dto';

@Controller('chat-history')
export class ChatHistoryController {

  constructor(private chatHistoryService: ChatHistoryService){}

  // This fetches the chat history associated with unionId '/:unionId'
  @Get('/:unionId')   
  async getChatHistory ( @Param() chatUnion: ChatHistoryDTO ){
    const chatHistory: Chat_union | boolean = await this.chatHistoryService.getChatHistory(chatUnion.unionId);
    if (chatHistory === false) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
    return chatHistory;
  }

  // This inserts new chat into existing chat-union(conversations)
  @Put()
  async updateChats ( @Body(new ParseArrayPipe({ items: UpdateChatDTO })) chatPayload : UpdateChatDTO[] ){
    const chats: boolean = await this.chatHistoryService.updateChats(chatPayload);
    if (chats === false) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  // this updates message delivery status to 'seen'
  @Put('/:set-seen')
  async setSeen ( @Body() chatDetails : SetSeenDTO ){
    const setSeen: boolean = await this.chatHistoryService.setSeen(chatDetails);
    if (setSeen === false) {
      throw new HttpException('Could Not Set Messages as Seen', HttpStatus.BAD_REQUEST);
    }
  }

  // This creates a new union and insert chat into the union.
  @Post()
  async newChat ( @Body() newChat : NewChatDTO ){
    const chats: boolean = await this.chatHistoryService.newChat(newChat);
    if (chats === false) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete()
  async deleteChatHistory (@Body() deleteHistory : DeleteHistoryDTO) {
    const output: boolean = await this.chatHistoryService.deleteChatHistory(deleteHistory.unionId);
    if (output === false) {
      throw new HttpException('Delete Request Failed', HttpStatus.BAD_REQUEST);
    }
  }

}
