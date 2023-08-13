import { Test, TestingModule } from '@nestjs/testing';
import { SearchUsersService } from './search-users.service';

describe('SearchUsersService', () => {
  let service: SearchUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchUsersService],
    }).compile();

    service = module.get<SearchUsersService>(SearchUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
