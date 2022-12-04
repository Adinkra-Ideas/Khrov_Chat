import { Test, TestingModule } from '@nestjs/testing'
import {
  channelsWithScore,
  channelsWithScoreArray,
  maximalChannels,
  maximalChannelsArray,
  minimalChannelsArray
} from '../../../prisma/channels.test-data'
import { GameStatus } from '../dto/query-channels.dto'
import { ChannelsController } from '../channels.controller'
import { ChannelsService } from '../channels.service'

const mockChannelsService = {
  create: jest.fn().mockResolvedValue(channelsWithScore),
  all: jest.fn().mockResolvedValue(minimalChannelsArray),
  findAll: jest.fn(),
  findOne: jest.fn().mockResolvedValue(maximalChannels),
  remove: jest.fn(),
  addPlayer: jest.fn(),
  addChannelsResult: jest.fn()
}

describe('ChannelsController', () => {
  let controller: ChannelsController
  let service: ChannelsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelsController],
      providers: [
        {
          provide: ChannelsService,
          useValue: mockChannelsService
        }
      ]
    }).compile()

    controller = module.get<ChannelsController>(ChannelsController)
    service = module.get<ChannelsService>(ChannelsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a channels', async () => {
      await controller.create({
        playerIds: [54]
      })

      expect(service.create).toBeCalledTimes(1)
    })
  })

  describe('all', () => {
    it('should return all channelses in minimal representation', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(minimalChannelsArray)

      const channelses = await controller.findAll({ includeScores: false, includePlayers: false })

      expect(channelses).toEqual(minimalChannelsArray)
    })

    it('should return all channelses with the score included', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(channelsWithScoreArray)

      const channelses = await controller.findAll({
        includeScores: true,
        includePlayers: false,
        gameStatus: GameStatus.COMPLETED
      })

      expect(channelses).toEqual(channelsWithScoreArray)
    })

    it('should return all channelses with the score and player names included', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(maximalChannelsArray)

      const channelses = await controller.findAll({
        includeScores: true,
        includePlayers: true,
        gameStatus: GameStatus.COMPLETED
      })

      expect(channelses).toEqual(maximalChannelsArray)
    })
  })

  describe('update', () => {
    it('should add a second player to an existing channels', async () => {
      await controller.update(1, { playerId: 2 })

      expect(service.addPlayer).toBeCalled()
    })

    it('should add the channels result and mark the game as completed', async () => {
      await controller.update(1, {
        scores: [
          {
            playerId: 1,
            score: 7
          }
        ]
      })

      expect(service.addChannelsResult).toBeCalled()
    })

    it('should add a second player and report the channels results', async () => {
      await controller.update(1, {
        playerId: 2,
        scores: [
          {
            playerId: 1,
            score: 7
          }
        ]
      })

      expect(service.addChannelsResult).toBeCalled()
      expect(service.addPlayer).toBeCalled()
    })
  })
})
