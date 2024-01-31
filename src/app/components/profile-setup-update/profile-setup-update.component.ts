import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-setup-update',
  templateUrl: './profile-setup-update.component.html',
  styleUrls: ['./profile-setup-update.component.css']
})
export class ProfileSetupUpdateComponent {
  constructor(private router: Router) {}
  onRegister() {
    this.router.navigate(['/home']);
  }
}
