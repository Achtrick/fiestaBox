import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Media, MediaSchema } from './entities/media.schema';
import { MediasService } from './medias.service';
import { MEDIAS_REPOSITORY } from './medias.service.tokens';
import { MediaRepository } from './repositories/media.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
  ],
  providers: [
    MediasService,
    {
      provide: MEDIAS_REPOSITORY,
      useClass: MediaRepository,
    },
  ],
  exports: [MediasService],
})
export class MediasModule {}
