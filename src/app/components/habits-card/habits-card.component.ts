import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-habits-card',
  templateUrl: './habits-card.component.html',
  styleUrls: ['./habits-card.component.css']
})
export class HabitsCardComponent {

  habits:any[] = [];

  constructor(private dataService:DataService){
    this.habits = dataService.getHabits();
  }
}
