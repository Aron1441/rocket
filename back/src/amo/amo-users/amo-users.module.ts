import { Module } from '@nestjs/common';
import { AmoUsersService } from './amo-users.service';
import { AmoUsersController } from './amo-users.controller';
import {HttpModule} from "@nestjs/axios";
import {ApiService} from "../../api/api.service";
import {AuthService} from "../../auth/auth.service";

@Module({
  imports: [HttpModule],
  controllers: [AmoUsersController],
  providers: [AmoUsersService, ApiService, AuthService],
})
export class AmoUsersModule {}
