import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from '@dto-interfaces';
import { lastValueFrom } from 'rxjs';
import {
  ToastAnimation,
  ToastSettings,
  ToastType,
} from '../core/components/toast/toast.component';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class CoreDataService {
  constructor(private http: HttpClient, private sharedService: SharedService) {}

  public async ExecuteRequest<T>(
    method: 'GET' | 'DELETE' | 'POST' | 'PUT',
    url: string,
    body?: Object,
    showMessages: boolean | ((res: IResponse<T>) => boolean) = false
  ): Promise<IResponse<T>> {
    let res: IResponse<T>;

    const methodMap: Record<typeof method, () => Promise<IResponse<T>>> = {
      GET: () => lastValueFrom(this.http.get<IResponse<T>>(url)),
      DELETE: () => lastValueFrom(this.http.delete<IResponse<T>>(url)),
      POST: () => lastValueFrom(this.http.post<IResponse<T>>(url, body)),
      PUT: () => lastValueFrom(this.http.put<IResponse<T>>(url, body)),
    };

    try {
      res = await methodMap[method]();
    } catch (error: any) {
      res = error?.error as IResponse<T>;
    }

    if (
      showMessages &&
      (showMessages === true || (showMessages as Function)(res))
    ) {
      this.showMessages<T>(res);
    }

    return res;
  }

  private showMessages<T>(res: IResponse<T>): void {
    const settings = new ToastSettings();
    settings.message = res.message;
    settings.type = res.success ? ToastType.Success : ToastType.Error;
    settings.animation = ToastAnimation.Slide;
    this.sharedService.toastSettings.set(settings);
  }
}
