import Swal  from 'sweetalert2';
import { Component, Input, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { SeriesLabelsContentArgs ,SeriesClickEvent} from "@progress/kendo-angular-charts";
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AiApiService } from 'src/app/services/ai-api.service';
import { PreviewResponcComponent } from '../preview-responc/preview-responc.component';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';





@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit , AfterViewInit{
  @Input() data:any;
  @Input() status:any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['chck','name', 'phone', 'emailId' ,'assignToUser','submittedOn','distance', 'surveyLink'];
  dataSource=new MatTableDataSource<any>([]);
  labelContent: any;
  chartOptions: any;
  legendItemName: any='Submitted'
  allowedLinkpreview:boolean=true;
  selection = new SelectionModel<checkelement>(true, []);
  internalUsers:InternalEmploye[]=[];
  selectedAssignee: string = '';
  // emit new event for assign to user
   @Output() assignToUser = new EventEmitter<boolean>();
   @Output() refreshData = new EventEmitter<boolean>();

  constructor(private SS:AiApiService, private dialog: MatDialog, private spinner: NgxSpinnerService ,private router:Router) {
  }


  ngOnInit(): void {
    //console.log("this.status",this.status);
    // console.log("this.data for tabel",this.data);
    if (Array.isArray(this.data.expandedData)) {
      this.dataSource = new MatTableDataSource<checkelement>(this.data.expandedData.filter((item: any) => item.isSubmitted == true));
    } else {
      this.dataSource = new MatTableDataSource<checkelement>([]);
    }
    //console.log("this.dataSource",this.dataSource);
    


   this.labelContent=(e: SeriesLabelsContentArgs) => {
      return e.category;
    }
    this.getInternalUsers()

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

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
    // console.log(e);
    this.legendItemName = e;
    switch(e) {

      case 'Submitted':
        if (Array.isArray(this.data.expandedData)) {
          this.dataSource = new MatTableDataSource<checkelement>(this.data.expandedData.filter((item: any) => item.isSubmitted == true));
        } else {
          this.dataSource = new MatTableDataSource<checkelement>([]);
        }
        this.displayedColumns = ['chck','name', 'phone', 'emailId','assignToUser','submittedOn','distance', 'surveyLink'];
        this.allowedLinkpreview=true;
        break;
      case 'No Response':
        if (Array.isArray(this.data.expandedData)) {
          this.dataSource = new MatTableDataSource<checkelement>(this.data.expandedData.filter((item: any) => item.isSubmitted == false));
        } else {
          this.dataSource = new MatTableDataSource<checkelement>([]);
        }
        this.displayedColumns = ['name', 'phone', 'emailId','distance'];
        this.allowedLinkpreview=false;
        break;
      default:
        //console.log('Invalid label');
    }
    this.dataSource.paginator = this.paginator;
  }

  markComplete(){
      this.spinner.show();
    this.SS.markComplete(this.data.portalId).subscribe((res:any)=>{
        // console.log("res",res);
     if (res.success == true){
      this.spinner.hide();
       Swal.fire({
          title: 'Request Marked As Completed',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#ffa022',
        }).then((result) => {
          if (result.isConfirmed) {
            // window.location.reload();
            this.refreshData.emit(true);

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

  assignSelectedToUser(): void {
    // 1. Check if a user is selected
    if (!this.selectedAssignee) {
      Swal.fire({
        icon: 'warning',
        title: 'No Assignee Selected',
        text: 'Please select a user from the dropdown',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ffa022',
      });
      return;
    }
  
    // 2. Check if any rows are selected
    if (!this.selection.selected.length) {
      Swal.fire({
        icon: 'warning',
        title: 'No Rows Selected',
        text: 'Please select at least one row to assign',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ffa022',
      }).then(() => {
        // Clear the dropdown if no rows are selected
        this.selectedAssignee = '';
      });
      return;
    }
  
    // 3. Show a confirmation prompt before actually calling the service
    //    Find the user’s name from 'internalUsers' for a nicer message
    const selectedUser = this.internalUsers.find(
      user => user.userId === this.selectedAssignee
    );
  
    Swal.fire({
      title: `Are you sure you want to designate ${selectedUser?.userName} to the selected adjuster?`,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#ffa022', // or whichever color you prefer
      cancelButtonColor: '#b9b9c1',
      width: '60rem',
    }).then(result => {
      if (result.isConfirmed) {
        // User clicked 'Yes' -> proceed with your assignment call
        this.spinner.show();
        this.selection.selected.forEach((item:any) => {
          item.assignedUserId = this.selectedAssignee;
        });
        this.SS.addUpdateAssignTo(this.selection.selected)
          .subscribe({
            next: (res: any) => {
              this.spinner.hide();
              if (res.success) {
                Swal.fire({
                  icon: 'success',
                  title: 'Assignment Successful',
                  text: 'Selected rows have been assigned successfully.',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#ffa022',
                }).then(() => {
                  // Clear selection and dropdown
                  this.selection.clear();
                  this.selectedAssignee = '';
                  this.assignToUser.emit(true);
                  

                });
              } else {
                this.handleApiError(res.message || 'Unknown error');
              }
            },
            error: (err) => {
              this.spinner.hide();
              this.handleApiError(err?.message || 'Network or server error');
            }
          });
      } else {
        // User clicked 'No' -> revert the dropdown
        this.selectedAssignee = '';
      }
    });
  }
  

  private handleApiError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonText: 'OK'
    });
  }


  navigateToPreview(data: any) {
    // console.log("link data", data);
    

    this.openDialog(data.surveyLinkID);

  }
  openDialog(data: any): void {
    const dialogRef = this.dialog.open(PreviewResponcComponent, {
      data: data,
      width: '95vw',
      height: '95vh',
      maxWidth: '95vw',
      maxHeight: '95vh'
       
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      // do something with the result if needed
    });
  }
  viewProfile(userData:any){
    // console.log("view profile clicked" ,userData)
    localStorage.setItem('viewProfile', JSON.stringify(userData));
    this.router.navigate(['/main/admin/view-profile']);
  }

 toggleAllRows(event: any): void {
    if (event.checked) {
      this.selection.select(...this.dataSource.data);
    } else {
      this.selection.clear();
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?: checkelement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.chck + 1}`;
  }

  getSelectedRowIds(): any[] {
    return this.selection.selected.map((row) => row.portalId);
  }

  getInternalUsers(){
    this.SS.getInternalUsers().subscribe((res:any)=>{
      if (res && Array.isArray(res)) {
        this.internalUsers = res;
       console.log("internalUsers",this.internalUsers);
      } else {
        this.internalUsers = [];
      }
    },(error)=>{
      this.internalUsers = [];
      // console.log("error",error);
    })
  }





}

export interface checkelement {
  chck: number;
  name: string;
  phone: string;
  emailId: string;
  assignToUser: string;
  submittedOn: string;
  distance: string;
  surveyLink: string;
  portalId: number;
}


export interface InternalEmploye {
  emailAddress: string;
  userId: string;
  userName: string;
}
