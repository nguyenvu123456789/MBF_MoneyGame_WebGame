import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/data/user.service";
import {GameHistoryService} from "../services/data/game-history.service";
import {IReceivedPrize} from "../interfaces/received-prizes";
import {IResponsePage} from "../interfaces/response-page";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";
import {Router} from "@angular/router";
import {TaskLoginService} from "../services/data/task-login.service";
import {AuthService} from "../services/data/auth.service";
import {ModalComponent} from "../modal/modal.component";
import {DomSanitizer} from "@angular/platform-browser";
import {AppComponent} from "../app.component";
import {IGame} from "../interfaces/game";
import {GameService} from "../services/data/game.service";

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss']
})
export class PlayGameComponent implements OnInit {
  msisdn !: string
  username: string | undefined
  id!: number
  receivedPrizes: any[] = [];
  remainingPlays: number | undefined;
  checkedIn!: boolean ;
  game!: IGame;
  constructor(protected gameHistoryService: GameHistoryService,
              protected modalService: NgbModal,
              protected datePipe: DatePipe,
              protected router: Router,
              protected taskLoginService:TaskLoginService,
              protected authService: AuthService,
              protected gameService: GameService,
              protected appComponent:AppComponent) {
  }

  ngOnInit(): void {
    const userLoggedIn = this.authService.getUserInfo();
    this.getUserInfo(userLoggedIn.msisdn);
    this.getGame();
  }

  getGame(){
    this.gameService.getActiveGame().subscribe((res)=>{
      this.game = res.body;
    })
  }

  getUserInfo(msisdn: string) {
    this.gameHistoryService.apiGetUserInfo(msisdn).subscribe((res) => {
      this.msisdn = res.body.msisdn;
      this.username = res.body.username;
      this.remainingPlays = res.body.remainingPlays;
      this.id = res.body.id;
      this.checkedIn = res.body.checkedIn;
    })
  }

  viewReceivedPrizes(modal:any) {
    if(!this.msisdn) {
      console.log("MSISDN is null")
      return;}
    this.gameHistoryService.apiGetReceivedPrizes(this.msisdn).subscribe((res) => {
        if(res.error){
          this.appComponent.showAlert('danger', res.error)
          return ;
        }
      this.receivedPrizes = res.body.content.map(item =>{
        return {
          ...item,
          receivedTime: this.datePipe.transform(new Date(item.receivedTime), 'HH:mm dd/MM/yyyy' )
        }
      });

      this.modalService.open(modal, {size: 'lg'});
    },
      (error)=>{
        this.appComponent.showAlert('danger', error)
    })
  }

  viewHistory() {
    this.router.navigate(['user-history'])
  }

  doTaskLogin() {
    this.taskLoginService.doTaskLogin(this.id).subscribe((res) => {
      if(res.error===null){
        this.openCheckInModal();
        this.getUserInfo(this.msisdn);
      }
    })
  }

  openCheckInModal(){
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.title = 'Chúc mừng';
    modalRef.componentInstance.message = 'Bạn đã nhận được <span class="spin-count">01</span> lượt quay';
    modalRef.componentInstance.icon = 'check_circle';
  }
}
