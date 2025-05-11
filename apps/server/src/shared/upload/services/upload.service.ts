import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { STORAGE_PROVIDER, UPLOAD_FOLDER } from '../constants/upload.constants';
import {
  StorageProvider,
  UploadedFile,
} from '../interfaces/storage-provider.interface';
import { ReadStream } from 'fs';
import { File } from 'multer';
import { extname, basename, join, dirname } from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import FfmpegCommand from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

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

  async getFile(filename: string, subFolders?: string[]): Promise<Buffer> {
    return this.storageProvider.getFile(filename, subFolders);
  }

  async getFileStream(
    filename: string,
    subFolders?: string[]
  ): Promise<ReadStream> {
    return this.storageProvider.getFileStream(filename, subFolders);
  }

  async deleteFile(filename: string): Promise<boolean> {
    return this.storageProvider.deleteFile(filename);
  }

  private _extractThumbnail(
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
}
