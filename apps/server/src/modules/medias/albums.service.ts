import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../../shared/generic-apis/service/base.service';
import { BaseRepository } from '../../shared/generic-apis/repositories/base.repository';
import { Media } from './entities/media.schema';
import { MEDIAS_REPOSITORY } from './medias.service.tokens';
import { IMediaRepository } from './repositories/media.repository.interface';

@Injectable()
export class MediasService extends BaseService<Media> {
  constructor(
    @InjectModel(Media.name) model: Model<Media>,
    @Inject(MEDIAS_REPOSITORY) private readonly mediaRepo: IMediaRepository
  ) {
    super(new BaseRepository<Media>(model));
  }
}
