import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppEnv } from '../../common/constants/app.constant';
import { AccountRepository } from '../account/account.repository';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JWT_STRATEGY_KEY } from './auth.constant';
import { CustomException } from '@devhub/nest-lib';
import { ErrorCode, ErrorMessage } from '../../common/constants/error.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY_KEY) {
  constructor(private readonly accountRepo: AccountRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AppEnv.JWT_SECRET,
    });
  }

  async validate(payload) {
    const { accountId } = payload;
    const found = await this.accountRepo.getOne({ id: accountId });

    if (!found)
      throw new CustomException(HttpStatus.UNAUTHORIZED, {
        code: ErrorCode.UNAUTHORIZED,
        message: ErrorMessage.UNAUTHORIZED,
      });

    return found;
  }
}
