import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './configs/database.config';
import { LoggerMiddleware, NestLibModule } from '@devhub/nest-lib';
import { ErrorMessage } from './common/constants/error.constant';
import { AccountModule } from './modules/account/account.module';
import { SharedModule } from './modules/shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { i18nConfig } from './configs/i18n.config';
import { I18nModule } from 'nestjs-i18n';
import * as redisStore from 'cache-manager-redis-store';
import { AppEnv } from './common/constants/app.constant';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    NestLibModule.register({
      errorMessages: {
        internalErrorMessage: ErrorMessage.INTERNAL_SERVER_ERROR,
      },
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      socket: {
        host: AppEnv.REDIS_HOST,
        port: AppEnv.REDIS_PORT,
      },
    }),
    I18nModule.forRoot(i18nConfig),
    SharedModule,
    AccountModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
