import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Event, EventType } from '../../../models/Event.model';
import { LayoutComponent } from '../../components/layout/layout.component';

@Component({
  selector: 'events',
  imports: [CommonModule, LayoutComponent, RouterLink],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent {
  public events: Event[] = [
    {
      Id: '1',
      Name: 'Startup Meetup',
      CoverPhoto:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
      Date: '2025-06-10',
      Type: EventType.Free,
    },
    {
      Id: '2',
      Name: 'Developer Bootcamp',
      CoverPhoto:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
      Date: '2025-07-01',
      Type: EventType.Platinium,
    },
    {
      Id: '3',
      Name: 'Cybersecurity Workshop',
      CoverPhoto:
        'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=400',
      Date: '2025-09-12',
      Type: EventType.Free,
    },
    {
      Id: '4',
      Name: 'Cloud Architecture Panel',
      CoverPhoto:
        'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=400',
      Date: '2025-11-01',
      Type: EventType.Platinium,
    },
    {
      Id: '5',
      Name: 'Startup Meetup',
      CoverPhoto:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
      Date: '2025-06-10',
      Type: EventType.Free,
    },
    {
      Id: '6',
      Name: 'Developer Bootcamp',
      CoverPhoto:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
      Date: '2025-07-01',
      Type: EventType.Platinium,
    },
    {
      Id: '7',
      Name: 'Cybersecurity Workshop',
      CoverPhoto:
        'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=400',
      Date: '2025-09-12',
      Type: EventType.Free,
    },
    {
      Id: '8',
      Name: 'Cloud Architecture Panel',
      CoverPhoto:
        'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=400',
      Date: '2025-11-01',
      Type: EventType.Platinium,
    },
    {
      Id: '9',
      Name: 'Startup Meetup',
      CoverPhoto:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
      Date: '2025-06-10',
      Type: EventType.Free,
    },
    {
      Id: '10',
      Name: 'Developer Bootcamp',
      CoverPhoto:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
      Date: '2025-07-01',
      Type: EventType.Platinium,
    },
    {
      Id: '11',
      Name: 'Cybersecurity Workshop',
      CoverPhoto:
        'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=400',
      Date: '2025-09-12',
      Type: EventType.Free,
    },
    {
      Id: '12',
      Name: 'Cloud Architecture Panel',
      CoverPhoto:
        'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=400',
      Date: '2025-11-01',
      Type: EventType.Platinium,
    },
  ];
}
