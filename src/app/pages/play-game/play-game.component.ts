import { Component, OnInit } from '@angular/core';
import { GameHistoryService } from '../../services/data/game-history.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TaskLoginService } from '../../services/data/task-login.service';
import { AuthService } from '../../services/data/auth.service';
import { ModalComponent } from '../../modal/modal.component';
import { AppComponent } from '../../app.component';
import { IGame, IPrize } from '../../interfaces/game';
import { GameService } from '../../services/data/game.service';
import { Sector } from '../../wheel/sector.model';
import { PrizeService } from "../../services/data/prize.service";

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss'],
})
export class PlayGameComponent implements OnInit {
  msisdn!: string;
  username: string | undefined;
  id!: number;
  receivedPrizes: any[] = [];
  remainingPlays: number | undefined;
  checkedIn!: boolean;
  game!: IGame;
  sector: Sector[] = [];
  audioUrl: string = '';
  prize: IPrize | undefined;

  constructor(
    protected gameHistoryService: GameHistoryService,
    protected modalService: NgbModal,
    protected datePipe: DatePipe,
    protected router: Router,
    protected taskLoginService: TaskLoginService,
    protected authService: AuthService,
    protected gameService: GameService,
    protected prizeService: PrizeService,
    protected appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    const userLoggedIn = this.authService.getUserInfo();
    this.getUserInfo(userLoggedIn.msisdn);
    this.getGame();
  }

  getGame() {
    this.gameService.getActiveGame().subscribe((res) => {
      this.game = res.body;
      this.audioUrl = 'http://localhost:8080/Game/GetAudioFile?audioUrl=' + res.body.audioUrl;
      const prizes = res.body.prizes;
      this.sector = prizes.map((prize) => ({
        id: prize.id.toString(),
        color: prize.colorCode,
        label: prize.prizeName,
        url: 'assets/images/prizes/'+prize.image,
      }));
      console.log(this.sector);
    });
  }

  getUserInfo(msisdn: string) {
    this.gameHistoryService.apiGetUserInfo(msisdn).subscribe((res) => {
      this.msisdn = res.body.msisdn;
      this.username = res.body.username;
      this.remainingPlays = res.body.remainingPlays;
      this.id = res.body.id;
      this.checkedIn = res.body.checkedIn;
    });
  }

  viewReceivedPrizes() {
    if (!this.msisdn) {
      console.log('MSISDN is null');
      return;
    }
    this.gameHistoryService.apiGetReceivedPrizes(this.msisdn).subscribe(
      (res) => {
        if (res.error) {
          this.appComponent.showAlert('danger', res.error);
          return;
        }
        this.receivedPrizes = res.body.content.map((item) => {
          return {
            ...item,
            receivedTime: this.datePipe.transform(
              new Date(item.receivedTime),
              'HH:mm dd/MM/yyyy'
            ),
          };
        });

        const modalRef = this.modalService.open(ModalComponent, { animation: false });
        modalRef.componentInstance.title = 'Quà đã nhận';
        modalRef.componentInstance.items = this.receivedPrizes;
      },
      (error) => {
        this.appComponent.showAlert('danger', error);
      }
    );
  }

  viewHistory() {
    this.router.navigate(['user-history/' + this.game.id + '/'+this.msisdn]);
  }

  doTaskLogin() {
    this.taskLoginService.doTaskLogin(this.id).subscribe((res) => {
      if (res.error === null) {
        this.openCheckInModal();
        this.getUserInfo(this.msisdn);
      }
    });
  }

  openCheckInModal() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.title = 'Chúc mừng';
    modalRef.componentInstance.message = 'Bạn đã nhận được <span class="spin-count">01</span> lượt quay';
    modalRef.componentInstance.icon = 'check_circle';
  }

  spinFinished(result: any) {
    if (result === 0) {
      const modalRef = this.modalService.open(ModalComponent);
      modalRef.componentInstance.title = 'Thông báo';
      modalRef.componentInstance.icon = 'error_outline';
      modalRef.componentInstance.message = 'Chúc bạn may mắn lần sau !!!';
    } else {
      this.prizeService.apiGetPrizeById(result).subscribe((res) => {
        this.prize = res.body;
        const modalRef = this.modalService.open(ModalComponent);
        modalRef.componentInstance.title = 'Chúc mừng';
        modalRef.componentInstance.image = this.prize?.image;
        modalRef.componentInstance.message= this.prize.prizeName;
      });
    }
  }

  spinClick() {
    const userLoggedIn = this.authService.getUserInfo();
    this.getUserInfo(userLoggedIn.msisdn);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
