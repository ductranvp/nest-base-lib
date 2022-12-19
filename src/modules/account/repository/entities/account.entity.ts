import { Column, Entity } from 'typeorm';
import { TableName } from '../../../../app/constants/app.constant';
import { AccountAbstract } from '../../abstracts/account.abstract';
import { AccountRole } from '../../account.constant';
import { BaseEntity, OmitBaseFields } from '@devhub/nest-lib';

@Entity({ name: TableName.ACCOUNT })
export class AccountEntity
  extends BaseEntity
  implements Omit<AccountAbstract, OmitBaseFields>
{
  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'simple-array', nullable: true, enum: AccountRole })
  roles: AccountRole[];
}
