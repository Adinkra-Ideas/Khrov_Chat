import { Test, TestingModule } from '@nestjs/testing';
import { ChatConnectionsService } from './chat-connections.service';

describe('ChatConnectionsService', () => {
  let service: ChatConnectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatConnectionsService],
    }).compile();

    service = module.get<ChatConnectionsService>(ChatConnectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
