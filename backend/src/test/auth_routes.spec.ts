import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import prisma from 'src/prisma/__mocks__/prisma'
import * as request from 'supertest'
import { AppModule } from '../app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { MockAuthGuard } from './mock-auth.guard'
import { Mock42AuthGuard } from './mock-42-auth.guard'
import { Mock2FAAuthGuard } from './mock-2fa-auth.guard'
import { MockRefreshAuthGuard } from './mock-refresh-auth.guard'
import { AuthGuard } from '@nestjs/passport'
import { RefreshAuthGuard } from 'src/auth/guards/refresh.guard'
import { TFAAuthGuard } from 'src/auth/guards/2fa-auth.guard'
import { authenticator } from 'otplib'
import * as cookieParser from 'cookie-parser'
import { JwtService } from '@nestjs/jwt'

describe('Test for diffrent routes', () => {
  describe('Tests for the users routes', () => {
    let app: INestApplication
    const frontUrl = process.env.FRONTEND_URL

    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule]
      })
        .overrideProvider(PrismaService)
        .useValue(prisma)
        .overrideGuard(JwtAuthGuard)
        .useClass(MockAuthGuard)
        .overrideGuard(TFAAuthGuard)
        .useClass(Mock2FAAuthGuard)
        .overrideGuard(RefreshAuthGuard)
        .useClass(MockRefreshAuthGuard)
        .overrideGuard(AuthGuard('42'))
        .useClass(Mock42AuthGuard)
        .compile()

      app = moduleFixture.createNestApplication()
      app.useGlobalPipes(new ValidationPipe())
      app.useGlobalGuards(new MockAuthGuard())
      app.use(cookieParser())
      app.enableCors({
        credentials: true,
        origin: ['http://localhost:8080'],
        methods: 'GET, PUT, POST, PATCH, DELETE',
        allowedHeaders: 'Content-Type, Authorization'
      })
      await app.init()
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    // very basic testing as hard to test diffrent stuff here
    // [GET] /auth/callback
    it('[GET] /auth/callback will redirect to a frontend part', async () => {
      const { status, body, header } = await request(app.getHttpServer())
        .get('/auth/callback')
        .set('Accept', 'application/json')
      expect(body).toStrictEqual({})
      expect(status).toBe(302)
      expect(header.location).toStrictEqual(frontUrl + '/user/firsttime')
    })
    // [GET] /auth/deactivate2FA
    it('[GET] /auth/deactivate2FA valid request works', async () => {
      const { status, body } = await request(app.getHttpServer())
        .get('/auth/deactivate2FA')
        .set('Accept', 'application/json')
      expect(body).toStrictEqual({})
      expect(status).toBe(200)
    })
    // [GET] /auth/activate2FA
    it('[GET] /auth/activate2FA valid request works', async () => {
      const { status, body } = await request(app.getHttpServer())
        .get('/auth/activate2FA')
        .set('Accept', 'application/json')
      expect(body).toStrictEqual({ url: expect.any(String) })
      expect(status).toBe(200)
    })
    // [GET] /auth/user-profile
    it('[GET] /auth/user-profile valid request works', async () => {
      const { status, body } = await request(app.getHttpServer())
        .get('/auth/user-profile')
        .set('Accept', 'application/json')
      expect(body).toStrictEqual({ id: 1, userName: 'testUser' })
      expect(status).toBe(200)
    })
    // [GET] /auth/logout
    it('[GET] /auth/logout valid request works', async () => {
      const { status, body } = await request(app.getHttpServer())
        .get('/auth/logout')
        .set('Accept', 'application/json')
      expect(body).toStrictEqual({ msg: 'success' })
      expect(status).toBe(200)
    })

    // [POST] /auth/verifyactivate2fa
    it('[POST] /auth/verifyactivate2fa invalid request returns an error', async () => {
      const mockUser = { id: 1, twoFactorAuthenticationSecret: '123456' }
      // @ts-ignore
      prisma.user.findUnique.mockResolvedValue(mockUser as any)
      const { status, body } = await request(app.getHttpServer())
        .post('/auth/verifyactivate2fa')
        .set('Accept', 'application/json')
        .send('123456')
      expect(body).toStrictEqual({ message: 'Code could not be Validated', statusCode: 403 })
      expect(status).toBe(403)
    })

    it('[POST] /auth/verifyactivate2fa with a valid code works', async () => {
      const mockUser = { id: 1, twoFactorAuthenticationSecret: '123456' }
      // @ts-ignore
      prisma.user.findUnique.mockResolvedValue(mockUser as any)
      const spy = jest.spyOn(authenticator, 'verify')
      spy.mockReturnValue(true)
      const { status, body } = await request(app.getHttpServer())
        .post('/auth/verifyactivate2fa')
        .set('Accept', 'application/json')
        .send('123456')
      expect(body).toStrictEqual({})
      expect(status).toBe(200)
    })

    // [POST] /auth/verify2FA
    it('[POST] /auth/verify2FA invalid request returns an error', async () => {
      const mockUser = { id: 1, twoFactorAuthenticationSecret: '123456' }
      // @ts-ignore
      prisma.user.findUnique.mockResolvedValue(mockUser as any)
      const spy = jest.spyOn(authenticator, 'verify')
      spy.mockReturnValue(false)
      const { status, body } = await request(app.getHttpServer())
        .post('/auth/verify2FA')
        .set('Accept', 'application/json')
        .send('123456')
      expect(body).toStrictEqual({ message: 'Code could not be Validated', statusCode: 403 })
      expect(status).toBe(403)
    })

    it('[POST] /auth/verify2FA valid request works', async () => {
      const mockUser = { id: 1, activated2FA: true, twoFactorAuthenticationSecret: '123456' }
      const spy = jest.spyOn(authenticator, 'verify')
      spy.mockReturnValue(true)
      // @ts-ignore
      prisma.user.findUnique.mockResolvedValue(mockUser as any)
      const { status, body } = await request(app.getHttpServer())
        .post('/auth/verify2FA')
        .set('Accept', 'application/json')
        .send('123456')
      expect(body).toStrictEqual({})
      expect(status).toBe(200)
    })

    // [GET] /auth/refresh
    it('[GET] /auth/refresh valid request works', async () => {
      const mockRefreshToken = 'fakeRefreshToken'
      const mockUser = { id: 1, activated2FA: true, refreshToken: mockRefreshToken }
      const spy = jest.spyOn(JwtService.prototype, 'decode')

      spy.mockReturnValue({ userId: 1 })
      // @ts-ignore
      prisma.user.findUnique.mockResolvedValue(mockUser as any)
      const { status, body } = await request(app.getHttpServer())
        .get('/auth/refresh')
        .set('Accept', 'application/json')
        .set('Cookie', ['refresh-cookie=fakeRefreshToken'])
        .send()
      expect(body).toStrictEqual({})
      expect(status).toBe(200)
    })

    it('[GET] /auth/refresh request with no refresh token returns an error', async () => {
      const mockUser = { id: 1, twoFactorAuthenticationSecret: '123456' }
      // @ts-ignore
      prisma.user.findUnique.mockResolvedValue(mockUser as any)
      const { status, body } = await request(app.getHttpServer())
        .get('/auth/refresh')
        .set('Accept', 'application/json')
        .set('Cookie', ['random-cookie=fakeRefreshToken'])
      expect(body).toStrictEqual({
        error: 'Unauthorized',
        message: 'No Valid RefreshToken',
        statusCode: 401
      })
      expect(status).toBe(401)
    })

    it('[GET] /auth/refresh request with no valid user returns an error', async () => {
      const spy = jest.spyOn(JwtService.prototype, 'decode')
      spy.mockReturnValue({ userId: 1 })
      // @ts-ignore
      prisma.user.findUnique.mockResolvedValue(null)
      const { status, body } = await request(app.getHttpServer())
        .get('/auth/refresh')
        .set('Accept', 'application/json')
        .set('Cookie', ['refresh-cookie=fakeRefreshToken'])
        .send()
      expect(body).toStrictEqual({
        error: 'Unauthorized',
        message: 'No Valid RefreshToken',
        statusCode: 401
      })
      expect(status).toBe(401)
    })

    it('[GET] /auth/refresh request with no refreshtoken on user returns an error', async () => {
      const mockUser = { id: 1, activated2FA: true, refreshToken: null }
      const spy = jest.spyOn(JwtService.prototype, 'decode')

      spy.mockReturnValue({ userId: 1 })
      // @ts-ignore
      prisma.user.findUnique.mockResolvedValue(mockUser as any)
      const { status, body } = await request(app.getHttpServer())
        .get('/auth/refresh')
        .set('Accept', 'application/json')
        .set('Cookie', ['refresh-cookie=fakeRefreshToken'])
        .send()
      expect(body).toStrictEqual({
        error: 'Unauthorized',
        message: 'No Valid RefreshToken',
        statusCode: 401
      })
      expect(status).toBe(401)
    })

    it('[GET] /auth/refresh request with wrong refreshtoken returns an error', async () => {
      const mockRefreshToken = 'wrongfakeRefreshToken'
      const mockUser = { id: 1, activated2FA: true, refreshToken: mockRefreshToken }
      const spy = jest.spyOn(JwtService.prototype, 'decode')

      spy.mockReturnValue({ userId: 1 })
      // @ts-ignore
      prisma.user.findUnique.mockResolvedValue(mockUser as any)
      const { status, body } = await request(app.getHttpServer())
        .get('/auth/refresh')
        .set('Accept', 'application/json')
        .set('Cookie', ['refresh-cookie=fakeRefreshToken'])
        .send()
      expect(body).toStrictEqual({
        error: 'Unauthorized',
        message: 'No Valid RefreshToken',
        statusCode: 401
      })
      expect(status).toBe(401)
    })
  })

  describe('Test if all routes are guarded', () => {
    let app: INestApplication

    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule]
      })
        .overrideProvider(PrismaService)

        .useValue(prisma)
        .compile()

      app = moduleFixture.createNestApplication()
      app.useGlobalPipes(new ValidationPipe())
      await app.init()
    })

    afterEach(() => {
      jest.clearAllMocks()
    })
    it('[GET] /auth/42login guard test', async () => {
      const { status } = await request(app.getHttpServer())
        .get('/auth/42login')
        .set('Accept', 'application/json')
        .set('auth-cookie', '')

      expect(status).toBe(302)
    })
    it('[GET] /auth/callback guard test', async () => {
      const { status } = await request(app.getHttpServer())
        .get('/auth/callback')
        .set('Accept', 'application/json')
        .set('auth-cookie', '')
      expect(status).toBe(302)
    })
    it('[GET] /auth/deactivate2FA guard test', async () => {
      const { status } = await request(app.getHttpServer())
        .get('/auth/deactivate2FA')
        .set('Accept', 'application/json')
        .set('auth-cookie', '')
        .expect('Content-Type', /json/)
      expect(status).toBe(401)
    })
    it('[GET] /auth/activate2FA guard test', async () => {
      const { status } = await request(app.getHttpServer())
        .get('/auth/activate2FA')
        .set('Accept', 'application/json')
        .set('auth-cookie', '')
        .expect('Content-Type', /json/)
      expect(status).toBe(401)
    })
    it('[GET] /auth/user-profile guard test', async () => {
      const { status } = await request(app.getHttpServer())
        .get('/auth/user-profile')
        .set('Accept', 'application/json')
        .set('auth-cookie', '')
        .expect('Content-Type', /json/)
      expect(status).toBe(401)
    })
    it('[GET] /auth/logout guard test', async () => {
      const { status } = await request(app.getHttpServer())
        .get('/auth/logout')
        .set('Accept', 'application/json')
        .set('auth-cookie', '')
        .expect('Content-Type', /json/)
      expect(status).toBe(401)
    })
    it('[POST] /auth/verifyactivate2fa guard test', async () => {
      const { status } = await request(app.getHttpServer())
        .post('/auth/verifyactivate2fa')
        .set('Accept', 'application/json')
        .set('auth-cookie', '')
        .expect('Content-Type', /json/)
      expect(status).toBe(401)
    })
    it('[POST] /auth/verify2FA guard test', async () => {
      const { status } = await request(app.getHttpServer())
        .post('/auth/verify2FA')
        .set('Accept', 'application/json')
        .set('auth-cookie', '')
        .expect('Content-Type', /json/)
      expect(status).toBe(401)
    })
    it('[GET] /auth/refresh guard test', async () => {
      const { status } = await request(app.getHttpServer())
        .get('/auth/refresh')
        .set('Accept', 'application/json')
        .set('auth-cookie', '')
        .expect('Content-Type', /json/)
      expect(status).toBe(401)
    })
  })
})
