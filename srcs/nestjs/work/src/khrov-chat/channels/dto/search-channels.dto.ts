import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsPositive, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchChannelsDto {
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'Should be an ID of a user that exists in the User table',
    example: 1,
  })
  readonly userId: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Search key. Minimum 2 characters ',
    example: 'go',
  })
  readonly key: string;
}

export class SearchChannelsResultDto {
  @ApiProperty({
    description: 'ID of the channel',
    example: 1,
  })
  readonly id: number;

  @ApiProperty({
    description: 'Name of the channel',
    example: 'EarthChannel',
  })
  readonly name: string;

  @ApiProperty({
    description: 'Description of the channel',
    example: 'EarthChannel is a channel for discussions',
  })
  readonly desc: string;

  @ApiProperty({
    description: 'Visibility of the channel',
    example: 'public',
  })
  readonly visibility: string;

  @ApiProperty({
    description: 'Role of {userId} in this Channel. Could be "user","admin","owner" or "not"(if they are not a member of this channel)',
    example: 'user',
  })
  readonly role: string;
}
