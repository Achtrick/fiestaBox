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
  getFile(filename: string): Promise<Buffer>;
  getFileStream(filename: string): Promise<ReadStream>;
  deleteFile(filename: string): Promise<boolean>;
}
