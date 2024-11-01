import {Injectable} from '@angular/core';
import {DataService} from "../data.service";
import {tap} from "rxjs";

export interface ILoginResponse {
  jwt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;

  constructor(protected http: DataService) {
  }

  apiLogin(msisdn: string, password: string) {
    let grantType = 'password';
    return this.http.post<ILoginResponse>('oauth2/login', {msisdn, password, grantType}).pipe(
      tap(req => {
        localStorage.setItem('token', req.body.jwt);
        this.currentUser = this.decodeToken(req.body.jwt);
      })
    )
  }

  getUserInfo() {
    if(this.currentUser) {
      return this.currentUser;
    }else {
      const token = localStorage.getItem('token');
      if(token){
        this.currentUser = this.decodeToken(token);
      }
      return this.currentUser
    }
  }

  private decodeToken(token: string) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  }
}
