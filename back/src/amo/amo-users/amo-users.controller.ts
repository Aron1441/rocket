import {Controller, Get, Inject, Logger, Req, Res, UseInterceptors} from '@nestjs/common';
import { AmoUsersService } from './amo-users.service';
import {ApiService} from "../../api/api.service";
import {Request, Response} from "express";
import {CACHE_MANAGER, CacheInterceptor, CacheKey} from "@nestjs/cache-manager";
import {PerformanceInterceptor} from "../../handlers/interceptors/performance.interceptor";
import { reqWithToken } from "../../types/common";
import {UsersTypes} from "../../types";
import {SkipThrottle} from "@nestjs/throttler";

@SkipThrottle()
@Controller('amo-users')
export class AmoUsersController {
  private logger = new Logger(AmoUsersController.name)
  constructor(private readonly amoUsersService: AmoUsersService, private readonly apiService: ApiService) {}

  @Get('/get')
  @UseInterceptors(PerformanceInterceptor)
  @CacheKey('account:users')
  async getUsers(@Req() request: reqWithToken, @Res({ passthrough: true }) response: Response) {
    const data = await this.apiService._call('/api/v4/users', request.token_data['access_token']) as UsersTypes.usersData

    return this.amoUsersService.transformUsers(data)
  }
}
