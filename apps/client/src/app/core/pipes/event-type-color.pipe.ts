import { Pipe, PipeTransform } from '@angular/core';
import { EventType } from '@dto-interfaces';

@Pipe({
  name: 'eventTypeColor',
})
export class EventTypeColorPipe implements PipeTransform {
  transform(value: EventType): string {
    switch (value) {
      case EventType.FREE:
        return 'var(--FreeColor)';
      case EventType.SILVER:
        return 'var(--SilverColor)';
      case EventType.GOLD:
        return 'var(--GoldColor)';
      default:
        return 'var(--FreeColor)';
    }
  }
}
