import { Component, Inject, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatLegacyPaginator as MatPaginator
} from '@angular/material/legacy-paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';

// IMPORTANT: import MatSort (or MatLegacySort if needed)
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-survey-sent-list',
  templateUrl: './survey-sent-list.component.html',
  styleUrls: ['./survey-sent-list.component.scss']
})
export class SurveySentListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'phone', 'emailId', 'address','submittedOn', 'distance'];
  viewAdjusterInfo: any;
  searchControl: FormControl = new FormControl();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; 

  dataSource = new MatTableDataSource<any>([]);
  title: string = '';

  constructor(
    private dialogRef: MatDialogRef<SurveySentListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.viewAdjusterInfo = this.data.element; 
    if (Array.isArray(this.viewAdjusterInfo?.expandedData)) {
      this.dataSource = new MatTableDataSource(this.viewAdjusterInfo.expandedData);
    }
    
    this.title = this.viewAdjusterInfo?.title || '';
    this.searchControl.valueChanges.subscribe(value => this.filterData(value));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filterData(value: string) {
    if (!value) {
      // Reset to all data with a new instance to avoid reference issues
      this.dataSource.data = [...this.viewAdjusterInfo.expandedData];
    } else {
      const lowerValue = value.toLowerCase();
      // Create a new filtered array instead of modifying the existing one
      const filteredData = this.viewAdjusterInfo.expandedData.filter((adjuster: any) =>
        (adjuster.name?.toLowerCase() || '').includes(lowerValue) ||
        (adjuster.emailId?.toLowerCase() || '').includes(lowerValue) ||
        (adjuster.phone || '').includes(lowerValue)
      );
      this.dataSource.data = filteredData;
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
