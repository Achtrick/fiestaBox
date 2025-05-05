import { Injectable, NotFoundException } from '@nestjs/common';
import {
  StorageProvider,
  UploadedFile,
} from '../../interfaces/storage-provider.interface';
import { DiskProviderOptions } from '../../interfaces/upload-options.interface';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { File } from 'multer';

@Injectable()
export class DiskStorageProvider implements StorageProvider {
  constructor(private options: DiskProviderOptions) {
    // Ensure the upload directory exists
    if (!fs.existsSync(options.destination)) {
      fs.mkdirSync(options.destination, { recursive: true });
    }
  }

  async upload(file: File): Promise<UploadedFile> {
    const filename = `${uuidv4()}-${file.originalname}`;
    const destinationPath = path.join(this.options.destination, filename);

    // Case A: memoryStorage → file.buffer
    if (file.buffer) {
      await fs.promises.writeFile(destinationPath, file.buffer);
    }
    // Case B: diskStorage → file.path
    else if (file.path) {
      // move the file from tmp → your destination
      await fs.promises.rename(file.path, destinationPath);
    } else {
      throw new Error('No file.buffer or file.path available');
    }

    return {
      originalname: file.originalname,
      filename,
      path: destinationPath,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async getFile(filename: string, subFolders?: string[]): Promise<Buffer> {
    const destinationPath = this._handleSubFolders(subFolders);

    const filePath = path.join(destinationPath, filename);
    return fs.promises.readFile(filePath);
  }

  async getFileStream(
    filename: string,
    subFolders?: string[]
  ): Promise<fs.ReadStream> {
    const destinationPath = this._handleSubFolders(subFolders);

    const filePath = path.join(destinationPath, filename);
    return fs.createReadStream(filePath);
  }

  async deleteFile(filename: string): Promise<boolean> {
    const filePath = path.join(this.options.destination, filename);

    try {
      await fs.promises.unlink(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  private _handleSubFolders(subFolders: string[]): string {
    let destinationPath = this.options.destination;
    if (Array.isArray(subFolders) && subFolders.length > 0) {
      const subFolderPath = path.join(...subFolders);
      destinationPath = path.join(destinationPath, subFolderPath);

      if (!fs.existsSync(destinationPath)) {
        throw new NotFoundException(
          `Subfolder ${destinationPath} does not exist`
        );
      }
    }
    return destinationPath;
  }
}
