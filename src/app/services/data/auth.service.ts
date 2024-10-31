import { Injectable } from '@angular/core';
import {DataService} from "../data.service";
import {tap} from "rxjs";

export interface ILoginResponse {
  jwt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(protected http: DataService) { }

  apiLogin(msisdn:string, password: string){
    let grantType = 'password';
    return this.http.post<ILoginResponse>('oauth2/login',{msisdn, password, grantType}).pipe(
      tap(req => localStorage.setItem('token', req.body.jwt))
    )
  }
}
