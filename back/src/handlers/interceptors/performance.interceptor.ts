import {CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor} from '@nestjs/common';
import {Observable, tap} from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private logger = new Logger(PerformanceInterceptor.name)
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = new Date().getTime()

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`Затраченное время: ${new Date().getTime() - start}`)
      })
    );
  }
}
