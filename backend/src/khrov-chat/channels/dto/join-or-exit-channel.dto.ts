import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsPositive, Matches, IsBoolean } from 'class-validator'
import { Transform } from 'class-transformer'

export class JoinOrExitChannelDto {
  @Transform(({ value }) => {
    return Number(value)
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'Should be an ID of a channel that exists in the Channel table',
    example: 1
  })
  readonly chId: number

  @Matches(/^[a-zA-Z\d]*$/)
  @ApiProperty({
    description:
      'Should be the right Password for Channel chId(if chId requires Password to access)',
    example: 'Abc123'
  })
  readonly password: string

  @Transform(({ value }) => {
    return Boolean(value)
  })
  @IsBoolean()
  @ApiProperty({
    description:
      'Should be either true or false. true means userId wants to join Channel chId. false means userId wants to exit Channel chId',
    example: true
  })
  readonly joinOrExit: boolean
}

export class JoinOrExitChannelResultDto {
  @ApiProperty({
    description: 'Message Explaining What Happened While Processing The Request',
    example: 'You are now a member of X channel'
  })
  readonly message: string
}
