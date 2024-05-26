import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import {ValidationPipe} from "@nestjs/common";
import {MyLoggerService} from "./logger/my-logger.service";
import {WINSTON_MODULE_NEST_PROVIDER} from "nest-winston";
import {HttpExceptionFilter} from "./http-exception/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
      // logger: LoggerFactory('MyApp'),
  });
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    // app.useLogger(new MyLoggerService());
  app.setGlobalPrefix('api');
  app.enableCors(
      {
        origin: 'http://localhost:5173',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
      }
  );
    app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
