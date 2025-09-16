import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef } from '@angular/material/legacy-dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SpreadsheetChangeEvent, SpreadsheetComponent, SpreadsheetMainMenuItem } from '@progress/kendo-angular-spreadsheet';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from '../../services/data.service';
import { ConcreteDataService } from '../../services/concrete-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-secure-viewer',
  templateUrl: './secure-viewer.component.html',
  styleUrls: ['./secure-viewer.component.scss']
})
export class SecureViewerComponent implements OnInit, OnDestroy , AfterViewInit {
  public rotation: number = 0;
  public isDownloadable: boolean = false;
  @ViewChild('spreadsheet') spreadsheet: SpreadsheetComponent | undefined;
  public items: SpreadsheetMainMenuItem[] = [{ id: "home", active: true }];
  public safeUrl: SafeResourceUrl | undefined;

  constructor(
    public dialogRef: MatLegacyDialogRef<SecureViewerComponent>,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private dataService: ConcreteDataService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    // console.log("dialog box data", this.data);
    this.isDownloadable = this.data.isDownloadable;
    this.checkUserAllowed();
    if (this.data.type === 'txt') {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.url);
    }
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.preventShortcuts);
    document.removeEventListener('contextmenu', this.preventContextMenu);
  }

  ngAfterViewInit(): void {
    this.loadSpreadsheet();
  }

  private loadSpreadsheet() {
    setTimeout(() => {
      try {
        let blob: Blob;
        if (this.data.type === 'xlsx') {
          blob = this.base64toBlob(this.data.url, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        } else if (this.data.type === 'xls') {
          blob = this.base64toBlob(this.data.url, 'application/vnd.ms-excel');
        } else {
          console.error('Unsupported file type');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event: any) => {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // console.log('Parsed data:', jsonData);

          // Convert jsonData to Kendo Spreadsheet data format
          const kendoData = {
            sheets: [
              {
                name: firstSheetName,
                rows: jsonData.map((row: any, index: number) => ({
                  index: index,
                  cells: Object.keys(row).map((key, i) => ({
                    index: i,
                    value: row[key]
                  }))
                }))
              }
            ]
          };

          if (this.spreadsheet && this.spreadsheet.spreadsheetWidget) {
            this.spreadsheet.spreadsheetWidget.fromJSON(kendoData);
          } else {
            console.error('Spreadsheet component is not initialized.');
          }
        };
        reader.readAsArrayBuffer(blob);

      } catch (error) {
        console.error("Error loading spreadsheet:", error);
      }
    }, 500); // Delay to ensure spreadsheet component is ready
  }

  rotateLeft() {
    this.rotation = (this.rotation - 90 + 360) % 360;
  }

  rotateRight() {
    this.rotation = (this.rotation + 90) % 360;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  private preventShortcuts(event: KeyboardEvent) {
    if (event.ctrlKey && (event.key === 's' || event.key === 'p')) {
      event.preventDefault();
    } else if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
      event.preventDefault();
    }
  }

  private preventContextMenu(event: MouseEvent) {
    if ((event.target as HTMLElement).tagName !== 'VIDEO' && (event.target as HTMLElement).tagName !== 'PDF-VIEWER') {
      event.preventDefault(); // Disable right-click context menu, except for interactive video/pdf-viewer
    }
  }

  private base64toBlob(b64Data: string, contentType = ''): Blob {
    try {
      const isDataUrl = b64Data.startsWith('data:');
      const cleanedBase64 = isDataUrl ? b64Data.split(',')[1] : b64Data;
      const sanitizedBase64 = cleanedBase64.replace(/[^A-Za-z0-9+/=]/g, '');
      const byteCharacters = atob(sanitizedBase64);
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: contentType });
    } catch (error) {
      console.error("Failed to convert Base64 to Blob:", error);
      throw new Error("Invalid Base64 data");
    }
  }

  downloadFile() {
    let mimeType = '';
    let base64Data = '';
    let fileExtension = '';

    if (this.data.type === 'video') {
      this.downloadVideo();
      return;
    }

    const mimeTypeMatch = this.data.url.match(/^data:([^;]+);base64,(.+)$/);
    if (mimeTypeMatch) {
      mimeType = mimeTypeMatch[1];
      base64Data = mimeTypeMatch[2];
    } else {
      base64Data = this.data.url;
      switch (this.data.type) {
        case 'xlsx':
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          fileExtension = 'xlsx';
          break;
        case 'xls':
          mimeType = 'application/vnd.ms-excel';
          fileExtension = 'xls';
          break;
        case 'pdf':
          mimeType = 'application/pdf';
          fileExtension = 'pdf';
          break;
        case 'image':
          mimeType = 'image/png';
          fileExtension = 'png';
          break;
        default:
          mimeType = 'application/octet-stream';
          fileExtension = 'bin';
      }
    }

    const blob = this.base64toBlob(base64Data, mimeType);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.data.name || 'downloaded_file'}.${fileExtension}`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  checkUserAllowed() {
    const currentUserData = localStorage.getItem('currentUser');
    if (currentUserData) {
      const roles = JSON.parse(currentUserData).data.role;
      const isAdminOrSuperAdmin = roles.some((role: any) => role.roleName === 'Super Admin' || role.roleName === 'Admin');
      if (isAdminOrSuperAdmin) {
        this.isDownloadable = true;
      }
    }
  }

  downloadVideo() {
    this.spinner.show();
    this.dataService.downloadVideoFile(this.data.path).subscribe({
      next: (blob: Blob) => {
        this.spinner.hide();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.data.name || 'downloaded_video'}.mp4`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Failed to download video:', err);
      }
    });
  }
}