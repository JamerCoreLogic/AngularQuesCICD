import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, } from '@angular/material/legacy-dialog';
import { FormControl } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';



export interface DialogData {
  adjuster: any;
}

@Component({
  selector: 'app-view-adjuster-info',
  templateUrl: './view-adjuster-info.component.html',
  styleUrls: ['./view-adjuster-info.component.scss']
})
export class ViewAdjusterInfoComponent implements OnInit {
  displayedColumns: string[] = ['Name','Email', 'Email Date','Response Date','Status','select'];
  viewAdjusterInfo: any[] = [];  // initialize as empty array
  filteredAdjusterInfo: any[] = [];  // filtered data
  searchControl: FormControl = new FormControl();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  paginatedAdjusterInfo: any[] = [];
  dataSource = new MatTableDataSource<any>(this.viewAdjusterInfo);
  title:any;

  constructor( private dialogRef: MatDialogRef<ViewAdjusterInfoComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit(): void {
    this.viewAdjusterInfo = this.data.adjuster;
    this.dataSource.data = this.viewAdjusterInfo;  // set the data for the dataSource
    //console.log("view adjuster",this.viewAdjusterInfo);
    this.title = this.viewAdjusterInfo[0].title;
    //console.log("title",this.title);
    this.searchControl.valueChanges.subscribe(value => this.filterData(value));
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // set the paginator after the view init
  }

  filterData(value: any) {
    if (!value) {
      this.dataSource.data = this.viewAdjusterInfo; // set filtered data to dataSource
    } else {
      if (typeof value === 'string') {
        value = value.toLowerCase();
        // Ensure case-insensitive comparison by converting both sides to lowercase
        this.dataSource.data = this.viewAdjusterInfo.filter(adjuster => 
          (adjuster.name && adjuster.name.toLowerCase().includes(value)) || 
          (adjuster.email && adjuster.email.toLowerCase().includes(value))
        );
      }
       // set filtered data to dataSource
    }
  }

//   onPageChange() {
//     if (this.paginator) {
//         const start = this.paginator.pageIndex * this.paginator.pageSize;
//         const end = start + this.paginator.pageSize;
//         this.filteredAdjusterInfo = [...(this.filteredAdjusterInfo || []).slice(start, end)];
//     }
// }
  onClose() {
    this.dialogRef.close();
  }

}
