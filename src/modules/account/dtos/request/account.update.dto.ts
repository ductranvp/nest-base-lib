import { PartialType } from '@nestjs/swagger';
import { AccountCreateDto } from './account.create.dto';

export class AccountUpdateDto extends PartialType(AccountCreateDto) {}
