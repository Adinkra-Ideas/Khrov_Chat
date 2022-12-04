import { ApiProperty } from '@nestjs/swagger'
import { Matches } from 'class-validator'

export class AddChannelDto {
  @Matches(/^[a-zA-Z\d]{3,15}$/)
  @ApiProperty({
    description: 'Name given to the channel that needs to be created',
    example: 'NewChannel9'
  })
  readonly name: string

  @Matches(/^[a-zA-Z\d?@ ,.'^\n]{10,42}$/)
  @ApiProperty({
    description: 'Description for the channel',
    example: 'NewChannel9 is a channel for nice topics'
  })
  readonly desc: string

  @Matches(/^public$|^private$|^password$/)
  @ApiProperty({
    description: 'Visibility mode for the channel',
    example: 'public'
  })
  readonly visibility: string

  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])^[a-zA-Z\d]{6,20}$/)
  @ApiProperty({
    description: 'Password for the channel',
    example: 'Abc123'
  })
  readonly password: string
}

export class AddChannelResultDto {
  @ApiProperty({
    description: 'Message Explaining What Happened While Processing The Request',
    example: 'Channel X Created Successfully!'
  })
  readonly message: string
}
