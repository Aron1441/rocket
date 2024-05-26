import {Catch, HttpException, HttpStatus, Injectable, UseFilters} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {firstValueFrom} from "rxjs";
import {HttpExceptionFilter} from "./http-exception/http-exception.filter";

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {
  }

  async getCredentials() {
    const url = 'http://localhost:3000/api/auth/token';
    // const data=
        try {
          await firstValueFrom(this.httpService.get(url))
        } catch (error) {
          throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: 'В запросе отсутствует ряд параметров или параметры невалидны!',
          },  HttpStatus.BAD_REQUEST)
        }
    // await firstValueFrom(this.httpService.get(url))

    // return data.data;
  }
}
