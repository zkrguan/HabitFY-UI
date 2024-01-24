import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-page-card',
  templateUrl: './home-page-card.component.html',
  styleUrls: ['./home-page-card.component.css'],
})
export class HomePageCardComponent {
  @Input() habits:any[] = [];
  @Input() dailies:any[] = [];
  @Input() title:string = '';
  @Input() button:string = '';

  onItemClick(data: any) {
    data.selected = !data.selected;
  }
}
