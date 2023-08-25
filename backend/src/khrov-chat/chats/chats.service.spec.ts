import { Test, TestingModule } from '@nestjs/testing'
import { ChatsService } from './chats.service'
import { ChatsController } from './chats.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { ChatsGateway } from './chats.gateway'
import { SocketService } from '../../socket/socket.service'

describe('ChatsService', () => {
  let chatsService: ChatsService
  let chatsController: ChatsController
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, ChatsService, ChatsGateway, SocketService],
      controllers: [ChatsController]
    }).compile()

    chatsService = module.get<ChatsService>(ChatsService)
    chatsController = module.get<ChatsController>(ChatsController)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(chatsService).toBeDefined()
  })
  it('should be defined', () => {
    expect(chatsController).toBeDefined()
  })
  it('should be defined', () => {
    expect(prismaService).toBeDefined()
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
      prismaService.chat_union.findUniqueOrThrow = jest.fn().mockImplementation(async () => result)
      expect(await chatsService.getChatHistory(1)).toBe(result)
    })
    // more test AKA 'it' for chatsService.getChatHistory()
  })
})
