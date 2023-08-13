import { Test, TestingModule } from '@nestjs/testing';
import { ChatBlockingService } from './chat-blocking.service';

describe('ChatBlockingService', () => {
  let service: ChatBlockingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatBlockingService],
    }).compile();

    service = module.get<ChatBlockingService>(ChatBlockingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
