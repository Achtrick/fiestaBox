import {
  IsString,
  IsOptional,
  IsMongoId,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';
import { Types } from 'mongoose';
import { IsUnique } from '../../../common/decorators/is-unique.decorator';

export class CreateMediaDto {
  @IsMongoId()
  albumId: Types.ObjectId;

  @IsString()
  originalName: string;

  @IsString()
  filename: string;

  @IsString()
  path: string;

  @IsString()
  mimeType: string;

  @IsString()
  size: string;

  @IsOptional()
  @IsString()
  thumbnailPath?: string;
}
