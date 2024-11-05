import { Injectable } from '@angular/core';
import {DataService} from "../data.service";
import {IGame, IPrize} from "../../interfaces/game";

@Injectable({
  providedIn: 'root'
})
export class PrizeService {

  constructor(private http:DataService) { }

  apiGetPrizeById(id:number){
    return this.http.get<IPrize>(`Prize/GetById`,{id});
  }
}
