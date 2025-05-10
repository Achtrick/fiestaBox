import { EventType, IEventDto } from '@dto-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event extends Document<Types.ObjectId> implements IEventDto {
  @Prop({ required: true, type: String })
  readonly name: string;

  @Prop({ required: true, type: Date })
  readonly startDate: Date;

  @Prop({ required: false, type: String })
  readonly description: string;

  @Prop({ required: true, type: String })
  readonly type: EventType;

  @Prop({ required: false, type: String })
  readonly coverPhoto?: string;

  @Prop({ required: false, type: String })
  readonly password?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  readonly userId: Types.ObjectId;
}

export const EventSchema = SchemaFactory.createForClass(Event);
