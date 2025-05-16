import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { STORAGE_PROVIDER, UPLOAD_FOLDER } from '../constants/upload.constants';
import {
  StorageProvider,
  UploadedFile,
} from '../interfaces/storage-provider.interface';
import { File } from 'multer';
import { extname, basename, join, dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import FfmpegCommand from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { Request, Response } from 'express';
import { Media } from '../../../modules/medias/entities/media.schema';
import { Readable } from 'stream';

export interface MediaUploadOptions {
  /** e.g. 'albums/1234' or 'profiles/5678' */
  baseFolder: string;
  /** if true, create a per‑video subfolder + thumbnail */
  generateVideoThumbnails?: boolean;
}

export interface UploadedMedia {
  type: 'image' | 'video' | 'audio';
  originalName: string;
  filename: string;
  path: string;
  size: number; // in bytes
  thumbnailPath?: string;
}

@Injectable()
export class UploadService {
  constructor(
    @Inject(STORAGE_PROVIDER) private storageProvider: StorageProvider
  ) {
    FfmpegCommand.setFfmpegPath(ffmpegPath);
  }

  async upload(file: File): Promise<UploadedFile> {
    return this.storageProvider.upload(file);
  }

  /**
   * upload images,videos and audios
   * @param files only accepts images,videos and audios
   * @param options baseFolder and an optional boolean generateVideoThumbnails
   * @returns
   */

  async uploadfiles(
    files: File[],
    options: MediaUploadOptions
  ): Promise<UploadedMedia[]> {
    const { baseFolder, generateVideoThumbnails = true } = options;

    this.storageProvider.ensureDirectoryExist(baseFolder);

    const results: UploadedMedia[] = [];

    for (const file of files) {
      const mime = file.mimetype;
      const isImage = mime.startsWith('image/');
      const isVideo = mime.startsWith('video/');
      const isAudio = mime.startsWith('audio/');

      if (!isImage && !isVideo && !isAudio) {
        throw new BadRequestException(`Unsupported type ${mime}`);
      }

      // choose folder and provider per file
      let targetFolder = baseFolder;
      if (isVideo && generateVideoThumbnails) {
        const sub = uuidv4();
        targetFolder = join(baseFolder, sub);
        this.storageProvider.ensureDirectoryExist(targetFolder);
      }

      // move or write
      const filename = `${uuidv4()}-${file.originalname}`;
      const destPath = join(targetFolder, filename);

      const uploadedFile = await this.storageProvider.upload(file, destPath);

      //const stats = fs.statSync(destPath); // Get file stats (including size)

      const record: UploadedMedia = {
        type: isImage ? 'image' : isVideo ? 'video' : 'audio',
        originalName: file.originalname,
        filename,
        path: this._getPathAfterFolder(destPath, UPLOAD_FOLDER),
        size: uploadedFile.size, // Add file size in bytes
      };

      // thumbnail for video , only works for disk storage
      if (isVideo && generateVideoThumbnails) {
        const thumbName =
          basename(destPath, extname(destPath)) + '_thumbnail.jpg';
        const thumbPath = join(targetFolder, thumbName);

        // use destPath (moved file) for both duration-check and existence
        this.storageProvider.ensureDirectoryExist(destPath);
        if ((await this._getVideoDuration(destPath)) > 1) {
          await this._extractThumbnail(destPath, thumbPath);
          record.thumbnailPath = this._getPathAfterFolder(
            thumbPath,
            UPLOAD_FOLDER
          );
        }
      }

      results.push(record);
    }

    return results;
  }

  private async _extractThumbnail(
    videoPath: string,
    thumbnailPath: string
  ): Promise<void> {
    return new Promise((res, rej) => {
      FfmpegCommand(videoPath)
        .screenshots({
          timemarks: ['00:00:01'],
          filename: basename(thumbnailPath),
          folder: dirname(thumbnailPath),
        })
        .on('end', () => res())
        .on('error', (err) => rej(err));
    });
  }

  private async _getVideoDuration(videoPath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      FfmpegCommand.ffprobe(videoPath, (err, metadata) => {
        if (err) return reject(err);
        resolve(metadata.format.duration); // in seconds
      });
    });
  }

  private _getPathAfterFolder(
    fullPath: string,
    folderName: string
  ): string | null {
    const index = fullPath.indexOf(folderName);

    if (index === -1) return null; // folder not found

    const afterFolderIndex = index + folderName.length;
    return fullPath.substring(afterFolderIndex).replace(/^\/|\\/, ''); // remove leading slash/backslash
  }

  async downloadFilesAsZip(filePaths: string[]): Promise<Readable> {
    return this.storageProvider.downloadFilesAsZip(filePaths);
  }

  async getFiles(filePaths: string[]): Promise<Buffer[]> {
    return this.storageProvider.getFiles(filePaths);
  }

  async deleteFile(filename: string): Promise<boolean> {
    return this.storageProvider.deleteFile(filename);
  }

  /**
   *
   * @param media
   * @param req
   * @param res
   * @returns
   */
  async stream(media: Media, req: Request, res: Response): Promise<void> {
    const filePath = join(__dirname, `${UPLOAD_FOLDER}/${media.path}`);
    const fileSize = media.size;
    const range = req.headers.range;

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', media.mimeType);

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

      await this._streamRange(filePath, res, start, end);
    } else {
      res.setHeader('Content-Length', fileSize);
      await this._streamRange(filePath, res, 0, fileSize - 1);
    }
  }

  private async _streamRange(
    filePath: string,
    res: Response,
    start: number,
    end: number
  ): Promise<void> {
    // 1) ask storageProvider for the ReadStream
    const stream = await this.storageProvider.getFileStream(filePath, {
      start,
      end,
    });

    // 2) pipe it and await completion/errors
    return new Promise<void>((resolve, reject) => {
      stream.pipe(res);
      stream.on('end', resolve);
      stream.on('error', reject);
    });
  }
}
