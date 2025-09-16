// NotificationComponent.ts

import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {MatLegacyTabChangeEvent as MatTabChangeEvent} from '@angular/material/legacy-tabs';
import {FormControl} from '@angular/forms';
import {MatLegacyPaginator as MatPaginator} from '@angular/material/legacy-paginator';
import {MatLegacyTableDataSource as MatTableDataSource} from '@angular/material/legacy-table';
import {MatSort} from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { AdjustersService } from 'src/app/services/adjusters.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['title', 'assignmentType', 'commRequestDate', 'status', 'description'];
  dataSource = new MatTableDataSource<any>(); // Main data source for active tab
  searchControl: FormControl = new FormControl();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  adjusterName: any;
  notification: any = null;
  dataSource1 = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  dataSource3 = new MatTableDataSource<any>();
  activeTabIndex = 0; // Track the active tab

  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('paginator3') paginator3!: MatPaginator;
  
  @ViewChild('sort1') sort1!: MatSort;
  @ViewChild('sort2') sort2!: MatSort;
  @ViewChild('sort3') sort3!: MatSort;

  constructor(public dialogRef: MatDialogRef<NotificationComponent>, private as: AdjustersService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.adjusterName = this.data.adjuster.name;
    
    // Configure filter predicate for all data sources with case-insensitive search
    const filterPredicate = (data: any, filter: string) => {
      // Check all properties to see if they contain the filter string
      const searchString = filter.trim().toLowerCase();
      return data.title?.toLowerCase().includes(searchString) || 
             data.assignmentType?.toLowerCase().includes(searchString) ||
             data.status?.toLowerCase().includes(searchString) ||
             data.description?.toLowerCase().includes(searchString);
    };
    
    // Apply filter predicate to all data sources
    this.dataSource.filterPredicate = filterPredicate;
    this.dataSource1.filterPredicate = filterPredicate;
    this.dataSource2.filterPredicate = filterPredicate;
    this.dataSource3.filterPredicate = filterPredicate;

    // Set up search control with debounce and distinct
    this.searchControl.valueChanges
        .pipe(
            startWith(''),
            debounceTime(400),
            distinctUntilChanged()
        )
        .subscribe(value => {
            const filterValue = value ? value.trim().toLowerCase() : '';
            // Apply filter to all data sources
            this.dataSource.filter = filterValue;
            this.dataSource1.filter = filterValue;
            this.dataSource2.filter = filterValue;
            this.dataSource3.filter = filterValue;
        });
        
    // Fetch data from service
    this.as.GetUserRequestDetailsByUserId(this.data.adjuster.userId).subscribe((res: any) => {
      if (res && res.data && res.data.length > 0) {
        this.notification = res.data[0];
        this.dataSource1.data = this.notification.asignRequests || [];
        this.dataSource2.data = this.notification.feedBackRequests || [];
        this.dataSource3.data = this.notification.waitingRequests || [];
        
        // Set initial dataSource based on active tab
        this.updateActiveDataSource();
      }
    }, (err: any) => {
      console.error('Error fetching notification data:', err);
    });
  }

  ngAfterViewInit(): void {
    // Set up paginators and sorts
    this.dataSource1.paginator = this.paginator1;
    this.dataSource1.sort = this.sort1;
    
    this.dataSource2.paginator = this.paginator2;
    this.dataSource2.sort = this.sort2;
    
    this.dataSource3.paginator = this.paginator3;
    this.dataSource3.sort = this.sort3;
    
    // Set main dataSource paginator and sort
    this.updateActiveDataSource();
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.activeTabIndex = tabChangeEvent.index;
    this.updateActiveDataSource();
    
    // Do not reset filter when changing tabs
    // This ensures the filter is maintained across tab changes
  }
  
  /**
   * Updates the main dataSource based on the activeTabIndex
   */
  private updateActiveDataSource(): void {
    if (!this.notification) return;
    
    switch (this.activeTabIndex) {
      case 0: // Assign tab
        this.dataSource.data = this.notification.asignRequests || [];
        this.dataSource.paginator = this.paginator1;
        this.dataSource.sort = this.sort1;
        break;
      case 1: // Feedback tab
        this.dataSource.data = this.notification.feedBackRequests || [];
        this.dataSource.paginator = this.paginator2;
        this.dataSource.sort = this.sort2;
        break;
      case 2: // Waiting tab
        this.dataSource.data = this.notification.waitingRequests || [];
        this.dataSource.paginator = this.paginator3;
        this.dataSource.sort = this.sort3;
        break;
    }
    
    // Apply current filter value to the active dataSource
    if (this.searchControl.value) {
      this.dataSource.filter = this.searchControl.value.trim().toLowerCase();
    }
    
    // Reset to first page when changing tabs
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
