import { IBaseRepository } from '../../../shared/repositories/base.repository.interface';
import { EventDocument } from '../entities/event.schema';

export interface IEventRepository extends IBaseRepository<EventDocument> {
  findByName(name: string): Promise<EventDocument | null>;
}
