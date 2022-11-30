import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { CustomException } from '../exceptions';
import { Response } from 'express';
import { IResponseError } from '../interfaces';
import { NestLibOptions } from '../../nest-lib.module';
import { MODULE_OPTION_KEY } from '../constants';
import { CustomLogger } from '../utils';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new CustomLogger(CustomExceptionFilter.name);

  constructor(@Inject(MODULE_OPTION_KEY) private options: NestLibOptions) {}

  catch(exception: CustomException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error({
      message: exception.error.message,
      stack: exception.stack,
    });

    if (this.options.useI18nOnFilter) {
      try {
        const i18n = getI18nContextFromArgumentsHost(host);
        exception.error.message = i18n.t(exception.error.message, {
          args: exception.error.args || {},
        });
      } catch (ex) {
        this.logger.error({ message: 'Translation error', stack: ex.stack });
      }
    }

    const { statusCode, error } = exception;

    const errorBody: IResponseError = {
      error: error,
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
    };

    response.status(exception.statusCode).json(errorBody);
  }
}
