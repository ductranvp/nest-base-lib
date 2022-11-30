import { config } from 'dotenv';
config();
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from '@devhub/nest-lib';
import { AppEnv } from '../common/constants/app.constant';

export default new DataSource({
  type: AppEnv.DB_TYPE as any,
  host: AppEnv.DB_HOST,
  port: +AppEnv.DB_PORT,
  database: AppEnv.DB_NAME,
  username: AppEnv.DB_USER,
  password: AppEnv.DB_PASS,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
});
