import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayGameComponent} from "./pages/play-game/play-game.component";
import { LoginComponent} from "./login/login.component";
import { UserHistoryComponent } from './pages/user-history/user-history.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'play', component: PlayGameComponent,  canActivate: [AuthGuard] },
  {path: 'user-history/:gameId', component: UserHistoryComponent, canActivate: [AuthGuard] },
  {path: '', component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
