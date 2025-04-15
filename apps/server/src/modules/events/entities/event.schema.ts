import { EventType, IEventDto } from '@dto-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event implements IEventDto {
  @Prop({ required: true, type: String })
  readonly Name: string;

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
}

export const EventSchema = SchemaFactory.createForClass(Event);
