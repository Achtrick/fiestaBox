import { IMongo } from './mongo';
import { Types } from 'mongoose';

export enum EventType {
  FREE = 'free',
  SILVER = 'silver',
  GOLD = 'gold',
}

export const EVENT_TYPE_SIZE_LIMITS: Record<EventType, number> = {
  [EventType.FREE]: 100 * 1024 * 1024, // 100 MB
  [EventType.SILVER]: 2 * 1024 * 1024 * 1024, // 2 GB
  [EventType.GOLD]: 10 * 1024 * 1024 * 1024, // 10 GB
};

export interface IEventDto extends IMongo {
  name: string;
  startDate: Date;
  description: string;
  type: EventType;
  coverPhoto?: string;
  password?: string;
  userId?: Types.ObjectId;
}
