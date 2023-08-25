import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { MockAuthGuard } from './mock-auth.guard'

describe('MatchController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockAuthGuard)
      .compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    app.useGlobalGuards(new MockAuthGuard())
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/POST match', () => {
    return request(app.getHttpServer())
      .post('/match')
      .send({ playerIds: [1, 2] })
      .expect(201)
  })

  describe('invalid player ids', () => {
    it.each([
      { playerIds: [] },
      { playerIds: [0] },
      { playerIds: [-1] },
      { playerIds: [1, 2, 3] },
      { playerIds: [1.2] },
      { playerIds: [1, 1] }
    ])('should not accept request', (playerIds) => {
      return request(app.getHttpServer()).post('/match').send({ playerIds }).expect(400)
    })

    it('should not create match for non existing players', () => {
      return request(app.getHttpServer())
        .post('/match')
        .send({ playerIds: [42424242] })
        .expect(404)
    })
  })

  describe('/GET match', () => {
    it('should return all matches', () => {
      // TODO: check the content of the response?
      return request(app.getHttpServer()).get('/match').expect(200)
    })

    it('should return a single match', async () => {
      const response = await request(app.getHttpServer()).get('/match/1')
      expect(response.status).toEqual(200)
      expect(response.body).toBeDefined()
      expect(response.body.players).toBeTruthy()
    })

    it('should not find a single match that does not exist', () => {
      return request(app.getHttpServer()).get('/match/42424242').expect(404)
    })
  })

  describe('/PATCH match', () => {
    it('should not modify anything when the body is empty', async () => {
      const response = await request(app.getHttpServer()).patch('/match/1').send({})

      // expect(response.status).toEqual(304)
      expect(response.status).toEqual(204)
    })

    it('should not accept the request when the match does not exist', () => {
      return request(app.getHttpServer()).patch('/match/42424242').send({ playerId: 1 }).expect(404)
    })

    it('should not accept the request when the player to add is not registered', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/match')
        .send({ playerIds: [1] })

      expect(createResponse.status).toEqual(201)
      expect(createResponse.body.id).toBeTruthy()

      const matchId = createResponse.body.id

      return request(app.getHttpServer())
        .patch(`/match/${matchId}`)
        .send({
          playerId: 42424242
        })
        .expect(404)
    })
  })
})
