import { IsString, IsOptional, IsMongoId, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

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

  @IsNumber()
  size: string;

  @IsOptional()
  @IsString()
  thumbnailPath?: string;
}
