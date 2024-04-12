import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RegisterComponent } from './components/register/register.component';
import { RegistrationGuard } from './guards/registration.guard';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { GoalComponent } from './components/goal/goal.component';
import { AuthenticationGuard } from './guards/authentication.guard';

const routes: Routes = [
  {
    path: 'login', component: LandingPageComponent,
    data: { navbar: false }
  },
  {
    path: 'register', component: RegisterComponent, canActivate: [AuthenticationGuard],
    data: { navbar: true }
  },
  {
    path: 'home', component: HomePageComponent, canActivate: [AuthenticationGuard, RegistrationGuard],
    data: { navbar: true }
  },
  {
    path: 'goal', component: GoalComponent, canActivate: [AuthenticationGuard, RegistrationGuard],
    data: { navbar: true, mode: 'create' }
  },
  {
    path: 'goal/:id/:isActivated', component: GoalComponent, canActivate: [AuthenticationGuard, RegistrationGuard],
    data: { navbar: true, mode: 'update' }
  },
  {
    path: 'about', component: AboutPageComponent, canActivate: [AuthenticationGuard, RegistrationGuard],
    data: { navbar: true }
  },
  {
    path: '', redirectTo: '/login', pathMatch: 'full',
    data: { navbar: false }
  },
  {
    path: '**', redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
