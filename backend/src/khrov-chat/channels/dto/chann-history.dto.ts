import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator'
import { Transform } from 'class-transformer'

export class ChannHistoryDto {
  @Transform(({ value }) => {
    return Number(value)
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'Should be an ID of a channel where {userId} is a member',
    example: 1
  })
  readonly chId: number
}

class UserType {
  @ApiProperty({
    description: 'UserName of the message poster',
    example: 'ade'
  })
  readonly userName: string

  @ApiProperty({
    description: 'ID of the message poster',
    example: 1
  })
  readonly id: number
}
export class ChannHistoryResultDto {
  @ApiProperty({
    description: 'The single message part',
    example: 'user'
  })
  readonly outgoing: string

  @ApiProperty({
    description: 'The time of creating the message',
    example: '2023-09-04T18:47:50.490Z'
  })
  readonly createdAt: Date

  @ApiProperty({
    description:
      'Current delivery status of the message this Channel. Could be "sent", or "pending"',
    example: 'sent'
  })
  readonly deliveryStatus: string

  @ApiProperty()
  user: UserType
}
