import {Controller, Get, Inject, Logger, Param, ParseIntPipe, Query, Req, Res} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import {HttpService} from "@nestjs/axios";
import {ApiService} from "../../api/api.service";
import {Response} from "express";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";
import { reqWithToken } from "../../types/common";
import {ContactTypes} from "../../types";
import {SkipThrottle} from "@nestjs/throttler";

@SkipThrottle()
@Controller('contacts')
export class ContactsController {
  private logger = new Logger(ContactsController.name)
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly contactsService: ContactsService, private readonly httpService:HttpService, private readonly apiService:ApiService) {}
  @Get('/get')
  async getContacts(
      @Req() request: reqWithToken,
      @Res({ passthrough: true }) response: Response
  ) {
    const data = await this.apiService._call('/api/v4/contacts', request.token_data['access_token']) as ContactTypes.apiContactsData;

    const contacts = data._embedded.contacts.reduce(function(acc, currentValue) {
      const contactLinks = currentValue.custom_fields_values.map(el => {
        return el.values[0].value
      })

      acc[currentValue.id.toString()] = { name: currentValue.name,  phone: contactLinks[0], email: contactLinks[1]};

      return acc;
    }, {} as { [key: string]: ContactTypes.contactData})

    return contacts;
  }

  @Get('/get/:id')
  async getContactByLeadId(
      @Param('id', ParseIntPipe) id: string,
      @Req() request: reqWithToken,
      @Res({ passthrough: true }) response: Response
  ) {
    const data = await this.apiService._call(`/api/v4/leads/${id}/links`, request.token_data['access_token']) as ContactTypes.apiContactLinks
    const leadContactId = data._embedded.links[0].to_entity_id

    const contacts = await this.getContacts(request, response)

    return contacts[leadContactId]
  }
}
