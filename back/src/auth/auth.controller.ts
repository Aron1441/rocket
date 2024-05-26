import {Controller, Get, Logger, Req, Res, Scope} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {Request, Response} from 'express';

interface CustomRequest extends Request {
    token_data: {
        refresh_token: string;
        access_token: string;
        maxAge: number;
    };
}
@Controller({ path: 'auth', scope: Scope.REQUEST})
export class AuthController {
    @Get('/token')
    async getTokens(
        @Req() request: CustomRequest, @Res({ passthrough: true }) response: Response)
    {
        response.cookie('refresh_token', request.token_data['refresh_token'], {
            sameSite: 'strict',
            httpOnly: true,
            path: '/',
        })
        response.cookie('access_token', request.token_data['access_token'], {
            path: '/',
            maxAge: 86400,
        })

        return { message: 'success', data: response.json }
    }
}
