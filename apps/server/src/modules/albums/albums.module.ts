import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from './entities/album.schema';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { ALBUMS_REPOSITORY } from './albums.service.tokens';
import { AlbumRepository } from './repositories/album.repository';
import { DataBaseModule } from '../../database/database.module';
import { IsUniqueConstraint } from '../../common/validators/is-unique.validator';

@Module({
  imports: [
    DataBaseModule,
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
  ],
  controllers: [AlbumsController],
  providers: [
    AlbumsService,
    {
      provide: ALBUMS_REPOSITORY,
      useClass: AlbumRepository,
    },
    IsUniqueConstraint,
  ],
  exports: [AlbumsService],
})
export class AlbumsModule {}
