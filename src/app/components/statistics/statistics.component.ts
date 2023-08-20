import { Component, Input } from '@angular/core';
import { Statistics } from "../../interfaces/statistics";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {

  @Input() statistics: Statistics;

}
