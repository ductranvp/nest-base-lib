import { AccountCreateDto } from './dtos/request/account.create.dto';
import { AccountEntity } from './repository/typeorm-pg/entities/account.entity';
import { AccountDto } from './dtos/response/account.dto';
import { IPageResponse } from '@devhub/nest-lib';

export class AccountMapper {
  public static createDtoToEntity(dto: AccountCreateDto): AccountEntity {
    return {
      id: undefined,
      email: dto.email,
      password: dto.password,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
      roles: dto.roles,
    };
  }

  public static entityToDto(entity: AccountEntity): AccountDto {
    return {
      id: entity.id,
      email: entity.email,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      roles: entity.roles,
    };
  }

  public static listEntityToListDto(entities: AccountEntity[]): AccountDto[] {
    return entities.map((item) => AccountMapper.entityToDto(item));
  }

  public static pageEntityToPageDto(
    page: IPageResponse<AccountEntity>,
  ): IPageResponse<AccountDto> {
    return {
      ...page,
      data: AccountMapper.listEntityToListDto(page.data),
    };
  }
}
