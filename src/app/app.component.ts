import { Component } from '@angular/core';
interface Alert {
  type: string;
  message: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  alert: Alert | undefined;
  title = 'enduser-fe';

  showAlert(type:string, message: string){
    this.alert = {type, message};
    setTimeout(()=> this.alert = undefined, 10000);
  }
}
