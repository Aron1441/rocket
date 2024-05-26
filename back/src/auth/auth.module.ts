import { Module } from '@nestjs/common';
import {HttpModule, HttpService} from "@nestjs/axios";
import {AuthService} from "./auth.service";

@Module({
    imports: [HttpModule],
    providers: [AuthService],
})
export class AuthModule {}
