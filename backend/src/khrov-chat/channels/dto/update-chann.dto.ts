import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsPositive, IsDateString } from 'class-validator'
import { Transform } from 'class-transformer'

export class UpdateChannDto {
  @Transform(({ value }) => {
    return Number(value)
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'Should be an ID of a channel where userId is a member and posting message to',
    example: 1
  })
  chId: number

  @IsNotEmpty()
  @ApiProperty({
    description: 'The single message to be posted into Channel Conversation',
    example: 'Hello everyone, I am new here'
  })
  msg: string

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'The time of posting the message',
    example: '2023-07-26T17:59:54.868Z'
  })
  time: Date
}
