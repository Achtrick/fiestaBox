import { ReadStream } from 'fs';
import { File } from 'multer';
import { Readable } from 'stream';

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
  downloadFilesAsZip(filePaths: string[]): Promise<Readable>;
  ensureDirectoryExist(destination: string): void;
}
