import { state } from '@angular/animations';
import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { catchError, throwError } from 'rxjs';
import { AddAssignmentComponent } from '../add-assignment/add-assignment.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-assignment',
  templateUrl: './view-assignment.component.html',
  styleUrls: ['./view-assignment.component.scss']
})
export class ViewAssignmentComponent implements OnInit {
  users: AdminElement[] = []
  displayedColumns: string[] = ['type', 'createdBy', 'createddOn', 'Action'];
  dataSource = new MatTableDataSource<AdminElement>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  selection = new SelectionModel<AdminElement>(true, []);
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  userResources: any;
  userRoles: any;
  userTypes: any;
  filterBy: any;
  searchString!: string;

  constructor(public dialog: MatDialog, private authService: AuthService, private SpinnerService: NgxSpinnerService,
    private router: Router, private cdr: ChangeDetectorRef) {
    this.SpinnerService.show();
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 15000);

    var obj=this.authService.isUserAllowed(window.location)
    if (obj.isAllow) {

    }
    else {
      this.router.navigate([obj.allowedPath]);
    }

    this.getUsers();
    this.SpinnerService.hide();
  }

  ngOnInit() {

  }

  getUsers() {
    this.SpinnerService.show();
    this.authService.getAssessments().subscribe((res: any) => {
      this.SpinnerService.hide();
      if (res != null && res.success && res.data) {
        const transformedData = res.data.map((user: any) => ({
          assessmentTypeId: user.assessmentTypeId,
          type: user.type,
          isDeleted: user.isDeleted,
          createdBy: user.createdBy,
          createddOn: this.dateToUS(user.createddOn),
          createddOnn: user.createddOn,   //added for sorting, previous is not working correctly, due to pipe implimentation.
          status: user.status
        }));
        this.dataSource = new MatTableDataSource<AdminElement>(transformedData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //console.log("DataSource is", this.dataSource);
        this.searchString = '';
        this.cdr.detectChanges();
      }
    }, (error: any) => {
        this.SpinnerService.hide();
        //console.log("Error is:", error)
      })
  }

  dateToUS(date: any) {
    var x = new Date(date);
    var y = x.toLocaleDateString('en-US');
    // //console.log("old format is: ", x, "    New is: ", y);
    return y
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sort.sort({ id: 'type', start: 'asc', disableClear: true });
    this.cdr.detectChanges();
  }

  filterBasedOn(event: any) {
    let value = event.target.value;
    let y;
    (value == '1' ? y = 'Name' : value == '2' ? y = 'Email' : value == '3' ? y = 'Status' : '')
    //console.log(value, y, "Type is: ", typeof (value))
    this.filterBy = y;
  }

  applyFilter(event: Event) {   //Changed Event type to any, for geting the value
     
    const filterValue = (event.target as HTMLInputElement).value;
    let tableFilters = [];
    if (this.filterBy) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        //in this.filterBy= elememt.value
        const value = data[this.filterBy].toLowerCase();
        return value.includes(filter);
      }
    }
    else {
      const myarry: string[] = ['type']
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return myarry.some(column => {
          const value = data[column].toLowerCase();
          return value.includes(filter);
        })
      }
    }
    this.cdr.detectChanges();
    //console.log("Datasource is:", this.dataSource.data)
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.cdr.detectChanges();
    }
  }

  openDialogeadd() {
    localStorage.setItem('currentPage', 'addAssignmentPage');
    const dialogRef = this.dialog.open(AddAssignmentComponent, {
      data: null,
      panelClass: 'add_assignment'
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.getUsers();
    });
  }

  openDialogeEdit(user: any) {
    localStorage.setItem('currentPage', 'editAssignmentPage');
    const dialogRef = this.dialog.open(AddAssignmentComponent, {
      data: user,
      panelClass: 'add_update',
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.getUsers();
    });
  }

  deleteAssignment(user: any) {
     
    Swal.fire({
      title: '',
      text: 'Are you sure want to delete ' + user.type + '?',
      icon: 'question',
      showDenyButton: true,
      // showCancelButton: true,
      // confirmButtonColor: '#3085d6',
      // denyButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#ffa022',
      denyButtonText: 'No',
      // cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
         
        this.authService.deleteAssessment(user.assessmentTypeId).pipe(
          catchError(error => {
            this.SpinnerService.hide();
            if (error.status == 0) {
              Swal.fire({
                title: 'Status code: ' + error.status,
                text: 'Please check the connection. Unable to communicate with server via HTTP(s).',
                icon: 'warning',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              })
            }
            else if (error.status) {
              Swal.fire({
                title: 'Status code: ' + error.status,
                text: 'Sorry! Something went wrong. Your request could not be completed, Please try again later.',
                icon: 'warning',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              })
            }
            if (error.status === 400) {
              //console.log('the server cannot or will not process the request due to something that is perceived to be a client error');
            } else {
              //console.log('Error retrieving data:', error.message);
            }
            return throwError(error);
          })
        )
          .subscribe((res: any) => {
            if (res != null) {
              if (res == true) {
                Swal.fire({
                  // title: 'Status code: ',
                  text: 'Assignment Deleted successfully.',
                  icon: 'success',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#ffa022',
                })
                this.getUsers();
              }
              else {
                Swal.fire({
                  // title: 'Status code: ' + error.status,
                  text: 'Sorry! Something went wrong. Your request could not be completed, Please try again later.',
                  icon: 'warning',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#ffa022',
                })
              }
            }
          })

      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

}
export interface AdminElement {
  assessmentTypeId: string;
  type: string;
  isDeleted: string;
  createdBy: string;
  createddOn: string;
  status: string;
}


