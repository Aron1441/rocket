import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class MyLoggerService extends ConsoleLogger {
    customLog(msg: string) {
        // this.setLogLevels(['warn'])
        // const bgYellow = '\x1b[43m';
        // const color = bgYellow;
        // const reset = '\x1b[0m';
        // const message = `${color}FROM MY LOGGER${reset}`;
        const message = '123'
        this.log(msg);
    }
}