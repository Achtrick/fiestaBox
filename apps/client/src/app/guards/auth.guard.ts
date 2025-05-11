import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.authService.isAuthenticated();
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
