import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from '../entities/event.schema';
import { IEventRepository } from './event.repository.interface';
import { BaseRepository } from '../../../shared/generic-apis/repositories/base.repository';

@Injectable()
export class EventRepository
  extends BaseRepository<EventDocument>
  implements IEventRepository
{
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>
  ) {
    super(eventModel);
  }

  async findByName(name: string): Promise<EventDocument | null> {
    return this.eventModel.findOne({ name }).exec();
  }
}
