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
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { SuccessMessage } from '../../common/decorators/success-message.decorator';
import { Album, AlbumDocument } from './entities/album.schema';
import { CreateAlbumDto } from './dto/create-album.dto';
import { OwnerGuard } from '../../common/guards/owner.guard';
import { AlbumsService } from './albums.service';
import { IsMongoId } from 'class-validator';

export class IdParamDto {
  @IsMongoId() // ← ensures “id” is a 24‑hex string
  id: string;
}

@Controller('albums')
export class AlbumsController {
  constructor(protected readonly albumService: AlbumsService) {}

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
}
