import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AccountRole } from '../../account/account.constant';
import { ROLES_KEY } from '../auth.constant';
import { CustomException } from '@devhub/nest-lib';
import {
  ErrorCode,
  ErrorMessage,
} from '../../../common/constants/error.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<AccountRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const valid = requiredRoles.some((role) =>
      request.user.roles?.includes(role),
    );
    if (!valid)
      throw new CustomException(HttpStatus.FORBIDDEN, {
        code: ErrorCode.FORBIDDEN,
        message: ErrorMessage.FORBIDDEN,
      });
    return true;
  }
}
