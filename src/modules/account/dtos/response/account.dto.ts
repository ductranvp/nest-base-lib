import { AccountAbstract } from '../../abstracts/account.abstract';
import { AccountRole } from '../../account.constant';

export class AccountDto
  implements Omit<AccountAbstract, 'deletedAt' | 'password'>
{
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  roles: AccountRole[];
}
