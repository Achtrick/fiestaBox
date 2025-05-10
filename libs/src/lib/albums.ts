import { Types } from 'mongoose';
import { IMongo } from './mongo';

export interface IAlbumDto extends IMongo {
  eventId: Types.ObjectId;
  name: string;
  color?: string;
  media?: string[];
  mediaCount?: number;
  password?: string;
}
