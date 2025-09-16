import Swal  from 'sweetalert2';
import { DashboardService } from './../../services/dashboard.service';
import { Component, Input, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import {SelectionModel} from '@angular/cdk/collections';
import { SeriesLabelsContentArgs,EventSeriesOptions,LegendItemClickEvent ,SeriesClickEvent,Series} from "@progress/kendo-angular-charts";
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ViewRequestComponent } from '../view-request/view-request.component';
import { NgxSpinnerService } from 'ngx-spinner';





@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit , AfterViewInit{
  @Input() data:any;
  @Input() status:any;
  @ViewChild(MatPaginator) paginator: MatPaginator|any;
  displayedColumns: string[] = ['chck','name', 'phone', 'email','date', 'location', 'distance'];
  columnsAliases: { [key: string]: string } = {
    Name: 'name',
    Phone: 'phone',
    Email: 'email',
    Date: 'date',
    Location: 'location',
    Distance: 'distance',

  };
  dataSource:any | null;
  selection = new SelectionModel<checkelement>(true, []);
  labelContent: any;
  chartOptions: any;
  legendItemName: any='Accepted'
  @Output() markedCompletedSucess = new EventEmitter<boolean>();

  constructor(private DS:DashboardService, private dialog: MatDialog, private spinner: NgxSpinnerService) {
  }


  ngOnInit(): void {
    //console.log("this.status",this.status);
    this.dataSource = new MatTableDataSource<checkelement>(this.data.acceptedRequestDetails);
    // //console.log("this.dataSource",this.dataSource);
    //console.log("this.data",this.data);


   this.labelContent=(e: SeriesLabelsContentArgs) => {
      return e.category;
    }
    this.selection.changed.subscribe(change => {
      this.handleSelectedRows();
    });

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows(event: any): void {
    if (event.checked) {
        this.selection.select(...this.dataSource.data);
    } else {
        this.selection.clear();
    }

    // Handle changes in the selected rows
    this.handleSelectedRows();
  }

  checkboxLabel(row?: checkelement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.chck + 1}`;
  }
  handleSelectedRows() {
    // Get IDs of the selected rows
    const selectedIds = this.getSelectedRowIds();
    //console.log(selectedIds); // replace this with your handling logic
  }


  getSelectedRowIds() {
    const idsArray = this.selection.selected.map(row => row.adjusterResponseId); // replace 'id' with your actual identifier key
    return idsArray.join(','); // join the ids with commas
}



  tableData: any;
  label: any;
  onSeriesClick(e: SeriesClickEvent) {
    // Assuming the label is in e.category
     this.label = e.category;
    //console.log(this.label);

    // Get the data associated with the label
    this.tableData = this.getDataForLabel(this.label);
  }

  getDataForLabel(label: string) {

  }
  onLegendItemClick(e: any) {
    //console.log(e);
    this.legendItemName = e;
    switch(e) {
      case 'Accepted':
        this.dataSource = new MatTableDataSource<checkelement>(this.data.acceptedRequestDetails);
        break;
      case 'Declined':
        this.dataSource = new MatTableDataSource<checkelement>(this.data.declinedRequestDetails);
        break;
      case 'No Response':
        this.dataSource = new MatTableDataSource<checkelement>(this.data.notRespondedRequestDetails);
        break;
      default:
        //console.log('Invalid label');
    }
  }
  markComplete(){
    // //console.log("selection selected",this.selection.selected[0].commRequestId);
    // if selection is empty then show alert
    if (this.selection.selected.length == 0) {
      Swal.fire({
        title: 'Error',
        text: 'Please select atleast one adjuster who has accepted this request.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ffa022',
      })
      return;
    }
    else{
      this.spinner.show();
      const data = this.selection.selected[0].commRequestId;
      const adjusterResponseIds = this.getSelectedRowIds();
      //console.log("adjusterResponseIds",adjusterResponseIds);

    this.DS.MarkedCompleted(data,adjusterResponseIds).subscribe((res)=>{
     if (res== true){
      this.spinner.hide();
       Swal.fire({
          title: 'Request Marked As Completed',
          text: 'Congrats, your request has been completed. Adjusters will no longer be able to respond to this request. If you still need additional resources, you can create a new request.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#ffa022',
        }).then((result) => {
          if (result.isConfirmed) {
            this.markedCompletedSucess.emit(true);
          }
        }
        )

     }
    },(error)=>{
      this.spinner.hide();
      Swal.fire({
        title: 'Error',
        text: 'Something went wrong',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ffa022',
      })
      //console.log("error",error);
    }
    )

    }


  }
  viewRequest(data: any) {
    //console.log("row data", data);
    // add one vale to data called isViewRequest
    data.isViewRequest = true;
    this.openDialog(data.adjusterResponseId);

  }
  openDialog(data: any): void {
    const dialogRef = this.dialog.open(ViewRequestComponent, {
      data: { data },
      width: '1000px',
       
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      // do something with the result if needed
    });
  }



}

export interface checkelement {
  chck: number;
  Name: string;
  Phone: number;
  Email: string;
  Date: string;
  Location:string;
  Distance:string;
  commRequestId:number;
  adjusterResponseId:number;
}




