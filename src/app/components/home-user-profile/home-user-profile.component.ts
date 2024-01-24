import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home-user-profile',
  templateUrl: './home-user-profile.component.html',
  styleUrls: ['./home-user-profile.component.css']
})
export class HomeUserProfileComponent {
  
  quotes:any[] = [];

  currentQuote:any = {};

  progress:any[] = [];

  mainGoals:any[] = [];

  constructor(private dataService:DataService) {
    this.quotes = this.dataService.getQuotes();
    this.progress = this.dataService.getProgress();
    this.mainGoals = this.dataService.getMainGoals();
    this.toChangeMotivation();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.progress.forEach(progress => progress.load = true);
    }, 500);
  }

  toChangeMotivation() {
    const index = Math.floor(Math.random() * this.quotes.length);
    this.currentQuote = this.quotes[index];
  }
}
