import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event, EventSchema } from './entities/event.schema';
import { EventRepository } from './repositories/event.repository';
import { EVENT_REPOSITORY, EVENTS_SERVICE } from './events.service.tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventsController],
  providers: [
    {
      provide: EVENTS_SERVICE,
      useClass: EventsService,
    },
    // Bind the interface to the concrete repository implementation:
    {
      provide: EVENT_REPOSITORY,
      useClass: EventRepository,
    },
  ],
  exports: [EVENTS_SERVICE],
})
export class EventsModule {}
