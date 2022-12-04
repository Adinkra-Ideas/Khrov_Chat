import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator'
import { Transform } from 'class-transformer'

export class DeleteHistoryDto {
  @Transform(({ value }) => {
    return Number(value)
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description:
      'Conversation ID identifying thee user who wants to delete their copy of the chat conversation',
    example: 1
  })
  unionId: number
}

export class DeleteHistoryResultDto {
  @ApiProperty({
    description: 'Message Explaining What Happened While Processing The Request',
    example: 'Success!'
  })
  readonly message: string
}
