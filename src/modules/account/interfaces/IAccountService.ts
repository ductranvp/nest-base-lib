import { CreateAccountDto } from '../dtos/request/create-account.dto';
import { AccountDto } from '../dtos/response/account.dto';
import { UpdateAccountDto } from '../dtos/request/update-account.dto';
import { PageAccountDto } from '../dtos/response/page-account.dto';
import { PageRequestDto } from '../../shared/dtos/page-request.dto';

export interface IAccountService {
  createAccount(dto: CreateAccountDto): Promise<AccountDto>;
  getAccountById(id: string): Promise<AccountDto>;
  getAccountByEmail(email: string): Promise<AccountDto>;
  getAccounts(query: PageRequestDto): Promise<PageAccountDto>;
  updateAccount(id: string, dto: UpdateAccountDto): Promise<AccountDto>;
  deleteAccount(id: string): Promise<boolean>;
}
