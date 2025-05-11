import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { UploadService } from '../services/upload.service';
import { UPLOAD_OPTIONS } from '../constants/upload.constants';
import { UploadOptions } from '../interfaces/upload-options.interface';

@Controller('uploads')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    @Inject(UPLOAD_OPTIONS) private defaultOptions: UploadOptions
  ) {}

  // Original routes remain the same
  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const file = await this.uploadService.getFile(filename);
    res.end(file);
  }

  @Get(':filename/stream')
  async streamFile(@Param('filename') filename: string) {
    const stream = await this.uploadService.getFileStream(filename);
    return new StreamableFile(stream);
  }

  @Delete(':filename')
  async deleteFile(@Param('filename') filename: string) {
    return { success: await this.uploadService.deleteFile(filename) };
  }
}
