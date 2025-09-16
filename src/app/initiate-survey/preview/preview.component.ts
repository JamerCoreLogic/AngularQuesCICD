import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialog } from '@angular/material/legacy-dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from "src/environments/environment";
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent {
  URL: SafeResourceUrl;
  constructor(

    private dialogRef: MatDialogRef<PreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialog: MatLegacyDialog,
    private sanitizer: DomSanitizer
  ) { 
    // console.log("preview component data",data.previewData);
    const unsafeUrl = environment.AI_UIENDPOINT + 'aiinspection/insured/qustionnairepreview?aiInspectionSurveyId=' + data.previewData.aiInspectionSurveyId + '&emailId=' + data.previewData.emailId; 
    this.URL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
    // console.log("URL",this.URL);
  }

}
