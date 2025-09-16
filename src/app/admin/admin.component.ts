
import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChangeAndResetPasswordComponent } from './change-and-reset-password/change-and-reset-password.component';
import { catchError, delay, throwError,BehaviorSubject, of as observableOf, startWith, switchMap, map, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { AdminElement } from '../models/user-models';
import * as XLSX from 'xlsx';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FileTracService } from '../services/file-trac.service';





@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'Name',
    'Role',
    'User type',
    'State',
    'Phone',
    'Email',
    'Status',
    'Profile Status',
    'modifiedOn',
    'Action',
  ];
  dataSource = new MatTableDataSource<AdminElement>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  selection = new SelectionModel<AdminElement>(true, []);
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  userResources: any={
    total:0,
    activeUsers:0,
    inactiveUsers:0,
    activeUserPercentage:0,
    inactiveUserPercentage:0
  }
  userRoles: any;
  userTypes: any;
  filterBy: string="";
  LoggeduserId = localStorage.getItem('LoggeduserId');
  searchString: string="";
  fpdUserPercentage: any;
  pageSize = 10;
  acceptableFilters = [
    'name',
    'userRoleDataCSV',
    'state',
    'mobile',
    'emailAddress',
    'status',
    'LastActivity',
    'userTypeName',
    'prevetting',
    'i_Am_Interested_In_The_Following_Assignments',
    'adjuster_Licenses',
    'residential_Property_Desk',
    'residential_Property_Field',
    'commercial_Property_Desk',
    'commercial_Property_Field',
    'casualty',
    'fileTrac',
    'clickClaims',
    'xactimate_Estimating',
    'isActive',
    'isLocked',
    'what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned',
  ];
  fieldDisplayNameMapping: { [key: string]: string } = {
    Name: 'Name',
    Role: 'Role',
    State: 'State',
    Phone: 'Phone',
    Email: 'Email',
    Status: 'Status',
    isActive: 'Active',
    isLocked: 'Locked',
    LastActivity: 'Last Activity',
    lastLogin: 'Last Login',
    failedLoginStatus: 'Login Status',
    city: 'City',
    zip: 'Zip',
    country: 'Country',
    address1: 'Address',
    street: 'Street',
    userTypeName: 'User Type',
    prevetting: 'Prevetting',
    modifiedOn: 'Profile Modified On',
    i_Am_Interested_In: 'I’m Interested In',
    adjuster_Licenses: 'Licensed States',
    residential_Property_Field: 'Residential Property Field',
    residential_Property_Desk: 'Residential Property Desk',
    commercial_Property_Field: 'Commercial Property Field',
    commercial_Property_Desk: 'Commercial Property Desk',
    casualty: 'Casualty',
    fileTrac: 'FileTrac',
    clickClaims: 'Click Claims',
    xactimate_Estimating: 'Xactimate Estimating',
    what_Type_Of_Claims: 'Preferred Claims Type',
    totalNumberOfClaims:'Total Number Of Claims'
  };

  originalUserData$ = new BehaviorSubject<any[]>([]);
  originalUserDataForCount: any[] = [];
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  loggedUserRes: any;
  loggedUserType: any;
  userType: any;
  isView: boolean = false;
  isFilterApplied: boolean = false;
  loggedUserTypeCheck = Number(localStorage.getItem('LoggedUserType'));
  totalData:number=0
  pageNumber:number=0
  filterValueSql: string=''
  operator: any;
   getTableData$(data:any) {
      return this.authService.GetUserListForAdminDashboard(data)
    }
    public dateRange: {
      start: Date | null,
      end: Date | null
    } = {
      start: null,
      end: null
    };
    companyNameFilter:any;
    surveyNameFilter:any;
    surveyTitleFilter:any;

    sortField: string = '';
    sortOrder: string = '';

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private SpinnerService: NgxSpinnerService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fileTracService: FileTracService
  ) {
    // setTimeout(() => {
    //   this.SpinnerService.hide();
    // }, 15000);
    localStorage.removeItem('editUser');
    localStorage.removeItem('viewProfile');

    var obj = this.authService.isUserAllowed(window.location);
    if (obj.isAllow) {
    } else {
      this.router.navigate([obj.allowedPath]);
    }

    this.getUserResources();
    this.getUserRole();
    this.getUserType();
    // this.getUsers();
  }
  ngOnInit() {
    this.checkForViewUser();
    this.checkUserInternal();
  }

  checkUserInternal() {
    if (this.loggedUserTypeCheck === 1) {
      // find the index of 'Action' in the array
      let index = this.displayedColumns.indexOf('Action');
      // insert 'ActionlastLogin' at that index
      this.displayedColumns.splice(index, 0, 'lastLogin');
    }
  }
  checkForViewUser() {
    this.loggedUserRes = localStorage.getItem('currentUser');
    this.loggedUserType = localStorage.getItem('LoggedUserType');
    if (this.loggedUserRes) {
      this.loggedUserRes = JSON.parse(this.loggedUserRes);
      //console.log("USER RES", this.loggedUserRes);
    }

    this.userType = localStorage.getItem('LoggedUserRole');
    this.userType = parseInt(this.userType);

    if (this.userType == 3) {
      //console.log("test testtesttesttesttesttesttest")
      this.isView = true;
    }
  }
  getUserResources() {
    this.authService.getUserSummary().subscribe((res: any) => {
      if (res != null) {
        this.userResources = res['data'];
        this.fpdUserPercentage = res['data'].fpdUserPercentage; //for *ngIf UserResources.fpdUserPercentage was not working
      }
    });
  }
  getUserRole() {
    this.authService.getUserRoles().subscribe((res: any) => {
      if (res != null) {
        this.userRoles = res['data'];
      }
    });
  }
  getUserType() {
    this.authService
      .getUserType()
      .pipe(delay(0))
      .subscribe((res: any) => {
        if (res != null) {
          this.userTypes = res['data'];
        }
      });
  }
  hasUserRole(moduleName: string): boolean {
    return (
      this.loggedUserRes?.data?.role &&
      this.loggedUserRes.data?.role.some((role: any) =>
        role.userPageList.some(
          (userPage: any) => userPage.moduleName === moduleName
        )
      )
    );
  }

  shouldShowDownloadButton(): boolean {
    const roles =
      this.loggedUserRes?.data?.role?.map((r: any) => r.roleName) || [];
    const hasAdmin = roles.includes('Admin');
    const hasSuperAdmin = roles.includes('Super Admin');
    const hasEmployee = roles.includes('Employee');
    const hasAdjuster = roles.includes('Adjuster');

    return (
      (hasAdmin || hasSuperAdmin || hasEmployee) &&
      this.loggedUserTypeCheck === 1 // loggedUserTypeCheck must be 1
    );
  }

  dateToUS(date: Date) {
    return new Date(date);
  }
  myMethod2(userRoleData: any) {
    return userRoleData.map((role: any) => role.role).join(', ');
  }
  myMethod(userRoleId: any) {
    var a = this.userRoles
      .filter((x: any) => x.roleId == userRoleId)
      .map((x: any) => x.role); //returning role name in array. works!
    var y = this.userRoles.find((x: any) => x.roleId == userRoleId); //returning object matched with role id. works & right approach!
    //console.log("Role is: ", y.role); //returning object.role matched with role id
    return y.role;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  
    // Initialize the spinner before the observable subscription starts
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          // Show spinner each time the switchMap is activated (e.g., page change)
          this.SpinnerService.show();
  
          if (this.filterValueSql.length > 1 || (this.dateRange && this.dateRange.start !== null && this.dateRange.end !== null)) {
            this.isFilterApplied = true;
          } else {
            this.isFilterApplied = false;
          }
          this.cdr.detectChanges();
  
          let payload = {
            pageNumber: this.paginator.pageIndex + 1,
            numberOfRecords: this.paginator.pageSize,
            searchKey: this.filterBy,
            searchValue: this.searchString,
            filterValue: this.filterValueSql,
            startDate: this.dateRange?.start,
            endDate: this.dateRange?.end,
            companyNameFilter: this.companyNameFilter,
            surveyTitleFilter: this.surveyTitleFilter,
            Operator: this.operator,
            surveyNameFilter: this.surveyNameFilter,
            sortField: this.sortField,
            sortOrder: this.sortOrder
          };
  
          // Start the data fetch process
          return this.getTableData$(payload).pipe(
            catchError((error) => {
              // In case of an error, continue the observable stream with a null value
              return observableOf(null);
            })
          );
        }),
        map((Data: any) => {
          // Process the data only if it's not null
          if (Data == null) return [];
  
          this.totalData = Data.data.resourceCount;
          this.cdr.detectChanges();
          this.SpinnerService.hide();
  
          return Data.data; // Ensure the processed data is passed along
        }),
        finalize(() => {
          // Hide spinner once the observable completes or errors out
          //console.log('Finalize called, hiding spinner.');
          this.SpinnerService.hide();
        })
      )
      .subscribe((UserData) => {
       // console.log("user data", UserData);
  
        let filteredData = UserData ? UserData.getUserListForDashboardWithPagination : [];
        if (this.isView && this.loggedUserTypeCheck == 1) {
          filteredData = filteredData.filter((user: any) => user.roleCsv.includes('Adjuster'));
        }
        this.originalUserData$.next(filteredData);
        this.dataSource = new MatTableDataSource(filteredData);
        // console.log("totla data",this.totalData);
      }
    );
  
    // Correctly apply the initial sorting
    // setTimeout(() => {
    //   if (this.dataSource.sort && this.dataSource.sort.sortables.get('modifiedOn')) {
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

    if (this.acceptableFilters.includes(value)) {
      this.filterBy = value;
    } else {
      this.filterBy = 'All';
    }
    this.searchString = '';
   // console.log("value for search",value);
  
    
    // No need to define filterPredicate here; it's handled in applyFilter
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
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
     // console.error('Paginator has not been initialized yet.');
      return; // Stop execution if paginator is not available
    }
    // const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
   // Assuming this is how you want to set the searchString
   // console.log("searchString",this.searchString , this.filterBy);
    if (this.searchString.length <=0){
      this.filterBy=""
    }
    if(this.searchString.length > 0 && this.filterBy ==''){
      this.filterBy="All"
    }
    if (this.filterValueSql.length > 1 || (this.dateRange && this.dateRange.start !== null && this.dateRange.end !== null)) {
      this.isFilterApplied = true;
    } else {
      this.isFilterApplied = false;
    }
    this.cdr.detectChanges()
    // Call your API with the new search term and update the dataSource with the new data
    this.SpinnerService.show()
    let payload={
      pageNumber:1, 
      numberOfRecords: this.paginator.pageSize, 
      searchKey:this.filterBy, 
      searchValue:this.searchString,
      filterValue:this.filterValueSql,
      startDate:this.dateRange?.start,
      endDate:this.dateRange?.end,
      companyNameFilter:this.companyNameFilter,
      surveyTitleFilter: this.surveyTitleFilter,
      Operator: this.operator,
      surveyNameFilter: this.surveyNameFilter,
      sortField: this.sortField,
      sortOrder: this.sortOrder
     }
    this.getTableData$(payload).pipe(
      finalize(() => {
        this.SpinnerService.hide();
      })
    ).subscribe((userData: any) => {
          if (userData.data &&userData.data.getUserListForDashboardWithPagination){
            let filteredData = userData.data.getUserListForDashboardWithPagination;
           
            if (this.isView && this.loggedUserTypeCheck == 1) {
                filteredData = filteredData.filter((user: any) => user.roleCsv.includes('Adjuster'));
            }
            // Directly update the data of the existing dataSource instance
            this.dataSource.data = filteredData;
            this.totalData =userData.data.resourceCount
           // console.log("totalData",this.totalData);
            // This is crucial if you're using pagination to ensure it resets to the first page if needed
           this.fixPaginator()
            
            this.cdr.detectChanges()
          }
            this.SpinnerService.hide()
        } ,(error: any) => {
          this.SpinnerService.hide();
          //console.log(error);
        }
      );
}


  editUser(user: any) {
    this.router.navigate(['/main/admin/add-user-tabs']);
    localStorage.setItem('editUser', JSON.stringify(user));
  }

  viewProfile(user: any) {
    this.router.navigate(['/main/admin/view-profile']);
    localStorage.setItem('viewProfile', JSON.stringify(user));
  }
  
  isEditable(userRoles: string): boolean {
    const forbiddenRoles = ['Admin', 'Super Admin', 'Employee'];
    // Assuming the userRoles is a comma-separated string of roles
    const rolesArray = userRoles.split(',').map((role) => role.trim());
    // Check if the user has any of the forbidden roles
    return !rolesArray.some((role) => forbiddenRoles.includes(role));
  }

  openDialogeChangeResetPass(user: any) {
    localStorage.setItem('currentPage', 'resetPass');
    const dialogRef = this.dialog.open(ChangeAndResetPasswordComponent, {
      data: user,
      panelClass: 'change_reset_password',
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log('The dialog was closed');
      // this.getUsers();
    });
  }

  deleteUser(user: any) {
    Swal.fire({
      title: '',
      text: 'Are you sure want to delete ' + user.name + '?',
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#ffa022',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteUser(user.userId).subscribe((res: any) => {
          if (res != null) {
            if (res == true) {
              Swal.fire({
                text: 'User Deleted successfully.',
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              });
              this.clearSessionCache('userListCache');
            // here i want to call the api to get the data again
            const payload = {
              pageNumber: this.paginator.pageIndex + 1,
              numberOfRecords: this.paginator.pageSize,
              searchKey: this.filterBy,
              searchValue: this.searchString,
              filterValue: this.filterValueSql,
              startDate: this.dateRange?.start,
              endDate: this.dateRange?.end,
              companyNameFilter: this.companyNameFilter,
              surveyTitleFilter: this.surveyTitleFilter,
              Operator: this.operator,
              surveyNameFilter: this.surveyNameFilter,
              sortField: this.sortField,
              sortOrder: this.sortOrder
            };
            this.getTableData$(payload).subscribe((data: any) => {
              if (data && data.data) {
                let filteredData = data.data.getUserListForDashboardWithPagination;
                if (this.isView && this.loggedUserTypeCheck == 1) {
                  filteredData = filteredData.filter((user: any) => user.roleCsv.includes('Adjuster'));
                }
                this.dataSource = new MatTableDataSource(filteredData);
              }
            });
              
            } else {
              Swal.fire({
                text: 'Sorry! Something went wrong. Your request could not be completed, Please try again later.',
                icon: 'warning',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              });
            }
          }
        });
      } else if (result.isDenied) {
      }
    });
  }


