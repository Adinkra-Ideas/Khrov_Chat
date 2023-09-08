import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsPositive, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class BlockingDto {
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'userId of the user who wants to block the other',
    example: 1,
  })
  readonly blockerId: number;

  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'userId of the user about to get blocked',
    example: 2,
  })
  readonly blockedId: number;
}

export class BlockingResultDto {
  @ApiProperty({
    description: 'Message Explaining What Happened While Processing The Request',
    example: 'Success!',
  })
  readonly message: string;
}
