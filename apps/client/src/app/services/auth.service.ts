import { Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from '@dto-interfaces';
import { jwtDecode } from 'jwt-decode';
import { CoreDataService } from './core-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userInfo: { token: string; role: UserRole } = JSON.parse(
    localStorage.getItem('userInfo')
  );

  public isAuthenticated: WritableSignal<boolean> = signal<boolean>(
    !!this.userInfo
  );

  constructor(
    private coreDataService: CoreDataService,
    private router: Router
  ) {}

  public async login(body: { email: string; password: string }): Promise<void> {
    const res = await this.coreDataService.ExecuteRequest<{ token: string }>(
      'POST',
      'auth/login',
      body,
      (res) => !res.success
    );

    if (res.success) {
      const token = res.data['token'];
      const userInfo = { token: token, role: jwtDecode(token)['role'] };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      this.isAuthenticated.set(true);
      this.router.navigate(['/']);
    }
  }
}
