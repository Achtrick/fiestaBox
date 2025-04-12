import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'layout',
  imports: [CommonModule, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  public eventId: WritableSignal<string> = signal('');
  public albumId: WritableSignal<string> = signal('');

  constructor(protected router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        const [event_id, album_id] = e.url.split('/').filter((_) => Number(_));

        this.eventId.set(event_id ?? null);
        this.albumId.set(album_id ?? null);
      });
  }
}
