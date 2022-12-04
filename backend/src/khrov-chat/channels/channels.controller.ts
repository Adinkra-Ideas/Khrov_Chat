import {
  Body,
  Param,
  Controller,
  Post,
  Put,
  Get,
  Query,
  Req,
  UseGuards,
  ParseArrayPipe,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { AuthGuard } from 'src/auth/auth.guard'
import { Role } from 'src/auth/role.decorator'
import { ChannelsService } from './channels.service'
import { AddChannelDto, AddChannelResultDto } from './dto/add-channel.dto'
import { SuggestedChannelsResultDto } from './dto/suggested-channels.dto'
import { SearchChannelsDto, SearchChannelsResultDto } from './dto/search-channels.dto'
import { ErrorValue } from './enums/error-value.enum'
import { JoinOrExitChannelDto, JoinOrExitChannelResultDto } from './dto/join-or-exit-channel.dto'
import { ChannConnectionsResultDto } from './dto/chann-connections.dto'
import { ChannHistoryDto, ChannHistoryResultDto } from './dto/chann-history.dto'
import { UpdateChannDto } from './dto/update-chann.dto'
import { SetSeenDto } from './dto/set-seen.dto'
import { ModerateUsersDto, ModerateUsersResultDto } from './dto/moderate-users.dto'
import { GetMemberIdDto, GetMemberIdResultDto } from './dto/get-member-id.dto'
import { PendingApprovalsDto, PendingApprovalsResultDto } from './dto/pending-approvals.dto'
import { ApproveOrRejectDto, ApproveOrRejectResultDto } from './dto/approve-or-reject.dto'
import { ModifyChannelDto, ModifyChannelResultDto } from './dto/modify-channel.dto'

@Controller('channels')
@ApiTags('channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @ApiOperation({ summary: 'Endpoint Delivering Suggested Channels for {userId}' })
  @ApiResponse({ status: 200, type: [SuggestedChannelsResultDto] })
  @ApiResponse({
    status: 400,
    description:
      'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!'
  })
  @ApiResponse({ status: 404, description: 'Unable To Find User ID!' })
  @Role('user')
  @UseGuards(AuthGuard)
  @Get('/suggestions')
  async suggestedChannels(@Req() req) {
    const response: SuggestedChannelsResultDto[] | ErrorValue =
      await this.channelsService.suggestedChannels(req.user.id)
    if (response === ErrorValue.NO_USER) {
      throw new HttpException('Unable To Find {userId}!', HttpStatus.NOT_FOUND)
    }
    return JSON.stringify(response)
  }

  @ApiOperation({ summary: 'Endpoint Making {userId} Join or Exit a Channel' })
  @ApiResponse({ status: 200, type: JoinOrExitChannelResultDto })
  @ApiResponse({
    status: 400,
    description:
      'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!'
  })
  @Role('user')
  @UseGuards(AuthGuard)
  @Put('/change')
  async joinOrExitChannel(@Body() requestProps: JoinOrExitChannelDto, @Req() req) {
    const response: string = await this.channelsService.joinOrExitChannel(requestProps, req.user.id)
    return JSON.stringify({ message: response })
  }

  @ApiOperation({
    summary: 'Endpoint Delivering List of Channels Matching Search {key} That is Sent By {userId}'
  })
  @ApiResponse({ status: 200, type: [SearchChannelsResultDto] })
  @ApiResponse({
    status: 400,
    description:
      'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!'
  })
  @ApiResponse({ status: 404, description: 'Unable To Find {UserId}!' })
  @Role('user')
  @UseGuards(AuthGuard)
  @Get('/me/:key')
  async searchChannels(@Param() details: SearchChannelsDto, @Req() req) {
    const response: SearchChannelsResultDto[] | ErrorValue =
      await this.channelsService.searchChannels(details.key, req.user.id)
    if (response === ErrorValue.NO_USER) {
      throw new HttpException('Unable To Find {userId}!', HttpStatus.NOT_FOUND)
    }
    return JSON.stringify(response)
  }

  @ApiOperation({ summary: 'Endpoint Receiving Input For Creating a new channel' })
  @ApiResponse({ status: 200, type: AddChannelResultDto })
  @ApiResponse({
    status: 400,
    description:
      'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!'
  })
  @ApiResponse({ status: 404, description: 'Unable To Find {userId}!' })
  @ApiResponse({ status: 406, description: 'Channel Name Already Taken!' })
  @ApiResponse({ status: 417, description: 'Unable To Create Channel!' })
  @Role('user')
  @UseGuards(AuthGuard)
  @Post()
  async addChannel(@Body() addChannelDto: AddChannelDto, @Req() req) {
    const response: ErrorValue = await this.channelsService.addChannel(addChannelDto, req.user.id)
    // Send back API JSON response
    switch (response) {
      case ErrorValue.NO_USER:
        throw new HttpException('Unable To Find User Details!', HttpStatus.NOT_FOUND)
      case ErrorValue.CHANNEL_EXISTS:
        throw new HttpException('Channel Name Already Taken!', HttpStatus.NOT_ACCEPTABLE)
      case ErrorValue.CREATION_ERROR:
        throw new HttpException('Unable To Create Channel!', HttpStatus.EXPECTATION_FAILED)
      default:
        return JSON.stringify({ message: `Channel ${addChannelDto.name} Created Successfully!` })
    }
  }

  @ApiOperation({
    summary:
      'Endpoint Fetching List of Channels that {userId} is connected to, and where {userId} is not banned'
  })
  @ApiResponse({ status: 200, type: [ChannConnectionsResultDto] })
  @ApiResponse({
    status: 400,
    description:
      'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!'
  })
  @ApiResponse({ status: 404, description: 'Unable To Find {userId}!' })
  @Role('user')
  @UseGuards(AuthGuard)
  @Get('/get/connections/get')
  async channConnections(@Req() req) {
    const response: ChannConnectionsResultDto[] | ErrorValue =
      await this.channelsService.channConnections(req.user.id)
    if (response === ErrorValue.NO_USER) {
      throw new HttpException('Unable To Find {userId}!', HttpStatus.NOT_FOUND)
    }
    return JSON.stringify(response)
  }

  @ApiOperation({
    summary: 'Endpoint Fetching All Conversations of the Channel {chId} for the {userId}'
  })
  @ApiResponse({ status: 200, type: [ChannHistoryResultDto] })
  @ApiResponse({
    status: 400,
    description:
      'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!'
  })
  @Role('user')
  @UseGuards(AuthGuard)
  @Get('/get/connections/chann/:chId')
  async channHistory(@Param() channel: ChannHistoryDto, @Req() req) {
    const response: ChannHistoryResultDto[] | boolean = await this.channelsService.channHistory(
      req.user.id,
      channel.chId
    )
    if (response === false) {
      throw new HttpException(
        'Unknown {userId} or {userId} not a Member of Channel {chId}',
        HttpStatus.NOT_FOUND
      )
    }
    return JSON.stringify(response)
  }

  @ApiOperation({
    summary: "Endpoint for inserting new msgs into an existing channel's conversation"
  })
  @ApiResponse({
    status: 200,
    description: 'Simply adds all messages to their respective channels and returns nothing'
  })
  @ApiResponse({
    status: 400,
    description:
      'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!'
  })
  @ApiBody({ type: [UpdateChannDto] })
  @Role('user')
  @UseGuards(AuthGuard)
  @Put()
  async updateChanns(
    @Body(new ParseArrayPipe({ items: UpdateChannDto })) channPayload: UpdateChannDto[],
    @Req() req
  ) {
    await this.channelsService.updateChanns(channPayload, req.user.id)
  }

  @ApiOperation({
    summary: 'Endpoint resets unreadCount to 0 where userId is a member of Channel chId'
  })
  @ApiResponse({
    status: 200,
    description:
      'Simply resets unreadCount to 0, where userId is a member of Channel chId, and returns nothing'
  })
  @ApiResponse({
    status: 400,
    description:
      'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!'
  })
  @Role('user')
  @UseGuards(AuthGuard)
  @Put('/put/set-seen')
  async setSeen(@Body() channDetails: SetSeenDto, @Req() req) {
    await this.channelsService.setSeen(channDetails, req.user.id)
  }

  @ApiOperation({ summary: 'Endpoint for getting user id with their userName as Query' })
  @ApiResponse({ status: 200, type: GetMemberIdResultDto })
  @ApiResponse({
    status: 400,
    description:
      'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!'
  })
  @Role('user')
  @UseGuards(AuthGuard)
  @Get()
  async getMemberId(@Query() channel: GetMemberIdDto, @Req() req) {
    const response: string = await this.channelsService.getMemberId(channel, req.user.id)
    return JSON.stringify({ message: response })
  }

  @ApiOperation({ summary: 'Endpoint for getting list of all join requests pending approvals' })
  @ApiResponse({ status: 200, type: [PendingApprovalsResultDto] })
  @ApiResponse({
    status: 400,
    description:
      'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!'
  })
  @ApiResponse({
    status: 412,
    description: 'Only The channel Admin or Owner can Request this Data'
  })
  @Role('user')
  @UseGuards(AuthGuard)
  @Get('/get/channel/moderate/true/:chId')
  async pendingApprovals(@Param() pendingProp: PendingApprovalsDto, @Req() req) {
    const response: PendingApprovalsResultDto[] | null =
      await this.channelsService.pendingApprovals(pendingProp, req.user.id)
    if (!response) {
      throw new HttpException(
        'Only The channel Admin or Owner can Request this Data',
        HttpStatus.PRECONDITION_FAILED
      )
    }
    return JSON.stringify(response)
  }

  @ApiOperation({ summary: 'Endpoint for moderating users in terms of kick, ban, mute, setAdmin' })
  @ApiResponse({ status: 200, type: ModerateUsersResultDto })
  @ApiResponse({
    status: 400,
    description:
      'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!'
  })
  @Role('user')
  @UseGuards(AuthGuard)
  @Put('/put/channel/moderate')
  async moderateUsers(@Body() moderateProp: ModerateUsersDto, @Req() req) {
    const response: string = await this.channelsService.moderateUsers(moderateProp, req.user.id)
    return JSON.stringify({ message: response })
  }

  @ApiOperation({
    summary: 'Endpoint for changing channel visibility and setting password as well'
  })
  @ApiResponse({ status: 200, type: ModifyChannelResultDto })
  @ApiResponse({
    status: 400,
    description:
      'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!'
  })
  @Role('user')
  @UseGuards(AuthGuard)
  @Put('/put/channel/moderate/modify')
  async modifyChannel(@Body() newChannelProp: ModifyChannelDto, @Req() req) {
    const response: string = await this.channelsService.modifyChannel(newChannelProp, req.user.id)
    return JSON.stringify({ message: response })
  }

  @ApiOperation({ summary: 'Endpoint for approving/rejecting a pending channel join request' })
  @ApiResponse({ status: 200, type: ApproveOrRejectResultDto })
  @ApiResponse({
    status: 400,
    description:
      'Endpoint Request Parameters And/Or Body Requirements Not Met. Check Response Error Message For Details!'
  })
  @Role('user')
  @UseGuards(AuthGuard)
  @Put('/put/channel/moderate/pending/decide')
  async approveOrReject(@Body() moderateProp: ApproveOrRejectDto, @Req() req) {
    const response: string = await this.channelsService.approveOrReject(moderateProp, req.user.id)
    return JSON.stringify({ message: response })
  }
}
