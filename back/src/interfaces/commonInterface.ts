import {AxiosResponse} from "axios";

export class CommonI {
    // @ts-ignore
    async call(msg:  string): Promise<AxiosResponse<any, any>>  {
        // return new Promise(() => 1)
    }
}