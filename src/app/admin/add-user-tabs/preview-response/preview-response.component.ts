import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialog } from '@angular/material/legacy-dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-preview-response',
  templateUrl: './preview-response.component.html',
  styleUrls: ['./preview-response.component.scss']
})
export class PreviewResponseComponent implements OnInit, OnDestroy {
  URL: SafeResourceUrl;
  loadTimeout: any;
  isError: boolean = false;

  constructor(

    private dialogRef: MatDialogRef<PreviewResponseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialog: MatLegacyDialog,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService
  ) { 
    // console.log("preview component data",data);
    const unsafeUrl = environment.AI_UIENDPOINT + 'aiinspection/insured/qustionnairepreview?surveyLinkID='+data;
    this.URL = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
    // console.log("URL",this.URL);
  }
 

  ngOnInit() {
    // Show spinner on component initialization
    this.spinner.show();

    // Set a timeout to handle the scenario where the iframe never finishes loading
    this.loadTimeout = setTimeout(() => {
      // If we reach here, the iframe load event did not fire in time
      this.onIframeError();
    }, 30000); // 30 seconds timeout (adjust as needed)
  }

  ngOnDestroy() {
    // Clear timeout if component is destroyed earlier
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
    }
  }

  onIframeLoad() {
    // Iframe finished loading successfully
    this.spinner.hide();
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
    }
  }

  onIframeError() {
    // Handle error scenario: Hide spinner and show an error message
    this.isError = true;
    this.spinner.hide();
  }
}
