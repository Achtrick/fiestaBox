import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[longPress]',
})
export class LongPressDirective {
  @Output()
  longPress = new EventEmitter<void>();

  private timeout: any;

  @HostListener('mousedown')
  @HostListener('touchstart')
  onPress() {
    this.timeout = setTimeout(() => {
      this.longPress.emit();
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
}
