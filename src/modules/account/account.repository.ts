import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from './account.entity';
import { Repository } from 'typeorm';
import { BaseRepository } from '@devhub/nest-lib';

export class AccountRepository extends BaseRepository<AccountEntity> {
  constructor(
    @InjectRepository(AccountEntity)
    protected readonly repo: Repository<AccountEntity>,
  ) {
    super(repo);
  }
}
