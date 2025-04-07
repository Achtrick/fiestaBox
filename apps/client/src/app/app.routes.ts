import { Route } from '@angular/router';
import { AlbumsComponent } from './core/pages/albums/albums.component';
import { EventsComponent } from './core/pages/events/events.component';
import { GalleryComponent } from './core/pages/gallery/gallery.component';
import { LoginComponent } from './core/pages/login/login.component';
import { RegisterComponent } from './core/pages/register/register.component';
import { AuthGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    component: EventsComponent,
    canActivate: [AuthGuard],
    data: { allowIfAuthenticated: true },
  },
  { path: 'albums/:event_id', component: AlbumsComponent },
  { path: 'gallery/:event_id/:album_id', component: GalleryComponent },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: { allowIfAuthenticated: false },
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard],
    data: { allowIfAuthenticated: false },
  },
  { path: '**', redirectTo: '' },
];
