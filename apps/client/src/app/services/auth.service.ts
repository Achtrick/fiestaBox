import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import {
  UserForgotPassword,
  UserInfo,
  UserLogin,
  UserRegister,
} from '../models/User.model';
import { AppStore } from '../signal-stores/app.store';
import { CoreDataService } from './core-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private coreDataService: CoreDataService,
    private appStore: AppStore,
    private router: Router
  ) {}

  public async login(body: UserLogin): Promise<void> {
    const res = await this.coreDataService.ExecuteRequest<{ token: string }>(
      'POST',
      'auth/login',
      body,
      (res) => !res.success
    );

    if (res.success) {
      const token = res.data['token'];

      const userInfo = new UserInfo();

      userInfo.token = token;
      userInfo.userId = jwtDecode(token)['userId'];
      userInfo.email = jwtDecode(token)['email'];
      userInfo.role = jwtDecode(token)['role'];

      this.appStore.setUserInfo(userInfo);
    }
  }

  public async signup(body: UserRegister): Promise<void> {
    const res = await this.coreDataService.ExecuteRequest(
      'POST',
      'auth/signup',
      body,
      true
    );

    if (res.success) {
      this.router.navigate(['/login']);
    }
  }

  public logout = (): void => {
    this.appStore.clearUserInfo();
  };

  public async forgotPassword(body: UserForgotPassword): Promise<void> {
    // waiting for api
  }
}
