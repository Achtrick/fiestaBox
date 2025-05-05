import { ReadStream } from 'fs';
import { Multer, File } from 'multer';

export interface UploadedFile {
  originalname: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
}

export interface StorageProvider {
  upload(file: File): Promise<UploadedFile>;
  getFile(filename: string, subFolders?: string[]): Promise<Buffer>;
  getFileStream(filename: string, subFolders?: string[]): Promise<ReadStream>;
  deleteFile(filename: string): Promise<boolean>;
}
