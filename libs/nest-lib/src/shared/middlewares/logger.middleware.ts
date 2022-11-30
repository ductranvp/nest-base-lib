import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IRequestLogging } from '../interfaces';
import { CustomLogger } from '../utils';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new CustomLogger(LoggerMiddleware.name);

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, params, body, query } = request;

    const { statusCode } = response;

    const log: IRequestLogging = {
      url: originalUrl,
      method: method,
      statusCode: statusCode,
      body: body,
      params: params,
      query: query,
    };

    this.logger.log(JSON.stringify(log));
    next();
  }
}
