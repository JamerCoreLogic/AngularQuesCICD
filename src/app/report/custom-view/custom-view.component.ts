import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { MatLegacyTable as MatTable, MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';

import { NgxSpinnerService } from 'ngx-spinner';
import {BehaviorSubject, catchError, startWith, switchMap,of as observableOf, of , map, finalize, Observable, skip } from 'rxjs';
import { Router } from '@angular/router';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';

import { FormControl } from '@angular/forms';

import { DatePipe } from '@angular/common';
import { FiledsListModel, ReportsElement } from 'src/app/models/user-models';
import { AuthService } from 'src/app/services/auth.service';
import { ReportsService } from 'src/app/services/reports.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

interface TransformedItem {
  [key: string]: any;
}
interface ReportResponse {
  data: {
    getUserListForReqDashboard: UserReport[];
    count: number;
  };
  success: boolean;
  message: string | null;
  errorCode: string | null;
}
interface UserReport {
  [key: string]: any; // Allows for any property name with a value of any type
}

@Component({
  selector: 'app-custom-view',
  templateUrl: './custom-view.component.html',
  styleUrls: ['./custom-view.component.scss']
})
export class CustomViewComponent implements OnInit, AfterViewInit {
  users: ReportsElement[] = []
  displayedColumns: string[] = ['name', 'city', 'state','zip', 'emailAddress', 'mobile','what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned', 'commercial_Property_Field', 'residential_Property_Field'];
  allColumns: string[] =[];
  dataSource = new MatTableDataSource<ReportsElement>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  selection = new SelectionModel<ReportsElement>(true, []);
  @ViewChild(MatSort)sort: MatSort = new MatSort;
  @ViewChild('table') table!: MatTable<any>;
  userRoles: any;
  userTypes: any;
  filterBy: string="";
  searchString: string="";
  pageSize=10;
  FiledsList!:FiledsListModel[]
  originalUserData$ = new BehaviorSubject<any[]>([]); 
  originalUserDataForCount:any[]=[]
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  isFilterApplied: boolean = false;
  loggedUserTypeCheck = Number((localStorage.getItem('LoggedUserType')));
  loggedUserRoleCheck = Number((localStorage.getItem('LoggedUserRole')));
  totalData: any;
  filterValueSql: string=''
  operator: any;
  customViews: any[] = [];
  searchTerm: string = '';
  isCreatingView: boolean = false;
  selectedCustomView: any = this.customViews[0];

  // Add missing properties for linter errors
  displayedFieldsList: any[] = [];
  shouldFetchData = true;
  sortField: string = '';
  sortOrder: string = '';
  public dateRange: {
    start: Date | null,
    end: Date | null
  } = {
    start: null,
    end: null
  };
  companyNameFilter: any;
  surveyTitleFilter: any;
  surveyNameFilter: any;

  // Add this flag to track API calls
  private isDataLoading = false;

  constructor(public dialog: MatDialog, private authService: AuthService, private SpinnerService: NgxSpinnerService,
    private router: Router , private cdr:ChangeDetectorRef , private reportsService:ReportsService, private datePipe:DatePipe) {

    localStorage.removeItem('editUser');

    var obj = this.authService.isUserAllowed(window.location)
    if (this.loggedUserTypeCheck=== 1) {
    }
    else {
      this.router.navigate([obj.allowedPath]);
    }

  }
 

  ngOnInit(): void {
    this.GetFiledsList();
    this.getCustomViews();

  }

  ngAfterViewInit(): void {
    this.setupPaginator();
    // Connect dataSource to MatSort
    this.dataSource.sort = this.sort;
  }


  GetFiledsList() {
    // Show spinner
    this.SpinnerService.show();
  
    this.reportsService.GetFiledsListForReports()
    .pipe(finalize(() => this.SpinnerService.hide())) 
      .subscribe(
        (res) => {
          if (!res.data) {
            this.SpinnerService.hide(); // Hide spinner on empty data
            return;
          }
    
          this.FiledsList = res.data;
          this.displayedFieldsList = this.FiledsList.filter(col => 
            !['companyName', 'claims_Received', 'Title', 'SurveyName'].includes(col.keyName)
          );
    
          this.allColumns = this.FiledsList.map(col => col.keyName);
          this.displayedFieldsList.sort((a, b) => (a.keyValue! < b.keyValue! ? -1 : 1));
          this.FiledsList.sort((a, b) => (a.keyValue! < b.keyValue! ? -1 : 1));
          
        
        },
        (error) => {
          //console.error("Error fetching fields list:", error);
          // Hide spinner on error
          this.SpinnerService.hide();
        }
      );
  }

  getCustomViews() {
    this.SpinnerService.show();
    this.reportsService.GetCustomViewList().subscribe(res => {
      this.customViews = res.data || [];
      this.selectedCustomView =  null;
      this.loadInitialData();
    }, () => {
      this.loadInitialData();
    });
  }
  loadInitialData() {
    if (this.selectedCustomView) {
      this.applyView(this.selectedCustomView);
    } else {
      this.loadDefaultData();
    }
  }

  
  /**
   * Load default data when no custom views are available
   */
  loadDefaultData() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    
    // If already loading, skip
    if (this.isDataLoading) {
      return;
    }
    
    // Set flag to prevent duplicate calls
    this.isDataLoading = true;

    this.filterBy = '';
    this.searchString = '';
    this.filterValueSql = '';
    this.dateRange = { start: null, end: null };
    this.companyNameFilter = '';
    this.surveyNameFilter = '';
    this.surveyTitleFilter = '';
    this.operator = 'AND';
    this.sortField = '';
    this.sortOrder = '';
    
    const payload = {
      pageNumber: 1,
      numberOfRecords: this.paginator ? this.paginator.pageSize : 10,
      searchKey: '',
      searchValue: '',
      filterValue: '',
      startDate: null as Date | null,
      endDate: null as Date | null,
      companyNameFilter: '',
      surveyNameFilter: '',
      surveyTitleFilter: '',
      Operator: 'AND',
      sortField: this.sortField,
      sortOrder: this.sortOrder
    };
    
    this.SpinnerService.show();
    this.getTableDataReports$(payload)
      .subscribe(
        (userData: any) => {
          // Reset the loading flag
          this.isDataLoading = false;
          
          if (userData.data && userData.data.getUserListForReqDashboard) {
            this.dataSource.data = userData.data.getUserListForReqDashboard;
            this.totalData = userData.data.count;
              // this.displayedColumns = ['name', 'city', 'state','zip', 'emailAddress', 'mobile','what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned', 'commercial_Property_Field', 'residential_Property_Field'];
            this.displayedColumns = this.allColumns;
            
            // Reconnect the sort after data is loaded
            this.dataSource.sort = this.sort;
            
            // Update paginator properly
            if (this.paginator) {
              this.paginator._changePageSize(this.paginator.pageSize);
            }
            
            this.cdr.detectChanges();
          }
          this.SpinnerService.hide();
        },
        (error) => {
          console.error('Error loading default data:', error);
          this.isDataLoading = false;
          this.SpinnerService.hide();
        }
      );
  }

getHeaderDisplay(keyName: string): string {
  if (this.FiledsList && Array.isArray(this.FiledsList)) {
    const field = this.FiledsList.find(f => f.keyName === keyName);
    return field ? field.keyValue : keyName;
  }
  return keyName;
}
formatField(value: any, fieldName: string): any {
  if (fieldName === 'approximate_Date_I_Began_Adjusting' || fieldName === 'lastLogin' || fieldName === 'modifiedOn' ) { // replace 'dateField' with your actual date field name
    return this.datePipe.transform(value, 'MM/dd/yyyy'); // format as you need
  }
  return value;
}



filterBasedOn(event: any) {
  let value = event.target.value;
  // Set filterBy based on the selected value
  this.filterBy = this.allColumns.includes(value) ? value : '';
  this.searchString = '';
  // Pass the original event to applyFilter
}

sortData(sort: Sort) {
  // console.log("sort", sort);
  this.sortField = sort.active;
  this.sortOrder = sort.direction;
  this.paginator.pageIndex = 0;
  
  // For client-side sorting, we would let MatTableDataSource handle it
  // But if we're using server-side sorting:
  const payload = {
    pageNumber: this.paginator.pageIndex + 1, 
    numberOfRecords: this.paginator.pageSize,
    searchKey: this.filterBy,
    searchValue: this.searchString,
    filterValue: this.filterValueSql,
    startDate: this.dateRange.start,
    endDate: this.dateRange.end,
    companyNameFilter: this.companyNameFilter || '',
    surveyNameFilter: this.surveyNameFilter || '',
    surveyTitleFilter: this.surveyTitleFilter || '',
    Operator: this.operator || 'AND',
    sortField: this.sortField,
    sortOrder: this.sortOrder
  };
  
  this.fetchData(payload);
}

applyView(view: any) {
  this.selectedCustomView = view;
  this.displayedColumns = view.columns.map((col: any) => col.keyName);
  // console.log("view",JSON.parse(view.filter || '{}'))

  const filterInfo = JSON.parse(view.filter || '{}');


  

  this.filterBy = filterInfo.searchKey || '';
  this.searchString = filterInfo.searchValue || '';
  this.sortField = filterInfo.sortField || '';
  this.sortOrder = filterInfo.sortOrder || '';
  this.dateRange = filterInfo.dateFilter || { start: null, end: null };
  this.companyNameFilter = filterInfo.companyName || '';
  this.surveyNameFilter = filterInfo.surveyName || '';
  this.surveyTitleFilter = filterInfo.surveyTitle || '';
  this.operator = filterInfo.operator || 'AND';
  this.filterValueSql = filterInfo.sqlQuery || '';

  const payload = {
    pageNumber: 1,
    numberOfRecords: this.paginator.pageSize,
    searchKey: this.filterBy,
    searchValue: this.searchString,
    filterValue: filterInfo.sqlQuery || '',
    startDate: this.dateRange.start,
    endDate: this.dateRange.end,
    companyNameFilter: filterInfo.companyName || '',
    surveyNameFilter: filterInfo.surveyName || '',
    surveyTitleFilter: filterInfo.surveyTitle || '',
    Operator: filterInfo.operator || 'AND',
    sortField: this.sortField,
    sortOrder: this.sortOrder
  };

  this.fetchData(payload);
}


updateFilterData(filterSqlString: any) {
  ////console.log("filterSqlString",filterSqlString)
  this.filterValueSql=filterSqlString
  // this.applyFilter()
}
getDateforFilter(date:any){
  ////console.log("daye in admin",date)
  this.dateRange=date
  ////console.log("date",this.dateRange)
}
getCompanyName(data:any){
  
  this.companyNameFilter=data
}
getSurveyTitle(data:any){
  this.surveyTitleFilter=data
}

getSurveyName(data:any){
  this.surveyNameFilter=data
}

getOperator(data:any){
  //console.log("operator",data)
  this.operator=data
}

resetSearchvalueinReports(data:any){
  this.searchString=data
  this.filterBy="All"
}

// Step 2: Adjust downloadExcel to use the modified getAllDataForDownload



  navigateToCustomView(){
    this.router.navigate(['/main/report/custom-view']);
  }
  goBack(){
    this.router.navigate(['/main/report']);
  }

filterCustomViews(): any[] {
  if (!this.searchTerm) {
    return this.customViews;
  }
  return this.customViews.filter(view => 
    view.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}

selectCustomView(view: any): void {
  // Reset paginator to first page when selecting a new view
  if (this.paginator) {
    this.paginator.pageIndex = 0;
  }
  
  this.selectedCustomView = view;
  this.applyView(view);
}

createNewCustomView(): void {
  // Store current filter state in localStorage if needed
  if (this.filterValueSql) {
    localStorage.setItem('filterStateReports', JSON.stringify({
      logic: "and",
      filters: []
    }));
  }
  
  // Navigate to view-editor
  this.router.navigate(['/main/report/view-editor']);
}



deleteCustomView(view: any, event: Event): void {
  event.stopPropagation();
  // show confirm box
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ffa022',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
  // Show spinner
  this.SpinnerService.show();
  this.customViews = []
  // Call API to create the duplicated view
  this.reportsService.DeleteCustomView(view.customViewId).subscribe(
    (response: any) => {
      //console.log('View deleted successfully', response);
      if(response.success){
      this.SpinnerService.hide();
      Swal.fire({
        title: 'Success',
        text: 'View deleted successfully',
        icon: 'success',
        confirmButtonColor: '#ffa022',
      }).then(() => {
        // Refresh the list of views
        this.getCustomViews();
        // refresh the table data
        // this.loadDefaultData();
      });
      }
      else{
        this.SpinnerService.hide();
        Swal.fire({
          title: 'Error',
          text: 'View not deleted',
          icon: 'error'
        })
      }
    },
    (error: any) => {
      //console.error('Error duplicating view', error);
      this.SpinnerService.hide();
    }
  );
  }
  });
}

