import { Injectable } from '@angular/core';
import {DataService} from "../data.service";
import {IResponse} from "../../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class TaskLoginService {

  constructor(private http: DataService) { }

  doTaskLogin(id:number){
    return this.http.post<IResponse>(`TaskLogin/Create?id=${id}`,{});
  }
}
