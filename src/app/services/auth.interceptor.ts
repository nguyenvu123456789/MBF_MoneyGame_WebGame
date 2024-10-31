import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('token');
    const authReq = authToken
      ? request.clone({headers: request.headers.set('Authorization', 'Bearer ' + authToken)})
      : request
    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('Error occurred: '+err)
        return throwError(()=>err)
      })
    );
  }
}
