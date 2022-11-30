import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getWinstonLoggerService } from '@devhub/nest-lib';
import { initAppConfig } from './configs/app.config';
import { AppEnv, NodeEnv } from './common/constants/app.constant';
import { setupSwagger } from './configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getWinstonLoggerService({
      pretty: AppEnv.NODE_ENV === NodeEnv.DEVELOPMENT,
    }),
  });
  initAppConfig(app);
  setupSwagger(app);
  await app.listen(AppEnv.APP_PORT);
}
bootstrap();
