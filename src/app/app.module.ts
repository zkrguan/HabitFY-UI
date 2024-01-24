import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeUserProfileComponent } from './components/home-user-profile/home-user-profile.component';
import { HomePageCardComponent } from './components/home-page-card/home-page-card.component';
import { HabitsCardComponent } from './components/habits-card/habits-card.component';
import { DailiesCardComponent } from './components/dailies-card/dailies-card.component';
import { LoginComponent } from './components/login/login.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeUserProfileComponent,
    HomePageCardComponent,
    HabitsCardComponent,
    DailiesCardComponent,
    LoginComponent,
    HomePageComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
