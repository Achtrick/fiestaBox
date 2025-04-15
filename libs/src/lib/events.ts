import { IMongo } from './mongo';

export enum EventType {
  FREE = 'free',
  SILVER = 'silver',
  GOLD = 'gold',
}
export interface IEventDto extends IMongo {
  name: string;
  startDate: Date;
  description: string;
  type: EventType;
  coverPhoto?: string;
  password?: string;
}
