import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialog } from '@angular/material/legacy-dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AiApiService } from 'src/app/services/ai-api.service';


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  body: any = '';
  subject: any = '';
  rawBody: any;
  constructor
  (
    private dialogRef: MatDialogRef<EmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialog: MatLegacyDialog,
    private sanitizer: DomSanitizer,
    @Inject(AiApiService) private aiApi: AiApiService,
  ) { }

  ngOnInit(): void {
    this.getEmailPreviewData();
    // console.log("email data", this.data);
  }

  sanitizerHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getEmailPreviewData() {
    this.aiApi.getemailPreviewData(this.data.previewData.aiInspectionSurveyId).subscribe((res: any) => {
      // console.log("email preview data", res);
      // console.log("email preview data", this.data.previewData);
      this.rawBody = res.data.body;
      this.subject = res.data.subject;
      const replacements = {
        Name: this.data.previewData.data.Name,
        EmailId: this.data.previewData.data.EmailId,
        Location: this.data.previewData.surveyLocation,
        ClaimType: this.data.previewData.claimType,
        NoOfClaims: this.data.previewData.NoOfClaims,
        LossType: this.data.previewData.lossType
      };
      this.body = this.replacePlaceholders(this.replaceWhiteSpace(this.rawBody), replacements);
      // console.log("Processed email body", this.body);
    });
  }

  replacePlaceholders(template: string, values: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) =>
      values.hasOwnProperty(key) ? values[key] : match
    );
  }

  replaceWhiteSpace(data: string): string {
    return data.replace(/white-space:pre-wrap/g, 'white-space:normal');
  }


  

}
