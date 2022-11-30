import { LoginDto } from '../dtos/request/login.dto';
import { LoginResponseDto } from '../dtos/response/login-response.dto';
import { RegisterDto } from '../dtos/request/register.dto';
import { AccountDto } from '../../account/dtos/response/account.dto';

export interface IAuthService {
  doLogin(dto: LoginDto): Promise<LoginResponseDto>;
  doRegister(dto: RegisterDto): Promise<AccountDto>;
}
