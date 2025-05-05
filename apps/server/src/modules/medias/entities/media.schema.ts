import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MediaDocument = Media & Document;

@Schema({ timestamps: true })
export class Media extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Album', required: true })
  albumId: Types.ObjectId;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true, unique: true })
  filename: string;

  @Prop({ required: true, unique: true })
  path: string;

  @Prop()
  mimeType: string;

  @Prop()
  size: string;

  @Prop()
  thumbnailPath?: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
