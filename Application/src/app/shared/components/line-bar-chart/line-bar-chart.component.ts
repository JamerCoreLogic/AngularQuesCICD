import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-line-bar-chart',
  imports: [CommonModule],
  templateUrl: './line-bar-chart.component.html',
  styleUrl: './line-bar-chart.component.sass'
})
export class LineBarChartComponent {
  labels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // bars
  datasetA = [30, 0, 300, 200, 500, 250, 400, 220, 500];
  datasetB = [0, 50, 0, 220, 0, 260, 0, 230, 0];

  // line
  lineData = [40, 90, 50, 150, 280, 300, 350, 250, 400];

  maxY = 500;

  // dimensions
  width = 900;
  height = 500;
  margin = { top: 24, right: 50, bottom: 40, left: 50 };

  barWidth = 24;
  barGap = 10; // space between the two bars in a group

  get chartWidth() { return this.width - this.margin.left - this.margin.right; }
  get chartHeight() { return this.height - this.margin.top - this.margin.bottom; }
  get step() { return this.chartWidth / (this.labels.length - 1); }
  get chartLeft() { return this.margin.left; }
  get chartRight() { return this.width - this.margin.right; }
  get chartBottom() { return this.height - this.margin.bottom; }

  ticks = [0, 100, 200, 300, 400, 500];

  getX(i: number) {
    return this.margin.left + i * this.step; // center of each month group
  }
  getY(v: number) {
    return this.chartBottom - (v / this.maxY) * this.chartHeight;
  }

  // ✅ precompute polyline points for Angular binding
  get linePoints(): string {
    return this.lineData.map((v, i) => `${this.getX(i)},${this.getY(v)}`).join(' ');
  }
}
