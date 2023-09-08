import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsPositive, IsBoolean} from 'class-validator';
import { Transform } from 'class-transformer';

export class NewChatDto {
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'user Id of the User sending this message ',
    example: 1,
  })
  senderId: number;

  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'user Id of the User to whom this message is intended',
    example: 2,
  })
  receiverId: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The message ',
    example: 'Hell there, how are you?',
  })
  msg: string;
}

export class NewChatResultDto {
  @ApiProperty({
    description: 'Message Explaining What Happened While Processing The Request',
    example: 'Success!',
  })
  readonly message: string;
}
