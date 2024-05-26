import {Inject, Injectable, Logger} from '@nestjs/common';
import type { urlMappingsI } from "../../types/common/index"
import {REQUEST} from "@nestjs/core";
import {Request, Response} from "express";
import {AxiosResponse} from "axios";
import {call} from '../../utilities/index'
import {HttpService} from "@nestjs/axios";
import {StatusesTypes} from "../../types";

@Injectable()
export class PipelinesService implements urlMappingsI {
    public url: string;
    mappings: object = {
        'getStatusesData': 'http://localhost:3000/api/pipelines',
    }
    call: (msg: string) => Promise<AxiosResponse>;
    constructor(@Inject(REQUEST) private req: Request, private readonly httpService: HttpService) {
        this.call = call.bind(this, req, httpService)
    }
    private logger = new Logger(PipelinesService.name)
    private static readonly PIPELINE_NUMBER = 0;
    getStatuses(apiData: unknown) {
        const data = apiData as StatusesTypes.pipelinesData
        const statuses = data?._embedded?.pipelines[0]._embedded.statuses.map(status => {
            return status.name
        })

        this.logger.log("Воронки: ", statuses)
    }

    transformStatuses(data: StatusesTypes.pipelinesData) {
        const statusesData = data._embedded.pipelines[PipelinesService.PIPELINE_NUMBER]._embedded.statuses

        return statusesData.reduce(function(acc, currentValue) {
            acc[currentValue.id.toString()] = { name: currentValue.name };
            return acc;
        }, {} as StatusesTypes.transformedStatusData)
    }

    async getStatusesData() {
        this.url = this.mappings[PipelinesService.prototype.getStatusesData.name]

        this.logger.log({
            level: 'warn',
            message: this.url
        })

        const statuses  = await this.call(`Error in GET request when in ${PipelinesService.prototype.getStatusesData.name} method`) as AxiosResponse<StatusesTypes.transformedStatusData>

        return statuses?.data;
    }
}