/**
 * Get the current user ID from local storage
 */
getCurrentUserId(): number {
  try {
    const userInfo = localStorage.getItem('loginInfoFPD');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      return parsedUser.userId || 0;
    }
  } catch (e) {
    //console.error('Error getting current user ID:', e);
  }
  return 0;
}

editCustomView(view: any, event: Event): void {
  event.stopPropagation();
  //console.log("view for edit",view)
// navigate to view editor with param id
this.router.navigate(['/main/report/view-editor'],{queryParams:{id:view.customViewId}})
}

// Add missing method reference
getTableDataReports$(data: any) {
  return this.reportsService.GetRequestedListForReportDashboard(data);
}

setupPaginator() {
  // console.log("setupPaginator")
  debugger
  this.paginator.page.pipe(
    skip(1),
    switchMap(() => {
      const payload = {
        pageNumber: this.paginator.pageIndex + 1,
        numberOfRecords: this.paginator.pageSize,
        searchKey: this.filterBy || '',
        searchValue: this.searchString || '',
        filterValue: this.filterValueSql || '',
        startDate: this.dateRange.start,
        endDate: this.dateRange.end,
        companyNameFilter: this.companyNameFilter || '',
        surveyNameFilter: this.surveyNameFilter || '',
        surveyTitleFilter: this.surveyTitleFilter || '',
        Operator: this.operator || 'AND',
        sortField: this.sortField,
        sortOrder: this.sortOrder
      };
      // console.log("payload for pagination",payload)
      this.fetchData(payload);
      return observableOf(null);
    })
  ).subscribe();
}


