import { Event, EventDocument } from '../entities/event.schema';

export interface IEventRepository {
  create(event: Partial<Event>): Promise<EventDocument>;
  findById(id: string): Promise<EventDocument | null>;
  update(id: string, event: Partial<Event>): Promise<EventDocument>;
  delete(id: string): Promise<void>;
}
