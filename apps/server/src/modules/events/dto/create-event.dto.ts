import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { EventType } from '@dto-interfaces';
import { Types } from 'mongoose';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsDateString()
  readonly startDate: Date;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(EventType)
  readonly type: EventType;

  @IsOptional()
  @IsString()
  readonly coverPhoto?: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword({
    minLength: 6,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  readonly password?: string;

  @IsMongoId()
  // optional to not cause any validation problem
  @IsOptional()
  readonly userId: Types.ObjectId;
}
