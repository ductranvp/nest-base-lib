import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { IResponseError } from '../interfaces';
import { NestLibOptions } from '../../nest-lib.module';
import { MODULE_OPTION_KEY } from '../constants';
import { CustomLogger } from '../utils';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new CustomLogger(GlobalExceptionFilter.name);

  constructor(@Inject(MODULE_OPTION_KEY) private options: NestLibOptions) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = this.options.errorMessages.internalErrorMessage;
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const errorResponse = exception.getResponse();
      message = (errorResponse as any)?.message;
    }

    this.logger.error({ message: exception.message, stack: exception.stack });

    if (this.options.useI18nOnFilter) {
      try {
        const i18n = getI18nContextFromArgumentsHost(host);
        message = i18n.t(message, {
          args: exception.args || {},
        });
      } catch (ex) {
        this.logger.error({ message: 'Translation error', stack: ex.stack });
      }
    }

    const errorBody: IResponseError = {
      error: {
        code: statusCode,
        message: message,
      },
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(errorBody);
  }
}
