import { ReadStream } from 'fs';
import { File } from 'multer';

export interface UploadedFile {
  originalname: string;
  path: string;
  size: number;
  mimetype: string;
}

export interface StorageProvider {
  upload(file: File, destinationPath?: string): Promise<UploadedFile>;
  getFiles(filePaths: string[]): Promise<Buffer[]>;
  getFileStream(
    filePath: string,
    options?: { start: number; end: number }
  ): Promise<ReadStream>;
  deleteFile(filename: string): Promise<boolean>;
  ensureDirectoryExist(destination: string): void;
}
