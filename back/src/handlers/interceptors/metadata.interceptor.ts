import {CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor} from '@nestjs/common';
import { Observable } from 'rxjs';
import {Reflector} from "@nestjs/core";
import {AuthService} from "../../auth/auth.service";

@Injectable()
export class MetadataInterceptor implements NestInterceptor {
  private logger = new Logger(AuthService.name)
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log("INTERCEPTOR")
    this.logger.log("INTERCEPTOR")

    this.logger.log(roles)


    return next.handle();
  }
}