viewOnlyMode(view: any, event: Event): void {
  event.stopPropagation();
  //console.log("view for edit",view)
// navigate to view editor with param id
this.router.navigate(['/main/report/view-editor'],{queryParams:{id:view.customViewId,viewOnly:true}})
}

fetchData(payload: any) {
  if (this.isDataLoading) return;

  this.isDataLoading = true;
  this.SpinnerService.show();

  this.reportsService.GetRequestedListForReportDashboard(payload)
    .subscribe((userData:any) => {
      this.dataSource.data = userData.data.getUserListForReqDashboard || [];
      this.totalData = userData.data.count || 0;
      
      // Reconnect the sort after data is loaded
      this.dataSource.sort = this.sort;
      
      this.cdr.detectChanges();
      
      // Add a small delay to ensure UI rendering completes before hiding the spinner
      setTimeout(() => {
        this.isDataLoading = false;
        this.SpinnerService.hide();
      }, 300);
    }, err => {
      console.error(err);
      // Make sure to hide spinner on error as well
      this.isDataLoading = false;
      this.SpinnerService.hide();
    });
}

downloadCustomView(){
  // download the data in excel format
  const payload = {
    pageNumber: this.paginator.pageIndex + 1,
    numberOfRecords: this.totalData, 
    searchKey: this.filterBy || '',
    searchValue: this.searchString || '',
    filterValue: this.filterValueSql || '',
    startDate: this.dateRange.start,
    endDate: this.dateRange.end,
    companyNameFilter: this.companyNameFilter || '',
    surveyNameFilter: this.surveyNameFilter || '',
    surveyTitleFilter: this.surveyTitleFilter || '',
    Operator: this.operator || 'AND',
    sortField: this.sortField,
    sortOrder: this.sortOrder
  };
  // console.log("payload for pagination",payload)
  this.getTableDataReports$(payload).subscribe((data:any) => {
    // console.log("data",data)
    const workbook = XLSX.utils.book_new();
    const records = data?.data?.getUserListForReqDashboard || [];
    const worksheet = XLSX.utils.json_to_sheet(records); 
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'CustomView.xlsx');
  })

 
}

