import { Route } from '@angular/router';
import { AlbumsComponent } from './core/pages/albums/albums.component';
import { GalleryComponent } from './core/pages/gallery/gallery.component';
import { LoginComponent } from './core/pages/login/login.component';
import { RegisterComponent } from './core/pages/register/register.component';

export const appRoutes: Route[] = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'albums', component: AlbumsComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: '**', redirectTo: '' },
];
