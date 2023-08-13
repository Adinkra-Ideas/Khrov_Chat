import { Test, TestingModule } from '@nestjs/testing';
import { ChatBlockingController } from './chat-blocking.controller';

describe('ChatBlockingController', () => {
  let controller: ChatBlockingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatBlockingController],
    }).compile();

    controller = module.get<ChatBlockingController>(ChatBlockingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
