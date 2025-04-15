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
import { Event } from './entities/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { SuccessMessage } from '../../common/decorators/success-message.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(createEventDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findEventById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: Partial<Event>
  ) {
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }

  @Get()
  @SuccessMessage('All events have been successfully retrieved!')
  async findAll(@Param('filter') filter: object) {
    return this.eventsService.findAllEvent(filter);
  }

  @Get('title/:title')
  async findOneByTitle(@Param('title') title: string) {
    return this.eventsService.findEventByTitle(title);
  }
}
