import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RegisterProfileService } from '../services/register-profile.service';

@Injectable({
  providedIn: 'root'
})
// helps to make sure user has registered a profile
// if not send it back to registration page
// check app-routing where registration guard has been implemented for the home page
export class RegistrationGuard implements CanActivate {

  constructor(private registerProfileService: RegisterProfileService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const isRegistered = await this.registerProfileService.userRegistrationStatus();
    if (!isRegistered) {
      this.router.navigate(['/register']);
      return false;
    }
    return true;
  }
}
