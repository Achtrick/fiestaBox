import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AppStore } from '../signal-stores/app.store';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private appStore: AppStore, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.appStore.isAuthenticated();
    const allowIfAuthenticated = route.data['allowIfAuthenticated'] ?? true;

    if (isLoggedIn && !allowIfAuthenticated) {
      this.router.navigate(['']);
      return false;
    }

    if (!isLoggedIn && allowIfAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
