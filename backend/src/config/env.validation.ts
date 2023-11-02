import { plainToClass } from 'class-transformer'
import { IsString, IsNotEmpty, validateSync } from 'class-validator'

class EnvironmentVariables {
  @IsNotEmpty()
  @IsString()
  DATABASE_URL: string

  @IsNotEmpty()
  @IsString()
  JWTSECRET: string

  @IsNotEmpty()
  @IsString()
  JWT_EXPIRATION: string

  @IsNotEmpty()
  @IsString()
  ACCESS_SECRET: string

  @IsNotEmpty()
  @IsString()
  REFRESH_SECRET: string

  @IsNotEmpty()
  @IsString()
  ACCESS_TOKEN_EXPIRATION: string

  @IsNotEmpty()
  @IsString()
  REFRESH_TOKEN_EXPIRATION: string

  @IsNotEmpty()
  @IsString()
  CLIENTID: string

  @IsNotEmpty()
  @IsString()
  CLIENTSECRET: string

  @IsNotEmpty()
  @IsString()
  CALLLBACKURL: string

  @IsNotEmpty()
  @IsString()
  FRONTEND_URL: string

  @IsNotEmpty()
  @IsString()
  AUTH_APP_NAME: string
}

export function validate(configuration: Record<string, unknown>) {
  const finalConfig = plainToClass(EnvironmentVariables, configuration, {
    enableImplicitConversion: false
  })

  const errors = validateSync(finalConfig, { skipMissingProperties: false })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return finalConfig
}
