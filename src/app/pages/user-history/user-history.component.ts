import { Component, OnInit } from '@angular/core';
import { UserHistoryService } from '../../services/data/user-history.service';
import { ActivatedRoute } from '@angular/router';
import { IUserHistory } from 'src/app/interfaces/user-history';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss'],
  providers: [DatePipe]
})
export class UserHistoryComponent implements OnInit {
  filteredHistory: IUserHistory[] = [];
  groupedHistory: { date: string, items: IUserHistory[] }[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  gameId!: number;
  msisdn!: string;

  constructor(
    private userHistoryService: UserHistoryService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.params['gameId'];
    this.msisdn = this.route.snapshot.params['msisdn'];
    this.fetchUserHistory();
  }

  fetchUserHistory(): void {
    const requestData = {
      pageIndex: 0,
      pageSize: 10,
      filtering: {
        startDate: this.startDate ? this.datePipe.transform(this.startDate, 'yyyy-MM-dd') : null,
        endDate: this.endDate ? this.datePipe.transform(this.endDate, 'yyyy-MM-dd') : null,
        gameId: this.gameId,
        msisdn: this.msisdn
      },
      sorting: {
        direction: 1,
        field: "id"
      },
      paginated: true
    };

    this.userHistoryService.apiGetPrizesByUser(requestData).subscribe((response: any) => {
        this.filteredHistory = response.body.data;
        this.groupHistoryByDate();
    });
  }

  private groupHistoryByDate(): void {
    const groupedData = this.filteredHistory.reduce((acc, history) => {
      const modifiedAtDate = history.modifiedAt ? new Date(history.modifiedAt) : new Date();
      const date = modifiedAtDate.toDateString();
      if (!acc[date]) acc[date] = { date, items: [] };
      acc[date].items.push(history);
      return acc;
    }, {} as Record<string, { date: string, items: IUserHistory[] }>);

    this.groupedHistory = Object.values(groupedData);
  }
}
