import { 
  Body,
  Param, 
  Controller, 
  Post, 
  Put, 
  Get,
  Query, 
  ParseArrayPipe,
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { AddChannelDto, AddChannelResultDto } from './dto/add-channel.dto';
import { SuggestedChannelsDto, SuggestedChannelsResultDto } from './dto/suggested-channels.dto';
import { SearchChannelsDto, SearchChannelsResultDto } from './dto/search-channels.dto';
import { ErrorValue } from './enums/error-value.enum';
import { JoinOrExitChannelDto, JoinOrExitChannelResultDto } from './dto/join-or-exit-channel.dto';
import { ChannConnectionsDto, ChannConnectionsResultDto } from './dto/chann-connections.dto';
import { ChannHistoryDto, ChannHistoryResultDto } from './dto/chann-history.dto';
import { UpdateChannDto } from './dto/update-chann.dto';
import { SetSeenDto } from './dto/set-seen.dto';
import { ModerateUsersDto, ModerateUsersResultDto } from './dto/moderate-users.dto';
import { GetMemberIdDto, GetMemberIdResultDto } from './dto/get-member-id.dto';
import { PendingApprovalsDto, PendingApprovalsResultDto }  from './dto/pending-approvals.dto';
import { ApproveOrRejectDto, ApproveOrRejectResultDto } from './dto/approve-or-reject.dto';
import { ModifyChannelDto, ModifyChannelResultDto } from './dto/modify-channel.dto';


@Controller('channels')
@ApiTags('channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService){}

  @ApiOperation({ summary: 'Endpoint Delivering Suggested Channels for {userId}' })
  @ApiResponse({ status: 200, type: [SuggestedChannelsResultDto] })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @ApiResponse({ status: 404, description: 'Unable To Find User ID!' })
  @Get('/:userId')
  async suggestedChannels(@Param() user: SuggestedChannelsDto){
    const response: SuggestedChannelsResultDto[] | ErrorValue = await this.channelsService.suggestedChannels(user.userId);
    if (response===ErrorValue.NO_USER) {
      throw new HttpException('Unable To Find {userId}!', HttpStatus.NOT_FOUND);
    }
    return JSON.stringify(response);
  }

  @ApiOperation({ summary: 'Endpoint Making {userId} Join or Exit a Channel' })
  @ApiResponse({ status: 200, type: JoinOrExitChannelResultDto })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @Put('/:userId')
  async joinOrExitChannel( @Body() requestProps: JoinOrExitChannelDto ){
    const response: string = await this.channelsService.joinOrExitChannel(requestProps);
    return JSON.stringify({'message': response})
  }

  @ApiOperation({ summary: 'Endpoint Delivering List of Channels Matching Search {key} That is Sent By {userId}' })
  @ApiResponse({ status: 200, type: [SearchChannelsResultDto] })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @ApiResponse({ status: 404, description: 'Unable To Find {UserId}!' })
  @Get('/:userId/:key') 
  async searchChannels( @Param() details: SearchChannelsDto ){
    const response: SearchChannelsResultDto[] | ErrorValue = await this.channelsService.searchChannels(details);
    if (response===ErrorValue.NO_USER) {
      throw new HttpException('Unable To Find {userId}!', HttpStatus.NOT_FOUND);
    }
    return JSON.stringify(response);
  }

  @ApiOperation({ summary: 'Endpoint Receiving Input For Creating a new channel' })
  @ApiResponse({ status: 200, type: AddChannelResultDto })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @ApiResponse({ status: 404, description: 'Unable To Find {userId}!' })
  @ApiResponse({ status: 406, description: 'Channel Name Already Taken!' })
  @ApiResponse({ status: 417, description: 'Unable To Create Channel!' })
  @Post()
  async addChannel(@Body() addChannelDto: AddChannelDto){
    const response: ErrorValue = await this.channelsService.addChannel(addChannelDto);
    // Send back API JSON response
    switch (response){
      case ErrorValue.NO_USER:
        throw new HttpException('Unable To Find User Details!', HttpStatus.NOT_FOUND);
      case ErrorValue.CHANNEL_EXISTS:
        throw new HttpException('Channel Name Already Taken!', HttpStatus.NOT_ACCEPTABLE);
      case ErrorValue.CREATION_ERROR:
        throw new HttpException('Unable To Create Channel!', HttpStatus.EXPECTATION_FAILED);
      default:
        return JSON.stringify({'message':`Channel ${addChannelDto.name} Created Successfully!`})
    }
  }

  @ApiOperation({ summary: 'Endpoint Fetching List of Channels that {userId} is connected to, and where {userId} is not banned' })
  @ApiResponse({ status: 200, type: [ChannConnectionsResultDto]})
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @ApiResponse({ status: 404, description: 'Unable To Find {userId}!'})
  @Get('/get/connections/:userId')
  async channConnections(@Param() user: ChannConnectionsDto ){
    const response: ChannConnectionsResultDto[] | ErrorValue  = await this.channelsService.channConnections(user.userId);
    if (response===ErrorValue.NO_USER) {
      throw new HttpException('Unable To Find {userId}!', HttpStatus.NOT_FOUND);
    }
    return JSON.stringify(response);
  }

  @ApiOperation({ summary: 'Endpoint Fetching All Conversations of the Channel {chId} for the {userId}' })
  @ApiResponse({ status: 200, type: [ChannHistoryResultDto]})
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @Get('/get/connections/:userId/:chId')
  async channHistory(@Param() channel: ChannHistoryDto){
    const response: ChannHistoryResultDto[] | boolean = await this.channelsService.channHistory(channel);
    if (response===false) {
      throw new HttpException('Unknown {userId} or {userId} not a Member of Channel {chId}', HttpStatus.NOT_FOUND);
    }
    return JSON.stringify(response);
  }

  @ApiOperation({ summary: "Endpoint for inserting new msgs into an existing channel's conversation" })
  @ApiResponse({ status: 200, description: 'Simply adds all messages to their respective channels and returns nothing' })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @ApiBody({ type: [UpdateChannDto] })
  @Put()
  async updateChanns(@Body(new ParseArrayPipe({ items: UpdateChannDto })) channPayload: UpdateChannDto[]){
    await this.channelsService.updateChanns(channPayload);
  }

  @ApiOperation({ summary: "Endpoint resets unreadCount to 0 where userId is a member of Channel chId" })
  @ApiResponse({ status: 200, description: 'Simply resets unreadCount to 0, where userId is a member of Channel chId, and returns nothing' })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @Put('/put/set-seen')
  async setSeen ( @Body() channDetails : SetSeenDto ) {
    await this.channelsService.setSeen(channDetails);
  }

  @ApiOperation({ summary: "Endpoint for getting user id with their userName as Query" })
  @ApiResponse({ status: 200, type: GetMemberIdResultDto })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @Get()
  async getMemberId(@Query() getMemberId: GetMemberIdDto, ){
    const response: string = await this.channelsService.getMemberId(getMemberId);
    return JSON.stringify({'message': response})
  }

  @ApiOperation({ summary: "Endpoint for getting list of all join requests pending approvals" })
  @ApiResponse({ status: 200, type: [PendingApprovalsResultDto] })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @ApiResponse({ status: 412, description: 'Only The channel Admin or Owner can Request this Data' })
  @Get('/get/channel/moderate/:adminId/:chId')
  async pendingApprovals(@Param() pendingProp: PendingApprovalsDto ){
    const response: PendingApprovalsResultDto[] | null = await this.channelsService.pendingApprovals(pendingProp);
    if (!response) {
      throw new HttpException('Only The channel Admin or Owner can Request this Data', HttpStatus.PRECONDITION_FAILED);
    }
    return JSON.stringify(response)
  }

  @ApiOperation({ summary: "Endpoint for moderating users in terms of kick, ban, mute, setAdmin" })
  @ApiResponse({ status: 200, type: ModerateUsersResultDto })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @Put('/put/channel/moderate')
  async moderateUsers(@Body() moderateProp: ModerateUsersDto){
    const response: string = await this.channelsService.moderateUsers(moderateProp);
    return JSON.stringify({'message': response})
  }

  @ApiOperation({ summary: "Endpoint for changing channel visibility and setting password as well" })
  @ApiResponse({ status: 200, type: ModifyChannelResultDto })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @Put('/put/channel/moderate/modify')
  async modifyChannel(@Body() newChannelProp: ModifyChannelDto, ){
    const response: string = await this.channelsService.modifyChannel(newChannelProp);
    return JSON.stringify({'message': response})
  }

  @ApiOperation({ summary: "Endpoint for approving/rejecting a pending channel join request" })
  @ApiResponse({ status: 200, type: ApproveOrRejectResultDto })
  @ApiResponse({ status: 400, description: 'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!' })
  @Put('/put/channel/moderate/pending/decide')
  async approveOrReject(@Body() moderateProp: ApproveOrRejectDto){
    const response: string = await this.channelsService.approveOrReject(moderateProp);
    return JSON.stringify({'message': response})
  }

}
