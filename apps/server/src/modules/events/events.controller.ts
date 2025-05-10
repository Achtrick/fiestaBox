import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Inject,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event, EventDocument } from './entities/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { SuccessMessage } from '../../common/decorators/success-message.decorator';
import { Owner } from '../../common/decorators/owner.decorator';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { OwnerGuard } from '../../common/guards/owner.guard';
import { EVENTS_SERVICE } from './events.service.tokens';
import { IsMongoId } from 'class-validator';
import { Request } from 'express';
import { Types } from 'mongoose';

export class IdParamDto {
  @IsMongoId() // ← ensures “id” is a 24‑hex string
  id: string;
}

@Controller('events')
export class EventsController {
  constructor(
    @Inject(EVENTS_SERVICE) private readonly eventsService: EventsService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @SuccessMessage(
    (data: EventDocument) => `Event created successfully with ID: ${data._id}`
  )
  async create(@Body() createEventDto: CreateEventDto, @Req() req: Request) {
    return this.eventsService.create({
      ...createEventDto,
      userId: new Types.ObjectId(req.user.userId),
    });
  }

  @Get(':id')
  @SuccessMessage(
    (data: EventDocument) =>
      `Event with ID:${data._id} is retrieved successfully!`
  )
  async findOne(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Owner({
    serviceToken: 'EventsServiceToken',
    param: 'id',
    ownerField: 'creatorId',
  })
  @Put(':id')
  @SuccessMessage(
    (data: EventDocument) =>
      `Event with ID: ${data._id} was updated successfully!`
  )
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: Partial<Event>
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @SuccessMessage('event deleted successfully!')
  async remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Get()
  @SuccessMessage('All events have been successfully retrieved!')
  async findAll(@Param('filter') filter: object) {
    return this.eventsService.findAll(filter);
  }

  @Get('name/:name')
  @SuccessMessage(
    (data: EventDocument) =>
      `Event with name:${data.name} is retrieved successfully!`
  )
  async findOneByName(@Param('name') name: string) {
    return await this.eventsService.findEventByName(name);
  }

  @Get(':id/isUploadLimitReached')
  async isUploadLimitReached(
    @Param(new ValidationPipe({ transform: true }))
    params: IdParamDto
  ) {
    return await this.eventsService.isUploadLimitReached(params.id);
  }
}
