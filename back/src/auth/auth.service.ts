import {BadRequestException, HttpException, HttpStatus, Inject, Injectable, Logger} from '@nestjs/common';
import axios, {AxiosResponse} from "axios";
import {firstValueFrom} from "rxjs";
import { HttpService } from '@nestjs/axios';
import { REQUEST } from '@nestjs/core';
import { Request, Response } from 'express';
import { Scope } from '@nestjs/common'
interface TokenData {
    token_type: string,
    expires_in: number,
    access_token: string,
    refresh_token: string
}

@Injectable()
export class AuthService {
    private logger = new Logger(AuthService.name)
    private access_token_path = 'oauth2/access_token';
    protected url: string;

    constructor() {
        this.url = new URL(this.access_token_path, process.env.DOMAIN).toString();
    }

    async getTokenData(){
        this.logger.log("Get tokens")

        const body = {
            client_id: process.env.WIDGET_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "authorization_code",
            redirect_uri: "https://artemkovalcuk.amocrm.ru/amo-market/#category-installed",
            code: process.env.WIDGET_CODE,
        }

        return axios.post(this.url, body, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            return response.data as TokenData;
        })
        .catch(error => {
            this.logger.log("Возможно код авторизации недействителен")
            throw new BadRequestException()
        });
    }

    async refreshToken(req: Request) {
        this.logger.log(`Check if refresh token is set -> ${req.cookies['refresh_token']}`)

        const data = {
            client_id: "b8ac02f9-25a3-41c8-8ea8-82b1fd7c57ef",
            client_secret: "DT7mWYTbqu8bd7FLGzkwxy3ADGyMoYkyUXXtYGoErjn7Qqr1pipu8TFjEIy1OoMX",
            grant_type: "refresh_token",
            redirect_uri: "https://artemkovalcuk.amocrm.ru/amo-market/#category-installed",
            refresh_token: req.cookies['refresh_token'],
        }

        return axios.post(this.url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response: AxiosResponse<TokenData>) => {
            this.logger.log("Данные по refresh token обновлены")
            return response.data as TokenData
        })
        .catch(error => {
            this.logger.log("Ошибка получения данных по refresh token")
            this.logger.log("Возможно токен был скомпрометирован")
            throw new BadRequestException()
        });
    }
}