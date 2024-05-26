import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.getResponse()

    response
        .status(status)
        .json({
          statusCode: status,
          message: message['error'],
          path: request.url,
          timestamp: new Date().toISOString(),
        });
  }
}
