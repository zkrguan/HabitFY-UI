import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent,
    data: { navbar: false }
  },
  {
    path: 'register', component: RegisterComponent,
    data: { navbar: false }
  },

  {
    path: 'home', component: HomePageComponent,
    data: { navbar: true }
  },
  {
    path: '', redirectTo: '/login', pathMatch: 'full',
    data: { navbar: false }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
