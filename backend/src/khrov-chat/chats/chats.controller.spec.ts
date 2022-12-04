import { Test, TestingModule } from '@nestjs/testing'
import { ChatsController } from './chats.controller'
import { ChatsService } from './chats.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { ChatsGateway } from './chats.gateway'
import { SocketService } from '../../socket/socket.service'

describe('ChatsController', () => {
  let chatsController: ChatsController
  let chatsService: ChatsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatsController],
      providers: [PrismaService, ChatsService, ChatsGateway, SocketService]
    }).compile()

    chatsController = module.get<ChatsController>(ChatsController)
    chatsService = module.get<ChatsService>(ChatsService)
  })

  it('should be defined', () => {
    expect(chatsController).toBeDefined()
  })
  it('should be defined', () => {
    expect(chatsService).toBeDefined()
  })

  describe('getChatHistory', () => {
    it('should return a DB Table ‘Chat_union[]’ Object', async () => {
      const result = {
        unionId: 1,
        unionIdOther: 2,
        client1Id: 1,
        client2Id: 2,
        blockStatus: false,
        allowedToUnblock: true,
        unreadCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        client2: {
          userName: 'khrov',
          profile_pics: [{ avatar: 'basxxx' }]
        },
        chat_historys: [
          {
            outgoing: 'hello',
            incoming: '',
            time: new Date(),
            deliveryStatus: 'sent'
          }
        ]
      }
      jest.spyOn(chatsService, 'getChatHistory').mockImplementation(async () => result)
      expect(await chatsController.getChatHistory({ unionId: 1 })).toBe(result)
    })
    // more test AKA 'it' for chatsController.getChatHistory()
  })
})
