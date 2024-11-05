import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserHistoryComponent } from './pages/user-history/user-history.component';
import {PlayGameComponent} from "./pages/play-game/play-game.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ShareModule} from "./core/module/share.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./services/auth.interceptor";
import { LoginComponent } from './login/login.component';
import {RouterModule} from "@angular/router";
import { FormsModule } from '@angular/forms';
import {MatIconModule} from "@angular/material/icon";
import {DatePipe} from "@angular/common";
import { ModalComponent } from './modal/modal.component';
import {WheelOfFortuneModule} from "./wheel/wheel-of-fortune.module";
import { ProfileComponent } from './pages/profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    UserHistoryComponent,
    PlayGameComponent,
    LoginComponent,
    ModalComponent,
    ProfileComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    NgbModule,
    WheelOfFortuneModule,
    ShareModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi:true},
    [DatePipe]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
