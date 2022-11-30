import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';
import { AppEnv, NodeEnv } from '../common/constants/app.constant';

export function setupSwagger(app: INestApplication) {
  const logger = new Logger('Swagger');
  if (AppEnv.NODE_ENV === NodeEnv.PRODUCTION) return;

  const config = new DocumentBuilder()
    .setTitle('Api Document')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  logger.log(`Api document: http://localhost:${AppEnv.APP_PORT}/api`);
}
