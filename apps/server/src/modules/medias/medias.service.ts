import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseService } from '../../shared/generic-apis/service/base.service';
import { BaseRepository } from '../../shared/generic-apis/repositories/base.repository';
import { Media } from './entities/media.schema';
import { Response } from 'express';
import { UploadService } from '../../shared/upload/services/upload.service';
import { Readable } from 'stream';
import { UPLOAD_FOLDER } from '../../shared/upload/constants/upload.constants';
import { join } from 'path';

@Injectable()
export class MediasService extends BaseService<Media> {
  constructor(
    @InjectModel(Media.name) model: Model<Media>,
    private readonly uploadService: UploadService
  ) {
    super(new BaseRepository<Media>(model));
  }

  /**
   *
   * @param mediaId
   * @param req
   * @param res
   * @returns
   */
  async stream(mediaId: string, req: any, res: Response): Promise<void> {
    const media = await this.findById(mediaId);
    if (!media) {
      //|| !userHasAccess(req.user, media)) {
      throw new ForbiddenException('no Media was found');
    }

    await this.uploadService.stream(media, req, res);
  }

  async downloadFilesAsZip(ids: string[]): Promise<Readable> {
    const idsAsObjectKeys = ids.map((id) => new Types.ObjectId(id));
    const medias = await this.findAll({ _id: { $in: idsAsObjectKeys } });
    if (!medias) {
      throw new ForbiddenException('no Media were found');
    }

    const paths = medias.map((media) =>
      join(__dirname, `${UPLOAD_FOLDER}/${media.path}`)
    );

    return this.uploadService.downloadFilesAsZip(paths);
  }
}
