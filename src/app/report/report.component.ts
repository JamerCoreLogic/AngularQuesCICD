import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { MatLegacyTable as MatTable, MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { AuthService } from '../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {BehaviorSubject, catchError, startWith, switchMap,of as observableOf, of , map, finalize, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { FiledsListModel, ReportsElement } from '../models/user-models';
import * as XLSX from 'xlsx';
import { FormControl } from '@angular/forms';
import { ReportsService } from '../services/reports.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
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
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, AfterViewInit {
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
  totalData: any;
  filterValueSql: string=''
  operator: any;
   getTableDataReports$(data:any) {
        return this.reportsService.GetRequestedListForReportDashboard(data)
    }
    public dateRange: {
      start: Date | null,
      end: Date | null
    } = {
      start: null,
      end: null
    };
    companyNameFilter:any;
    surveyTitleFilter:any;
    surveyNameFilter:any;
    displayedFieldsList: any[] = [];
    shouldFetchData = true;
    sortField: string = '';
    sortOrder: string = '';


  constructor(public dialog: MatDialog, private authService: AuthService, private SpinnerService: NgxSpinnerService,
    private router: Router , private cdr:ChangeDetectorRef , private reportsService:ReportsService, private datePipe:DatePipe) {

    localStorage.removeItem('editUser');

    var obj = this.authService.isUserAllowed(window.location)
    // console.log("is user allowed",obj)
    if (this.loggedUserTypeCheck=== 1) {
    }
    else {
      this.router.navigate([obj.allowedPath]);
    }

    // this.getUsers();
  }
  ngOnInit() {
    this.toppings.valueChanges.subscribe((selectedOptions: string[] | null) => {
      // Check if selectedOptions is not null
      if (selectedOptions) {
        // Prevent removing all columns
        if (selectedOptions.length === 0) {
          // Keep the last selected column
          const lastSelectedColumns = this.displayedColumns[0];
          this.toppings.setValue([lastSelectedColumns], { emitEvent: false });
          // Show message to user
          Swal.fire({
            title: 'Warning',
            text: 'At least one column must remain selected',
            icon: 'warning',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          });
          return;
        }
        // Step 1: Remove unselected non-default columns
        this.displayedColumns = this.displayedColumns.filter(col => selectedOptions.includes(col));
        // Step 2: Add new selected non-default columns
        selectedOptions.forEach(col => {
          if (!this.displayedColumns.includes(col)) {
            this.displayedColumns.push(col);
          }
        });
      }
    });
    this.GetFiledsList()
    this.toppings.setValue(this.displayedColumns)
  }
  
  toppings = new FormControl<string[]>([]); 
  isDefaultColumn(column: string): boolean {
    const defaultColumns = [
      'name', 'city', 'state', 'zip', 'emailAddress', 'mobile', 
      'what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned', 'commercial_Property_Field', 'residential_Property_Field'
    ];
    return defaultColumns.includes(column);
  }

  GetFiledsList() {
    this.SpinnerService.show();
    this.reportsService.GetFiledsListForReports().subscribe(
      (res) => {
        if (!res.data) {
          console.error("Error fetching fields list: data is empty");
          // Make sure to hide spinner in case of error too
          return;
        }
  
        // Assign the original list for other tasks
        this.FiledsList = res.data;
  
        // Create a filtered list for display by excluding certain fields
        this.displayedFieldsList = this.FiledsList.filter(col => 
          !['companyName', 'claims_Received','Title','SurveyName'].includes(col.keyName)
        );
  
        this.allColumns = Array.from(this.FiledsList, (col) => col.keyName);
        this.displayedFieldsList.sort((a, b) => a.keyValue! < b.keyValue! ? -1 : 1);
        this.FiledsList.sort((a, b) => a.keyValue! < b.keyValue! ? -1 : 1);
  
       // Hide spinner after processing data
      },
      (error) => {
        console.error("Error fetching fields list:", error);
        this.SpinnerService.hide(); // Make sure to hide spinner in case of error
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

 

  dateToUS(date: any) {
    return new Date(date);
  }
  myMethod2(userRoleData: any) {
    return userRoleData.map((role: any) => role.role).join(', ');

  }
  myMethod(userRoleId: any) {
    var a = this.userRoles.filter((x: any) => x.roleId == userRoleId).map((x: any) => x.role) //returning role name in array. works!
    var y = this.userRoles.find((x: any) => x.roleId == userRoleId) //returning object matched with role id. works & right approach!
    //console.log("Role is: ", y.role); //returning object.role matched with role id
    return y.role;
  }


    ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
       this.paginator.page
         .pipe(
           startWith({}),
           switchMap(() => {
            if (!this.shouldFetchData) {
              // Skip fetching if controlled by flag
              return of(null);
            }
            
             this.SpinnerService.show();
             if (this.filterValueSql.length > 1 || (this.dateRange && this.dateRange.start !== null && this.dateRange.end !== null)) {
              this.isFilterApplied = true;
            } else {
              this.isFilterApplied = false;
            }
            this.cdr.detectChanges()
             let payload={
              pageNumber:this.paginator.pageIndex + 1, 
              numberOfRecords:  this.paginator.pageSize, 
              searchKey:this.filterBy, 
              searchValue:this.searchString,
              filterValue:this.filterValueSql,
              startDate: this.dateRange?.start,
              endDate: this.dateRange?.end,
              companyNameFilter: this.companyNameFilter,
              surveyNameFilter: this.surveyNameFilter,
              surveyTitleFilter: this.surveyTitleFilter,
              Operator:this.operator,
              sortField: this.sortField,
              sortOrder: this.sortOrder
             }

             return this.getTableDataReports$(payload).pipe(
              catchError((error) => {
         // Hide spinner in case of error before emitting a null value
                return observableOf(null); // Continue the stream with a null value
              })
            );
           }),
           map((Data: any) => {
             if (Data == null) return [];
             this.totalData = Data.data.count;
             this.cdr.detectChanges();
             this.SpinnerService.hide();
             return Data.data;
           }),
           finalize(() => {
            // Just in case there are paths that don't properly hide the spinner, though it should ideally be managed within the catchError and map operators above.
           // console.log('Finalize called, hiding spinner.');
            this.SpinnerService.hide();
          })
         )
         .subscribe((UserData) => {
          // console.log('user data', UserData);
           let filteredData = UserData.getUserListForReqDashboard;
           this.originalUserData$.next(filteredData);
           this.dataSource = new MatTableDataSource(filteredData);
         });
  
      // setTimeout(() => {
      //   if (this.dataSource.sort && this.dataSource.sort.sortables) {
      //     this.dataSource.sort.sort({
      //       id: 'modifiedOn',
      //       start: 'desc',
      //       disableClear: true,
      //     });
      //   }
      // }, 0);
    }

filterBasedOn(event: any) {
  let value = event.target.value;
  // Set filterBy based on the selected value
  this.filterBy = this.allColumns.includes(value) ? value : '';
  this.searchString = '';
  // Pass the original event to applyFilter
}

sortData(sort: Sort) {
   // check if sort.direction is empty or null then set sortField to empty string
   if(sort.direction == null || sort.direction == ''){
    this.sortField = '';
  }else{
    this.sortField = sort.active;
  }
  this.sortOrder = sort.direction;
  // console.log("sort",this.sortField,this.sortOrder)

  // Trigger data fetch with new sorting parameters
  this.applyFilter();
}

applyFilter() {
  if (!this.paginator) {
    console.error('Paginator has not been initialized yet.');
    return; // Stop execution if paginator is not available
  }

  //console.log("searchString", this.searchString, this.filterBy);
  if (this.searchString.length <= 0) {
    this.filterBy = "";
  }
  if (this.searchString.length > 0 && this.filterBy == '') {
    this.filterBy = "All";
  }
  if (this.searchString && /lock(ed)?/i.test(this.searchString)) {
    this.searchString = this.searchString.toLocaleLowerCase();
  }
  
  
  // Show spinner before making API call
  this.SpinnerService.show();
  if (this.filterValueSql.length > 1 || (this.dateRange && this.dateRange.start !== null && this.dateRange.end !== null)) {
    this.isFilterApplied = true;
  } else {
    this.isFilterApplied = false;
  }
  this.cdr.detectChanges()

  let payload = {
    pageNumber: 1, 
    numberOfRecords: this.paginator.pageSize, 
    searchKey: this.filterBy, 
    searchValue: this.searchString,
    filterValue: this.filterValueSql,
    startDate: this.dateRange?.start,
    endDate: this.dateRange?.end,
    companyNameFilter: this.companyNameFilter,
    surveyNameFilter: this.surveyNameFilter,
    surveyTitleFilter: this.surveyTitleFilter,
    Operator:this.operator,
    sortField: this.sortField,
    sortOrder: this.sortOrder
  };

  this.getTableDataReports$(payload)
    .pipe(
      finalize(() => {
        // Ensure spinner is hidden when the stream is completed or errors out
        this.SpinnerService.hide();
      })
    )
    .subscribe((userData: any) => {
      if (userData.data && userData.data.getUserListForReqDashboard) {
        let filteredData = userData.data.getUserListForReqDashboard;

        // Update the dataSource with the new data
        this.dataSource.data = filteredData;
        this.totalData = userData.data.count;

        // Reset pagination to the first page if applicable
        this.fixPaginator()
        this.cdr.detectChanges()
      }
    }, (error: any) => {
      // Error handling
      //console.log(error);
    });
}

fixPaginator() {
  if (this.paginator) {
    this.paginator.pageIndex = 0;
    this.paginator._changePageSize(this.paginator.pageSize);
  }
}
updateFilterData(filterSqlString: any) {
  //console.log("filterSqlString",filterSqlString)
  this.filterValueSql=filterSqlString
  this.applyFilter()
}
getDateforFilter(date:any){
  //console.log("daye in admin",date)
  this.dateRange=date
  //console.log("date",this.dateRange)
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
  // console.log("operator",data)
  this.operator=data
}

resetSearchvalueinReports(data:any){
  this.searchString=data
  this.filterBy="All"
}
getAllDataForDownload(): Observable<TransformedItem[]> {
  let payload = {
    pageNumber: 1, // Assuming you want to fetch all data
    numberOfRecords: this.totalData, // Make sure this is set correctly to fetch all records
    searchKey: this.filterBy,
    searchValue: this.searchString,
    filterValue: this.filterValueSql,
    startDate: this.dateRange?.start,
    endDate: this.dateRange?.end,
    companyNameFilter: this.companyNameFilter,
    surveyNameFilter: this.surveyNameFilter,
    surveyTitleFilter: this.surveyTitleFilter,
    Operator:this.operator,
    sortField: this.sortField,
    sortOrder: this.sortOrder
  };

  return this.getTableDataReports$(payload)
  .pipe(
    map((response: any) => response as ReportResponse), // Type assertion here
    map((response: ReportResponse) => {
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
    XLSX.writeFile(workbook, 'Filtered_Records.xlsx'); 
    // Using writeFile for simplicity
    this.shouldFetchData = true;
  });
}

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  navigateToCustomView(){
    this.router.navigate(['/main/report/custom-view']);
  }
  

}
