import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../../shared/generic-apis/service/base.service';
import { BaseRepository } from '../../shared/generic-apis/repositories/base.repository';
import { Media } from './entities/media.schema';
import { Response } from 'express';
import { UploadService } from '../../shared/upload/services/upload.service';

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
      throw new ForbiddenException();
    }

    await this.uploadService.stream(media, req, res);
  }
}