lockProfile(user: any) {
    let data={
      userid:user.userId,
      loggedinuser: this.LoggeduserId
    }
    Swal.fire({
      title: '',
      text: 'Are you sure want to lock profile for ' + user.name + '?',
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#ffa022',
      denyButtonText: 'No',
      // cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.lockProfile(data).subscribe((res: any) => {
          if (res != null) {
            if (res == true) {
              Swal.fire({
                // title: 'Status code: ',
                text: 'Profile locked successfully.',
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              }).then((result)=>{
                if(result.isConfirmed){
                  this.SpinnerService.show()
               // refetch the data
               let payload = {
                pageNumber: this.paginator.pageIndex + 1,
                numberOfRecords: this.paginator.pageSize,
                searchKey: this.filterBy,
                searchValue: this.searchString,
                filterValue: this.filterValueSql,
                startDate: this.dateRange?.start,
                endDate: this.dateRange?.end,
                companyNameFilter: this.companyNameFilter,
                surveyTitleFilter: this.surveyTitleFilter,
                Operator: this.operator,
                surveyNameFilter: this.surveyNameFilter,
                sortField: this.sortField,
                sortOrder: this.sortOrder
              };
              this.getTableData$(payload).subscribe((data: any) => {
                this.SpinnerService.hide()
                if (data && data.data) {
                  let filteredData = data.data.getUserListForDashboardWithPagination;
                  this.dataSource.data = filteredData;
                }
              },error=>{
                this.SpinnerService.hide()
              }
            );
               

                }
              })
              

              //  this.getTableData$(this.paginator.pageIndex + 1,this.paginator.pageSize,this.filterBy,this.searchString,this.filterValueSql)
            } else {
              Swal.fire({
                // title: 'Status code: ' + error.status,
                text: 'Sorry! Something went wrong. Your request could not be completed, Please try again later.',
                icon: 'warning',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              });
            }
          }
        });
      } else if (result.isDenied) {
      }
    });
  }

  unlockProfile(user: any) {
    let data={
      userid:user.userId,
      loggedinuser: this.LoggeduserId
    }
    Swal.fire({
      title: '',
      text: 'Are you sure want to unlock profile for ' + user.name + '?',
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#ffa022',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.unLockprofile(data).subscribe((res: any) => {
          if (res != null) {
            if (res == true) {
              Swal.fire({
                // title: 'Status code: ',
                text: 'Profile unlocked successfully.',
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              }).then((result)=>{
                if(result.isConfirmed){
                  this.SpinnerService.show()
               // refetch the data
               let payload = {
                pageNumber: this.paginator.pageIndex + 1,
                numberOfRecords: this.paginator.pageSize,
                searchKey: this.filterBy,
                searchValue: this.searchString,
                filterValue: this.filterValueSql,
                startDate: this.dateRange?.start,
                endDate: this.dateRange?.end,
                companyNameFilter: this.companyNameFilter,
                surveyTitleFilter: this.surveyTitleFilter,
                Operator: this.operator,
                surveyNameFilter: this.surveyNameFilter,
                sortField: this.sortField,
                sortOrder: this.sortOrder
              };
              this.getTableData$(payload).subscribe((data: any) => {
                this.SpinnerService.hide()
                if (data && data.data) {
                  let filteredData = data.data.getUserListForDashboardWithPagination;
                  this.dataSource.data = filteredData;
                }
              },error=>{
                this.SpinnerService.hide()
              }
            );
               

                }
              })
            } else {
              Swal.fire({
                // title: 'Status code: ' + error.status,
                text: 'Sorry! Something went wrong. Your request could not be completed, Please try again later.',
                icon: 'warning',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              });
            }
          }
        });
      } else if (result.isDenied) {
      }
    });
  }



  changeResetPassword(userEmail: any, value: any) {
    let obj = {
      updateBy: Number(localStorage.getItem('LoggeduserId')),
      email: userEmail,
      value: value,
    };

    let model = JSON.stringify(obj);
    this.authService
      .updateResetPassword(obj)
      .pipe(
        catchError((error) => {
          if (error.status == 0) {
            Swal.fire({
              title: 'Status code: ' + error.status,
              text: 'Please check the connection. Unable to communicate with server via HTTP(s).',
              icon: 'warning',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            });
          } else if (error.status) {
            Swal.fire({
              title: 'Status code: ' + error.status,
              text: 'Sorry! Something went wrong. Your request could not be completed, Please try again later.',
              icon: 'warning',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            });
          }
          if (error.status === 404) {
            //console.log('the server cannot or will not process the request due to something that is perceived to be a client error');
          } else {
            //console.log('Error retrieving data:', error.message);
          }
          return throwError(error);
        })
      )
      .subscribe((res: any) => {
        // this.SpinnerService.hide();
        if (res.success == true) {
        }
      });
  }
  updateFilterData(filterSqlString: any) {
    // console.log("filterSqlString",filterSqlString)
    this.filterValueSql=filterSqlString
    this.applyFilter()
  }
  getDateforFilter(date:any){
   // console.log("daye in admin",date)
    this.dateRange=date
    //console.log("date",this.dateRange)
  }
  getCompanyName(data:any){
    
    this.companyNameFilter=data
  }
  getSurveyName(data:any){
    this.surveyNameFilter=data
  }
  getSurveyTitle(data:any){
    this.surveyTitleFilter=data
  }

  getOperator(data:any){
    // console.log("operator",data)
    this.operator=data
  }
  resetSearchvalueinAdmin(data:any){
    this.searchString=data
    this.filterBy="All"
  }
  downloadExcel() {
    this.SpinnerService.show();
    // Define a payload that either bypasses pagination or requests all records at once.
    // This depends on how your backend is set up to handle such requests.
    const downloadPayload = {
      filterValue: this.filterValueSql,
      startDate: this.dateRange?.start ? this.dateRange.start.toISOString().substring(0, 10) : null,
      endDate: this.dateRange?.end ? this.dateRange.end.toISOString().substring(0, 10) : null,
      companyNameFilter: this.companyNameFilter,
      surveyTitleFilter: this.surveyTitleFilter,
      surveyNameFilter: this.surveyNameFilter,
      Operator: this.operator,
      pageNumber: 1,
      numberOfRecords: this.totalData, // Adjust based on your maximum expected records
      searchKey: this.filterBy,
      searchValue: this.searchString,
      sortField: this.sortField,
      sortOrder: this.sortOrder
    };
  
    this.getTableData$(downloadPayload).subscribe((data :any )=> {
     // console.log("getTableData",data);
      
      this.SpinnerService.hide();
      if (data && data.data ) {
        // Assuming data is directly the array of records. Adjust based on the actual response structure.
        let dataForDownloads= data.data.getUserListForDashboardWithPagination.map((item: any) => {
          return {
          ...item,
            isLocked: item.isLocked? 'Locked' : 'Unlocked',
          };
        });
        const filteredData = this.prepareDataForDownload(dataForDownloads);
  
        // Continue with Excel file generation...
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'All_Records.xlsx');
      } else {
        // Handle case where no data is returned
        //console.log('No data available for download.');
      }
    }, error => {
      this.SpinnerService.hide();
      console.error('Error downloading records:', error);
    });
  }
  
  prepareDataForDownload(data: AdminElement[]) {
    //console.log("prepareDataForDownload", data)
    const excludeColumns = ['userId', 'failedLoginStatus','isActive']; // Define the columns to exclude
    return data.map(item => {
      const newItem: { [key: string]: any } = {};
      Object.keys(item)
        .filter(key => !excludeColumns.includes(key))
        .forEach(key => {
          // Apply any necessary transformations here
          newItem[this.fieldDisplayNameMapping[key] || key] = item[key];
        });
      return newItem;
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );
  }
  clearSessionCache(key: string) {
    localStorage.removeItem(key);
  }

  fixPaginator() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
      this.paginator._changePageSize(this.paginator.pageSize);
    }
  }
  addUser(){
    this.router.navigate(['/main/admin/add-user-tabs']);
    localStorage.removeItem('editUser')
    localStorage.removeItem('viewProfile')
    this.authService.clearUserDataCache()
  }
}





function parseISO(arg0: string) {
  throw new Error('Function not implemented.');
}
interface FileTracDataMap {
  [key: number]: { // Using an index signature
    companyNames: string[];
    claimDates: Date[];
  };
}

