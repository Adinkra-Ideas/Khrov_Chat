import { Test, TestingModule } from '@nestjs/testing'
import {
  chatsWithScore,
  chatsWithScoreArray,
  maximalChats,
  maximalChatsArray,
  minimalChatsArray
} from '../../../prisma/chats.test-data'
import { GameStatus } from '../dto/query-chats.dto'
import { ChatsController } from '../chats.controller'
import { ChatsService } from '../chats.service'

const mockChatsService = {
  create: jest.fn().mockResolvedValue(chatsWithScore),
  all: jest.fn().mockResolvedValue(minimalChatsArray),
  findAll: jest.fn(),
  findOne: jest.fn().mockResolvedValue(maximalChats),
  remove: jest.fn(),
  addPlayer: jest.fn(),
  addChatsResult: jest.fn()
}

describe('ChatsController', () => {
  let controller: ChatsController
  let service: ChatsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatsController],
      providers: [
        {
          provide: ChatsService,
          useValue: mockChatsService
        }
      ]
    }).compile()

    controller = module.get<ChatsController>(ChatsController)
    service = module.get<ChatsService>(ChatsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a chats', async () => {
      await controller.create({
        playerIds: [54]
      })

      expect(service.create).toBeCalledTimes(1)
    })
  })

  describe('all', () => {
    it('should return all chatses in minimal representation', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(minimalChatsArray)

      const chatses = await controller.findAll({ includeScores: false, includePlayers: false })

      expect(chatses).toEqual(minimalChatsArray)
    })

    it('should return all chatses with the score included', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(chatsWithScoreArray)

      const chatses = await controller.findAll({
        includeScores: true,
        includePlayers: false,
        gameStatus: GameStatus.COMPLETED
      })

      expect(chatses).toEqual(chatsWithScoreArray)
    })

    it('should return all chatses with the score and player names included', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(maximalChatsArray)

      const chatses = await controller.findAll({
        includeScores: true,
        includePlayers: true,
        gameStatus: GameStatus.COMPLETED
      })

      expect(chatses).toEqual(maximalChatsArray)
    })
  })

  describe('update', () => {
    it('should add a second player to an existing chats', async () => {
      await controller.update(1, { playerId: 2 })

      expect(service.addPlayer).toBeCalled()
    })

    it('should add the chats result and mark the game as completed', async () => {
      await controller.update(1, {
        scores: [
          {
            playerId: 1,
            score: 7
          }
        ]
      })

      expect(service.addChatsResult).toBeCalled()
    })

    it('should add a second player and report the chats results', async () => {
      await controller.update(1, {
        playerId: 2,
        scores: [
          {
            playerId: 1,
            score: 7
          }
        ]
      })

      expect(service.addChatsResult).toBeCalled()
      expect(service.addPlayer).toBeCalled()
    })
  })
})
