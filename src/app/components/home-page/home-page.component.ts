import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers: [DatePipe]
})
export class HomePageComponent {
  currentDate:any='';
  constructor(private datePipe: DatePipe){}
  ngOnInit() {
    this.currentDate = this.datePipe.transform(new Date(), 'fullDate');
  }
}
