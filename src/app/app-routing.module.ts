import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RegisterComponent } from './components/register/register.component';
import { RegistrationGuard } from './guards/registration.guard';

const routes: Routes = [
  {
    path: 'login', component: LandingPageComponent,
    data: { navbar: false }
  },
  {
    path: 'register', component:RegisterComponent,
    data: { navbar: true }
  },

  {
    path: 'home', component: HomePageComponent, canActivate: [RegistrationGuard],
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
