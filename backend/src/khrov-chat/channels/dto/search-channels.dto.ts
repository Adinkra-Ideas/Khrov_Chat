import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class SearchChannelsDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Search key. Minimum 2 characters ',
    example: 'go'
  })
  readonly key: string
}

export class SearchChannelsResultDto {
  @ApiProperty({
    description: 'ID of the channel',
    example: 1
  })
  readonly id: number

  @ApiProperty({
    description: 'Name of the channel',
    example: 'EarthChannel'
  })
  readonly name: string

  @ApiProperty({
    description: 'Description of the channel',
    example: 'EarthChannel is a channel for discussions'
  })
  readonly desc: string

  @ApiProperty({
    description: 'Visibility of the channel',
    example: 'public'
  })
  readonly visibility: string

  @ApiProperty({
    description:
      'Role of {userId} in this Channel. Could be "user","admin","owner" or "not"(if they are not a member of this channel)',
    example: 'user'
  })
  readonly role: string
}
