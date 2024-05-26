import {Inject, Injectable} from '@nestjs/common';
import {AxiosError, AxiosResponse} from "axios";
import type {urlMappingsI, urlMapping} from "../../types/common";
import {HttpService} from "@nestjs/axios";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";
import { call } from '../../utilities/index'
import {ContactTypes} from "../../types";

@Injectable()
export class ContactsService implements urlMappingsI {
    public url: string;
    mappings: urlMapping = {
        'getContactsById': 'http://localhost:3000/api/contacts/get/{wildcard}',
    }

    call: (msg: string) => Promise<AxiosResponse>;

    constructor(@Inject(REQUEST) private req: Request, private readonly httpService: HttpService) {
        this.call = call.bind(this, req, httpService)

        this.mappings.hasWildcard =  function (key: string) {
            const value = this[key]
            if(!value?.includes('wildcard')) return false

            return true
        }
    }

    async getContactsById(id: number) {
        const proxyMapping = new Proxy(this.mappings, {
            get(target, prop) {
                if (typeof prop === 'string' && prop in target) {
                    const value = target[prop as keyof urlMapping];
                    if (typeof value === 'string' && target.hasWildcard(prop))
                    {
                        return value.replace('{wildcard}', id.toString());
                    }
                }

                return undefined;
            }
        })

        const funcName = ContactsService.prototype.getContactsById.name;
        this.url = proxyMapping[funcName]
        const contacts = await this.call(`Error in GET request when in ${funcName} method`) as AxiosResponse<ContactTypes.contactData>

        return contacts?.data;
    }
}
