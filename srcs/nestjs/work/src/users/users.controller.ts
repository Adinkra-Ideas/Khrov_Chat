import { Controller, Get, Param, Post, Body, Query, Delete, Put} from '@nestjs/common';
import { UsersService } from './users.service';
// CreateUserDTO is a data transfer object, a TypeScript class that we will 
// create shortly for type-checking and to define the structures of what  
// an object looks like when creating a new user.
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
	// Using constructor to inject the UsersService into this controller
    constructor(private usersService: UsersService) { }

	// Method used to fetch the list of all users. It has @Get() decorator attached to it. 
	// This helps to map any GET request sent to /users to this controller.
    @Get()
    async getUsers() {
        const users = await this.usersService.getUsers();
        return users;
    }

	// Method used to retrieve the details of a particular user by passing the userID as a parameter.
    @Get(':userID')
    async getUser(@Param('userID') userID: number) {
        const user = await this.usersService.getUser(userID);
        return user;
    }

	// Method used to create and post a new user to the existing user list. And because we are not 
	// persisting into the database, the newly added user will only be held in memory.
    @Post()
    async addUser(@Body() newUserRow: CreateUserDTO) {
        const user = await this.usersService.addUser(newUserRow);
        return user;
    }

	// Method used to delete a user by passing the userID as a query parameter.
    @Delete()
    async deleteUser(@Query() query) {
        const users = await this.usersService.deleteUser(query.userID);
        return users;
    }
}
