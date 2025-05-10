import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Event, EventDocument } from './entities/event.schema';
import { IEventRepository } from './repositories/event.repository.interface';
import { EVENT_REPOSITORY } from './events.service.tokens';
import { EVENT_TYPE_SIZE_LIMITS } from '@dto-interfaces';
import { MediasService } from '../medias/medias.service';
import { AlbumsService } from '../albums/albums.service';
import { BaseService } from '../../shared/generic-apis/service/base.service';
import { BaseRepository } from '../../shared/generic-apis/repositories/base.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class EventsService extends BaseService<Event> {
  // Using a custom injection token to get the repository implementation.
  constructor(
    @InjectModel(Event.name) model: Model<Event>,
    @Inject(EVENT_REPOSITORY) private readonly eventRepo: IEventRepository,
    private readonly mediaService: MediasService,
    private readonly albumService: AlbumsService
  ) {
    super(new BaseRepository<Event>(model));
  }

  /**
   * Finds an event by its Name.
   * Throws NotFoundException if the event does not exist.
   */
  async findEventByName(name: string): Promise<EventDocument> {
    const event = await this.eventRepo.findByName(name);
    if (!event) {
      throw new NotFoundException(`Event with name ${name} not found`);
    }
    return event;
  }

  /**
   * Checks if the upload limit for a specific event type has been reached.
   * @param eventId - The ID of the event to check.
   * @returns - true if the upload limit is reached, false otherwise.
   */
  async isUploadLimitReached(eventId: string): Promise<boolean> {
    const event = await super.findById(eventId);

    const limit = EVENT_TYPE_SIZE_LIMITS[event.type];

    const albums = await this.albumService.findAll({ eventId });
    if (albums.length === 0) return false;

    const albumIds = albums.map((album) => album._id.toString());

    const result = await this.mediaService.aggregate<{ totalSize: number }>([
      { $match: { albumId: { $in: albumIds } } },
      {
        $group: {
          _id: null,
          totalSize: { $sum: '$size' },
        },
      },
    ]);

    const totalSize = result[0]?.totalSize ?? 0;
    return totalSize >= limit;
  }
}
