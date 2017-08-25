import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common'

@Injectable()
export class MockRefreshAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = {
      id: 1
    }
    request['user'] = user
    return true
  }
}
