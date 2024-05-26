import {catchError, firstValueFrom} from "rxjs";
import {AxiosError, AxiosResponse} from "axios";
import {Request} from "express";
import {HttpService} from "@nestjs/axios";
import {BadRequestException, HttpException, HttpStatus} from "@nestjs/common";

export async function call(req: Request, service: HttpService, errMessage: string) {
    if(this.url)
        return await firstValueFrom(service.get(this.url, {
            headers: {
                // Если нужны куки для авторизации
                Cookie: req.headers.cookie
            },
            withCredentials: true
        }).pipe(
        catchError((error: AxiosError) => {
            throw new BadRequestException(errMessage);
        }))) as AxiosResponse<unknown>
}

export function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}