import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAuthenticated: WritableSignal<boolean> = signal<boolean>(true);

  constructor() {}
}
