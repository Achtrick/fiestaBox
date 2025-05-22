import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlanDocument = Plan & Document;

@Schema({ timestamps: true })
export class Plan extends Document<Types.ObjectId> {
  @Prop({ required: true, type: String })
  readonly type: string;

  @Prop({ required: true })
  readonly size: number;

  @Prop({ required: true })
  readonly price: number;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
