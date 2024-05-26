import { Module } from '@nestjs/common';
import {firstValueFrom} from "rxjs";
import axios from "axios";
import {HttpModule} from "@nestjs/axios";
import { ApiService } from './api.service';
import {AuthService} from "../auth/auth.service";
import {ApiController} from "./api.controller";


@Module({
    imports: [HttpModule],
  controllers: [ApiController],
  providers: [ApiService, AuthService],
    exports: [ApiModule]
})
export class ApiModule {

}
