import { Component } from '@angular/core';
import { UserHistoryService } from '../services/data/user-history.service';
import { IUserHistory } from 'src/app/interfaces/user-history';
import { DatePipe } from '@angular/common'; 

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss'],
  providers: [DatePipe] 
})
export class UserHistoryComponent {
  filteredHistory: IUserHistory[] = [];
  groupedHistory: { date: string, items: IUserHistory[] }[] = []; 
  startDate: Date | null = null;
  endDate: Date | null = null;
  gameId = 1;
  msisdn = "0987654322";

  constructor(private userHistoryService: UserHistoryService, private datePipe: DatePipe) {}  
  
  ngOnInit(): void {
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
        direction: "",
        field: "id"
      },
      paginated: true
    };

    this.userHistoryService.apiGetPrizesByUser(requestData).subscribe((response: any) => {
      if (response.status === 200) {
        this.filteredHistory = response.body.data;
        this.groupHistoryByDate();
      }
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
