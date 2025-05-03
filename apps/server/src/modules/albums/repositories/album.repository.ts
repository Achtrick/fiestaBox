import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '../../../shared/generic-apis/repositories/base.repository';
import { Album, AlbumDocument } from '../entities/album.schema';
import { IAlbumRepository } from './album.repository.interface';

@Injectable()
export class AlbumRepository
  extends BaseRepository<AlbumDocument>
  implements IAlbumRepository
{
  constructor(
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>
  ) {
    super(albumModel);
  }

  async findByName(name: string): Promise<AlbumDocument | null> {
    return this.albumModel.findOne({ name }).exec();
  }
}
