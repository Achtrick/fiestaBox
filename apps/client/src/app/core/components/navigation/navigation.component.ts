import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'navigation',
  imports: [CommonModule, RouterLink],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  public eventId: WritableSignal<string> = signal('');
  public albumId: WritableSignal<string> = signal('');

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.router.events
      .pipe(filter((_) => _ instanceof ActivationEnd))
      .subscribe((activationEnd: ActivationEnd) => {
        const { event_id, album_id } = activationEnd.snapshot.params;
        this.eventId.set(event_id);
        this.albumId.set(album_id);
      });
  }
}
