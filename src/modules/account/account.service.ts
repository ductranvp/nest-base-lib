import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AccountCreateDto } from './dtos/request/account.create.dto';
import { AccountMapper } from './account.mapper';
import { IAccountService } from './interfaces/IAccountService';
import { AccountDto } from './dtos/response/account.dto';
import { AccountUpdateDto } from './dtos/request/account.update.dto';
import { AccountRepository } from './repository/typeorm-pg/repositories/account.repository';
import { AccountPageDto } from './dtos/response/account.page.dto';
import { ErrorCode, ErrorMessage } from '../../app/constants/error.constant';
import { CustomException } from '@devhub/nest-lib';
import { PageRequestDto } from '../shared/dtos/page-request.dto';
import { Cache } from 'cache-manager';
import { AppEnv } from '../../app/constants/app.constant';
import { hashPassword } from '../../app/utils/password.util';
import { AccountEntity } from './repository/typeorm-pg/entities/account.entity';

@Injectable()
export class AccountService implements IAccountService {
  constructor(
    private readonly repo: AccountRepository,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async createAccount(dto: AccountCreateDto): Promise<AccountDto> {
    const prepareEntity = AccountMapper.createDtoToEntity(dto);
    prepareEntity.password = await hashPassword(prepareEntity.password);
    const created = await this.repo.createOne(prepareEntity);
    return AccountMapper.entityToDto(created);
  }

  async getAccountById(id: string): Promise<AccountDto> {
    const cached = await this.cacheService.get<AccountDto>(id);
    if (cached) return cached;

    const exist = await this.repo.getOne({ id });
    if (!exist)
      throw new CustomException(HttpStatus.NOT_FOUND, {
        code: ErrorCode.ACCOUNT_NOT_FOUND,
        message: ErrorMessage.ACCOUNT_NOT_FOUND,
      });
    const result = AccountMapper.entityToDto(exist);

    this.cacheService.set(id, result, { ttl: AppEnv.DEFAULT_CACHE_TTL });

    return result;
  }

  async getAccountByEmail(email: string): Promise<AccountDto> {
    const exist = await this.repo.getOne({ email });
    if (!exist)
      throw new CustomException(HttpStatus.NOT_FOUND, {
        code: ErrorCode.ACCOUNT_NOT_FOUND,
        message: ErrorMessage.ACCOUNT_NOT_FOUND,
      });
    return AccountMapper.entityToDto(exist);
  }

  async updateAccount(id: string, dto: AccountUpdateDto): Promise<AccountDto> {
    await this.getAccountById(id);
    if (dto.password) dto.password = await hashPassword(dto.password);
    await this.repo.updateOne({ id }, dto);
    return this.getAccountById(id);
  }

  async deleteAccount(id: string): Promise<boolean> {
    await this.getAccountById(id);
    return this.repo.deleteOne({ id }, true);
  }

  async getAccounts(query: PageRequestDto): Promise<AccountPageDto> {
    const result = await this.repo.getMany(query);
    return AccountMapper.pageEntityToPageDto(result);
  }

  async getAccountEntityByEmail(email: string): Promise<AccountEntity> {
    const exist = await this.repo.getOne({ email });
    if (!exist)
      throw new CustomException(HttpStatus.NOT_FOUND, {
        code: ErrorCode.ACCOUNT_NOT_FOUND,
        message: ErrorMessage.ACCOUNT_NOT_FOUND,
      });
    return exist;
  }
}
