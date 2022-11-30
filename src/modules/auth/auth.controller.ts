import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from './dtos/request/login.dto';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dtos/response/login-response.dto';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dtos/request/register.dto';
import { AccountDto } from '../account/dtos/response/account.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.service.doLogin(dto);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  register(@Body() dto: RegisterDto): Promise<AccountDto> {
    return this.service.doRegister(dto);
  }
}
