import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../../shared/generic-apis/service/base.service';
import { BaseRepository } from '../../shared/generic-apis/repositories/base.repository';
import { Media } from './entities/media.schema';
import { MEDIAS_REPOSITORY } from './medias.service.tokens';
import { IMediaRepository } from './repositories/media.repository.interface';
import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';
import { UPLOAD_FOLDER } from '../../shared/upload/constants/upload.constants';

@Injectable()
export class MediasService extends BaseService<Media> {
  constructor(@InjectModel(Media.name) model: Model<Media>) {
    super(new BaseRepository<Media>(model));
  }

  /**
   *
   * @param media
   * @param req
   * @param res
   * @returns
   */
  async stream(media: Media, req: any, res: Response): Promise<void> {
    const filePath = join(__dirname, `${UPLOAD_FOLDER}/${media.path}`);
    const stat = await fs.promises.stat(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', media.mimeType);

    const pipeStream = (start: number, end: number) => {
      return new Promise<void>((resolve, reject) => {
        const stream = fs.createReadStream(filePath, { start, end });
        stream.pipe(res);
        stream.on('end', resolve);
        stream.on('error', reject);
      });
    };

    if (range) {
      const matches = /bytes=(\d+)-(\d+)?/.exec(range);
      if (!matches) {
        res.status(400).send('Invalid Range');
        return;
      }

      const start = Number(matches[1]);
      const end = matches[2] ? Number(matches[2]) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        res.status(416).setHeader('Content-Range', `bytes */${fileSize}`);
        res.end();
        return;
      }

      const chunkSize = end - start + 1;
      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      res.setHeader('Content-Length', chunkSize);

      await pipeStream(start, end);
    } else {
      res.setHeader('Content-Length', fileSize);
      await pipeStream(0, fileSize - 1);
    }
  }
}
