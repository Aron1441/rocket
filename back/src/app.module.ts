import {Module, NestModule, MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule} from '@nestjs/serve-static';
import { join } from 'path';
import {AuthController} from "./auth/auth.controller";
import { AuthService } from './auth/auth.service';
import {HttpModule, HttpService} from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import {AuthModule} from "./auth/auth.module";
import { ApiModule } from './api/api.module';
import {ApiService} from "./api/api.service";
import { PipelinesService } from './amo/pipelines/pipelines.service';
import { PipelinesController } from './amo/pipelines/pipelines.controller';
import { PipelinesModule } from './amo/pipelines/pipelines.module';
import { LeadsModule } from './amo/leads/leads.module';
import { AmoUsersModule } from './amo/amo-users/amo-users.module';
import {CacheInterceptor, CacheModule} from "@nestjs/cache-manager";
import {APP_GUARD, APP_INTERCEPTOR} from "@nestjs/core";
import {CustomCacheInterceptor} from "./custom-cache/custom-cache.interceptor";
import { ContactsModule } from './amo/contacts/contacts.module';
import {AuthGuard} from "./handlers/guards/auth.guard";
import {MyLoggerModule} from "./logger/my-logger.module";
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import {ThrottlerModule} from "@nestjs/throttler";


@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              nestWinstonModuleUtilities.format.nestLike('MyApp', {
                colors: true,
                prettyPrint: true,
                processId: true
              }),
          ),
        }),
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'client3'),
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 30 * 1000,
    }),

  HttpModule,
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    AuthModule,
    ApiModule,
    PipelinesModule,
    LeadsModule,
    AmoUsersModule,
    ContactsModule,
  ],
  controllers: [AppController, AuthController, PipelinesController],
  providers: [AppService, AuthService, ApiService, PipelinesService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CustomCacheInterceptor,
    // },

    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply()
        .forRoutes('*')
  }
}
