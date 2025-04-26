import { IMongo } from './mongo';

export interface IAlbumDto extends IMongo {
  name: string;
  color?: string;
  media: string[];
  password?: string;
}
