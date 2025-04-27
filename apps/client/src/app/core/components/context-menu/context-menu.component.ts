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
import { PressPosition } from '../../directives/long-press.directive';
import {
  ActionButton,
  ActionButtonComponent,
} from '../action-button/action-button.component';

@Component({
  selector: 'context-menu',
  template: `
    @if (visible()){
    <div class="context-menu-container" (click)="closeContextMenu()">
      <div #contextMenu id="context-menu" class="context-menu">
        @for (item of menuItems(); track $index) {
        <action-button
          [class.last]="$index === menuItems().length - 1"
          [actionButton]="item"
        ></action-button>
        }
      </div>
    </div>
    }
  `,
  styles: `
  .context-menu-container{
    width: 100dvw;
    height: 100dvh;
    background-color: transparent;
    backdrop-filter: blur(2px);
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 1500;

    .context-menu{
    position: absolute;
    background-color:rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(5px);
    box-shadow: 5px 5px 10px #ccc;
    border-radius: 1rem;
    width: 200px;
    height: auto;
    max-height: 200px;
    opacity: 0;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow-y: auto;

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
  }
  `,
  imports: [CommonModule, ActionButtonComponent],
})
export class ContextMenuComponent {
  @ViewChild('contextMenu') contextMenu: ElementRef<HTMLElement>;

  visible: ModelSignal<boolean> = model(false);
  position: InputSignal<PressPosition> = input({
    x: '0px',
    y: '0px',
  });
  menuItems: InputSignal<ContextMenuItem[]> = input([]);

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.repaint();
      }
      if (this.position()) {
        this.repaint();
      }
    });
  }

  public closeContextMenu = (): void => {
    this.visible.set(false);
  };

  private repaint = (): void => {
    setTimeout(() => {
      const container = this.contextMenu?.nativeElement;
      if (container) {
        if (
          Number(this.position().x.split('px')[0]) + 200 >
          window.innerWidth
        ) {
          container.style.left = window.innerWidth - 200 + 'px';
        } else {
          container.style.left = this.position().x;
        }
        if (
          Number(this.position().y.split('px')[0]) + 200 >
          window.innerHeight
        ) {
          container.style.top = window.innerHeight - 200 + 'px';
        } else {
          container.style.top = this.position().y;
        }
        container.style.opacity = '1';
      }
    }, 0);
  };
}

export class ContextMenuItem extends ActionButton {
  svgIcon?: string;
}
