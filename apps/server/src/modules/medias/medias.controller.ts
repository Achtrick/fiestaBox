import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { MediasService } from './medias.service';
import { Request, Response } from 'express';

@Controller('media')
export class MediasController {
  constructor(private readonly mediaService: MediasService) {}

  @Get(':mediaId/stream')
  async streamMedia(
    @Param('mediaId') mediaId: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    await this.mediaService.stream(mediaId, req, res);
  }
}
