import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import {plainToInstance} from "class-transformer";

@Injectable()
export class ParseLeadFilterPipe implements PipeTransform<string, number> {
    transform(value: string, { metatype }: ArgumentMetadata): number {

        const object = plainToInstance(metatype, value);
        let val;

        if(!isNaN(parseInt(object.query))) {
            val = parseInt(object.query, 10);
        } else {
            val = object.query
        }
        // console.log("Value", typeof val)
        // if (object.query === '') {
        //     throw new BadRequestException('Validation failed!!');
        // }
        return val;
    }
}