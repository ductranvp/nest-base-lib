import { DynamicModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import {
  CustomExceptionFilter,
  GlobalExceptionFilter,
  MODULE_OPTION_KEY,
} from './shared';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';

interface ErrorMessages {
  internalErrorMessage?: string;
}

export interface NestLibOptions {
  useCustomFilter?: boolean;
  useGlobalFilter?: boolean;
  useI18nOnFilter?: boolean;
  errorMessages?: ErrorMessages;
}

const defaultOptions: NestLibOptions = {
  useCustomFilter: true,
  useGlobalFilter: true,
  useI18nOnFilter: true,
  errorMessages: {
    internalErrorMessage: 'Internal Server Error',
  },
};

export class NestLibModule {
  static register(options?: NestLibOptions): DynamicModule {
    const mergedOptions: NestLibOptions = {
      ...defaultOptions,
      ...options,
      errorMessages: {
        ...defaultOptions.errorMessages,
        ...options?.errorMessages,
      },
    };

    /* Providers */
    const providers: Provider[] = [
      {
        provide: MODULE_OPTION_KEY,
        useValue: mergedOptions,
      },
    ];

    if (mergedOptions.useCustomFilter) {
      providers.push({ provide: APP_FILTER, useClass: CustomExceptionFilter });
    }

    if (mergedOptions.useGlobalFilter) {
      providers.unshift({
        provide: APP_FILTER,
        useClass: GlobalExceptionFilter,
      });
    }

    /* Imports */
    const imports: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    > = [];

    return {
      imports: imports,
      providers: providers,
      module: NestLibModule,
    };
  }
}
