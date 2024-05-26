import {Inject, Injectable, Logger} from '@nestjs/common';
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager"
import {Request} from "express";
import {AxiosError, AxiosResponse} from "axios";
import {call} from "../../utilities";
import {REQUEST} from "@nestjs/core";
import {HttpService} from "@nestjs/axios";
import type { urlMappingsI } from "../../types/common/index"
import {UsersTypes} from "../../types";

@Injectable()
export class AmoUsersService implements urlMappingsI {
    static readonly CACHE_KEY = 'account:users'
    private logger = new Logger(AmoUsersService.name)
    public url: string;

    mappings: object = {
        'getAmoUsersData': 'http://localhost:3000/api/amo-users/get',
    }

    call: (msg: string) => Promise<AxiosResponse>;
    constructor(@Inject(REQUEST) private req: Request, @Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly httpService: HttpService) {
        this.call = call.bind(this, req, this.httpService)
    }
    transformUsers(data: UsersTypes.usersData) {
        let reducedData = data._embedded.users.map(user => {
            const { id, name } = user

            return { id: id, name: name }
        })

        return reducedData.reduce(function(acc, currentValue)  {
            acc[currentValue.id.toString()] = { name: currentValue.name };

            return acc;
        }, {} as UsersTypes.transformedData)
    }

    async getAmoUsersData() {
        this.url = this.mappings[AmoUsersService.prototype.getAmoUsersData.name]

        this.logger.log({
            level: 'warn',
            message: this.url
        })

        const statuses  = await this.call(`Error in GET request when in ${AmoUsersService.prototype.getAmoUsersData.name} method`) as AxiosResponse<UsersTypes.transformedData>

        return statuses.data;
    }
}
