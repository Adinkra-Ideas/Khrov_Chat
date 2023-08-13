import { Module } from '@nestjs/common';
import { SearchUsersController } from './search-users.controller';
import { SearchUsersService } from './search-users.service';
import { PrismaModule } from '../../db/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [SearchUsersController],
  providers: [SearchUsersService]
})
export class SearchUsersModule {}
