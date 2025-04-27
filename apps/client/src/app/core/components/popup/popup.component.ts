import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import {
  ActionButton,
  ActionButtonComponent,
} from '../action-button/action-button.component';

@Component({
  selector: 'popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  imports: [CommonModule, ActionButtonComponent],
})
export class PopupComponent implements OnInit, OnChanges {
  @ViewChild('overlay', { static: true }) overlay: ElementRef<HTMLElement>;
  @ViewChild('container', { static: true }) container: ElementRef<HTMLElement>;
  @ViewChild('header', { static: true }) header: ElementRef<HTMLElement>;
  @ViewChild('content', { static: true }) content: ElementRef<HTMLElement>;

  @Input() visible: boolean = false;
  @Input() animation: PopupAnimation = PopupAnimation.FadeIn;
  @Input() title: string = '';
  @Input() showCloseBtn: boolean = true;
  @Input() blurBackground: boolean = true;
  @Input() backgroundColor: string = '#000000';
  @Input() headerColor: string = '#ffffff';
  @Input() width: string = '50%';
  @Input() height: string = '50%';
  @Input() actionButtons: ActionButton[] = [];

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() OnHiding: EventEmitter<void> = new EventEmitter<void>();

  public ActionButton = ActionButton;

  private _visible: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _animate: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.setOverlayStyle();
    this.setContainerStyle();
    this.setContentStyle();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      if (changes['visible'].currentValue) {
        this.open();
      } else {
        this.close();
      }
    }
    if (changes['actionButtons']) {
      this.setContentStyle();
    }
  }

  private setOverlayStyle(): void {
    const popupOverlay = this.overlay.nativeElement;

    this._visible.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      if (value) {
        popupOverlay.style.display = 'flex';
        setTimeout(() => {
          popupOverlay.style.opacity = '1';
          popupOverlay.style.backgroundColor = this.blurBackground
            ? this.backgroundColor + '55'
            : this.backgroundColor;
          this.blurBackground &&
            (popupOverlay.style['backdropFilter'] = 'blur(5px)');
        }, 0);
      } else {
        popupOverlay.style.opacity = '0';
        setTimeout(() => {
          popupOverlay.style.display = 'none';
        }, 300);
      }
    });
  }

  private setContainerStyle(): void {
    const popupContainer = this.container.nativeElement;
    popupContainer.style.width = this.width;
    popupContainer.style.height = this.height;

    if (this.animation === PopupAnimation.FadeIn) {
      popupContainer.style.transform = 'scale(0.98)';
    }
    if (this.animation === PopupAnimation.FadeOut) {
      popupContainer.style.transform = 'scale(1.08)';
    }
    if (this.animation === PopupAnimation.SlideUp) {
      popupContainer.style.transform = 'translateY(60px)';
    }
    if (this.animation === PopupAnimation.SlideDown) {
      popupContainer.style.transform = 'translateY(-60px)';
    }

    this._animate.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      if (value) {
        switch (this.animation) {
          case PopupAnimation.FadeIn:
            popupContainer.style.transform = 'scale(1.08)';
            break;
          case PopupAnimation.FadeOut:
            popupContainer.style.transform = 'scale(0.98)';
            break;
          case PopupAnimation.SlideUp:
            popupContainer.style.transform = 'translateY(0px)';
            break;
          case PopupAnimation.SlideDown:
            popupContainer.style.transform = 'translateY(0px)';
            break;
        }
      } else {
        switch (this.animation) {
          case PopupAnimation.FadeIn:
            popupContainer.style.transform = 'scale(0.98)';
            break;
          case PopupAnimation.FadeOut:
            popupContainer.style.transform = 'scale(1.08)';
            break;
          case PopupAnimation.SlideUp:
            popupContainer.style.transform = 'translateY(60px)';
            break;
          case PopupAnimation.SlideDown:
            popupContainer.style.transform = 'translateY(-60px)';
            break;
        }
      }
    });
  }

  private setContentStyle(): void {
    const popupContent = this.content.nativeElement;
    popupContent.style.padding = this.actionButtons.length
      ? '50px 8px 50px 8px'
      : '50px 8px 8px 8px';
  }

  public open(): void {
    this._visible.next(true);
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      this._animate.next(true);
    }, 0);
    setTimeout(() => {
      this.container.nativeElement.style.transition = 'all 0s';
    }, 600);
  }

  public close(e?: MouseEvent): void {
    if (e && e.target['className'] !== 'popup-overlay') {
      return;
    }

    document.body.style.overflow = 'auto';
    this.container.nativeElement.style.transition = 'all 0.3s';
    this._visible.next(false);
    this.visibleChange.emit(false);
    this.OnHiding.emit();
    setTimeout(() => {
      this._animate.next(false);
    }, 0);
  }
}

export enum PopupAnimation {
  FadeIn = 'FadeIn',
  FadeOut = 'FadeOut',
  SlideUp = 'SlideUp',
  SlideDown = 'SlideDown',
}
