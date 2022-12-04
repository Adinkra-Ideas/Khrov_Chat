import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsPositive, Matches, IsDateString } from 'class-validator'
import { Transform } from 'class-transformer'

export class ModerateUsersDto {
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

  @Transform(({ value }) => {
    return Number(value)
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'ID of the user that adminId wants to moderate',
    example: 1
  })
  readonly userId: number

  @Matches(/^setAsAdmin$|^ban$|^kick$|^mute$/)
  @ApiProperty({
    description: 'Moderation action that adminId wants to take on userId',
    example: 'mute'
  })
  readonly action: string

  @IsDateString()
  @ApiProperty({
    description: 'If moderation action===mute, Date time when the mute will expire',
    example: '2023-07-26T17:59:54.868Z'
  })
  readonly mutedUntil: Date
}

export class ModerateUsersResultDto {
  @ApiProperty({
    description: 'Message Explaining What Happened While Processing The Request',
    example: 'Success! Xuser is now muted until 2023-07-26T17:59:54.868Z'
  })
  readonly message: string
}
