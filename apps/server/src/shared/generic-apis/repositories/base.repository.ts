import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  PipelineStage,
  AggregateOptions,
} from 'mongoose';
import { IBaseRepository } from './base.repository.interface';

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  /** Create a single document */
  async create(item: Partial<T>): Promise<T> {
    const created = new this.model(item);
    return created.save();
  }

  /** Create multiple documents in bulk */
  async insertMany(items: Partial<T>[]): Promise<T[]> {
    return this.model.insertMany(items) as unknown as T[];
  }

  /** Find a document by its ID */
  async findById(id: string): Promise<T | null> {
    const model = await this.model.findById(id).exec();
    return model;
  }

  /** Find a single document by filter */
  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  /** Find all documents matching a filter */
  async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  /** Update a document by its ID */
  async update(id: string, item: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, item, { new: true }).exec();
  }

  /** Delete a document by its ID */
  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }

  /** Delete multiple documents matching a filter */
  async deleteMany(filter: FilterQuery<T>): Promise<{ deletedCount?: number }> {
    const result = await this.model.deleteMany(filter).exec();
    return { deletedCount: result.deletedCount };
  }

  /** Count documents matching a filter */
  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  /** Paginate through documents */
  async paginate(
    filter: FilterQuery<T> = {},
    options: {
      page?: number;
      limit?: number;
      sort?:
        | string
        | { [key: string]: object | { $meta: any } }
        | [string, object][]
        | undefined
        | null;
    } = {}
  ): Promise<{
    docs: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      this.model
        .find(filter)
        .sort(options.sort as any)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);
    const pages = Math.ceil(total / limit);
    return { docs, total, page, limit, pages };
  }

  /** Perform an aggregation pipeline */
  async aggregate<U>(
    pipeline: PipelineStage[],
    options?: AggregateOptions
  ): Promise<U[]> {
    return this.model.aggregate<U>(pipeline, options).exec();
  }
}
