import { AccountCreateDto } from '../dtos/request/account.create.dto';
import { AccountDto } from '../dtos/response/account.dto';
import { AccountUpdateDto } from '../dtos/request/account.update.dto';
import { AccountPageDto } from '../dtos/response/account.page.dto';
import { PageRequestDto } from '../../shared/dtos/page-request.dto';
import { AccountEntity } from '../repository/typeorm-pg/entities/account.entity';

export interface IAccountService {
  createAccount(dto: AccountCreateDto): Promise<AccountDto>;
  getAccountById(id: string): Promise<AccountDto>;
  getAccountByEmail(email: string): Promise<AccountDto>;
  getAccountEntityByEmail(email: string): Promise<AccountEntity>;
  getAccounts(query: PageRequestDto): Promise<AccountPageDto>;
  updateAccount(id: string, dto: AccountUpdateDto): Promise<AccountDto>;
  deleteAccount(id: string): Promise<boolean>;
}
