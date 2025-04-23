import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { Event, EventDocument } from './entities/event.schema';
import { IEventRepository } from './repositories/event.repository.interface';
import { EVENT_REPOSITORY } from './events.service.tokens';

@Injectable()
export class EventsService {
  // Using a custom injection token to get the repository implementation.
  constructor(
    @Inject(EVENT_REPOSITORY) private readonly eventRepo: IEventRepository
  ) {}

  /**
   * Creates a new event based on the provided CreateEventDto.
   */
  async createEvent(data: CreateEventDto): Promise<EventDocument> {
    return this.eventRepo.create(data);
  }

  /**
   * Finds an event by its ID.
   * Throws NotFoundException if the event does not exist.
   */
  async findEventById(id: string): Promise<EventDocument> {
    const event = await this.eventRepo.findById(id);
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }

  /**
   * Updates an existing event.
   */
  async updateEvent(id: string, data: Partial<Event>): Promise<EventDocument> {
    return this.eventRepo.update(id, data);
  }

  /**
   * Deletes an event by its ID.
   */
  async deleteEvent(id: string): Promise<void> {
    return this.eventRepo.delete(id);
  }

  /**
   * returns all events. if a filter is provided, return filtered events.
   * @param filter - optional filter object to filter events
   * @returns - array of events
   */
  async findAllEvent(filter?: object): Promise<EventDocument[]> {
    return this.eventRepo.findAll(filter);
  }

  /**
   * Finds an event by its Name.
   * Throws NotFoundException if the event does not exist.
   */
  async findEventByName(name: string): Promise<EventDocument> {
    const event = await this.eventRepo.findByName(name);
    if (!event) {
      throw new NotFoundException(`Event with name ${name} not found`);
    }
    return event;
  }
}
