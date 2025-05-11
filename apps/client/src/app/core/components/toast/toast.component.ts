import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'toast',
  template: `
    <div #container class="toast-container">
      <div #content class="toast-content">
        @if(Array.isArray(message)){ @for (m of message; track $index) {
        {{ message }}<br />
        } } @else{
        {{ message }}
        }
      </div>
    </div>
  `,
  styles: `
  .toast-container {
  position: absolute;
  display: flex;
  justify-content: center;
  z-index: 1000;
  padding: 10px;
  width: 100%;
}
.toast-content {
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0px 0px 50px #cccccc;
  font-size: 17px;
  max-height: 250px;
  min-height: 35px;
  max-width: 300px;
  min-width: 200px;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  transition: all 0.6s;
  color: #ffffff;
}
`,
})
export class ToastComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('container', { static: true })
  private container: ElementRef<HTMLElement>;
  @ViewChild('content', { static: true })
  private content: ElementRef<HTMLElement>;

  @Input() visible: boolean = false;
  @Input() message: string | string[] = '';
  @Input() position: ToastPosition = ToastPosition.Top;
  @Input() animation: ToastAnimation = ToastAnimation.FadeIn;
  @Input() type: ToastType = ToastType.Default;
  @Input() hideAfter: number = 2000;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() OnHiding: EventEmitter<void> = new EventEmitter<void>();

  public ToastAnimation = ToastAnimation;
  public ToastPosition = ToastPosition;
  public ToastType = ToastType;
  public Array = Array;

  private _visible: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _animate: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.setContainerStyle();
    this.setContentStyle();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes['visible'].currentValue) {
      this.open();
    }
  }

  private setContainerStyle(): void {
    const container = this.container.nativeElement;
    this._visible.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      if (value) {
        container.style.display = 'flex';
        container.style.top =
          this.position === ToastPosition.Top ? '0px' : 'unset';
        container.style.bottom =
          this.position === ToastPosition.Bottom ? '0px' : 'unset';
      } else {
        container.style.display = 'none';
      }
    });
  }

  private setContentStyle() {
    const tostContent = this.content.nativeElement;
    let backgroundColor = '';

    switch (this.type) {
      case ToastType.Default:
        backgroundColor = '#2e2e2e';
        break;
      case ToastType.Info:
        backgroundColor = '#20b9e3';
        break;
      case ToastType.Error:
        backgroundColor = '#e01017';
        break;
      case ToastType.Success:
        backgroundColor = '#51db23';
        break;
      case ToastType.Warning:
        backgroundColor = '#eb9423';
        break;
    }

    tostContent.style.backgroundColor = backgroundColor;

    if (this.animation === ToastAnimation.FadeIn) {
      tostContent.style.transform = 'scale(0.98)';
    }
    if (this.animation === ToastAnimation.FadeOut) {
      tostContent.style.transform = 'scale(1.08)';
    }

    this._animate.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      if (value) {
        switch (this.animation) {
          case ToastAnimation.FadeIn:
            tostContent.style.opacity = '1';
            tostContent.style.transform = 'scale(1.08)';
            break;
          case ToastAnimation.FadeOut:
            tostContent.style.opacity = '1';
            tostContent.style.transform = 'scale(0.98)';
            break;
          case ToastAnimation.Slide:
            tostContent.style.opacity = '1';
            if (this.position === ToastPosition.Top) {
              tostContent.style.transform = 'translateY(20px)';
            } else {
              tostContent.style.transform = 'translateY(-20px)';
            }
            break;
        }
      } else {
        switch (this.animation) {
          case ToastAnimation.FadeIn:
            tostContent.style.opacity = '0';
            tostContent.style.transform = 'scale(0.98)';
            break;
          case ToastAnimation.FadeOut:
            tostContent.style.opacity = '0';
            tostContent.style.transform = 'scale(1.08)';
            break;
          case ToastAnimation.Slide:
            tostContent.style.opacity = '0';
            tostContent.style.transform = 'translateY(0px)';
            break;
        }
      }
    });
  }

  public open(): void {
    if (!this._visible.value) {
      this._visible.next(true);
      setTimeout(() => {
        this._visible.next(false);
        this.visibleChange.emit(false);
        this.OnHiding.emit();
      }, this.hideAfter);
      setTimeout(() => {
        this._animate.next(true);
      }, 100);
      setTimeout(() => {
        this._animate.next(false);
      }, this.hideAfter - 600);
    }
  }
}

export enum ToastAnimation {
  FadeIn = 'FadeIn',
  FadeOut = 'FadeOut',
  Slide = 'Slide',
}

export enum ToastPosition {
  Top = 'Top',
  Bottom = 'Bottom',
}

export enum ToastType {
  Default = 'Default',
  Info = 'Info',
  Error = 'Error',
  Success = 'Success',
  Warning = 'Warning',
}

export class ToastSettings {
  message: string | string[];
  type: ToastType;
  hideAfter: number;
  animation: ToastAnimation;
  position: ToastPosition;
}
