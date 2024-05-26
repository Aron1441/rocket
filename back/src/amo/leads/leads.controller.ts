import {
    Controller,
    Get, HttpException, HttpStatus,
    Inject,
    Query,
    Req,
    Res, SetMetadata, UseFilters,
    UseInterceptors,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import {Request, Response} from "express";
import {ApiService} from "../../api/api.service";
import {PerformanceInterceptor} from "../../handlers/interceptors/performance.interceptor";
import {FilterLeadsDto} from "../../dto/leads/filter-leads.dto";
import {ParseLeadFilterPipe} from "../../handlers/pipes/parse-lead-filter.pipe";
import {CacheTTL} from "@nestjs/common/cache";
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {LeadsTypes} from "../../types";
import { reqWithToken } from "../../types/common";
import {SkipThrottle, Throttle} from "@nestjs/throttler";

@Controller('leads')
export class LeadsController {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,private readonly leadsService: LeadsService, private readonly apiService: ApiService,) {}
      @Get('/get')
      @UseInterceptors(PerformanceInterceptor)
      async getLeads(@Req() request: reqWithToken, @Res({passthrough: true}) response: Response) {
        const data = await this.apiService._call('/api/v4/leads', request.token_data['access_token'], response) as LeadsTypes.leadsData

        return await this.leadsService.formData(data)
      }

    @Get('/filtered')
    @UseInterceptors(PerformanceInterceptor)
    @Throttle({ default: { limit: 1, ttl: 1000 } })
    @CacheTTL(0)
    // @UseInterceptors(PerformanceInterceptor)
    async getFilteredLeads(@Query(new ParseLeadFilterPipe()) query: FilterLeadsDto, @Req() request: reqWithToken, @Res({passthrough: true}) response: Response) {
        let data = await this.apiService._call(`/api/v4/leads?query=${query}`, request.token_data['access_token']) as LeadsTypes.leadsData

        return await this.leadsService.formData(data)
    }
}
