import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsPositive, IsBoolean } from 'class-validator'
import { Transform } from 'class-transformer'

export class ApproveOrRejectDto {
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
    description: 'ID of a user whose request to join Channel chId is still pending',
    example: 2
  })
  readonly memberId: number

  @Transform(({ value }) => {
    return Boolean(value)
  })
  @IsBoolean()
  @ApiProperty({
    description:
      "adminId's decision regarding this memberId's request to join Channel chId. true===accept, false===reject",
    example: true
  })
  readonly action: boolean
}

export class ApproveOrRejectResultDto {
  @ApiProperty({
    description: 'Message Explaining What Happened While Processing The Request',
    example: 'Success!'
  })
  readonly message: string
}
