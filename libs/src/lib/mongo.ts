import { Types } from 'mongoose';

export interface IMongo {
  _id?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  isDeleted?: boolean;
}
