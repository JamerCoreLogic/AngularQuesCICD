import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { SeriesLabelsContentArgs,EventSeriesOptions,LegendItemClickEvent ,SeriesClickEvent,Series} from "@progress/kendo-angular-charts";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  @Input() data:any;
  @Output() legendItemNameOutput = new EventEmitter<string>();
  labelContent: any;
  chartOptions: any;
  data2: any;
  legendItemName: any='Accepted'

  constructor() { }

  ngOnInit(): void {
    try {
      // Add null/undefined check for this.data
      if (!this.data) {
        this.data = {
          submitted: 0,
          notResponded: 0,
          totelSent: 0
        };
      }
      
      this.data2 = [
        {
          Status: "Submitted",
          Count: ((this.data.submitted/this.data.totelSent)*100).toFixed(2),
          color:"rgb(120, 210, 55)"
        },
        {
          Status: "No Response",
          Count: ((this.data.notResponded/this.data.totelSent)*100).toFixed(2),
          color:"rgb(255, 210, 70)"
        }
      ];

      this.labelContent=(e: SeriesLabelsContentArgs) => {
        if (e.percentage === 0) {
          return "";
        }
        return e.category;
      }
    } catch (error) {
      console.error('Error initializing graph component:', error);
      // Set a default empty state
      this.data2 = [
        { Status: "Submitted", Count: "0.00", color:"rgb(120, 210, 55)" },
        { Status: "No Response", Count: "0.00", color:"rgb(255, 210, 70)" }
      ];
    }
  }
  tableData: any;

  onSeriesClick(e: SeriesClickEvent) {
    try {
      // Safely access the category
      const label = e ? e.category : '';
      
      // Get the data associated with the label
      this.tableData = this.getDataForLabel(label);
    } catch (error) {
      console.error('Error in onSeriesClick:', error);
    }
  }

  getDataForLabel(label: string) {
    // Implementation to be added if needed
  }
  
  onLegendItemClick(e: LegendItemClickEvent) {
    try {
      // Only update and emit if e.text exists
      if (e && e.text !== undefined) {
        this.legendItemName = e.text;
        this.legendItemNameOutput.emit(this.legendItemName);
      }
      
      // Safely call preventDefault if it exists
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
    } catch (error) {
      console.error('Error in onLegendItemClick:', error);
    }
  }
}
