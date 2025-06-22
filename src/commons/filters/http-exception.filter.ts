import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { LoggerService } from 'src/logger/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private _logger: LoggerService) {
    this._logger.setContext(HttpExceptionFilter.name);
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const type = exception.name;
    const title = exception.name;
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse = exception.response || { message: 'Ha ocurrido un error inesperado.' };

    this._logger.error({
      message: `🚨 Error en ${request.method} ${request.url}`,
      statusCode: status,
      error: errorResponse,
      stack: exception.stack,
    });

    response.status(status).json(errorResponse);
  }
}