getAllDataForDownload(): Observable<TransformedItem[]> {
  this.SpinnerService.show();
  let payload = {
    pageNumber: this.paginator.pageIndex + 1,
    numberOfRecords: this.totalData, 
    searchKey: this.filterBy || '',
    searchValue: this.searchString || '',
    filterValue: this.filterValueSql || '',
    startDate: this.dateRange.start,
    endDate: this.dateRange.end,
    companyNameFilter: this.companyNameFilter || '',
    surveyNameFilter: this.surveyNameFilter || '',
    surveyTitleFilter: this.surveyTitleFilter || '',
    Operator: this.operator || 'AND',
    sortField: this.sortField,
    sortOrder: this.sortOrder
  };

  return this.getTableDataReports$(payload)
  .pipe(
    map((response: any) => response as ReportResponse), // Type assertion here
    map((response: ReportResponse) => {
      this.SpinnerService.hide();
      return response.data.getUserListForReqDashboard.map(item => {
        const transformedItem: TransformedItem = {};
        this.displayedColumns.forEach(col => {
          const field = this.FiledsList.find(f => f.keyName === col);
          const header = field ? field.keyValue : col;
          transformedItem[header] = item[col];
        });
        return transformedItem;
      });
    }),
    catchError(error => {
      console.error('Error fetching data for download:', error);
      this.SpinnerService.hide();
      return of([]);
    })
  );
}
// Step 2: Adjust downloadExcel to use the modified getAllDataForDownload
downloadExcel() {
  this.shouldFetchData = false;
  this.getAllDataForDownload().subscribe(transformedData => {
    // Your existing Excel generation logic, now inside the subscription
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    // The rest of your logic...
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'Filtered_Records_'+ (this.selectedCustomView?.name || '') +'.xlsx');
    // Using writeFile for simplicity
    this.shouldFetchData = true;
  });
}

}


