import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

export type Response<T = any> = {
  status: number;
  code: number;
  error: string;
  body: T;
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl='http://localhost:8080';
  constructor(private http: HttpClient) { }

  get<T>(url: string, params?: {}, config?:{}): Observable<Response<T>>{
    return this.http
      .get<Response<T>>(`${this.apiUrl}/${url}`, {params, ...config})
      .pipe(catchError((err)=>this.handleError(err)));
  }

  post<T>(url: string, body: any, config?:{}): Observable<Response<T>>{
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http
      .post<Response<T>>(`${this.apiUrl}/${url}`, body, {headers, ...config})
      .pipe(catchError((err)=>this.handleError(err)));
  }

  private handleError(err: HttpErrorResponse){
    let errorMessage = '';
    if(err.error instanceof ErrorEvent){
      errorMessage = `Client-side error: ${err.error.message}`;
    }else if(typeof err.error === 'object' && err.error !== null){
      const{status, code, error, body} = err.error;
      errorMessage = error ? `${error}`:'(failed)net::ERR_CONNECTION_REFUSED';
    }else {
      errorMessage = `Server-side error: ${err.status} - ${
        err.message || err.error
      }`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
