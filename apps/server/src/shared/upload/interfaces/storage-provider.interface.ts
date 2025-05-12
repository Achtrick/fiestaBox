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
  getFile(filename: string, subFolders?: string[]): Promise<Buffer>;
  getFiles(filePaths: string[]): Promise<Buffer[]>;
  getFileStream(filename: string, subFolders?: string[]): Promise<ReadStream>;
  deleteFile(filename: string): Promise<boolean>;
  ensureDirectoryExist(destination: string): void;
}
