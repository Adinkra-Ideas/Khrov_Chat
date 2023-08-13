import { IsNumber, IsNotEmpty, IsPositive} from 'class-validator';
import { Transform } from 'class-transformer';

export default class {
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly searcherId: number;

  @IsNotEmpty()
  readonly key: string;
}
