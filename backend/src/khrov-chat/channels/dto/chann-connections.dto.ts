import { ApiProperty } from '@nestjs/swagger'

class ChType {
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
}
export class ChannConnectionsResultDto {
  @ApiProperty({
    description: 'ID of a channel where {userId} is a member',
    example: 1
  })
  readonly chId: number

  @ApiProperty({
    description: 'Role of {userId} in this Channel. Could be "user","admin","owner"',
    example: 'user'
  })
  readonly role: string

  @ApiProperty({
    description: 'Current status of {userId} in this Channel. Could be "good", "muted" or "banned"',
    example: 'good'
  })
  readonly linkStatus: string

  @ApiProperty({
    description: 'Expiry Time of most recent mute of {userId} in Channel chId',
    example: '2023-09-04T18:47:50.490Z'
  })
  readonly mutedUntil: Date

  @ApiProperty({
    description: 'Number of unread messages since {userId} last visited Channel chId',
    example: 15
  })
  readonly unreadCount: number

  @ApiProperty()
  ch: ChType
}
