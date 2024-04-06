import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  // helps to make sure user is authenticated
  // if not send user back to login page
  async canActivate(): Promise<boolean> {
    // checking if user is authenticated or not
    const isAuthenticated = await this.authService.userAuthenticationVerification();
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
