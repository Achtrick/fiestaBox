import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from '../models/User.model';

@Injectable({ providedIn: 'root' })
export class AppStore {
  private _userInfo = signal<UserInfo | null>(
    JSON.parse(localStorage.getItem('userInfo'))
  );

  readonly userInfo = this._userInfo;
  readonly isAuthenticated = this._userInfo;

  constructor(private router: Router) {}

  setUserInfo = (userInfo: UserInfo) => {
    this.userInfo.set(userInfo);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    this.router.navigate(['/']);
  };

  clearUserInfo = () => {
    this.userInfo.set(null);
    localStorage.removeItem('userInfo');
    this.router.navigate(['/login']);
  };
}
