import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query,
  ParseArrayPipe, 
  HttpException, 
  HttpStatus, 
  Delete 
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ChatsService } from './chats.service';
import { Chat_union } from '@prisma/client'; 
import { ChatHistoryDto, ChatHistoryResultDto} from './dto/chat-history.dto';
import { UpdateChatDto, UpdateChatResultDto } from './dto/update-chat.dto';
import { NewChatDto, NewChatResultDto } from './dto/new-chat.dto';
import { SetSeenDto, SetSeenResultDto } from './dto/set-seen.dto';
import { DeleteHistoryDto, DeleteHistoryResultDto } from './dto/delete-history.dto';
import { BlockingDto, BlockingResultDto } from './dto/blocking.dto';
import { GetBlockedDto, GetBlockedResultDto } from './dto/get-blocked.dto'
import { ChatConnectionsDto, ChatConnectionsResultDto } from './dto/chat-connections.dto';
import { SearchUsersDto, SearchUsersResultDto } from './dto/search-users.dto';
import { PrismaService } from '../../db/prisma.service'; // will be removed along with test Api


@Controller('chats')
@ApiTags('chats')
export class ChatsController {

  constructor(private chatsService: ChatsService,
              private prisma: PrismaService //  will be removed along with test Api
              ){}

  @ApiOperation({ summary: 'Endpoint fetching the chat history associated with unionId' })
  @ApiResponse({ status: 200, type: ChatHistoryResultDto })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @ApiResponse({ status: 404, description: 'No Conversations found for the given unionId' })
  @Get()   
  async getChatHistory(@Query() chatUnion: ChatHistoryDto){
    const response: ChatHistoryResultDto | boolean = await this.chatsService.getChatHistory(chatUnion.unionId);
    if (response === false) {
      throw new HttpException('No Conversations found for the given unionId', HttpStatus.NOT_FOUND);
    }
    return response;
  }

  @ApiOperation({ summary: 'Endpoint inserting new chat messages into existing conversations' })
  @ApiBody({ type: [UpdateChatDto] })
  @ApiResponse({ status: 200, type: UpdateChatResultDto })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @ApiResponse({ status: 404, description: 'A user in one of the chat conversations could not be found' })
  @Put()
  async updateChats( @Body(new ParseArrayPipe({ items: UpdateChatDto })) chatPayload : UpdateChatDto[] ){
    const response: boolean = await this.chatsService.updateChats(chatPayload);
    if (response===false) {
      throw new HttpException('A user in one of the chat conversations could not be found', HttpStatus.NOT_FOUND);
    } else {
      return JSON.stringify({'message': 'Success!'})
    }
  }

  @ApiOperation({ summary: 'Endpoint updating message delivery status to seen' })
  @ApiResponse({ status: 200, type: SetSeenResultDto })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @ApiResponse({ status: 417, description: 'Request to set Messages as Seen Failed!' })
  @Put('/seen')
  async setSeen( @Body() chatDetails : SetSeenDto ){
    const response: boolean = await this.chatsService.setSeen(chatDetails);
    if (response===false) {
      throw new HttpException('Request to set Messages as Seen Failed!', HttpStatus.EXPECTATION_FAILED);
    } else {
      return JSON.stringify({'message': 'Success!'})
    }
  }

  @ApiOperation({ summary: 'Endpoint creating a new chat union and inserting first chat into the chat union' })
  @ApiResponse({ status: 200, type: NewChatResultDto })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @ApiResponse({ status: 417, description: 'Request to start a new chat conversation failed!' })
  @Post()
  async newChat( @Body() newChat : NewChatDto ){
    const response: boolean = await this.chatsService.newChat(newChat);
    if (response===false) {
      throw new HttpException('Request to start a new chat conversation failed!', HttpStatus.EXPECTATION_FAILED);
    } else {
      return JSON.stringify({'message': 'Success!'})
    }
  }

  @ApiOperation({ summary: "Endpoint For deleting one user's copy of the chat conversation" })
  @ApiResponse({ status: 200, type: DeleteHistoryResultDto })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @ApiResponse({ status: 417, description: 'Delete Request Failed' })
  @Delete()
  async deleteChatHistory(@Body() deleteHistory : DeleteHistoryDto) {
    const response: boolean = await this.chatsService.deleteChatHistory(deleteHistory.unionId);
    if (response===false) {
      throw new HttpException('Delete Request Failed', HttpStatus.EXPECTATION_FAILED);
    } else {
      return JSON.stringify({'message': 'Success!'})
    }
  }
  
  @ApiOperation({ summary: "Endpoint For fetching a preview of all existing conversations that this {userId} has" })
  @ApiResponse({ status: 200, type: [ChatConnectionsResultDto] })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @Get('/:userId')   
  async chatConnections(@Param() user: ChatConnectionsDto){
    const response: ChatConnectionsResultDto[] = await this.chatsService.chatConnections(user.userId);
    return response;
  }

  @ApiOperation({ summary: "Endpoint For fetching a preview of all blocked users list" })
  @ApiResponse({ status: 200, type: [GetBlockedResultDto] })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @Get('/blocked/:userId')
  async getBlocked(@Param() id: GetBlockedDto){
    const response: GetBlockedResultDto[] = await this.chatsService.getBlocked(id.userId);
    return response;
  }

  @ApiOperation({ summary: "Endpoint For Blocking a User" })
  @ApiResponse({ status: 200, type: BlockingResultDto })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @ApiResponse({ status: 417, description: 'Block Request Failed' })
  @Put('/block/user')
  async blockUser(@Body() blockDetails: BlockingDto){
    const response: boolean = await this.chatsService.blockUser(blockDetails);
    if (response===false) {
      throw new HttpException('Block Request Failed', HttpStatus.EXPECTATION_FAILED);
    } else {
      return JSON.stringify({'message': 'Success!'})
    }
  }

  @ApiOperation({ summary: "Endpoint For Unblocking a User" })
  @ApiResponse({ status: 200, type: BlockingResultDto })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @ApiResponse({ status: 417, description: 'Unblock Request Failed' })
  @Put('/block/user/unblock')
  async unblockUser ( @Body() blockDetails : BlockingDto ){
    const response: boolean = await this.chatsService.unblockUser(blockDetails);
    if (response===false) {
      throw new HttpException('Unlock Request Failed', HttpStatus.EXPECTATION_FAILED);
    } else {
      return JSON.stringify({'message': 'Success!'})
    }
  }

  @ApiOperation({ summary: "Endpoint For fetching user search result using search key" })
  @ApiResponse({ status: 200, type: [SearchUsersResultDto] })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @Get('/get/search/user')   
  async searchUsers(@Query() details: SearchUsersDto){
    const response: SearchUsersResultDto[] = await this.chatsService.searchUsers(details);
    return response;
  }

  
  // just a test api // will be removed
  @ApiOperation({ summary: "Just a test API for testing purposes. will be deleted in due time" })
  @Get('/get/temp/login/:userId')
  async apiTest( @Param() userId: ChatConnectionsDto ){
    try {
      await this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId.userId,
        },
      });
    } catch (error) {
      throw new HttpException('No User Associated With Your Provided User ID In Your "User" DB Table. Please Create', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.prisma.profile_pic.findUniqueOrThrow({
        where: {
          userId: userId.userId,
        },
      });
    } catch (error) {
      throw new HttpException('User ID Must Have An Avatar in Your "Profile_pic" DB Table. Please Create', HttpStatus.BAD_REQUEST);
    }
  }


}
