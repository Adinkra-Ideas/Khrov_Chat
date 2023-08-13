import { IsNumber, IsNotEmpty, IsPositive, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export default class {
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly blockerId: number;

  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly blockedId: number;
}