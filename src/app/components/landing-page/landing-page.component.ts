import { Component } from '@angular/core';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  constructor() { }
  onLogin() {
    Auth.federatedSignIn();
  }
}
