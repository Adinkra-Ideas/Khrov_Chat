import { IsNumber, IsNotEmpty, IsPositive, IsBoolean} from 'class-validator';
import { Transform } from 'class-transformer';

export default class {
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  senderId: number;

  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  receiverId: number;

  @IsNotEmpty()
  msg: string;
}
