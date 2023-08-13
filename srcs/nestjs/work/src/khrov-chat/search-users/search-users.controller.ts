import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import {SearchUsersService} from './search-users.service';
import SearchUsersDTO from './dto/search-users.dto';
import { User } from '@prisma/client'; 

@Controller('search-users')
export class SearchUsersController {
  constructor(private searchUsersService: SearchUsersService){}
// : User[] 
  @Post()   
  async searchUsers( @Body() details: SearchUsersDTO ){
    const output = await this.searchUsersService.searchUsers(details);
    return output;
  }
}
