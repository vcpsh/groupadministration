import {Component} from '@angular/core';
import {BaseComponent} from '../BaseComponent';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends BaseComponent {
  // cards = [
  //   { title: 'Card 2', cols: 1, rows: 1 },
  //   { title: 'Card 3', cols: 1, rows: 2 },
  //   { title: 'Card 4', cols: 1, rows: 1 }
  // ];
}
