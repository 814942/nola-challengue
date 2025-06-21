import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  constructor(private readonly configService: ConfigService) {
    super('App Logger');
  }

  log(message: string, data?: any) {
    if (data) {
      const formattedData = JSON.stringify(data, null, 2);
      super.log(`${message}\nDetalles:\n${formattedData}`);
    } else {
      super.log(message);
    }
  }
}
