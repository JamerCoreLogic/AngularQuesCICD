import {animate, state, style, transition, trigger} from '@angular/animations';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, forkJoin, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-file-trac-info',
  templateUrl: './file-trac-info.component.html',
  styleUrls: ['./file-trac-info.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class FileTracInfoComponent implements OnInit {
  @Input() userType: number | undefined;
  @Input() userRole: number | undefined;
  filetracDataByYear: FiletracDataByYear[] = [];
  filetracDataByName: FiletracDataByName[] = [];
  dataSource = this.filetracDataByYear;
  dataSource2 = this.filetracDataByName;
  columnsToDisplay = ['year', 'totalClaims'];
  columnsToDisplay2 = ['companyName', 'totalClaims'];
  years:string[]=[]
  totalNumberOfClaimByYear:number[]=[]
  numberzOfClients:number=0
  fileTracForm!:FormGroup
  userData:any
  role:any
  updateBtnAlowed:boolean=true
  updateBtnDisabled:boolean=false
  currentUser:any= JSON.parse(localStorage.getItem('currentUser')!)


  constructor(private authService: AuthService , private fb:FormBuilder, private SpinnerService:NgxSpinnerService) {
    this.createAdditionalInfoForm()
  }

  ngOnInit(): void {
    this.getRoleData();
    this.getUserData()
      .then(() => this.getFileTracId())
    this.isFileTracIdEdit();
    this.isFileTracFormView();
  }
  createAdditionalInfoForm() {
    this.fileTracForm = this.fb.group({
      userId: [0],
      total_Number_Of_Claim: [],
    
    })
  }
  ngAfterViewInit(): void {
  }

isFileTracIdEdit(){
  if(this.role && !(this.role==1 || this.role==2)){
    this.fileTracForm.disable()
    this.updateBtnAlowed=false


  }
}
  getRoleData(){
    this.role = JSON.parse(localStorage.getItem('LoggedUserRole')!)
  }

getUserData(): Promise<void> {
  return new Promise((resolve) => {
    this.authService.getUserData().subscribe((res: any) => {
      if (res) {
        this.userData = res;
        // console.log("userData",this.userData)
      }
      resolve();
    });
  });
}

getFileTracId(): Promise<void> {
  return new Promise((resolve) => {
    if(this.userData == null || this.userData == undefined){
        this.fileTracForm.disable();
        this.updateBtnDisabled=true
      return resolve()
    }
    let payload = {
      userId: this.userData.userId || 0,
      email: this.userData.Email || this.userData.emailAddress
    };
    this.authService.GetFileTracId(payload).subscribe((item: any) => {
      this.fileTracForm.controls['userId'].setValue(item.data);
      this.userData.fileTracId = item.data;
      this.getFileTracDataGroupByYear();
      resolve();
    });
  });
}

getFileTracDataGroupByYear() {
  this.SpinnerService.show()
  const fileTracId = this.userData.fileTracId || 0;
  let fileTracDataGroupByYear = this.authService.GetFileTracDataGroupByYear(fileTracId);
  let fileTracDataGroupByCompanyName =this.authService.GetFileTracDataGroupByCompanyName(fileTracId);
  let numberzOfClients = this.authService.GetTotalNumberOfClaims(fileTracId);
  forkJoin([
    fileTracDataGroupByYear,
    fileTracDataGroupByCompanyName,
    numberzOfClients
  ]).pipe(
    catchError(error => {
      // Handle the error here
      console.error(error);
      // Hide the spinner
      this.SpinnerService.hide();
      // Show the error message
      Swal.fire({
        title: '',
        text: error.message,
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ffa022',
      })
      // Return an empty array to avoid breaking the app
      return of([]);
    })
  ).subscribe((result: any) => {
    // console.log('result', result);
    this.filetracDataByYear = result[0].data.sort((a: FiletracDataByYear, b: FiletracDataByYear) => parseInt(b.year) - parseInt(a.year));
    this.filetracDataByName = result[1].data;
    this.numberzOfClients = result[2].data;
    
    this.fileTracForm.controls['total_Number_Of_Claim'].setValue(this.numberzOfClients);
    this.fileTracForm.controls['total_Number_Of_Claim'].disable();
    
    this.getDataForChart(this.filetracDataByYear, this.filetracDataByName);
    this.dataSource = [...this.filetracDataByYear]; // Spread operator ensures table updates with sorted data
    this.dataSource2 = this.filetracDataByName;
    this.SpinnerService.hide();
  }
  );
}

  getHeaderDisplay(keyName: string): string {
    if (keyName && keyName == 'year') {
      keyName = 'Year';
    } else if (keyName == 'totalClaims') {
      keyName = 'Total Number of Claims';
    } else if (keyName == 'companyName') {
      keyName = 'Client Company';
    }
    return keyName;
  }
  getDataForChart(filetracByYear:any, filetracByName:any) {
    if (filetracByYear) {
      // Map years and total claims from the data
      this.years = filetracByYear.map((item: any) => item.year);
      this.totalNumberOfClaimByYear = filetracByYear.map((item: any) => item.totalClaims);
  
      // Sort years in descending order
      this.years.sort((a: string, b: string) => parseInt(b) - parseInt(a));
  
      // console.log("Sorted years", this.years, this.totalNumberOfClaimByYear);
    }
  }


getFileTracID(){
  return this.fileTracForm.controls['userId'].value
}
isFileTracFormDirty() {
  return this.fileTracForm.dirty;
}

isFileTracFormView(){
  const currentURL = window.location.href;
    const currentUrlObj = new URL(currentURL);
    const path = currentUrlObj.pathname;
    if(['/main/admin/view-profile'].includes(path)){
      this.fileTracForm.disable();
      this.updateBtnDisabled=true
      }
}
updateFileTracId(){
  let payload={
    email:this.userData.Email || this.userData.emailAddress,
    fileTracId:this.fileTracForm.controls['userId'].value,
    UserId:this.currentUser.data.userId || 0
  }
  this.authService.UpdateFileTracId(payload).subscribe((item:any)=>{
    if(item && item.success==true){
      // console.log("id updated")
      Swal.fire({
        title: '',
        text: item.message,
        icon: 'success',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ffa022',
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          this.userData.fileTracId=this.fileTracForm.controls['userId'].value
          this.getFileTracDataGroupByYear()
        }
      })
      
     
      
    }else{
      Swal.fire({
        title: '',
        text: item.message,
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ffa022',
      }).then((result)=>{
        if (result.isConfirmed || result.isDismissed) {
         this.fileTracForm.controls['userId'].reset()
        }
      })

    }

  })
}
 // Only Integer Numbers
 keyPressNumbers(event:any) {
  var charCode = (event.which) ? event.which : event.keyCode;
  // Only Numbers 0-9
  if ((charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
  } else {
    return true;
  }
}

enableEditMode() {
  this.fileTracForm.enable();
  this.updateBtnDisabled=false
  this.fileTracForm.controls['userId'].enable()
  this.fileTracForm.updateValueAndValidity()
}
}

export interface FiletracDataByYear {
  year: string;
  totalClaims: number;
}
export interface FiletracDataByName {
  companyName: string;
  totalClaims: number;
}

