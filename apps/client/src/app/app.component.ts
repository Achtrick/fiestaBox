import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { AuthService } from './services/auth.service';

@Component({
  imports: [RouterModule, LayoutComponent, CommonModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(public authService: AuthService) {}
  title = 'client';
}
