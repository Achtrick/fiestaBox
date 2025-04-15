import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event, EventDocument } from './entities/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { SuccessMessage } from '../../common/decorators/success-message.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @SuccessMessage(
    (data: EventDocument) => `Event created successfully with ID: ${data._id}`
  )
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(createEventDto);
  }

  @Get(':id')
  @SuccessMessage(
    (data: EventDocument) =>
      `Event with ID:${data._id} is retrieved successfully!`
  )
  async findOne(@Param('id') id: string) {
    return this.eventsService.findEventById(id);
  }

  @Put(':id')
  @SuccessMessage(
    (data: EventDocument) =>
      `Event with ID: ${data._id} was updated successfully!`
  )
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: Partial<Event>
  ) {
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @Delete(':id')
  @SuccessMessage('event deleted successfully!')
  async remove(@Param('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }

  @Get()
  @SuccessMessage('All events have been successfully retrieved!')
  async findAll(@Param('filter') filter: object) {
    return this.eventsService.findAllEvent(filter);
  }

  @Get('name/:name')
  @SuccessMessage(
    (data: EventDocument) =>
      `Event with name:${data.name} is retrieved successfully!`
  )
  async findOneByName(@Param('name') name: string) {
    return await this.eventsService.findEventByName(name);
  }
}
