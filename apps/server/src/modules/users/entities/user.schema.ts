import { IUserDto, UserRole } from '@dto-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User implements IUserDto {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, type: Number })
  phone: number;

  // Indicates if the user has verified their email.
  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: true, type: String, default: UserRole.USER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
