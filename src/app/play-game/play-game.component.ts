import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/data/user.service";

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss']
})
export class PlayGameComponent implements OnInit {
  msisdn : number | undefined
  constructor(protected http: UserService) {
  }

  ngOnInit(): void {
    this.getUserByMsisdn('0987654321')
    console.log("Play game here")
  }

  getUserByMsisdn(msisdn: string) {
    this.http.apiGetUserByMsisdn(msisdn).subscribe((res) => {
      this.msisdn = res.body.msisdn;
    })
  }
}
