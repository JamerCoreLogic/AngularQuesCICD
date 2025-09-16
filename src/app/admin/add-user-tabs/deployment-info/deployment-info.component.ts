import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatTableDataSource } from '@angular/material/table';
import { dateFormatValidator, futurDateValidator } from 'src/app/models/date.validator';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { PreviewResponseComponent } from '../preview-response/preview-response.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-deployment-info',
  templateUrl: './deployment-info.component.html',
  styleUrls: ['./deployment-info.component.scss']
})
export class DeploymentInfoComponent implements OnInit, AfterViewInit {

  deploymentInfoForm!: FormGroup
  data: any
  @Input() editUserDataFromParent: any;
  submit: boolean = false
  availabilityStatusOptions = ["Available", "Unavailable", "Deployed"]
  userType = Number((localStorage.getItem('LoggedUserType')));
  today = new Date();
  StatesList: any
  zipLabel = 'Zip';
  stateLabel = 'State'
  countries = [{ value: 'United States' }, { value: 'Canada' }]
  surveyList = new MatTableDataSource<any>([]);// Material Table Data Source
  displayedColumns: string[] = ['title', 'createOn', 'submittedOn', 'response']; // Columns to display
  submittedSurveyCount: number = 0; // Count of submitted surveys
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private fb: FormBuilder, private authService: AuthService, private el: ElementRef, private cdr: ChangeDetectorRef,
    private dialog: MatDialog) {
    this.createDeploymentInfoForm();

  }

  PostUserData(EditUserDataFromParent: any) {
    if (EditUserDataFromParent.availabilityStatus != null) {
      this.data = {
        ...EditUserDataFromParent,
        availabilityDate: this.formatDateWithMilliseconds(EditUserDataFromParent.availabilityDate)
      };

      // console.log("EditUserDataFromParent for deployment", this.data);
      this.FetchUser();
    }
  }

  formatDateWithMilliseconds(dateStr: string): string {
    // If dateStr is missing milliseconds, add '.000Z' at the end
    if (dateStr && !dateStr.includes('.')) {
      return dateStr + ".000Z";
    }
    return dateStr;
  }
  FetchUser() {
    // Convert the date string to Date object for the datepicker
    if (this.data.availabilityDate) {
      //this.data.availabilityDate = new Date(this.data.availabilityDate);
      let originalDateString = this.data.availabilityDate;


      // Parse the API date as UTC and convert to local timezone to get the correct date
      const utcDate = new Date(new Date(originalDateString.replace('Z','')));
      // console.log("UTC parsed date:", utcDate);

      if (!isNaN(utcDate.getTime())) {
        // Extract the local date components after timezone conversion
        const localDate = new Date(utcDate.getFullYear(), utcDate.getMonth(), utcDate.getDate());
        this.data.availabilityDate = localDate;

      }
    }

    this.deploymentInfoForm.patchValue(this.data);
    this.clearAvailabilityDateValidators();
  }

  ngOnInit(): void {
    this.getStates('United States');
    this.listenForDateInputChanges();
    this.isDeploymentInfoFormView();
    this.getUserData() // Load survey list
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.surveyList.paginator = this.paginator;

    setTimeout(() => {
      this.surveyList.sort = this.sort;
      const sortState: Sort = { active: 'submittedOn', direction: 'desc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    }, 0);



  }
  ngOnSimpleChanges(): void {
    this.surveyList.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'response':
          return item.submittedOn ? new Date(item.submittedOn) : null;

        // For all other columns, fall back to the default
        default:
          return (item as any)[property];
      }
    };
  }


  getUserData() {
    this.authService.getUserData().subscribe((res: any) => {
      if (res) {
        this.requestData = {
          adjusterId: res.userId,
          sortBy: "Name",
          sortOrder: "asc"
        };
        this.loadSurveyList();
      }
    });
  }

  listenForDateInputChanges() {
    this.deploymentInfoForm.get('availabilityDate')?.valueChanges
      .subscribe(val => {
        // console.log("Date selected:", val)
        const control = this.deploymentInfoForm.get('availabilityDate');
        if (control) {
          if (val) {
            control.setValidators([futurDateValidator]);
          } else {
            control.clearValidators();
          }
          control.updateValueAndValidity({ emitEvent: false });
        }
      });
  }

  createDeploymentInfoForm() {
    this.deploymentInfoForm = this.fb.group({
      availabilityStatus: ["Available"],
      availabilityDate: [],
      claimCapacity: [0, [Validators.min(0), Validators.max(1000)]],
      deploymentLocationAddress1: [],
      deploymentCountry: [],
      deploymentStreet: [],
      deploymentState: [],
      deploymentZip: [],
      deploymentCity: []
    });

    this.deploymentInfoForm.get('deploymentCountry')?.valueChanges.subscribe(() => {
      this.getStates(this.deploymentInfoForm.get('deploymentCountry')?.value);
    });

    // this.deploymentInfoForm.get('availabilityStatus')?.valueChanges.subscribe(() => {
    //   this.onStatusChange();
    // });
  }

  isDeploymentInfoFormValid() {
    if (this.userType == 1) {
      return { deploymentInfoForm: this.deploymentInfoForm.getRawValue() };
    }

    const status = this.deploymentInfoForm.get('availabilityStatus')?.value;
    if (status === 'Unavailable' && !this.deploymentInfoForm.get('availabilityDate')?.value) {
      Swal.fire({
        title: '',
        text: 'Please provide valid input.',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ffa022',
      });
      return false;
    }

    if (this.deploymentInfoForm.invalid) {
      this.submit = true;
      for (const key of Object.keys(this.deploymentInfoForm.controls)) {
        if (this.deploymentInfoForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          if (invalidControl) {
            invalidControl.focus();
          } else {
            // console.log(`Form control with name ${key} not found.`);
          }
          Swal.fire({
            title: '',
            text: 'Please provide valid input.',
            icon: 'warning',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          });
          break;
        }
      }
      return false;
    }

    return { deploymentInfoForm: this.deploymentInfoForm.getRawValue() };
  }

  isDeploymentInfoFormDirty() {
    return this.deploymentInfoForm.dirty;
  }

  isDeploymentInfoFormView() {
    const currentURL = window.location.href;
    const currentUrlObj = new URL(currentURL);
    const path = currentUrlObj.pathname;
    if (['/main/admin/view-profile'].includes(path)) {
      this.deploymentInfoForm.disable();
    }
  }

  reset() {
    this.submit = false;
    const currentURL = window.location.href;
    const currentUrlObj = new URL(currentURL);
    if (currentUrlObj.pathname == "/main/admin/add-user-tabs") {
      if (localStorage.getItem('editUser')) {
        let edituser = JSON.parse(localStorage.getItem('editUser') || '');
        this.FetchUser();
      } else {
        this.deploymentInfoForm.reset();
      }
    } else if (currentUrlObj.pathname == "/main/admin/update-profile") {
      let loggedUserid = localStorage.getItem('LoggeduserId');
      this.FetchUser();
    }
  }

  getStates(country: any) {
    let val = (country == 'United States' ? 1 : country == 'Canada' ? 2 : '');
    if (val) {
      this.authService.getStates(val).subscribe((res: any) => {
        if (res != null) {
          this.StatesList = res["data"];
        }
      });
    }
  }
  getStateZipLabel() {
    if (this.deploymentInfoForm.controls['deploymentCountry'].value == 'United States') {
      this.zipLabel = 'Zip';
      this.stateLabel = 'State'
    } else {
      this.zipLabel = 'Postal Code';
      this.stateLabel = 'Province'
    }
  }
  onStatusChange(): void {
    const statusControl = this.deploymentInfoForm.get('availabilityStatus');
    if (!statusControl) {
      return;
    }
    const status = statusControl.value;
    const availabilityDateControl = this.deploymentInfoForm.get('availabilityDate');

    if (!availabilityDateControl) {
      return; // or handle this case appropriately
    }

    if (status === 'Unavailable') {
      Swal.fire({
        title: 'When will you be available?',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ffa022'
      }).then((result) => {
        if (result.value) {
          availabilityDateControl.setValidators([
            Validators.required,
            futurDateValidator,
          ]);
          availabilityDateControl.setValue(null);
          availabilityDateControl.updateValueAndValidity();
        }
      });
    } else {
      this.clearAvailabilityDateValidators();
    }
  }

  clearAvailabilityDateValidators() {
    const availabilityDateControl = this.deploymentInfoForm.get('availabilityDate');
    const statusControl = this.deploymentInfoForm.get('availabilityStatus');

    if (availabilityDateControl) {
      availabilityDateControl.clearValidators();

      // Only clear the value if status is not 'Unavailable'
      if (statusControl?.value !== 'Unavailable') {
        availabilityDateControl.setValue(null);
      }

      availabilityDateControl.updateValueAndValidity();
    }
  }

  requestData: any;
  loadSurveyList(): void {
    // Simulate API call to fetch surveys


    this.authService.GetSurveysByAdjusterId(this.requestData).subscribe((res: any) => {
      // console.log("Survey List", res);
      if (res && res.data) {
        this.surveyList = new MatTableDataSource(res.data);
        this.submittedSurveyCount = res.data.length;
        this.surveyList.paginator = this.paginator;
        this.surveyList.sort = this.sort;
        // console.log('Data source:', this.surveyList);
        // console.log('Paginator:', this.surveyList.paginator);
      }
    });


    // Update submitted survey count

  }

  navigateToPreview(data: any) {
    // console.log("link data", data);

    // Condition: Check if survey is NOT submitted or surveyLinkID is missing
    if (!data.submittedOn) {
      Swal.fire({
        title: 'Warning',
        text: 'Survey is not submitted',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ffa022'
      });
      return;
    }

    // Open the dialog if both conditions are met
    this.openDialog(data.surveyLinkID);
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(PreviewResponseComponent, {
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

  enableEditMode() {
    this.deploymentInfoForm.enable();
  }


}
