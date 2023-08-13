import { Test, TestingModule } from '@nestjs/testing';
import { SearchUsersController } from './search-users.controller';

describe('SearchUsersController', () => {
  let controller: SearchUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchUsersController],
    }).compile();

    controller = module.get<SearchUsersController>(SearchUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
