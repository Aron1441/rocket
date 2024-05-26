import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Redirect,
  Req,
  Res,
  Scope,
  UseFilters,
  UseInterceptors
} from '@nestjs/common';
import { AppService } from './app.service';
import {ApiModule} from "./api/api.module";
import {HttpExceptionFilter} from "./http-exception/http-exception.filter";
import {ApiService} from "./api/api.service";
import {Request, Response} from "express";
import {AuthService} from "./auth/auth.service";
interface TokenData {
  token_type: string,
  expires_in: number,
  access_token: string,
  refresh_token: string
}

@Controller()
// @UseFilters(HttpExceptionFilter)
export class AppController {
  i: number = 0;
  constructor(private readonly appService: AppService, private readonly apiService: ApiService, private readonly authService :AuthService) {}
  @Get('/t')
  gett() {
    ++this.i;
  }

  @Get('/t1')
  gett1() {
    return this.i;
  }

  @Get('/leads')
  async getLeads() {
     let data = this.appService.getCredentials();
    // console.log(process.env.WIDGET_CODE)

    return data;
  }
  // @Get('/test')
  // @UseInterceptors(PerfomanceInterceptor)
  // async getTest(@Res({ passthrough: true }) response: Response) {
  //   // this.authService.setCookie(response, data);
  //   let data = await this.authService.getTokenData()
  //
  //   return data
  // }



  @Get('/pipes2')

  async getPipes2(@Req() request: Request, @Res() res: Response) {


    return 321;
  }
}
