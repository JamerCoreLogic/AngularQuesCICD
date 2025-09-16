import { state } from '@angular/animations';
import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { AddClientsComponent } from '../add-clients/add-clients.component';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-clients',
  templateUrl: './view-clients.component.html',
  styleUrls: ['./view-clients.component.scss']
})
export class ViewClientsComponent implements OnInit,AfterViewInit {
  users: AdminElement[] = []
  displayedColumns: string[] = ['Name', 'Email', 'status', 'createdBy', 'createdOn', 'Action'];
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
    private router: Router , private cdr: ChangeDetectorRef) {
    // this.SpinnerService.show();
    // setTimeout(() => {
    //   this.SpinnerService.hide();
    // }, 15000);

    var obj = this.authService.isUserAllowed(window.location)
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Default sorting
      this.sort.sort({ id: 'Name', start: 'asc', disableClear: true });
    }, 0);

    this.sort.sortChange.subscribe((sort: Sort) => {
      if (sort.active === 'Name') {
        this.dataSource.data = this.dataSource.data.slice().sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          return isAsc
            ? a.Name.localeCompare(b.Name)
            : b.Name.localeCompare(a.Name);
        });
      }
    });
  }

  getUsers() {
    this.SpinnerService.show();
    this.authService.getClients().subscribe((res: any) => {
      if (res != null && res.success && res.data) {
        this.SpinnerService.hide();
        const transformedData = res.data.map((user: any) => ({
          select: user.clientId, // Assuming userId as select field
          Name: user.lName ? `${user.fName} ${user.lName}` : user.fName,
          firstName: user.fName,
          lastName: user.lName,
          address1: user.address1,
          address2: user.address2,
          city: user.city,
          state: user.state,
          zip: user.zip,
          primaryPhone: user.primaryPhone,
          clientId: user.clientId,
          Email: user.emailAddress,
          isDeleted: user.isDeleted,
          isActive: user.isActive,
          createdBy: user.createdBy,
          createdOn: user.createdOn,
          createdOnn: user.createdOn,   //added for sorting, previous is not working correctly, due to pipe implimentation.
          Status: user.status
        }));
        this.dataSource = new MatTableDataSource<AdminElement>(transformedData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //console.log("DataSource is", this.dataSource);
        this.searchString = '';
      }else{
        //console.log("Error in fetching data");
        this.SpinnerService.hide();
      }
    }, (error: any) => {
      this.SpinnerService.hide();
      //console.log("Error in fetching data");
    });
  }

  dateToUS(date: any) {
    var x = new Date(date);
    var y = x.toLocaleDateString('en-US');
    // //console.log("old format is: ", x, "    New is: ", y);
    return y
  }

 

  filterBasedOn(event: any) {
    let value = event.target.value;
    let y;
    (value == '4' ? y = '' : value == '1' ? y = 'firstName' : value == '2' ? y = 'Email' : value == '3' ? y = 'Status' : '')
    //console.log(value, y, "Type is: ", typeof (value))
    this.filterBy = y;
    this.searchString = '';
    this.dataSource.filterPredicate = function (record, filter) {
      return true;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
      const myarry: string[] = ['firstName', 'Email', 'Status']
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return myarry.some(column => {
          const value = data[column].toLowerCase();
          return value.includes(filter);
        })
      }
    }
    //console.log("Datasource is:", this.dataSource.data)
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialogeadd() {
    localStorage.setItem('currentPage', 'addClientPage');
    const dialogRef = this.dialog.open(AddClientsComponent, {
      data: null,
      panelClass: 'add_client',
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.getUsers();
    });
  }

  openDialogeEdit(user: any) {
    localStorage.setItem('currentPage', 'editClientPage');
    const dialogRef = this.dialog.open(AddClientsComponent, {
      data: user,
      panelClass: 'add_client',
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.getUsers();
    });
  }

  deleteClient(user: any) {
    Swal.fire({
      title: '',
      text: 'Are you sure want to delete ' + user.Name + '?',
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
        this.authService.deleteClient(user.clientId).pipe(
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
                  text: 'Client Deleted successfully.',
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
  select: number;
  clientId: string;
  Name: string;
  Email: string;
  Status: string;
  createdBy: string;
  createdOn: string;
  isDeleted: string;
  isActive: string;
}


