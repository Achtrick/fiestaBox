import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseRepository } from '../repositories/base.repository';
import {
  Document,
  FilterQuery,
  PipelineStage,
  UpdateQuery,
  AggregateOptions,
} from 'mongoose';

@Injectable()
export class BaseService<T extends Document> {
  constructor(protected readonly repo: BaseRepository<T>) {}

  async create(dto: Partial<T>): Promise<T> {
    return this.repo.create(dto);
  }

  async insertMany(dtos: Partial<T>[]): Promise<T[]> {
    return this.repo.insertMany(dtos);
  }

  async findAll(filter?: FilterQuery<T>): Promise<T[]> {
    return this.repo.findAll(filter);
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.repo.findOne(filter);
  }

  async findById(id: string): Promise<T | null> {
    const model = await this.repo.findById(id);
    if (!model) {
      throw new NotFoundException(`Model with ID ${id} not found`);
    }
    return model;
  }

  async update(id: string, dto: Partial<T>): Promise<T | null> {
    const model = await this.findById(id);

    const invalidKeys = Object.keys(dto).filter(
      (key) => !(key in model.toObject())
    );
    if (invalidKeys.length > 0) {
      throw new BadRequestException(
        `Invalid properties in DTO: ${invalidKeys.join(', ')}`
      );
    }
    return this.repo.update(id, dto as UpdateQuery<T>);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    return this.repo.delete(id);
  }

  async deleteMany(filter: FilterQuery<T>): Promise<{ deletedCount?: number }> {
    return this.repo.deleteMany(filter);
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.repo.count(filter);
  }

  async paginate(
    filter: FilterQuery<T> = {},
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
  }> {
    return this.repo.paginate(filter, options);
  }

  async aggregate<U>(
    pipeline: PipelineStage[],
    options?: AggregateOptions
  ): Promise<U[]> {
    return this.repo.aggregate<U>(pipeline, options);
  }
}
