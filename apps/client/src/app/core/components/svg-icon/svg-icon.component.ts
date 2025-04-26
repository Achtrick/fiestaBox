import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { IconRegistry } from '../../../app.component';

@Component({
  selector: 'svg-icon',
  imports: [CommonModule],
  template: `<div #icon [style.fill]="color" class="icon"></div>`,
  styles: `
  :host ::ng-deep {
    display:block;
    width:100%;
    height:100%;
    user-select:none;

    .icon{
      width:inherit;
      height:inherit;
      
      svg{
         width:inherit;
         height:inherit;
         fill:inherit;
         
         path{
           fill:inherit;
         }
      }
    }
   
  }
  `,
})
export class SvgIconComponent implements AfterViewInit {
  @ViewChild('icon') icon: ElementRef<HTMLElement>;

  @Input() svgName: string;
  @Input() color: string;

  constructor() {}

  ngAfterViewInit(): void {
    this.icon.nativeElement.innerHTML = IconRegistry[this.svgName];
  }
}
