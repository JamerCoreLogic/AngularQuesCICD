import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { SecureViewerComponent } from 'src/app/explorer/components/secure-viewer/secure-viewer.component';

interface Attachment {
  id?: number | string;  // number for saved attachments, string for pending
  name: string;
  fileType: string;
  uploadDate: Date;
  expirationDate?: Date;
  filePath?: string;
  status?: 'pending' | 'saved' | 'failed';
}

interface PendingAttachment {
  id: string;  // Temporary local ID
  fileName: string;
  fileType: string;
  fileExtention: string;
  fileData: string;
  mimeType: string;
  description?: string;
  expirationDate?: string;
  uploadedDate: string;
  status: 'pending';
  uploadedBy: number;
  modiFiedOn: string;
  modiFiedBy: number;
}

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit, AfterViewInit {
  @ViewChild('uploadDialog') uploadDialog!: TemplateRef<any>;
  
  attachmentForm: FormGroup;
	  displayedColumns: string[] = ['name', 'fileType', 'uploadDate', 'expirationDate', 'actions'];
  pendingUploads: PendingAttachment[] = [];
  uploadingPending = false;
  failedUploads: string[] = [];  // Store failed upload IDs
  dataSource = new MatTableDataSource<Attachment>();
  dialogRef: MatDialogRef<any> | null = null;
  totalItems = 0;
  isNFIPCertification = false;
  userId = localStorage.getItem('LoggeduserId');
  currentlyEditingUser= localStorage.getItem('currentlyEditingUserId');
  disableUploadButton=true;
  fileTypeOptions: string[] = [];
  allowedExtensions: { [key: string]: string } = {};

  allowedFileTypes = ['.pdf','.docx', '.jpg', '.jpeg', '.png'];
 
  // Edit state
  isEditMode = false;
  editingAttachmentRef: { isPending: boolean; id: string | number } | null = null;
  editingOriginalFileName: string | null = null;
  isViewMode=false;

  
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private spinner: NgxSpinnerService

  ) {
    this.attachmentForm = this.fb.group({
      fileType: ['', Validators.required],
      otherDescription: [''],
      expirationDate: [''],
      file: ['', Validators.required]
    });

    // Add conditional validation for otherDescription
    this.attachmentForm.get('fileType')?.valueChanges.subscribe(value => {
      // console.log("fileType",value)
      if (value == null || value == undefined || value == ''){
      this.disableUploadButton=true;
      }else{
        this.disableUploadButton=false;
      }
      const otherDescription = this.attachmentForm.get('otherDescription');
      if (value === 'Other') {
        otherDescription?.setValidators(Validators.required);
      } else {
        otherDescription?.clearValidators();
      }
      otherDescription?.updateValueAndValidity();
    });

    // Add conditional validation for expirationDate
    this.attachmentForm.get('fileType')?.valueChanges.subscribe(value => {
      const expirationDate = this.attachmentForm.get('expirationDate');
      if (value === 'NFIP Certification') {
        expirationDate?.setValidators(Validators.required);
      } else {
        expirationDate?.clearValidators();
      }
      expirationDate?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    // Load file types and their allowed extensions
    // console.log("user id",this.userId)
    
    setTimeout(() => {
      this.currentlyEditingUser = localStorage.getItem('currentlyEditingUserId');
      // console.log("current user id",this.currentlyEditingUser)
      if(this.currentlyEditingUser != null && this.currentlyEditingUser != undefined){
        this.loadAttachments();
      }

    }, 3000);
    this.getActiveFileTypes()
    

    

    // Watch for file type changes to handle NFIP validation
    this.attachmentForm.get('fileType')?.valueChanges.subscribe(value => {
      this.isNFIPCertification = value === 'NFIP Certification';
      const expirationDate = this.attachmentForm.get('expirationDate');
      
      if (this.isNFIPCertification) {
        expirationDate?.setValidators(Validators.required);
      } else {
        expirationDate?.clearValidators();
      }
      expirationDate?.updateValueAndValidity();
    });
    this.isAttachmentsFormView();
  }

  ngAfterViewInit():void {    
  }
  getActiveFileTypes(){
    this.authService.getActiveFileTypes().subscribe(response => {
      if (response.success && response.data) {
        this.fileTypeOptions = response.data.map(item => item.fileType).sort();
        response.data.forEach(item => {
          this.allowedExtensions[item.fileType] = item.expectedFileExtention;
        });
      }
    });
  }

  loadAttachments(pageIndex: number = 0, pageSize: number = 10): void {
    this.currentlyEditingUser=localStorage.getItem('currentlyEditingUserId');
    this.spinner.show();
    this.authService.getAdjusterAttachmentsByUserId({
      userId: parseInt(this.currentlyEditingUser), 
      sortBy: 'fileType', 
      sortDescending: false
    }).subscribe(response => {
      if (response.success && response.data) {
                  this.dataSource.data = response.data.attachments.map(attachment => ({
            id: attachment.id,
            name: attachment.fileName,
            fileType: attachment.fileType,
            uploadDate: this.parseUTCDate(attachment.uploadedDate),
            expirationDate: attachment.expirationDate ? this.parseUTCDate(attachment.expirationDate) : null,
            filePath: attachment.systemFilename
          }));
          // console.log("parse date",this.parseUTCDate(response.data.attachments[0].expirationDate) )
        this.totalItems = response.data.totalCount;
      } else {
        Swal.fire({
          title: '',
          text: response.message || 'Failed to load attachments',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#ffa022',
        });
      }
    }, error => {
      console.error('Error loading attachments:', error);
      Swal.fire({
        title: '',
        text: 'Failed to load attachments. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ffa022',
      });
    },()=>{
      this.spinner.hide();
    });
  }

  openUploadDialog(): void {
    // Default to add mode
    this.isEditMode = false;
    this.editingAttachmentRef = null;
    this.editingOriginalFileName = null;
    this.setFileRequired(true);
    this.attachmentForm.reset();
    this.selectedFile = null;
    this.dialogRef = this.dialog.open(this.uploadDialog, {
      width: '500px',
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result === 'uploaded') {
        if(this.currentlyEditingUser != null && this.currentlyEditingUser != undefined){
          this.loadAttachments(); // Refresh the list
        }
      }
      this.selectedFile = null;
      this.attachmentForm.reset();
    });
  }
  
  private setFileRequired(isRequired: boolean): void {
    const control = this.attachmentForm.get('file');
    if (!control) { return; }
    if (isRequired) {
      control.setValidators([Validators.required]);
    } else {
      control.clearValidators();
    }
    control.updateValueAndValidity({ emitEvent: false });
  }

  openEditDialog(row: Attachment): void {
    this.isEditMode = true;
    this.selectedFile = null;
    this.editingOriginalFileName = row.name;
    this.setFileRequired(false);

    if (row.status === 'pending' && typeof row.id === 'string') {
      // Pending: load from local cache
      const pending = this.pendingUploads.find(p => p.id === row.id);
      if (!pending) { return; }
      this.editingAttachmentRef = { isPending: true, id: pending.id };
      this.attachmentForm.patchValue({
        fileType: pending.fileType,
        otherDescription: pending.description || '',
        expirationDate: pending.expirationDate ? new Date(pending.expirationDate) : ''
      });
      this.isNFIPCertification = pending.fileType === 'NFIP Certification';
      // attach existing file to form control and selectedFile
      this.selectedFile = { name: pending.fileName, base64: pending.fileData };
      this.attachmentForm.patchValue({ file: pending.fileData });
    } else if (typeof row.id === 'number' && this.currentlyEditingUser) {
      // Saved: fetch full details then patch
      this.spinner.show();
      this.editingAttachmentRef = { isPending: false, id: row.id };
      this.authService.getAdjusterAttachmentByIdAndUserId({
        id: row.id,
        userId: parseInt(this.currentlyEditingUser)
      }).subscribe(res => {
        if (res.success && res.data) {
          this.attachmentForm.patchValue({
            fileType: res.data.fileType,
            otherDescription: res.data.description || '',
            expirationDate: res.data.expirationDate ? new Date(res.data.expirationDate) : ''
          });
          this.isNFIPCertification = res.data.fileType === 'NFIP Certification';
          this.editingOriginalFileName = res.data.fileName;
          // attach existing file to form control and selectedFile
          this.selectedFile = { name: res.data.fileName, base64: res.data.fileData };
          this.attachmentForm.patchValue({ file: res.data.fileData });
        }
      }, () => {}, () => {
        this.spinner.hide();
      });
    }

    this.dialogRef = this.dialog.open(this.uploadDialog, {
      width: '500px',
      disableClose: true
    });
  }
    selectedFile: { name: string; base64: string } | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      const fileType = this.attachmentForm.get('fileType')?.value;
      const allowedExtensions = this.allowedExtensions[fileType];
      // console.log("fileType",fileType)
      // console.log("allowedExtensions",allowedExtensions)

      if (!allowedExtensions || !allowedExtensions.split(',').includes(extension)) {
        Swal.fire({
          title: '',
          text: `Invalid file type. Allowed types for ${fileType}: ${allowedExtensions}`,
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#ffa022',
        });
        event.target.value = '';
        return;
      }

      const maxFileSize = 25 * 1024 * 1024; // 25MB
      if (file.size > maxFileSize) {
        Swal.fire({
          title: '',
          text: 'File size exceeds the 25MB limit.',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#ffa022',
        });
        event.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = btoa(e.target.result);
        this.selectedFile = {
          name: file.name,
          base64: base64String
        };
        this.attachmentForm.patchValue({ file: base64String });
      };
      reader.readAsBinaryString(file);
    }
  }
  pandingUploads:any[]=[];

  onSubmit(): void {
    // Add or Edit
    this.currentlyEditingUser=localStorage.getItem('currentlyEditingUserId');
    if (!this.attachmentForm.valid || !this.userId) { return; }

    const fileType = this.attachmentForm.get('fileType')?.value;
    const currentTime = this.formatUtcNow(); // UTC format

    // EDIT MODE
    if (this.isEditMode && this.editingAttachmentRef) {
      const isPending = this.editingAttachmentRef.isPending;
      const hasNewFile = !!this.selectedFile;

      const expirationUtc = this.toUtcDateOnly(this.attachmentForm.get('expirationDate')?.value);

      if (isPending) {
        // Update in-memory pending record
        const idx = this.pendingUploads.findIndex(p => p.id === this.editingAttachmentRef!.id);
        if (idx > -1) {
          const original = this.pendingUploads[idx];
          const updated: PendingAttachment = {
            ...original,
            fileName: hasNewFile ? this.selectedFile!.name : original.fileName,
            fileType: fileType,
            description: fileType === 'Other' ? this.attachmentForm.get('otherDescription')?.value : undefined,
            expirationDate: expirationUtc,
            modiFiedOn: currentTime,
            modiFiedBy: parseInt(this.userId),
            ...(hasNewFile ? {
              fileData: this.selectedFile!.base64,
              fileExtention: '.' + this.selectedFile!.name.split('.').pop()?.toLowerCase(),
              mimeType: this.getMimeType(this.selectedFile!.name)
            } : {})
          };
          this.pendingUploads[idx] = updated;
          this.updateDataSource();
          this.dialogRef?.close('uploaded');
          Swal.fire({ title: '', text: 'Attachment updated.', icon: 'success', confirmButtonText: 'Ok', confirmButtonColor: '#ffa022' });
        }
        return;
      }

      // Saved record update via API (reuse same upload endpoint and payload)
      if (typeof this.editingAttachmentRef.id === 'number' && this.currentlyEditingUser) {
        // Build the same payload used for upload
        const payload: any = {
          userId: parseInt(this.currentlyEditingUser),
          fileName: this.selectedFile!.name,
          fileType: fileType,
          description: fileType === 'Other' ? this.attachmentForm.get('otherDescription')?.value : undefined,
          expirationDate: expirationUtc,
          fileExtention: '.' + this.selectedFile!.name.split('.').pop()?.toLowerCase(),
          fileData: this.selectedFile!.base64,
          mimeType: this.getMimeType(this.selectedFile!.name),
          uploadedBy: parseInt(this.userId),
          uploadedDate: currentTime,
          modiFiedOn: currentTime,
          modiFiedBy: parseInt(this.userId),
          id: Number(this.editingAttachmentRef.id)
        };

        this.spinner.show();
        this.authService.uploadAdjusterAttachment(payload).subscribe(res => {
          if (res.success) {
            Swal.fire({ title: '', text: 'Attachment updated successfully', icon: 'success', confirmButtonText: 'Ok', confirmButtonColor: '#ffa022' })
              .then(() => {
                this.dialogRef?.close('uploaded');
                this.loadAttachments();
              });
          } else {
            Swal.fire({ title: '', text: res.message || 'Failed to update attachment', icon: 'error', confirmButtonText: 'Ok', confirmButtonColor: '#ffa022' });
          }
        }, () => {
          Swal.fire({ title: '', text: 'Failed to update attachment. Please try again.', icon: 'error', confirmButtonText: 'Ok', confirmButtonColor: '#ffa022' });
        }, () => {
          this.spinner.hide();
        });
        return;
      }
    }

    // ADD MODE (existing flow)
    if (this.selectedFile) {
      const fileType = this.attachmentForm.get('fileType')?.value;
      const fileData = this.selectedFile.base64;
      const fileName = this.selectedFile.name;
      const fileExtension = '.' + fileName.split('.').pop()?.toLowerCase();
      const currentTime = this.formatUtcNow(); // UTC format
      
      const baseData: Omit<PendingAttachment, 'id' | 'status'> = {
        fileName: fileName,
        fileType: fileType,
        fileExtention: fileExtension,
        fileData: fileData,
        uploadedBy: parseInt(this.userId),
        mimeType: this.getMimeType(fileName),
        uploadedDate: currentTime,
        modiFiedOn: currentTime,
        modiFiedBy: parseInt(this.userId),
        description: fileType === 'Other' ? this.attachmentForm.get('otherDescription')?.value : undefined,
        expirationDate: this.toUtcDateOnly(this.attachmentForm.get('expirationDate')?.value)
      };

      // If no currentlyEditingUser, store as pending
      if (!this.currentlyEditingUser) {
        this.addPendingUpload(baseData);
        Swal.fire({
          title: '',
          text: 'File added to pending uploads. It will be uploaded when the profile is saved.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#ffa022',
        }).then(() => {
          this.dialogRef?.close('uploaded');
        });
      } else {
        // If we have a user ID, upload directly
        const uploadData = {
          ...baseData,
          userId: parseInt(this.currentlyEditingUser)
        };
        this.spinner.show();
        this.authService.uploadAdjusterAttachment(uploadData).subscribe(
          response => {
            if (response.success) {
              Swal.fire({
                title: '',
                text: 'File uploaded successfully',
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              }).then(() => {
                this.dialogRef?.close('uploaded');
                this.loadAttachments();
              });
            } else {
              Swal.fire({
                title: '',
                text: response.message || 'Failed to upload file',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              });
            }
          },
          error => {
            console.error('Error uploading file:', error);
            Swal.fire({
              title: '',
              text: 'Failed to upload file. Please try again.',
              icon: 'error',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            });
          },
          ()=>{
            this.spinner.hide();
          }
        );
      }
    }
  }

  onPageChange(event: PageEvent): void {
    this.loadAttachments(event.pageIndex, event.pageSize);
  }

  sortData(sort: Sort): void {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'fileType': return compare(a.fileType, b.fileType, isAsc);
        case 'uploadDate': return compare(a.uploadDate, b.uploadDate, isAsc);
        case 'expirationDate': 
          if (!a.expirationDate) return isAsc ? -1 : 1;
          if (!b.expirationDate) return isAsc ? 1 : -1;
          return compare(a.expirationDate, b.expirationDate, isAsc);
        default: return 0;
      }
    });
  }

  viewAttachment(attachment: Attachment): void {
    if (attachment.id && this.userId && typeof attachment.id === 'number') {
      this.spinner.show();
      this.authService.getAdjusterAttachmentByIdAndUserId({
        id: attachment.id,
        userId: parseInt(this.currentlyEditingUser)
      }).subscribe(
        response => {
          if (response.success && response.data) {
            // Create a temporary link to download/view the file
            const fileData = response.data.fileData;
            const fileName = response.data.fileName;
            const mimeType = response.data.mimeType || this.getMimeType(fileName);
            const fileType = this.getFileType(mimeType)
            const base64Data = `data:${mimeType};base64,${fileData}`

            // console.log("fileType",fileType)
            // console.log("mimeType",mimeType)
            // console.log("base64Data",base64Data)
            // console.log("fileName",fileName)
            this.openSecureViewer({ type: fileType, url: base64Data, name: fileName, isDownloadable: false });

          } else {
            Swal.fire({
              title: '',
              text: response.message || 'Failed to load attachment',
              icon: 'error',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            });
          }
        },
        error => {
          console.error('Error loading attachment:', error);
          Swal.fire({
            title: '',
            text: 'Failed to load attachment. Please try again.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          });
        },
        ()=>{
          this.spinner.hide();
        }
      );
    }
  }
  getFileType(mimeType:string){
    const viewerConfig = {
      'application/pdf': { type: 'pdf', method: 'getFile', mimeType: 'application/pdf' },
      'pdf': { type: 'pdf', method: 'getFile', mimeType: 'application/pdf' },
      'image': { type: 'image', method: 'getFile', mimeType: 'image/jpeg' },
      'image/png': { type: 'image', method: 'getFile', mimeType: 'image/png' },
      'image/jpeg': { type: 'image', method: 'getFile', mimeType: 'image/jpeg' },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { type: 'doc', method: 'getFile', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      '8/vnd.openxmlformats-officedocument.wordprocessingml.document': { type: 'doc', method: 'getFile', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      'xlsx': { type: 'xlsx', method: 'getFile', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      'xls': { type: 'xls', method: 'getFile', mimeType: 'application/vnd.ms-excel' },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { type: 'xlsx', method: 'getFile', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      'pptx': { type: 'pptx', method: 'getFile', mimeType: 'application/vnd.ms-powerpoint' },
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': { type: 'pptx', method: 'getFile', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
      'txt': { type: 'txt', method: 'getFile', mimeType: 'text/plain' },
  };
  return viewerConfig[mimeType as keyof typeof viewerConfig]?.type || 'other';
  }



  private openSecureViewer(data: { type: string, url: string ,name:string ,isDownloadable?:boolean ,path?:string}) {
    this.dialog.open(SecureViewerComponent, {
      panelClass: 'folder-dialog-class',
      width: '80%',
      height: '90%',
      data
    });
  }

  /**
   * Deletes an attachment, handling both pending and saved attachments
   * @param attachment The attachment to delete
   */
  deleteAttachment(attachment: Attachment): void {
    const isPending = attachment.status === 'pending';
    const confirmMessage = isPending ? 
      'You want to remove this pending attachment?' : 
      'You want to delete this attachment?';

    Swal.fire({
      title: 'Are you sure?',
      text: confirmMessage,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#ffa022',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        if (isPending) {
          // For pending attachments, find the matching pending upload
          const pendingAttachment = this.pendingUploads.find(
            p => p.fileName === attachment.name && p.fileType === attachment.fileType
          );
          if (pendingAttachment) {
            this.removePendingUpload(pendingAttachment.id);
            Swal.fire({
              title: '',
              text: 'Pending attachment removed successfully',
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ffa022',
            });
          }
        } else if (attachment.id && typeof attachment.id === 'number') {
          // For saved attachments, call API
          this.spinner.show();
          this.authService.deleteAttachment({ 
            id: attachment.id,
            userId: parseInt(this.userId)
          }).subscribe(
            response => {
              if (response.success) {
                Swal.fire({
                  title: '',
                  text: 'Attachment deleted successfully',
                  icon: 'success',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#ffa022',
                }).then(() => {
                  this.loadAttachments();
                });
              } else {
                Swal.fire({
                  title: '',
                  text: response.message || 'Failed to delete attachment',
                  icon: 'error',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#ffa022',
                });
              }
            },
            error => {
              console.error('Error deleting attachment:', error);
              Swal.fire({
                title: '',
                text: 'Failed to delete attachment. Please try again.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#ffa022',
              });
            },
            ()=>{
              this.spinner.hide();
            }
          );
        }
      }
    });
  }

  private getMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png'
    };
    return mimeTypes[extension || ''] || 'application/octet-stream';
  }

  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  private parseUTCDate(dateString: string): Date {
    // Parse the date string and ensure it's treated as UTC
    const date = new Date(dateString);
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      )
    );
  }

  // Returns current time in UTC without milliseconds
  private formatUtcNow(): string {
    return new Date().toISOString().split('.')[0] + 'Z';
  }

  // Normalizes a date coming from datepicker to midnight UTC and returns ISO string without milliseconds
  private toUtcDateOnly(value: any): string | undefined {
    if (!value) { return undefined; }
    const d = new Date(value);
    const utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0));
    return utc.toISOString().split('.')[0] + 'Z';
  }

  // Method to add pending upload
  addPendingUpload(data: Omit<PendingAttachment, 'id' | 'status'>) {
    const pendingUpload: PendingAttachment = {
      ...data,
      id: `pending-${Date.now()}`,
      status: 'pending'
    };
    this.pendingUploads.push(pendingUpload);
    this.updateDataSource();
  }

  // Method to remove pending upload
  removePendingUpload(id: string) {
    // console.log("removePendingUpload",id)
    this.pendingUploads = this.pendingUploads.filter(upload => upload.id !== id);
    // console.log("pendingUploads",this.pendingUploads)
    this.updateDataSource();
  }

  // Method to clear all pending uploads
  clearPendingUploads() {
    this.pendingUploads = [];
    this.updateDataSource();
  }

  // Method to get all pending uploads
  getPendingUploads(): PendingAttachment[] {
    return [...this.pendingUploads];
  }

  // Method to mark upload as failed
  markUploadFailed(id: string) {
    this.failedUploads.push(id);
  }

  // Method to clear failed uploads
  clearFailedUploads() {
    this.failedUploads = [];
  }

  // Method to check if an upload failed
  isUploadFailed(id: string): boolean {
    return this.failedUploads.includes(id);
  }

  // Method to update the data source with both saved and pending attachments
  private updateDataSource() {
    // Get current saved attachments (filter out any pending ones that might have gotten in)
    const savedAttachments = this.dataSource.data.filter(attachment => !attachment.status);

    // Map pending uploads to Attachment format
    const pendingAttachments: Attachment[] = this.pendingUploads.map(pending => ({
      id: pending.id,  // Include the temporary id for pending attachments
      name: pending.fileName,
      fileType: pending.fileType,
      uploadDate: this.parseUTCDate(pending.uploadedDate),
      expirationDate: pending.expirationDate ? this.parseUTCDate(pending.expirationDate) : null,
      status: 'pending' as const
    }));

    // Combine pending and saved attachments
    this.dataSource.data = [...pendingAttachments, ...savedAttachments];
  }

  isAttachmentsFormValid(): boolean {
    return this.attachmentForm.valid;
  }

  isAttachmentsFormDirty(): boolean {
    return this.attachmentForm.dirty;
  }

  /**
   * Clears all pending uploads and resets the form
   * @param clearSavedAttachments - Whether to also clear the saved attachments from the table
   */
  reset(clearSavedAttachments: boolean = false): void {
    // Reset form
    this.attachmentForm.reset();
    this.selectedFile = null;

    // Clear pending uploads
    this.pendingUploads = [];
    this.failedUploads = [];

    // Clear saved attachments if requested
    if (clearSavedAttachments && this.dataSource) {
      this.dataSource.data = [];
    } else {
      // Reload saved attachments
      this.loadAttachments();
    }

    // Update table
    this.updateDataSource();
  }

  /**
   * Processes all pending uploads after successful save
   * @returns Observable that completes when all pending uploads are processed
   */
  processPendingUploadsAndClear(): Observable<Array<{
    success: boolean;
    message?: string;
    fileName: string;
    error?: any;
  }>> {
    // Get the current user ID
    const userId = parseInt(localStorage.getItem('currentlyEditingUserId') || '0', 10);
    if (!userId || this.pendingUploads.length === 0) {
      return of([]);
    }

    // Show loading indicator
    this.uploadingPending = true;

    // Process uploads sequentially
    return this.authService.processPendingUploads(userId, this.pendingUploads).pipe(
      tap(results => {
        // Handle results
        results.forEach(result => {
          if (!result.success) {
            this.markUploadFailed(result.fileName);
          }
        });

        // Clear successful uploads
        this.pendingUploads = this.pendingUploads.filter(upload => 
          this.failedUploads.includes(upload.fileName)
        );

        // Update table
        this.updateDataSource();

        // Hide loading indicator
        this.uploadingPending = false;
      }),
      catchError((error: any) => {
        console.error('Error processing pending uploads:', error);
        this.uploadingPending = false;
        return of([]);
      })
    );
  }

  getAttachmentsData(): any[] {
    return this.dataSource.data.map(attachment => ({
      id: attachment.id,
      name: attachment.name,
      fileType: attachment.fileType,
      uploadDate: attachment.uploadDate,
      expirationDate: attachment.expirationDate || null,
      filePath: attachment.filePath
    }));
  }
  enableEditMode(){
    this.isViewMode=false;
    // console.log("view mode",this.isViewMode)
  }
  isAttachmentsFormView(){
    const currentURL = window.location.href;
      const currentUrlObj = new URL(currentURL);
      const path = currentUrlObj.pathname;
      if(['/main/admin/view-profile'].includes(path)){
        this.attachmentForm.disable();
        this.isViewMode=true
        }
  }
}

function compare(a: any, b: any, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

