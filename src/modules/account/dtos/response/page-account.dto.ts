import { AccountDto } from './account.dto';
import { IPageResponse } from '@devhub/nest-lib';

export class PageAccountDto implements IPageResponse<AccountDto> {
  data: AccountDto[];
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage: number;
}
