import { IAlbumDto } from '@dto-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AlbumDocument = Album & Document;

@Schema({ timestamps: true })
export class Album extends Document<Types.ObjectId> implements IAlbumDto {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  color?: string;

  @Prop()
  password?: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
