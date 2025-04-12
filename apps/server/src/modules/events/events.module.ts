// src/modules/events/events.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event, EventSchema } from './entities/event.schema';
import { EventRepository } from './repositories/event.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventsController],
  providers: [
    EventsService,
    // Bind the interface to the concrete repository implementation:
    {
      provide: 'IEventRepository',
      useClass: EventRepository,
    },
  ],
  exports: [EventsService],
})
export class EventsModule {}
