import { Test, TestingModule } from '@nestjs/testing'
import { ChannelsService } from './channels.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { ChannelsGateway } from './channels.gateway'
import { SocketService } from '../../socket/socket.service'

describe('ChannelsService', () => {
  let channelsService: ChannelsService
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, ChannelsService, ChannelsGateway, SocketService]
    }).compile()

    channelsService = module.get<ChannelsService>(ChannelsService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(channelsService).toBeDefined()
  })
  it('should be defined', () => {
    expect(prismaService).toBeDefined()
  })

  describe('suggestedChannels', () => {
    it('should return a DB Table ‘SuggestedChannelsResultDto[]’ Object', async () => {
      const result = [
        {
          id: 1,
          name: 'foo',
          desc: 'lorem ipsum',
          visibility: 'public',
          role: 'not'
        }
      ]
      const findMany = [
        {
          chId: 1,
          ch: {
            name: 'foo',
            desc: 'lorem ipsum',
            visibility: 'public'
          }
        }
      ]
      prismaService.user.findUniqueOrThrow = jest.fn().mockImplementation(async () => {})
      prismaService.channel_link.findMany = jest.fn().mockImplementation(async () => findMany)
      prismaService.channel_link.findFirst = jest.fn().mockImplementation(async () => {})
      prismaService.channel_link.findFirstOrThrow = jest.fn().mockImplementation(async () => {})
      expect(await channelsService.suggestedChannels(1)).toStrictEqual(result)
    })
    // more test AKA 'it' for channelsService.suggestedChannels()
  })
})
