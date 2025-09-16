import {AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdjustersService } from 'src/app/services/adjusters.service';


export interface DialogData {
  adjuster: any;
}

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit,AfterViewInit {
  qustionList: any;
  viewProfile: any;
  deploymentData:any;
   internalInfoForm!: FormGroup
  loggedUserTypeCheck = Number(localStorage.getItem('LoggedUserType'));
  QbRating = ["A", "B", "C", "D", "X", "PF","Pre-vet field residential", "Pre-vet field commercial", "Pre-vet desk residential","Pre-vet desk commercial","Pre-Vetted Proctor","Vetted Proctor"]
  fieldGrades = ["A", "B", "C", "D", "X"];
  constructor( public dialogRef: MatDialogRef<ViewProfileComponent>,private as: AdjustersService,private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private router:Router,private spinner:NgxSpinnerService) { 
      this.createAdditionalInfoForm();
    }

  ngOnInit(): void {
    this.spinner.show()
    // console.log("View Profile",this.data);
    this.as.GetViewProfileByUserId(this.data.adjuster.userId).subscribe((res:any)=>{
      
      this.viewProfile=res.data[0]
      this.qustionList=res?.data[0]?.additionalAndInternalInformation[0]
      this.deploymentData=res?.data[0]?.deploymentData[0]
      this.internalInfoForm.patchValue(this.qustionList)
      this.internalInfoForm.disable()
      // console.log("GetViewProfileByUserId",this.viewProfile);
      this.spinner.hide()
    },(err:any)=>{
      this.spinner.hide()
      //console.log(err);
    })
  }

  ngAfterViewInit(): void {
    //console.log("this.qustionList",this.qustionList);
  }
  transform() {
     
    // return this.sanitizer.bypassSecurityTrustResourceUrl(this.base64textString);
    const x = "data:image/png;base64,";
    var src;
    if (this.viewProfile?.profilePic) {
      src = x.concat(this.viewProfile.profilePic)
    }
    return src;
  }
  viewAdjusterProfile() {
    let user={
      userId:this.data.adjuster.userId
    }

    this.router.navigate(['/main/admin/view-profile']);
    localStorage.setItem('viewProfile', JSON.stringify(user));
    this.dialogRef.close()
  }
  editAdjusterProfile() {
    let user={
      userId:this.data.adjuster.userId
    }
    this.router.navigate(['/main/admin/add-user-tabs']);
    localStorage.setItem('editUser', JSON.stringify(this.data.adjuster));
    this.dialogRef.close()
  }
  createAdditionalInfoForm() {
    this.internalInfoForm = this.fb.group({
      residential_Field_Grade: [],
      commercial_Field_Grade: [],
      liability_Grade: [],
      inspector_Grade: [],
      desk_Grade: [],
      claims_Supervisor_Grade: [],
      file_Review_Grade: [],
      prevetting: [], // Previously "QB Rating"
      headLineOverview: [],
      internalNotes: [],
      goodCandidateFor: []
    })
    this.internalInfoForm.disable()
  }

  formatLabel(label: string): string {
    return label
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ')
      .trim();
  }

}
