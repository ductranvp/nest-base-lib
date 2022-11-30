import { AccountRole } from '../account.constant';
import { IBaseEntity } from '@devhub/nest-lib';

export interface IAccountEntity extends IBaseEntity {
  email: string;
  password: string;
  roles: AccountRole[];
}
