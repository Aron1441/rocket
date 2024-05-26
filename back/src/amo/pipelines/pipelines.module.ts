import { Module } from '@nestjs/common';
import {ApiService} from "../../api/api.service";
import {PipelinesService} from "./pipelines.service";
import {HttpModule, HttpService} from "@nestjs/axios";
import {AuthService} from "../../auth/auth.service";
import {PipelinesController} from "./pipelines.controller";

@Module({
    imports: [HttpModule],
    controllers: [PipelinesController],
    providers: [PipelinesService, ApiService, AuthService]
})
export class PipelinesModule {}
