import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable, Logger,
  UnauthorizedException
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {AuthService} from "../../auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name)
  constructor(private authService: AuthService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    //@ts-ignore
    let tokenData: TokenData;
    this.logger.log(request.cookies)

    try {
      if(!request.cookies['refresh_token']) {
        tokenData = await this.authService.getTokenData()
        request['token_data'] = tokenData;
        return true;
      }

      if(request.cookies && request.cookies['access_token']) {
        request['token_data'] = request.cookies;

        return true;
      }

      this.logger.log("Получение нового access_token")
      tokenData = await this.authService.refreshToken(request)
      request['token_data'] = tokenData;

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
