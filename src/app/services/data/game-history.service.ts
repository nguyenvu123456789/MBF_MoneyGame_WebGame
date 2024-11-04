import { Injectable } from '@angular/core';
import {DataService} from "../data.service";
import {IRequestPage} from "../../interfaces/request-page";
import {IReceivedPrize} from "../../interfaces/received-prizes";
import {IResponsePage} from "../../interfaces/response-page";
import {IUserPlay} from "../../interfaces/user-play";

@Injectable({
  providedIn: 'root'
})
export class GameHistoryService {

  constructor(protected http:DataService) { }
  request : IRequestPage = new IRequestPage();
  apiGetReceivedPrizes(msisdn:any){
    this.request.filtering.msisdn = msisdn;
    return this.http.post<IResponsePage<IReceivedPrize>>('game-history/received-prize', this.request)
  }
  apiGetUserInfo(msisdn:any){
    return this.http.get<IUserPlay>('game-history/user-info', {msisdn})
  }
}
