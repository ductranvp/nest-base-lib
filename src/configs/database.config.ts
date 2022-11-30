import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppEnv } from '../common/constants/app.constant';
import { SnakeNamingStrategy } from '@devhub/nest-lib';

export const databaseConfig: TypeOrmModuleOptions = {
  type: AppEnv.DB_TYPE as any,
  host: AppEnv.DB_HOST,
  port: AppEnv.DB_PORT,
  database: AppEnv.DB_NAME,
  username: AppEnv.DB_USER,
  password: AppEnv.DB_PASS,
  logging: ['query'],
  // https://docs.nestjs.com/techniques/database#auto-load-entities
  autoLoadEntities: true,
  namingStrategy: new SnakeNamingStrategy(),
};
