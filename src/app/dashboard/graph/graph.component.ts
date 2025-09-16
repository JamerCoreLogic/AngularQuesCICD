import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SeriesLabelsContentArgs, EventSeriesOptions, LegendItemClickEvent, SeriesClickEvent, Series } from "@progress/kendo-angular-charts";

interface GraphData {
  Status: string;
  Count: number;
  color: string;
}

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  @Input() data: any;
  @Output() legendItemNameOutput = new EventEmitter<string>();
  labelContent: any;
  chartOptions: any;
  data2: GraphData[] = [];
  legendItemName: string = 'Accepted';
  tableData: any;

  constructor() { }

  ngOnInit(): void {
    this.initializeChartData();
  }

  private initializeChartData(): void {
    const defaultData = {
      acceptedPercent: 0,
      declinedPercent: 0,
      notRespondedPercent: 0
    };

    const graphPercentage = this.data?.graphPercentage || defaultData;

    this.data2 = [
      {
        Status: "Accepted",
        Count: graphPercentage.acceptedPercent ?? 0,
        color: "rgb(120, 210, 55)"
      },
      {
        Status: "Declined",
        Count: graphPercentage.declinedPercent ?? 0,
        color: "rgb(255, 0, 0)"
      },
      {
        Status: "No Response",
        Count: graphPercentage.notRespondedPercent ?? 0,
        color: "rgb(255, 210, 70)"
      }
    ];

    this.labelContent = (e: SeriesLabelsContentArgs) => {
      if (e.percentage === 0) {
        return "";
      }
      return e.category;
    }
  }

  onSeriesClick(e: SeriesClickEvent) {
    const label = e.category;
    this.tableData = this.getDataForLabel(label);
  }

  getDataForLabel(label: string) {
    return this.data2.find(item => item.Status === label) || null;
  }

  onLegendItemClick(e: LegendItemClickEvent) {
    this.legendItemName = e.text;
    this.legendItemNameOutput.emit(this.legendItemName);
    e.preventDefault();
  }
}
