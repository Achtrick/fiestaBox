import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from './entities/album.schema';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { ALBUMS_REPOSITORY } from './albums.service.tokens';
import { AlbumRepository } from './repositories/album.repository';
import { IsUniqueConstraint } from '../../common/validators/is-unique.validator';
import { UploadModule } from '../../shared/upload/upload.module';
import path from 'path';
import { MediasModule } from '../medias/medias.module';
import { UPLOAD_FOLDER } from '../../shared/upload/constants/upload.constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    UploadModule.register({
      provider: 'disk',
      providerOptions: {
        destination: path.join(__dirname, `../../../${UPLOAD_FOLDER}/albums`),
      },
    }),
    MediasModule,
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
