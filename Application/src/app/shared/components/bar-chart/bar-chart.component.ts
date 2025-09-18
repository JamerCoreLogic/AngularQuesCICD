import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bar-chart',
  imports: [CommonModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.sass',

})
export class BarChartComponent {
  data = [
    { label: '238220', cyan: 50, purple: 40 },
    { label: '238220', cyan: 60, purple: 30 },
    { label: '238220', cyan: 40, purple: 45 },
    { label: '238220', cyan: 35, purple: 55 },
    { label: '238220', cyan: 45, purple: 35 },
    { label: '238220', cyan: 40, purple: 50 },
    { label: '238220', cyan: 30, purple: 60 }
  ];

  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipData = { label: '', cyan: 0, purple: 0 };

  constructor() { }

  ngOnInit(): void { }

  showTooltip(event: MouseEvent, data: any) {
    this.tooltipX = event.pageX;
    this.tooltipY = event.pageY - 20;
    this.tooltipData = data;
    this.tooltipVisible = true;
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }
}

