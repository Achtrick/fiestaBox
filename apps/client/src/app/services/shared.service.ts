import { Injectable, signal, WritableSignal } from '@angular/core';
import { ToastSettings } from '../core/components/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public toastSettings: WritableSignal<ToastSettings> = signal(undefined);

  constructor() {}
}
