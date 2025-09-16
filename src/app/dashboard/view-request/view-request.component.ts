import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.scss']
})
export class ViewRequestComponent implements OnInit {
  token: any;
  details: any;
  isDeclined: boolean = false;
  adjusterRequestId: any;
  receivedOn: any;
  isSubmitted!: boolean;
  acceptanceForm!: FormGroup;

  constructor(
    public dialog: MatDialog,
    private ar: ActivatedRoute,
    private router: Router,
    private ds: DashboardService,
    @Inject(MAT_DIALOG_DATA) public communicationID: any,
    private spinner: NgxSpinnerService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.acceptanceForm = new FormGroup({
      'xactNetAddress': new FormControl('', [
        Validators.required,
        Validators.maxLength(200)
      ]),
      'inspectLossTime': new FormControl('', [
        Validators.required,
        Validators.maxLength(2)
      ]),
      'estimateReturnTime': new FormControl('', [
        Validators.required,
        Validators.maxLength(2)
      ]),
      'remarks': new FormControl('')
    });
  }

  ngOnInit(): void {
    if (!this.communicationID) {
      this.acceptanceForm.enable();
      return;
    }

    if (this.communicationID.data) {
      this.spinner.show();
      this.ds.GetCommunicationResponse(this.communicationID.data).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res?.data?.[0]) {
            this.details = res.data[0];
            this.acceptanceForm.patchValue({
              xactNetAddress: this.details.xactnetAddress || '',
              inspectLossTime: this.details.insuredClaimantCanInspectLossInDays?.toString() || '',
              estimateReturnTime: this.details.returnTheEstimateInDays?.toString() || '',
              remarks: this.details.remarks || ''
            });
            this.acceptanceForm.disable();
          }
        },
        error: (error: any) => {
          this.spinner.hide();
          console.error('Error fetching communication response:', error);
        }
      });
    }
  }
}
