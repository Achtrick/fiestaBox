import { IBaseRepository } from '../../../shared/generic-apis/repositories/base.repository.interface';
import { MediaDocument } from '../entities/media.schema';

export interface IMediaRepository extends IBaseRepository<MediaDocument> {}
