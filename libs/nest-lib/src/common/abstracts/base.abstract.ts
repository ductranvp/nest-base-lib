/**
 * Base interface for most entity with audit and soft delete
 * */
export abstract class BaseAbstract<T = any> {
  id: T;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
