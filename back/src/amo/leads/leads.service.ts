import {Inject, Injectable, Logger} from '@nestjs/common';
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";
import axios, {AxiosError, AxiosResponse} from "axios";
import {HttpService} from "@nestjs/axios";
import {REQUEST} from "@nestjs/core";
import {Request, Response} from "express";
import {call} from '../../utilities/index'
import {WINSTON_MODULE_PROVIDER} from "nest-winston";
import {AmoUsersService} from "../amo-users/amo-users.service";
import type { urlMappingsI } from "../../types/common/index"
import {PipelinesService} from "../pipelines/pipelines.service";
import {ContactsService} from "../contacts/contacts.service";
import {LeadsTypes} from "../../types";

@Injectable()
export class LeadsService implements urlMappingsI {
    protected responsible_name: string;
    protected status_name: string[];
    protected description: object;
    public url: string;
    public mappings: object = {
        'getStatusesData': 'http://localhost:3000/api/pipelines',
    }
    call: (msg: string) => Promise<AxiosResponse>;
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache,
                @Inject(REQUEST) private req: Request,
                @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
                private readonly httpService: HttpService,
                private readonly amoUsersService: AmoUsersService,
                private readonly pipelinesService: PipelinesService,
                private readonly contactsService: ContactsService) {

        this.call = call.bind(this, req, httpService)
    }
    public async formData(data: LeadsTypes.leadsData) {
        const amoUsersInfo = await this.amoUsersService.getAmoUsersData()
        const statuses = await this.pipelinesService.getStatusesData()

        const preparedLeadData = data._embedded.leads.map(async (lead, index) => {
            const contacts = await this.contactsService.getContactsById(lead.id)
            this.responsible_name = amoUsersInfo[lead.responsible_user_id.toString()].name
            this.status_name = [statuses[lead.status_id].name]
            this.description = contacts

            Object.assign(lead, {
                responsible_name: this.responsible_name,
                status_name: this.status_name,
                description: this.description
            })

            return lead
        })

        return await Promise.all(preparedLeadData)
    }
}
