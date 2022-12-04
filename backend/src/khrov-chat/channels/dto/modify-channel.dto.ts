import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsPositive, Matches } from 'class-validator'
import { Transform } from 'class-transformer'

export class ModifyChannelDto {
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

  @Matches(/^public$|^private$|^password$/)
  @ApiProperty({
    description: 'New channel visibility option that adminId wants to set for chId',
    example: 'public'
  })
  readonly newVisibility: string

  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])^[a-zA-Z\d]{6,20}$/)
  @ApiProperty({
    description: 'New Password to be used for accessing the channel',
    example: 'Abc123'
  })
  readonly password: string
}

export class ModifyChannelResultDto {
  @ApiProperty({
    description: 'Message Explaining What Happened While Processing The Request',
    example: 'Success!'
  })
  readonly message: string
}
