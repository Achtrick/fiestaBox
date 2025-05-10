import { IsString, IsOptional, IsMongoId, IsHexColor } from 'class-validator';
import { Types } from 'mongoose';
import { IsUnique } from '../../../common/decorators/is-unique.decorator';

export class CreateAlbumDto {
  @IsMongoId()
  eventId: Types.ObjectId;

  @IsString()
  @IsUnique('Album', 'name', { message: 'Name already taken.' })
  name: string;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
