import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventType, IEventDto } from '@dto-interfaces';
import { Action } from '../../../models/Action.model';
import { ActionButton } from '../../components/action-button/action-button.component';
import { EventFormComponent } from '../../components/events/event-form.component';
import {
  PopupAnimation,
  PopupComponent,
} from '../../components/popup/popup.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { EventTypeColorPipe } from '../../pipes/event-type-color.pipe';

@Component({
  selector: 'events',
  imports: [
    CommonModule,
    RouterLink,
    PopupComponent,
    EventFormComponent,
    ToolbarComponent,
    EventTypeColorPipe,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent {
  public events: IEventDto[] = [
    {
      _id: '1',
      name: 'Startup Meetup',
      coverPhoto:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
      startDate: new Date('2025-06-10'),
      type: EventType.FREE,
      description: '---',
    },
    {
      _id: '2',
      name: 'Developer Bootcamp',
      coverPhoto:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
      startDate: new Date('2025-07-01'),
      type: EventType.GOLD,
      description: '---',
    },
    {
      _id: '3',
      name: 'Cybersecurity Workshop',
      coverPhoto:
        'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=400',
      startDate: new Date('2025-09-12'),
      type: EventType.FREE,
      description: '---',
    },
    {
      _id: '4',
      name: 'Cloud Architecture Panel',
      coverPhoto:
        'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=400',
      startDate: new Date('2025-11-01'),
      type: EventType.SILVER,
      description: '---',
    },
    {
      _id: '5',
      name: 'Startup Meetup',
      coverPhoto:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
      startDate: new Date('2025-06-10'),
      type: EventType.FREE,
      description: '---',
    },
    {
      _id: '6',
      name: 'Developer Bootcamp',
      coverPhoto:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
      startDate: new Date('2025-07-01'),
      type: EventType.GOLD,
      description: '---',
    },
  ];
  public Action = Action;
  public action: WritableSignal<Action> = signal(null);
  public actionTitle: WritableSignal<string> = signal('');
  public PopupAnimation = PopupAnimation;
  public actionButtons: WritableSignal<ActionButton[]> = signal([]);

  constructor() {}

  public clearAction = (): void => {
    this.actionButtons.set([]);
    this.action.set(null);
  };

  public addEvent = (e: MouseEvent): void => {
    e.stopPropagation();
    this.action.set(Action.ADD);
    this.actionTitle.set('Create a new event');
    this.actionButtons.set([
      {
        text: 'cancel',
        width: '100px',
        height: '35px',
        backgroundColor: 'var(--SecondaryColor)',
        color: 'var(--PrimaryColor)',
        action: this.clearAction,
      },
      {
        text: 'confirm',
        width: '100px',
        height: '35px',
        backgroundColor: 'var(--PrimaryColor)',
        color: 'var(--SecondaryColor)',
        formId: 'events-form',
      },
    ]);
  };

  public editEvent(e: MouseEvent): void {
    e.stopPropagation();
    this.action.set(Action.UPDATE);
    this.actionTitle.set('Edit event');
  }

  public deleteEvent(e: MouseEvent): void {
    e.stopPropagation();
    this.action.set(Action.DELETE);
    this.actionTitle.set('Sure you want to delete this event ?');
    this.actionButtons.set([
      {
        text: 'no',
        width: '100px',
        height: '35px',
        backgroundColor: 'var(--SecondaryColor)',
        color: 'var(--PrimaryColor)',
        action: this.clearAction,
      },
      {
        text: 'yes, delete',
        width: '100px',
        height: '35px',
        backgroundColor: 'var(--PrimaryColor)',
        color: 'var(--SecondaryColor)',
        action: () => alert('event canceled'),
      },
    ]);
  }
}
