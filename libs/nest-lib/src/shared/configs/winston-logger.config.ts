import { WinstonModuleOptions } from 'nest-winston/dist/winston.interfaces';
import { transports, format } from 'winston';
import 'winston-daily-rotate-file';
import * as Transport from 'winston-transport';
import { WinstonModule } from 'nest-winston';
import { LoggerService } from '@nestjs/common';

const LogLevel = {
  error: 'error', // 0,
  warn: 'warn', // 1,
  info: 'info', // 2,
  http: 'http', // 3,
  verbose: 'verbose', // 4,
  debug: 'debug', // 5,
  silly: 'silly', // 6,
};

export interface ILoggerOptions {
  /**
   * Save logs to file
   * */
  save?: boolean;

  /**
   * Show logs with colors & pretty format
   * */
  pretty?: boolean;

  /**
   * The directory name to save log files to. (default: 'logs')
   * */
  dirname?: string;

  /**
   * Maximum number of logs to keep. If not set, no logs will be removed. This can be a number of files or number of days.
   * If using days, add 'd' as the suffix. (default: 30d)
   */
  maxFiles?: string | number;
}

export const DefaultLoggerOptions: ILoggerOptions = {
  save: true,
  pretty: true,
  dirname: 'logs',
  maxFiles: '30d',
};

/**
 * Get winston log options
 * */
export function getWinstonLoggerOptions(
  options?: ILoggerOptions,
): WinstonModuleOptions {
  const mergedOptions: ILoggerOptions = {
    ...DefaultLoggerOptions,
    ...options,
  };

  const { combine, splat, timestamp, printf, colorize, errors, json } = format;

  const logFormat = printf((data) => {
    const { level, message, timestamp, context, ...metadata } = data;
    let msg = `${timestamp} ${level} [${context}] : ${message} `;
    if (Object.keys(metadata).length) {
      msg += JSON.stringify(metadata);
    }
    return msg;
  });

  const timestampFormat = 'YYYY-MM-DD HH:mm:ss.SSS Z';

  /* Default format in json, suitable for production log */
  const defaultFormat = combine(timestamp({ format: timestampFormat }), json());

  /* Pretty format for development */
  const devFormat = combine(
    colorize(),
    splat(),
    timestamp({ format: timestampFormat }),
    errors({ stack: true }),
    logFormat,
  );

  const logTransports: Transport[] = [
    // Add console log
    new transports.Console({
      level: LogLevel.info,
      format: mergedOptions?.pretty ? devFormat : defaultFormat,
    }),
  ];

  if (mergedOptions?.save) {
    const transportOptions = {
      // ${process.cwd()}/${configService.get('LOG_PATH')}
      dirname: mergedOptions.dirname,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: mergedOptions.maxFiles,
      format: mergedOptions?.pretty ? devFormat : defaultFormat,
    };

    const logLevelConfigs = [
      // { level: LogLevel.error, filename: '%DATE%.error.log' },
      // { level: LogLevel.warn, filename: '%DATE%.warn.log' },
      { level: LogLevel.info, filename: '%DATE%.log' },
    ];

    logTransports.push(
      ...logLevelConfigs.map(
        (item) =>
          new transports.DailyRotateFile({
            level: item.level,
            filename: item.filename,
            ...transportOptions,
          }),
      ),
    );
  }

  return {
    transports: logTransports,
  };
}

/**
 * Get a logger service instance created by winston
 * */
export function getWinstonLoggerService(
  options?: ILoggerOptions,
): LoggerService {
  return WinstonModule.createLogger(getWinstonLoggerOptions(options));
}
