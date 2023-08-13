import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Users } from "./users.entity";


@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(Users)
		private usersRepository: Repository<Users>,
	) {}

	// return all table contents
	getUsers(): Promise<Users[]> {
		return this.usersRepository.find();
	}

	// This Promise is like saying, 'I promise to return a row of Users DB Data or NULL'
	getUser(id: number): Promise<Users | null> {
		return this.usersRepository.findOneBy({ id });
	}

	// inserts a row
	async addUser(newUserRow): Promise<void> {
		await this.usersRepository.insert(newUserRow);
	}

	// delete a row
	async deleteUser(id): Promise<void> {
		await this.usersRepository.delete(id);
	}
}
