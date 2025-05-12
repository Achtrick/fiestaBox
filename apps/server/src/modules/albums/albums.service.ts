import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../../shared/generic-apis/service/base.service';
import { Album } from './entities/album.schema';
import { BaseRepository } from '../../shared/generic-apis/repositories/base.repository';
import { ALBUMS_REPOSITORY } from './albums.service.tokens';
import { IAlbumRepository } from './repositories/album.repository.interface';
import {
  MediaUploadOptions,
  UploadedMedia,
  UploadService,
} from '../../shared/upload/services/upload.service';
import { File } from 'multer';
import { MediasService } from '../medias/medias.service';
import { Types } from 'mongoose';
import { Media } from '../medias/entities/media.schema';

export interface FindByAlbumOptions {
  page?: number;
  limit?: number;
  sort?: any;
}
@Injectable()
export class AlbumsService extends BaseService<Album> {
  constructor(
    @InjectModel(Album.name) model: Model<Album>,
    @Inject(ALBUMS_REPOSITORY) private readonly albumRepo: IAlbumRepository,
    private readonly uploadService: UploadService,
    private readonly mediaService: MediasService
  ) {
    super(new BaseRepository<Album>(model));
  }

  async findByName(name: string): Promise<Album> {
    const album = await this.albumRepo.findByName(name);
    if (!album) {
      throw new NotFoundException(`No albums found with name: ${name}`);
    }
    return album;
  }

  async uploadMedias(
    albumId: string,
    files: File[],
    mediaUploadOptions: MediaUploadOptions
  ): Promise<UploadedMedia[]> {
    const album = await this.albumRepo.findById(albumId);
    if (!album) {
      throw new NotFoundException(`Album with ID: ${albumId} not found`);
    }
    if (!files || files?.length === 0) {
      throw new BadRequestException('No files provided for upload');
    }
    const results: UploadedMedia[] = await this.uploadService.uploadfiles(
      files,
      mediaUploadOptions
    );

    await this.mediaService.insertMany(
      results.map((media) => {
        return {
          albumId: new Types.ObjectId(albumId),
          mimeType: media.type,
          originalName: media.originalName,
          filename: media.filename,
          path: media.path,
          thumbnailPath: media.thumbnailPath,
          size: media.size,
        };
      })
    );

    return results;
  }

  /**
   *
   * @param albumId the UUID (or PK) of the album
   * @param limit
   * @param offset
   * @returns
   */
  async getMediaByAlbum(albumId: string, limit: number, offset: number) {
    const page = Math.floor(offset / limit) + 1;

    const { docs } = await this.findMediasByAlbum(albumId, {
      page,
      limit,
      sort: { createdAt: 'desc' },
    });

    return docs.map((m) => ({
      id: m._id,
      name: m.filename,
      mimeType: m.mimeType,
    }));
  }

  /**
   * Fetch media belonging to a given album, with optional pagination & sort.
   *
   * @param albumId  the UUID (or PK) of the album
   * @param options  { take, skip, order } for pagination/sorting
   */
  async findMediasByAlbum(
    albumId: string,
    options: FindByAlbumOptions = {}
  ): Promise<{
    docs: Media[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    // 1) Verify album exists (and permissions)
    await this.findById(albumId);

    // 2) Destructure defaults
    const { page = 1, limit = 20, sort = { createdAt: 'desc' } } = options;

    // 3) Use generic paginate method
    return this.mediaService.paginate(
      { albumId: new Types.ObjectId(albumId) },
      {
        page,
        limit,
        sort,
      }
    );
  }
}
