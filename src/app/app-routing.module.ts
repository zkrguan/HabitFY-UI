import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ProfileSetupUpdateComponent } from './components/profile-setup-update/profile-setup-update.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login', component: LandingPageComponent,
    data: { navbar: false }
  },
  {
    path: 'profile', component:ProfileSetupUpdateComponent,
    data: { navbar: true },
    canActivate: [authGuard]
  },

  {
    path: 'home', component: HomePageComponent,
    data: { navbar: true },
    canActivate: [authGuard]
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
