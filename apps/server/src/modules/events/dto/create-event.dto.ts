import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { EventType, IEventDto } from '@dto-interfaces';

export class CreateEventDto implements IEventDto {
  @IsNotEmpty()
  @IsString()
  readonly Name: string;

  @IsNotEmpty()
  @IsDate()
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
}
