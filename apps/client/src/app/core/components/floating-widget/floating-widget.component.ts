import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  input,
  InputSignal,
  model,
  ModelSignal,
  ViewChild,
} from '@angular/core';
import {
  ActionButton,
  ActionButtonComponent,
} from '../action-button/action-button.component';

@Component({
  selector: 'floating-widget',
  template: `
    @if (visible()){
    <div #widget class="floating-widget-container">
      @for (item of widgetItems(); track $index) {
      <action-button
        [class.last]="$index === widgetItems().length - 1"
        [actionButton]="item"
      ></action-button>
      }
    </div>
    }
  `,
  styles: `
  .floating-widget-container{
    position: fixed;
    background-color:rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(5px);
    box-shadow: 5px 5px 5px #cccccc6e;
    border-radius: 1rem;
    width: 100px;
    height: auto;
    opacity: 0;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow-y: auto;
    right: 10px;
    bottom: -150px;
    animation: hover 3s ease infinite;

    &:hover{
      animation: none;
    }
    ::ng-deep button{
        border: none;
        border-bottom: 1px solid #cccccc;
        border-radius: 0px;
        box-shadow: none;
        width: 100%;
        height: 30px;
        color: #474747;
        background-color: transparent;
    }
    action-button{
        width: 100%;
    }
   ::ng-deep .last button{
      border-bottom: none;
    }
  }
  @media(max-width: 800px){
      .floating-widget-container{
        animation: none;
      }
    }
  `,
  imports: [CommonModule, ActionButtonComponent],
})
export class FloatingWidgetComponent {
  @ViewChild('widget') widget: ElementRef<HTMLElement>;

  visible: ModelSignal<boolean> = model(false);
  animationDisabled: InputSignal<boolean> = input(false);
  width: InputSignal<string> = input();
  left: InputSignal<string> = input();
  bottom: InputSignal<string> = input();
  widgetItems: InputSignal<FloatingWidgetItem[]> = input([]);

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.repaint();
      }
    });
  }

  private repaint(): void {
    setTimeout(() => {
      const widget = this.widget?.nativeElement;
      if (widget) {
        widget.style.opacity = '1';
        widget.style.bottom = '80px';
        if (this.animationDisabled()) {
          widget.style.animation = 'none';
        }
        if (this.left()) {
          widget.style.left = this.left();
        }
        if (this.bottom()) {
          widget.style.bottom = this.bottom();
        }
        if (this.width()) {
          widget.style.width = this.width();
        }
      }
    }, 0);
  }
}

export class FloatingWidgetItem extends ActionButton {
  svgIcon?: string;
}
