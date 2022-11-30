import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CreateAccountDto } from './dtos/request/create-account.dto';
import { AccountService } from './account.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccountDto } from './dtos/response/account.dto';
import { UpdateAccountDto } from './dtos/request/update-account.dto';
import { PageAccountDto } from './dtos/response/page-account.dto';
import { PageRequestDto } from '../shared/dtos/page-request.dto';
import { UseAppGuard } from '../auth/decorators/use-app-guard.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccountRole } from './account.constant';

@ApiTags('account')
@ApiBearerAuth()
@UseAppGuard()
@Roles(AccountRole.USER)
@Controller('account')
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Post('create-one')
  createOne(
    @Req() request,
    @Body() dto: CreateAccountDto,
  ): Promise<AccountDto> {
    return this.service.createAccount(dto);
  }

  @Get('get-many')
  getMany(@Query() query: PageRequestDto): Promise<PageAccountDto> {
    return this.service.getAccounts(query);
  }

  @Get('get-one/:id')
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<AccountDto> {
    return this.service.getAccountById(id);
  }

  @Patch('update-one/:id')
  updateOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAccountDto,
  ): Promise<AccountDto> {
    return this.service.updateAccount(id, dto);
  }

  @Delete('delete-one/:id')
  softDeleteOne(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
    return this.service.deleteAccount(id);
  }
}
