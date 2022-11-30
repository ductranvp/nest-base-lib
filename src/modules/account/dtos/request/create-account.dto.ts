import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { IAccountEntity } from '../../interfaces/IAccountEntity';
import { ApiProperty } from '@nestjs/swagger';
import { AccountRole } from '../../account.constant';
import { OmitBaseFields } from '@devhub/nest-lib';

export class CreateAccountDto implements Omit<IAccountEntity, OmitBaseFields> {
  @ApiProperty({
    example: 'example@domain.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @ApiProperty({
    enum: AccountRole,
    isArray: true,
  })
  @IsEnum(AccountRole, { each: true })
  roles: AccountRole[];
}
