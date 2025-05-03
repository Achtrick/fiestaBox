import { IBaseRepository } from '../../../shared/generic-apis/repositories/base.repository.interface';
import { AlbumDocument } from '../entities/album.schema';

export interface IAlbumRepository extends IBaseRepository<AlbumDocument> {
  findByName(name: string): Promise<AlbumDocument | null>;
}
