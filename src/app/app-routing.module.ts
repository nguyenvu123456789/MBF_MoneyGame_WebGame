import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PlayGameComponent} from "./play-game/play-game.component";
import {LoginComponent} from "./login/login.component";
import { UserHistoryComponent } from './user-history/user-history.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'play', component: PlayGameComponent},
  {path: 'user-history', component: UserHistoryComponent},
  {path: '', component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
