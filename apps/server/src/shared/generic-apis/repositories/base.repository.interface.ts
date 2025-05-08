import { Document } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  create(item: Partial<T>): Promise<T>;
  insertMany(items: Partial<T>[]): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findOne(filter: object): Promise<T | null>;
  findAll(filter?: object): Promise<T[]>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<void>;
  deleteMany(filter: object): Promise<{ deletedCount?: number }>;
  count(filter?: object): Promise<number>;
  paginate(
    filter?: object,
    options?: {
      page?: number;
      limit?: number;
      sort?:
        | string
        | { [key: string]: object | { $meta: any } }
        | [string, object][]
        | undefined
        | null;
    }
  ): Promise<{
    docs: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }>;
  aggregate<U>(pipeline: object[], options?: object): Promise<U[]>;
}
