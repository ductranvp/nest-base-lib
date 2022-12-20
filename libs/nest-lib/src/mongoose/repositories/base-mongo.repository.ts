import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  DefaultValue,
  QUERY_KEY_VALUE_DELIMITER,
  QUERY_PARAM_DELIMITER,
  SortOrder,
  IBaseRepository,
  IPageRequest,
  IPageResponse,
  calculatePageOffset,
} from '../../common';
import { BaseMongoEntity } from '../schemas';
import { FilterQuery, Model } from 'mongoose';

export class BaseMongoRepository<E extends BaseMongoEntity>
  implements IBaseRepository<E>
{
  protected repo: Model<E>;
  protected entityColumns: string[];
  protected entityName: string;

  constructor(repository: Model<E>) {
    this.repo = repository;
    this.entityName = null;
    this.entityColumns = [];
  }

  async createOne(data: E): Promise<E> {
    return this.repo.create(data);
  }

  async getOne(findCondition: FilterQuery<E>): Promise<E> {
    return this.repo.findOne(findCondition);
  }

  async updateOne(findCondition: FilterQuery<E>, data: any): Promise<boolean> {
    const result = await this.repo.updateOne(findCondition, data);
    return result.matchedCount === 1;
  }

  async deleteOne(
    findCondition: FilterQuery<E>,
    softDelete: boolean,
  ): Promise<boolean> {
    let result;
    if (softDelete) {
      result = await this.repo.updateOne(findCondition, {});
    } else {
      result = await this.repo.delete(findCondition);
    }
    return result.affected === 1;
  }

  async createMany(array: E[]): Promise<E[]> {
    return this.repo.save(array);
  }

  async getMany(request: IPageRequest): Promise<IPageResponse<E>> {
    const { equalSearch, includeSearch, sort } = request;
    const page = Number(request.page);
    const pageSize = Number(request.pageSize) || DefaultValue.PAGE_SIZE;
    const builder = this.repo.createQueryBuilder(this.alias);

    if (equalSearch) {
      const eqs = equalSearch.split(QUERY_PARAM_DELIMITER);
      eqs.forEach((item) => {
        const [key, value] = item.split(QUERY_KEY_VALUE_DELIMITER);
        this.checkFieldExistInEntity(key);
        builder.andWhere(`${this.alias}.${key} = '${value}'`);
      });
    }

    if (includeSearch) {
      const ins = includeSearch.split(QUERY_PARAM_DELIMITER);
      ins.forEach((item) => {
        const [key, value] = item.split(QUERY_KEY_VALUE_DELIMITER);
        this.checkFieldExistInEntity(key);
        builder.andWhere(`${this.alias}.${key} ILIKE '%${value}%'`);
      });
    }

    if (sort) {
      const sorts = sort.split(QUERY_PARAM_DELIMITER);
      sorts.forEach((item) => {
        const [key, value] = item.split(QUERY_KEY_VALUE_DELIMITER);
        this.checkFieldExistInEntity(key);
        const sortValue = this.getSortValue(value);
        if (sortValue) {
          builder.addOrderBy(`${this.alias}.${key}`, sortValue);
        }
      });
    }

    if (page && !isNaN(page)) {
      builder.take(pageSize).skip(calculatePageOffset(page, pageSize));

      const [data, total] = <[E[], number]>await builder.getManyAndCount();
      return {
        data: data,
        pageSize: Number(pageSize),
        page: page,
        totalItem: total,
        totalPage: Math.ceil(total / pageSize),
      };
    } else {
      const data = await builder.getMany();
      return {
        data: data,
        pageSize: null,
        page: null,
        totalItem: null,
        totalPage: null,
      };
    }
  }

  protected getSortValue(value: string): SortOrder {
    if (value && value.toLowerCase() === 'asc') return SortOrder.ASC;
    if (value && value.toLowerCase() === 'desc') return SortOrder.DESC;
    return null;
  }

  private throwBadRequestException(msg?: unknown): BadRequestException {
    throw new BadRequestException(msg);
  }

  private throwNotFoundException(name: string): NotFoundException {
    throw new NotFoundException(`${name} not found`);
  }

  private checkFieldExistInEntity(field) {
    if (!this.entityColumns.includes(field))
      this.throwBadRequestException(
        `${field} doesn't exist in ${this.entityName}`,
      );
  }
}
