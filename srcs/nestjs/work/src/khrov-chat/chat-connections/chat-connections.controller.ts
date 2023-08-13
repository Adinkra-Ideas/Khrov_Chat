import {Controller, Get, Post, Param, HttpException, HttpStatus } from '@nestjs/common';
import {ChatConnectionsService} from './chat-connections.service';
import ChatConnectionsDTO from './dto/chat-connections.dto';
import { Chat_union, User, Profile_pic } from '@prisma/client';  
import { PrismaService } from '../../db/prisma.service';

@Controller('chat-connections')
export class ChatConnectionsController{

  constructor(private chatConnectionsService: ChatConnectionsService,
    private prisma: PrismaService){}

  @Post('/:userId')   
  async chatConnections( @Param() user: ChatConnectionsDTO ){
    const connections : object | boolean = await this.chatConnectionsService.chatConnections(user.userId);
    // if (connections === false) {
    //   throw new HttpException('Unknown User ID', HttpStatus.BAD_REQUEST);
    // }
    return connections;
  }

  @Get('/:userId')
  async apiTest( @Param() userId: ChatConnectionsDTO ){
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
