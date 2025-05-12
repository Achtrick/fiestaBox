import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { MediasService } from './medias.service';
import { Request, Response } from 'express';

@Controller('media')
export class MediasController {
  constructor(private readonly mediaService: MediasService) {}

  // media.controller.ts
  @Get(':mediaId/stream')
  async streamMedia(
    @Param('mediaId') mediaId: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const media = await this.mediaService.findById(mediaId);
    if (!media) {
      //|| !userHasAccess(req.user, media)) {
      throw new ForbiddenException();
    }

    await this.mediaService.stream(media, req, res);
  }
}
