import {Logger, Module} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import {ApiService} from "../../api/api.service";
import {HttpModule, HttpService} from "@nestjs/axios";
import {AuthService} from "../../auth/auth.service";
import { CacheModule } from '@nestjs/cache-manager';
import {MyLoggerService} from "../../logger/my-logger.service";
import {MyLoggerModule} from "../../logger/my-logger.module";
import {AmoUsersService} from "../amo-users/amo-users.service";
import {PipelinesService} from "../pipelines/pipelines.service";
import {ContactsService} from "../contacts/contacts.service";

@Module({
  imports: [MyLoggerModule, HttpModule, CacheModule.register()],
  controllers: [LeadsController],
  providers: [LeadsService, ApiService, AuthService, AmoUsersService, PipelinesService, ContactsService],
})
export class LeadsModule {}
