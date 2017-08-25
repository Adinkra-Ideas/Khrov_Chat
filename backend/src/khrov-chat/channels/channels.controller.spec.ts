import { Test, TestingModule } from '@nestjs/testing'
import { ChannelsController } from './channels.controller'
import { ChannelsService } from './channels.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { ChannelsGateway } from './channels.gateway'
import { SocketService } from '../../socket/socket.service'

describe('ChannelsController', () => {
  let channelsController: ChannelsController
  let channelsService: ChannelsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelsController],
      providers: [PrismaService, ChannelsService, ChannelsGateway, SocketService]
    }).compile()

    channelsController = module.get<ChannelsController>(ChannelsController)
    channelsService = module.get<ChannelsService>(ChannelsService)
  })

  it('should be defined', () => {
    expect(channelsController).toBeDefined()
  })
  it('should be defined', () => {
    expect(channelsService).toBeDefined()
  })

  describe('suggestedChannels', () => {
    it('should return a DB Table ‘SuggestedChannelsResultDto[]’ Object', async () => {
      const result = [
        {
          id: 1,
          name: 'foo',
          desc: 'lorem ipsum',
          visibility: 'public',
          role: 'user'
        }
      ]
      const resultJson = JSON.stringify(result)
      jest.spyOn(channelsService, 'suggestedChannels').mockImplementation(async () => result)
      expect(await channelsController.suggestedChannels({ user: { id: 1 } })).toBe(resultJson)
    })
    // more test AKA 'it' for channelsController.suggestedChannels()
  })
})
