import { ApiProperty } from '@nestjs/swagger'

class Chat_historysType {
  @ApiProperty({
    description: 'Conversation ID identifying a user to a Chat',
    example: 1
  })
  readonly unionId: number

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
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAOVBMVEXv7OjGw70AAADCv7ry7+v49fHm49/g3dns6eXMycR4dnTPzMekop9WVVTKx8QYFxcyMjG8ubPY1dHE2mloAAACUklEQVRoge2a25KDIAyGoUbR4qHl/R92Aa21HQmYhJud/jd79zXzb8hhorptmsbZ9Iqt3szj9GKq9c/dtAB8dBBAa+4H+GJbIfLGb+3ygj86UXTEd48VvsizA32JcFuB7ek2wO9tDbZS7d3DTZXAfejmpqZKgfvQJzVWCtyHPqq5HnxWphZbebRAPUnpChpC9QGpEvRBVp2zVmtrXadk+dDZptGbmsYKFgwweidvfC329OwXOuKtBBm6E3TE871JsiXoaXag89g9wvZ01guEAWNrPTCMAYMG7kNnZCRk2J5OhoPLsbV2VDrk2VpT4Vga7r4Q07HEFbIvuTxcRczGfK5EX4imP0vgTxr7Bz9V1X9o0QOlPlGwJWzqdJ8ruNEV6jiIt6ENTm1GJe+f3ovyZZHRo/Ohc5poznVW+weHjxbkJrfSUWM4pkTNafbMI/s1ok/De8VYM6Bzw/dk/mF5MzjaMArKYeD9B7QjbDFFrX+Vuxi2KUcHXRoZzxYV1JwLS0zRwPKpoRBdUmlPgi+qBDR2IZ2GDsqiywbEc+VKTaYM4soVSarhGx21nWNKEGpMyS6Bho60VG7gaOjcwLHQy5YgXOmE4bPTL4mXh6uS2XixiJ8rMZhKWJ40nZ+IQYlkLFtTckqsMXXhEuzkjiQT+Tn7B/8X8L4evD8eRKTh5njKEYbDfDxCScPH4/lMGN5Ox8OfLDwc/g4nS1l4PFm+j62i8PXY+j4TS8JfZ+L9wC0I3w/cPvYhnubF4NAOy/dHBUJt7uujgu1ziKfEUPQ8fA7xB92pGr+J4j6kAAAAAElFTkSuQmCC'
  })
  readonly avatar: string
}
class Client2Type {
  @ApiProperty({
    description: 'UserName of Client2Id',
    example: 'ade'
  })
  readonly userName: string

  @ApiProperty({
    description: 'Email of Client2Id',
    example: 'ade@gmail.com'
  })
  readonly email: string

  @ApiProperty({
    description: 'Name of Client2Id',
    example: 'ade'
  })
  readonly name: string

  // @ApiProperty({
  //   description: 'Time of last message posted to the conversation',
  //   example: '2023-07-26T17:59:54.868Z'
  // })
  // readonly updatedAt: Date

  @ApiProperty()
  profile_pics: Profile_picsType[]
}
export class ChatConnectionsResultDto {
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
