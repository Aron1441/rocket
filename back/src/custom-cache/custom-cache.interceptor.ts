import {CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor} from '@nestjs/common';
import {Observable, tap} from 'rxjs';
import {CacheInterceptor} from "@nestjs/cache-manager";

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = this.trackBy(context);

    const cachedValue = await this.cacheManager.get(cacheKey);
    if (cachedValue) {
      console.log(`Cache hit for key: ${cacheKey}`);
    } else {

      console.log(`Cache miss for key: ${cacheKey}`);
    }

    return next.handle().pipe(
        tap((response) => {
          console.log(`Response being cached under key: ${cacheKey}`);
          this.cacheManager.set(cacheKey, response, );
        })
    );
  }
}