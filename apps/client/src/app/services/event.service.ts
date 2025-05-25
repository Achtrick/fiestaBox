import { Injectable } from '@angular/core';
import { Event } from '../models/Event.model';
import { CoreDataService } from './core-data.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private coreDataService: CoreDataService) {}

  public async geEvents(): Promise<Event[]> {
    const res = await this.coreDataService.ExecuteRequest<Event>(
      'GET',
      'events',
      null,
      false
    );

    return res.data as Event[];
  }

  public async addEvent(event: Event): Promise<boolean> {
    const res = await this.coreDataService.ExecuteRequest(
      'POST',
      'events',
      event,
      true
    );

    return res.success;
  }
}
