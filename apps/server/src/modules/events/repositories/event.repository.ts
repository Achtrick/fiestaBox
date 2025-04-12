import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from '../entities/event.schema';
import { IEventRepository } from './event.repository.interface';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>
  ) {}

  async create(event: Partial<Event>): Promise<EventDocument> {
    const newEvent = new this.eventModel(event);
    return newEvent.save();
  }

  async findById(id: string): Promise<EventDocument | null> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }

  async update(id: string, event: Partial<Event>): Promise<EventDocument> {
    const updatedEvent = await this.eventModel.findByIdAndUpdate(id, event, {
      new: true,
    });
    if (!updatedEvent) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return updatedEvent;
  }

  async delete(id: string): Promise<void> {
    const result = await this.eventModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
  }
}
