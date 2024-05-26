import {HttpException, HttpStatus, Injectable, Logger, Res, Scope} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {AxiosError, AxiosResponse} from "axios";
import {catchError, firstValueFrom} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {sleep} from '../utilities'
import { ApiTypes } from "../types";

@Injectable({
    scope: Scope.TRANSIENT
})
export class ApiService implements ApiTypes.ApiI {
    private logger = new Logger(ApiService.name)
    _call: (...args: any) => Promise<any>
    constructor(private readonly httpService: HttpService, private authService :AuthService) {
        this._call = this.prepCall()
    }

   private prepCall() {
       let callsCounter: number = 0;

        return async (url : string, token, data: any = null, method: 'get' | 'post' = 'get') => {
            const apiUrl = new URL(url, process.env.DOMAIN);
            let apiResponse: AxiosResponse<unknown>;
            callsCounter++;

            if(callsCounter > 5) {
                await sleep(1000)
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            if(method === 'get') {
                this.logger.log(apiUrl.toString())
                apiResponse = await firstValueFrom(this.httpService.get(apiUrl.toString(), config).pipe(
                    catchError((error: AxiosError) => {
                        throw `Error in GET request ${error}`;
                    }))
                )
            } else {
                apiResponse = await firstValueFrom(this.httpService.post(apiUrl.toString(), data, config).pipe(
                    catchError((error: AxiosError) => {
                        this.logger.error("Error in POST request", error);
                        throw 'An error happened!';
                    }))
                )
            }

            return apiResponse.data;
        }
    }
}
