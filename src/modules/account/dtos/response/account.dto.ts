import { IAccountEntity } from '../../interfaces/IAccountEntity';
import { AccountRole } from '../../account.constant';

export class AccountDto
  implements Omit<IAccountEntity, 'deletedAt' | 'password'>
{
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  roles: AccountRole[];
}
