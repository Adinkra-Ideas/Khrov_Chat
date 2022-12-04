import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator'
import { Transform } from 'class-transformer'

export class PendingApprovalsDto {
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
}

class UserType {
  @ApiProperty({
    description: 'Username of the user that has requested to join Channel chId',
    example: 'mosquie214'
  })
  readonly userName: string
}
export class PendingApprovalsResultDto {
  @ApiProperty({
    description: 'ID of a user that has requested to join Channel chId',
    example: 1
  })
  readonly userId: number

  @ApiProperty({
    description: 'ID of the channel where userId has requested to join',
    example: 1
  })
  readonly chId: number

  @ApiProperty()
  user: UserType
}
