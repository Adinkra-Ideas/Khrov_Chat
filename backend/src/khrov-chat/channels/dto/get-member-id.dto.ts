import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsPositive, Matches } from 'class-validator'
import { Transform } from 'class-transformer'

export class GetMemberIdDto {
  @Transform(({ value }) => {
    return Number(value)
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'ID of a channel where adminId is an admin',
    example: 1
  })
  readonly chId: number

  @Matches(/^[a-zA-Z\d?@ ,.'^\n]{3,17}$/)
  @ApiProperty({
    description: 'userName of the user whose userId is being requested',
    example: 'mamcee'
  })
  readonly userName: string
}

export class GetMemberIdResultDto {
  @ApiProperty({
    description: 'Message Explaining What Happened While Processing The Request',
    example: 'UserId for X user is 1'
  })
  readonly message: string
}
