import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'HabitFY';
  navbar = false;

  ngOnInit() {
    Auth.currentAuthenticatedUser()
      .then(user => console.log(user))
      .catch(() => console.log('Not signed in'));
  }

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.navbar = this.router.routerState.snapshot.root.firstChild?.data['navbar'];
      }
    });
  }
}
