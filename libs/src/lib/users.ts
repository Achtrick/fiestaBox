import { IMongo } from './mongo';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface IUserDto extends IMongo {
  name: string;
  password: string;
  phone: number;
  email: string;
  role: UserRole;
}
