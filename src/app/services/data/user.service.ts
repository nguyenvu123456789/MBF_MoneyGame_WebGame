import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataService} from "../data.service";
import {IUser} from "../../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: DataService) { }

  apiGetUserByMsisdn(msisdn: string){
    return this.http.get<IUser>('User/GetByMsisdn',{msisdn: msisdn})
  }
}
