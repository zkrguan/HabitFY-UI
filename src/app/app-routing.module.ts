import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RegisterComponent } from './components/register/register.component';
import { RegistrationGuard } from './guards/registration.guard';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { GoalComponent } from './components/goal/goal.component';

const routes: Routes = [
  {
    path: 'login', component: LandingPageComponent,
    data: { navbar: false }
  },
  {
    path: 'register', component: RegisterComponent, canActivate: [RegistrationGuard],
    data: { navbar: true }
  },
  {
    path: 'home', component: HomePageComponent, canActivate: [RegistrationGuard],
    data: { navbar: true }
  },
  {
    path: 'goal', component: GoalComponent, canActivate: [RegistrationGuard],
    data: { navbar: true, mode: 'create' }
  },
  {
    path: 'goal/:id/:isActivated', component: GoalComponent, canActivate: [RegistrationGuard],
    data: { navbar: true, mode: 'update' }
  },
  {
    path: 'about', component: AboutPageComponent, canActivate: [RegistrationGuard],
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
