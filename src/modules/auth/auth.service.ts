import { HttpStatus, Injectable } from '@nestjs/common';
import { IAuthService } from './interfaces/IAuthService';
import { LoginDto } from './dtos/request/login.dto';
import { LoginResponseDto } from './dtos/response/login-response.dto';
import { JwtService } from '@nestjs/jwt';
import { AccountRepository } from '../account/account.repository';
import { ErrorCode, ErrorMessage } from '../../common/constants/error.constant';
import { CustomException } from '@devhub/nest-lib';
import { RegisterDto } from './dtos/request/register.dto';
import { AccountDto } from '../account/dtos/response/account.dto';
import { AccountService } from '../account/account.service';
import { AccountRole } from '../account/account.constant';
import { comparePasswordHash } from '../../common/utils/password.util';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  async doLogin(dto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = dto;
    const exist = await this.accountRepository.getOne({ email });
    if (!exist)
      throw new CustomException(HttpStatus.NOT_FOUND, {
        code: ErrorCode.ACCOUNT_NOT_FOUND,
        message: ErrorMessage.ACCOUNT_NOT_FOUND,
      });

    const isPasswordValid = await comparePasswordHash(password, exist.password);
    if (!isPasswordValid)
      throw new CustomException(HttpStatus.UNAUTHORIZED, {
        code: ErrorCode.INVALID_EMAIL_OR_PASSWORD,
        message: ErrorMessage.INVALID_EMAIL_OR_PASSWORD,
      });

    return {
      accessToken: this.jwtService.sign({ accountId: exist.id }),
    };
  }

  doRegister(dto: RegisterDto): Promise<AccountDto> {
    return this.accountService.createAccount({
      email: dto.email,
      password: dto.password,
      roles: [AccountRole.USER],
    });
  }
}
