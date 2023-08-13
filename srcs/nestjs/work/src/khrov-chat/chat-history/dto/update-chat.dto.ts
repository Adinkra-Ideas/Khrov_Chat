import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export default class {
  @IsNotEmpty()
  outgoing: string;

  @IsNotEmpty()
  time: string;

  @IsNotEmpty()
  deliveryStatus: string;

  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  unionId: number;

  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  unionIdOther: number;
}
