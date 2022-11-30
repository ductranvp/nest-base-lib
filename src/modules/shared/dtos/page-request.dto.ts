import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IPageRequest } from '@devhub/nest-lib';

export class PageRequestDto implements IPageRequest {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    example: 1,
  })
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    example: 10,
  })
  pageSize?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'name=asc;createdAt=desc',
  })
  sort?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'name=example',
  })
  equalSearch?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'name=example',
  })
  includeSearch?: string;
}
