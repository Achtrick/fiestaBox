import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Media, MediaSchema } from './entities/media.schema';
import { MediasService } from './medias.service';
import { MEDIAS_REPOSITORY } from './medias.service.tokens';
import { MediaRepository } from './repositories/media.repository';
import { MediasController } from './medias.controller';
import { UploadModule } from '../../shared/upload/upload.module';
import path from 'path';
import { UPLOAD_FOLDER } from '../../shared/upload/constants/upload.constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
    UploadModule.register({
      provider: 'disk',
      providerOptions: {
        destination: path.join(__dirname, `../../../${UPLOAD_FOLDER}/albums`),
      },
    }),
  ],
  providers: [
    MediasService,
    {
      provide: MEDIAS_REPOSITORY,
      useClass: MediaRepository,
    },
  ],
  controllers: [MediasController],
  exports: [MediasService],
})
export class MediasModule {}
