import { Injectable } from '@angular/core';
import {DataService} from "../data.service";
import {IGame} from "../../interfaces/game";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http:DataService) { }

  getActiveGame(){
    return this.http.get<IGame>('Game/ExistGame')
  }
}
