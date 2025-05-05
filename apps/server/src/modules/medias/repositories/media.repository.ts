import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '../../../shared/generic-apis/repositories/base.repository';
import { Media, MediaDocument } from '../entities/media.schema';
import { IMediaRepository } from './media.repository.interface';

@Injectable()
export class MediaRepository
  extends BaseRepository<MediaDocument>
  implements IMediaRepository
{
  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>
  ) {
    super(mediaModel);
  }
}
