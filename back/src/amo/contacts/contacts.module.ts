import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import {HttpModule} from "@nestjs/axios";
import {ApiService} from "../../api/api.service";
import {AuthService} from "../../auth/auth.service";

@Module({
  imports: [HttpModule],
  controllers: [ContactsController],
  providers: [ContactsService, ApiService, AuthService],
})
export class ContactsModule {}
