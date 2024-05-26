import {Controller, Get, Req, Res} from '@nestjs/common';
import {Request, Response} from "express";
import {ApiService} from "../../api/api.service";
import {PipelinesService} from "./pipelines.service";
import {CacheKey} from "@nestjs/cache-manager";
import {SkipThrottle} from "@nestjs/throttler";
import { reqWithToken } from "../../types/common";
import {StatusesTypes} from "../../types";

@SkipThrottle()
@Controller()
export class PipelinesController {
    constructor(private readonly pipelinesService: PipelinesService, private readonly apiService: ApiService) {}
    @Get('/pipelines')
    @CacheKey('account:statuses')
    async pipelineData(@Req() request: reqWithToken, @Res() response: Response) {
        const data = await this.apiService._call('/api/v4/leads/pipelines', request.token_data['access_token']) as StatusesTypes.pipelinesData
        const transformedData = this.pipelinesService.transformStatuses(data)

        return response.status(200).send(transformedData);
    }
}