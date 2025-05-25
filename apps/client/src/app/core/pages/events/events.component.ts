import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Action } from '../../../models/Action.model';
import { Event as Events } from '../../../models/Event.model';
import { EventService } from '../../../services/event.service';
import { ActionButton } from '../../components/action-button/action-button.component';
import { EventFormComponent } from '../../components/events/event-form.component';
import {
  PopupAnimation,
  PopupComponent,
} from '../../components/popup/popup.component';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';
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
    SvgIconComponent,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent {
  public events: WritableSignal<Events[]> = signal([]);
  public loading: WritableSignal<boolean> = signal(true);
  public actionLoading: WritableSignal<boolean> = signal(false);
  public Action = Action;
  public action: WritableSignal<Action> = signal(undefined);
  public actionTitle: WritableSignal<string> = signal('');
  public actionButtons: WritableSignal<ActionButton[]> = signal([]);
  public selectedEvent: WritableSignal<Events> = signal(undefined);
  public PopupAnimation = PopupAnimation;

  constructor(private eventService: EventService) {}

  async ngOnInit(): Promise<void> {
    await this.getEvents();
  }

  public async getEvents(): Promise<void> {
    this.clearAction();
    this.loading.set(true);
    const data = await this.eventService.geEvents();
    this.events.set(data);
    this.loading.set(false);
  }

  public clearAction = (): void => {
    this.actionButtons.set([]);
    this.action.set(undefined);
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

  public editEvent(e: MouseEvent, event: Events): void {
    e.stopPropagation();

    this.selectedEvent.set(event);

    this.action.set(Action.UPDATE);
    this.actionTitle.set('Edit event');
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
  }

  public deleteEvent(e: MouseEvent, event: Events): void {
    e.stopPropagation();

    this.selectedEvent.set(event);

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

  public loadDefaultImage(e: Event): void {
    (e.target as HTMLImageElement).src = 'event-placeholder.webp';
  }

  public onFormSubmit(): void {
    this.actionLoading.set(true);
  }

  public async onFormExecuted(e: { success: boolean }): Promise<void> {
    this.actionLoading.set(false);

    if (e.success) {
      await this.getEvents();
    }
  }
}
