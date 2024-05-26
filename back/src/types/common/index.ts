import {AxiosResponse} from "axios";
import {Request, Response} from "express";

export declare interface urlMappingsI {
    mappings:  object
    call: (msg: string) => Promise<AxiosResponse>,
    url: string
}

export type reqWithToken = Request & { token_data: string }

export type urlMapping = {
    [key: string]: string;
} & { hasWildcard?: (arg: string) => boolean }