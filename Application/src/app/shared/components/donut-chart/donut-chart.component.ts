import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-donut-chart',
  imports: [],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.sass'
})
export class DonutChartComponent {
  @Input() currentRole :any;

}
