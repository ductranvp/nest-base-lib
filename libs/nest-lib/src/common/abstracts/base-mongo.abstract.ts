/**
 * Base interface for most entity with audit and soft delete
 * */
export abstract class BaseMongoAbstract<T = any> {
  _id: T;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
