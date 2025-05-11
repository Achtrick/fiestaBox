import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = JSON.parse(localStorage.getItem('userInfo')!)?.token;
    const authReq = req.clone({
      url: 'http://localhost:3000/api/' + req.url,
      headers: req.headers.set('Authorization', 'Bearer ' + authToken),
    });
    return next.handle(authReq);
  }
}
