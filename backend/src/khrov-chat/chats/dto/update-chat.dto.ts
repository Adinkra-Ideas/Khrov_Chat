import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsPositive, IsDateString } from 'class-validator'
import { Transform } from 'class-transformer'

export class UpdateChatDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'New chat message to be inserted into the chat conversation',
    example: ' Hello there'
  })
  outgoing: string

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'Time of posting the new chat message',
    example: '2023-07-26T17:59:54.868Z'
  })
  time: string

  @IsNotEmpty()
  @ApiProperty({
    description: 'Delivery status of the new chat message',
    example: 'pending'
  })
  deliveryStatus: string

  @Transform(({ value }) => {
    return Number(value)
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description:
      'Unique ID for determining which chat Conversation and The User sending this message ',
    example: 1
  })
  unionId: number

  @Transform(({ value }) => {
    return Number(value)
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'Unique ID of the opposite used of this chat conversation',
    example: 2
  })
  unionIdOther: number
}

export class UpdateChatResultDto {
  @ApiProperty({
    description: 'Message Explaining What Happened While Processing The Request',
    example: 'Success!'
  })
  readonly message: string
}
