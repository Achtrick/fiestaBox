import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseRepository } from '../repositories/base.repository';
import { Document } from 'mongoose';

@Injectable()
export class BaseService<T extends Document> {
  constructor(protected readonly repo: BaseRepository<T>) {}

  async create(dto: Partial<T>): Promise<T> {
    return this.repo.create(dto);
  }

  async findAll(filter?: object): Promise<T[]> {
    return this.repo.findAll(filter);
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
    return this.repo.update(id, dto);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    return this.repo.delete(id);
  }
}
