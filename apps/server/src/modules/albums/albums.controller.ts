import {
  Controller,
  Get,
  Param,
  Body,
  Put,
  UseGuards,
  Post,
  Delete,
  ValidationPipe,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  Inject,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { SuccessMessage } from '../../common/decorators/success-message.decorator';
import { Album, AlbumDocument } from './entities/album.schema';
import { CreateAlbumDto } from './dto/create-album.dto';
import { OwnerGuard } from '../../common/guards/owner.guard';
import { AlbumsService } from './albums.service';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import {
  MediaUploadOptions,
  UploadedMedia,
  UploadService,
} from '../../shared/upload/services/upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { File } from 'multer';
import { join } from 'path';
import { UploadOptions } from '../../shared/upload/interfaces/upload-options.interface';
import { Types } from 'mongoose';

export class IdParamDto {
  @IsMongoId() // ← ensures “id” is a 24‑hex string
  id: string;

  @IsString()
  @IsOptional()
  filename: string;
}

@Controller('albums')
export class AlbumsController {
  constructor(
    protected readonly albumService: AlbumsService,
    private readonly uploadService: UploadService,
    @Inject('UPLOAD_OPTIONS') private uploadOptions: UploadOptions
  ) {}

  /**
   * ------------------------------ create one album
   * @param createEventDto
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @SuccessMessage(
    (data: AlbumDocument) => `Album created successfully with ID: ${data._id}`
  )
  async create(@Body() createEventDto: CreateAlbumDto) {
    createEventDto.eventId = new Types.ObjectId(createEventDto.eventId);
    return this.albumService.create(createEventDto);
  }

  /**
   * ------------------------------ get one album by id
   * @param id
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @SuccessMessage(
    (data: AlbumDocument) =>
      `Album with ID:${data?._id} is retrieved successfully!`
  )
  async findOne(
    @Param(new ValidationPipe({ transform: true }))
    params: IdParamDto
  ) {
    return await this.albumService.findById(params.id);
  }

  /**
   * ------------------------------ update one album by id
   * @param id
   * @param updateEventDto
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @SuccessMessage(
    (data: AlbumDocument) =>
      `Album with ID: ${data._id} was updated successfully!`
  )
  async update(
    @Param(new ValidationPipe({ transform: true }))
    params: IdParamDto,
    @Body() updateEventDto: Partial<Album>
  ) {
    return this.albumService.update(params.id, updateEventDto);
  }

  /**
   * ------------------------------ delete one album by id
   * @param id
   * @returns
   */
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Delete(':id')
  @SuccessMessage('album deleted successfully!')
  async remove(
    @Param(new ValidationPipe({ transform: true }))
    params: IdParamDto
  ) {
    return this.albumService.remove(params.id);
  }

  /**
   * ------------------------------ get all albums
   * @param filter
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  @SuccessMessage('All albums have been successfully retrieved!')
  async findAll(@Param('filter') filter: object) {
    return this.albumService.findAll(filter);
  }

  /**
   * ------------------------------ get one album by name
   * @param name
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Get('name/:name')
  @SuccessMessage(
    (data: AlbumDocument) =>
      `Album with name:${data.name} is retrieved successfully!`
  )
  async findOneByName(@Param('name') name: string) {
    return await this.albumService.findByName(name);
  }

  /**
   * ------------------------------ upload media to album
   * @param albumId
   * @param files
   * @returns
   */
  @Post(':id/media')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: 'uploads/tmp',
        filename: (_, f, cb) => cb(null, f.originalname),
      }),
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.match(/^(image\/.+|video\/.+|audio\/.+)$/)) {
          return cb(
            new BadRequestException('Only images, videos & audio allowed'),
            false
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 500 * 1024 * 1024 },
    })
  )
  async uploadMedia(
    @Param(new ValidationPipe({ transform: true }))
    params: IdParamDto,
    @UploadedFiles() files: File[]
  ): Promise<UploadedMedia[]> {
    const baseRoot =
      'destination' in this.uploadOptions.providerOptions
        ? this.uploadOptions.providerOptions.destination
        : this.uploadOptions.providerOptions.bucket;

    const mediaUploadOptions: MediaUploadOptions = {
      baseFolder: join(baseRoot, params.id),
      generateVideoThumbnails: true,
    };

    return this.albumService.uploadMedias(params.id, files, mediaUploadOptions);
  }

  /**
   * ------------------------------ get media from album
   * @param albumId
   * @param filename
   * @returns
   */
  @Get(':id/media/:filename')
  async getFile(
    @Param(new ValidationPipe({ transform: true }))
    params: IdParamDto,
    @Res() res: Response
  ) {
    try {
      const { id, filename } = params;
      const file = await this.uploadService.getFile(filename, [id]);
      res.end(file);
    } catch (error) {
      console.error('Error retrieving file:', error);
      res.status(500).send('Error retrieving file');
    }
  }

  /**
   * ------------------------------ get media stream from album
   * @param albumId
   * @param filename
   * @returns
   */
  @Get(':id/filestream/:filename')
  async getFileStream(
    @Param(new ValidationPipe({ transform: true }))
    params: IdParamDto,
    @Res() res: Response
  ) {
    try {
      const { id, filename } = params;
      const file = await this.uploadService.getFileStream(filename, [id]);
      res.end(file);
    } catch (error) {
      console.error('Error retrieving file:', error);
      res.status(500).send('Error retrieving file');
    }
  }
}
