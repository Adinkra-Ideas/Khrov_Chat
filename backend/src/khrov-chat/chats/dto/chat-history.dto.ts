import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator'
import { Transform } from 'class-transformer'

export class ChatHistoryDto {
  @Transform(({ value }) => {
    return Number(value)
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'Conversation ID identifying a user to a Chat',
    example: 1
  })
  readonly unionId: number
}

class Chat_historysType {
  @ApiProperty({
    description:
      'The view is that of client1Id. Message will be outgoing if it was sent from client1Id',
    example: 'hello client2Id'
  })
  readonly outgoing: string

  @ApiProperty({
    description:
      'The view is that of client1Id. Message will be incoming if it was sent from client2Id',
    example: 'Fine client1Id'
  })
  readonly incoming: string

  @ApiProperty({
    description: 'Time of message',
    example: '2023-07-26T17:59:54.868Z'
  })
  readonly time: Date

  @ApiProperty({
    description: 'Delivery status of message. Could be sent, delivered or seen',
    example: 'sent'
  })
  readonly deliveryStatus: string
}
class Profile_picsType {
  @ApiProperty({
    description: 'Base64 encoding of Profile photo of Client2Id',
    example: 'data:image/png;base64,'
  })
  readonly avatar: string
}
class Client2Type {
  @ApiProperty({
    description: 'UserName of Client2Id',
    example: 'ade'
  })
  readonly userName: string

  @ApiProperty()
  profile_pics: Profile_picsType[]
}
export class ChatHistoryResultDto {
  @ApiProperty({
    description: 'Conversation ID identifying a user to a Chat',
    example: 1
  })
  readonly unionId: number

  @ApiProperty({
    description:
      'Each chat Conversation has two users invlved. This is the ID identifying the other user in same Chat conversation as unionId',
    example: 2
  })
  readonly unionIdOther: number

  @ApiProperty({
    description: 'Conversation ID unionId identifies the client1Id user to a Chat',
    example: 1
  })
  readonly client1Id: number

  @ApiProperty({
    description: 'Conversation ID unionIdOther identifies the client12d user to a Chat',
    example: 2
  })
  readonly client2Id: number

  @ApiProperty({
    description:
      'blockStatus===true means this conversation between client1Id and client2Id is blocked',
    example: true
  })
  readonly blockStatus: boolean

  @ApiProperty({
    description:
      'allowedToUnblock===true means it was client1Id that initiated the blocking and thus will be the user to also initiate the unblocking',
    example: true
  })
  readonly allowedToUnblock: boolean

  @ApiProperty({
    description: 'Number of messages in this conversation that client1Id is yet to read',
    example: 2
  })
  readonly unreadCount: number

  @ApiProperty({
    description: 'Time of first message between client1Id and client2Id in this conversation',
    example: '2023-07-26T17:59:54.868Z'
  })
  readonly createdAt: Date

  @ApiProperty({
    description: 'Time of most recent message between client1Id and client2Id in this conversation',
    example: '2023-07-26T17:59:54.868Z'
  })
  readonly updatedAt: Date

  @ApiProperty()
  client2: Client2Type

  @ApiProperty()
  chat_historys: Chat_historysType[]
}
