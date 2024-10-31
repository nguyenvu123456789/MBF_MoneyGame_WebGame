import { Component, OnInit } from '@angular/core';
import { UserHistoryService } from '../services/data/user-history.service';
import { IUserHistory } from 'src/app/interfaces/user-history';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss']
})
export class UserHistoryComponent implements OnInit {
  filteredHistory: IUserHistory[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  gameId = 1; 
  msisdn = "0987654323";

  constructor(private userHistoryService: UserHistoryService) {}

  ngOnInit(): void {
    this.fetchUserHistory();
  }

  fetchUserHistory(): void {
    const requestData = {
      pageIndex: 0,
      pageSize: 10,
      filtering: {
        startDate: this.startDate ? this.startDate.toISOString() : "",
        endDate: this.endDate ? this.endDate.toISOString() : "",
        gameId: this.gameId,
        msisdn: this.msisdn
      },
      sorting: {
        direction: 0,
        field: "id"
      },
      paginated: true
    };

    this.userHistoryService.apiGetPrizesByUser(requestData).subscribe((response: any) => {
      if (response.status === 200) {
        this.filteredHistory = response.body.data;
      }
    });
  }

  onSearch(): void {
    this.fetchUserHistory();
  }
}
