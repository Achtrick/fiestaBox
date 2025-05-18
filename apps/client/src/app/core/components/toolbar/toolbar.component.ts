import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import {
  FloatingWidgetComponent,
  FloatingWidgetItem,
} from '../floating-widget/floating-widget.component';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'toolbar',
  imports: [CommonModule, SvgIconComponent, FloatingWidgetComponent],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit {
  @Input() title: string = '';
  @Input() actionTitle: string = '';
  @Input() actionIcon: string = '';
  @Input() badgeCount: number = 0;
  @Input() action: (event: MouseEvent) => void;

  public widgetItems: WritableSignal<FloatingWidgetItem[]> = signal([]);
  public menuOpen: WritableSignal<boolean> = signal(false);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.widgetItems.set([
      {
        text: 'close',
        action: this.toggleMenu,
      },
      {
        text: 'logout',
        color: 'whitesmoke',
        backgroundColor: '#e51616',
        action: this.authService.logout,
      },
    ]);
  }

  public toggleMenu = (): void => {
    this.menuOpen.update((value) => !value);
  };
}
