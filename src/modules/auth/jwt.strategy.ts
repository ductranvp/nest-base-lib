import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppEnv } from '../../app/constants/app.constant';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JWT_STRATEGY_KEY } from './auth.constant';
import { CustomException } from '@devhub/nest-lib';
import { ErrorCode, ErrorMessage } from '../../app/constants/error.constant';
import { AccountService } from '../account/account.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY_KEY) {
  constructor(private readonly accountService: AccountService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AppEnv.JWT_SECRET,
    });
  }

  async validate(payload) {
    const { accountId } = payload;
    try {
      return await this.accountService.getAccountById(accountId);
    } catch (e) {
      throw new CustomException(HttpStatus.UNAUTHORIZED, {
        code: ErrorCode.UNAUTHORIZED,
        message: ErrorMessage.UNAUTHORIZED,
      });
    }
  }
}
