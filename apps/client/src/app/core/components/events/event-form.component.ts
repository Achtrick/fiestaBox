import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { EventType } from '@dto-interfaces';
import { Types } from 'mongoose';
import { ConvertHelper, FormHelper } from '../../../helpers/helpers';
import { Action } from '../../../models/Action.model';
import { Event, EventTypes } from '../../../models/Event.model';
import { EventService } from '../../../services/event.service';
import { AppStore } from '../../../signal-stores/app.store';
import {
  ChangeEvent,
  ImgUploaderComponent,
} from '../file-uploader/file-uploader.component';

@Component({
  selector: 'event-form',
  imports: [CommonModule, ImgUploaderComponent],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
})
export class EventFormComponent {
  @Input() action: Action = Action.ADD;
  @Input() event: Event = { ...new Event(), type: EventType.FREE };

  public onSubmit = output<void>();
  public onExecuted = output<{ success: boolean }>();

  public eventTypes = EventTypes;
  public FormHelper = FormHelper;
  public ConvertHelper = ConvertHelper;

  constructor(private eventService: EventService, private appStore: AppStore) {}

  public async persistEventData(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    this.onSubmit.emit();
    this.event.userId = new Types.ObjectId(this.appStore.userInfo().userId);

    switch (this.action) {
      case Action.ADD:
        await this.addEvent();
        break;
      case Action.UPDATE:
        break;

      default:
        break;
    }
  }

  private async addEvent(): Promise<void> {
    const success = await this.eventService.addEvent(this.event);
    success && this.onExecuted.emit({ success: success });
  }

  public setEventType(type: EventType): void {
    this.event.type = type;
  }

  public async imgChange(e: ChangeEvent): Promise<void> {
    console.log(e);
  }
}
