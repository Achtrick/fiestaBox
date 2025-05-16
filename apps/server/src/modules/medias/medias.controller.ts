import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
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

  @Get('download')
  async downloadFiles(@Query('ids') ids: string[], @Res() res: Response) {
    const zipStream = await this.mediaService.downloadFilesAsZip(ids);

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=files.zip',
    });

    zipStream.pipe(res);
  }
}
