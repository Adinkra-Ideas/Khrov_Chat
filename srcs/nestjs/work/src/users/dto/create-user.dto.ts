import { MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
    readonly id: number;

	@MinLength(3)
  	@IsNotEmpty()
    readonly username: string;
	
    readonly signature: string;
    readonly password: string;
}