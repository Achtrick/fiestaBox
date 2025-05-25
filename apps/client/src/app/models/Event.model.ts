import { EventType, IEventDto } from '@dto-interfaces';
import { Types } from 'mongoose';

export class Event implements IEventDto {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  startDate: Date;
  coverPhoto?: string;
  description: string;
  type: EventType;
  password?: string;
}

export const EventTypes = [EventType.FREE, EventType.SILVER, EventType.GOLD];
