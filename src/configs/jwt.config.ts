import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { AppEnv } from '../common/constants/app.constant';

export const jwtConfig: JwtModuleOptions = {
  secret: AppEnv.JWT_SECRET,
  signOptions: { expiresIn: AppEnv.JWT_EXPIRY_IN_SECOND },
};
