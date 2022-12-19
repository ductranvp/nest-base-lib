import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from '@devhub/nest-lib';

export function initAppConfig(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableCors();
}
