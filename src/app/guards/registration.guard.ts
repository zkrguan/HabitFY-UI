import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RegisterProfileService } from '../services/register-profile.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
// helps to make sure user has registered a profile
// if not send it back to registration page
// check app-routing where registration guard has been implemented for the home page
export class RegistrationGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    // checking if user is authenticated or not
    const isAuthenticated = await this.authService.userAuthenticationVerification();
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }
    // now checking if user has created register profile or not
    const isRegistered = await this.authService.getUserParametersFromCognito();
    if (!isRegistered) {
      this.router.navigate(['/register']);
      return false;
    }
    return true;
  }
}
