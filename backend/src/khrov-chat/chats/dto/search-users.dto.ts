import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class SearchUsersDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Search key',
    example: 2
  })
  readonly key: string
}

class Profile_picsType {
  @ApiProperty({
    description: 'Base64 encoding of Profile photo of a User in the search result',
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAOVBMVEXv7OjGw70AAADCv7ry7+v49fHm49/g3dns6eXMycR4dnTPzMekop9WVVTKx8QYFxcyMjG8ubPY1dHE2mloAAACUklEQVRoge2a25KDIAyGoUbR4qHl/R92Aa21HQmYhJud/jd79zXzb8hhorptmsbZ9Iqt3szj9GKq9c/dtAB8dBBAa+4H+GJbIfLGb+3ygj86UXTEd48VvsizA32JcFuB7ek2wO9tDbZS7d3DTZXAfejmpqZKgfvQJzVWCtyHPqq5HnxWphZbebRAPUnpChpC9QGpEvRBVp2zVmtrXadk+dDZptGbmsYKFgwweidvfC329OwXOuKtBBm6E3TE871JsiXoaXag89g9wvZ01guEAWNrPTCMAYMG7kNnZCRk2J5OhoPLsbV2VDrk2VpT4Vga7r4Q07HEFbIvuTxcRczGfK5EX4imP0vgTxr7Bz9V1X9o0QOlPlGwJWzqdJ8ruNEV6jiIt6ENTm1GJe+f3ovyZZHRo/Ohc5poznVW+weHjxbkJrfSUWM4pkTNafbMI/s1ok/De8VYM6Bzw/dk/mF5MzjaMArKYeD9B7QjbDFFrX+Vuxi2KUcHXRoZzxYV1JwLS0zRwPKpoRBdUmlPgi+qBDR2IZ2GDsqiywbEc+VKTaYM4soVSarhGx21nWNKEGpMyS6Bho60VG7gaOjcwLHQy5YgXOmE4bPTL4mXh6uS2XixiJ8rMZhKWJ40nZ+IQYlkLFtTckqsMXXhEuzkjiQT+Tn7B/8X8L4evD8eRKTh5njKEYbDfDxCScPH4/lMGN5Ox8OfLDwc/g4nS1l4PFm+j62i8PXY+j4TS8JfZ+L9wC0I3w/cPvYhnubF4NAOy/dHBUJt7uujgu1ziKfEUPQ8fA7xB92pGr+J4j6kAAAAAElFTkSuQmCC'
  })
  readonly avatar: string
}
export class SearchUsersResultDto {
  @ApiProperty({
    description: 'User Id of a User in the search result',
    example: 2
  })
  readonly id: number

  @ApiProperty({
    description: 'UserName of a User in the search result',
    example: 'ade'
  })
  readonly userName: string

  // @ApiProperty({
  //   description: 'Time of UserName registration',
  //   example: '2023-07-26T17:59:54.868Z'
  // })
  // readonly createdAt: Date

  @ApiProperty()
  profile_pics: Profile_picsType[]
}
