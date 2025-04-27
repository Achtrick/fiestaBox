import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[longPress]',
})
export class LongPressDirective {
  @Output()
  public longPress = new EventEmitter<PressPosition>();

  private timeout: any;
  private lastEvent: MouseEvent | TouchEvent | null = null;

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onPress(event: MouseEvent | TouchEvent) {
    this.lastEvent = event;
    this.timeout = setTimeout(() => {
      const coords = this.getCoordinates(this.lastEvent);
      this.longPress.emit(coords);
      this.vibrate();
    }, 500);
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  @HostListener('touchend')
  onRelease() {
    clearTimeout(this.timeout);
  }

  private vibrate() {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  private getCoordinates(event: MouseEvent | TouchEvent | null): PressPosition {
    if (!event) {
      return { x: '0px', y: '0' };
    }
    if (event instanceof MouseEvent) {
      return { x: event.clientX - 10 + 'px', y: event.clientY - 10 + 'px' };
    } else if (event instanceof TouchEvent && event.touches.length > 0) {
      const touch = event.touches[0];
      return { x: touch.clientX - 10 + 'px', y: touch.clientY - 10 + 'px' };
    } else if (event instanceof TouchEvent && event.changedTouches.length > 0) {
      const touch = event.changedTouches[0];
      return { x: touch.clientX - 10 + 'px', y: touch.clientY - 10 + 'px' };
    }
    return { x: '0px', y: '0px' };
  }
}

export class PressPosition {
  x: string;
  y: string;
}
