import { Test, TestingModule } from '@nestjs/testing';
import { ChatConnectionsController } from './chat-connections.controller';

describe('ChatConnectionsController', () => {
  let controller: ChatConnectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatConnectionsController],
    }).compile();

    controller = module.get<ChatConnectionsController>(ChatConnectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
