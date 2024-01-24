import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-dailies-card',
  templateUrl: './dailies-card.component.html',
  styleUrls: ['./dailies-card.component.css']
})
export class DailiesCardComponent {

  dailies:any[] = [];

  constructor(private dataService:DataService){
    this.dailies = dataService.getDailies();
  }
}
