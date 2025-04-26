import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IEventDto } from '@dto-interfaces';

@Component({
  selector: 'event-form',
  imports: [CommonModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
})
export class EventFormComponent {
  @Input() event: IEventDto;
  public persistEventData(e: SubmitEvent): void {
    e.preventDefault();
    console.log(e);
  }
}
