import { AccountRole } from '../account.constant';
import { BaseAbstract } from '@devhub/nest-lib';

export interface AccountAbstract extends BaseAbstract {
  email: string;
  password: string;
  roles: AccountRole[];
}
