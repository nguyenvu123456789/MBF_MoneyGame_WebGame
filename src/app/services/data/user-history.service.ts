import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { IUserHistory } from 'src/app/interfaces/user-history';

@Injectable({
  providedIn: 'root'
})
export class UserHistoryService {
  constructor(private http: DataService) {}

  apiGetPrizesByUser(data: any) {
    return this.http.post<IUserHistory>('game-history/searchUserPrizes', data);
  }
}
