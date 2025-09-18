import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AQUserInfo } from '@agenciiq/login';
import { AQBranchService, AQAgencyService } from '@agenciiq/agency';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { KeyboardValidation } from '../../../../shared/services/aqValidators/keyboard-validation';
import { AQZipDetailsService } from '@agenciiq/aqadmin';
import { Subject, Subscription } from 'rxjs';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';
import { BranchScreen } from 'src/app/global-settings/error-message/branch-screen';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.sass'],
  standalone: false
})
export class BranchComponent implements OnInit, OnDestroy {
  _BranchScreen: BranchScreen = null;
  branchForm: FormGroup;
  branchDetails = [];
  newBranchList = [];
  submitted: boolean = false;
  isZipInvalid: boolean = false;
  zipErrorMessage: string;
  isAddress1Valid = false;
  address1ErrorMessage: string = '';
  pageTitle: string;
  subject = new Subject();
  IsEventFromPage: boolean = false;

  private validateAddressSubscription: Subscription;
  private updateBranchSubscription: Subscription;
  private updateBranchSubscription1: Subscription;
  private zipDetailsSubscription: Subscription;
  private zipSubscription: Subscription;


  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _user: AQUserInfo,
    private _branchService: AQBranchService,
    private _popup: PopupService,
    private _agency: AQAgencyService,
    private _loader: LoaderService,
    public ValidateKey: KeyboardValidation,
    private zipDetails: AQZipDetailsService,
    private trimValueService: TrimValueService
  ) {
    this._BranchScreen = new BranchScreen();
  }

  ngOnInit() {
    this.createBranchForm();
    // if (sessionStorage.getItem('_agencyId') && sessionStorage.getItem('_branchId')) {
    //   this.pageTitle = "Edit Branch";
    //   this.getBranchById(sessionStorage.getItem('_agencyId'), sessionStorage.getItem('_branchId'));
    // } else if (sessionStorage.getItem('_tempId')) {
    //   this.getBranchFromTemp();
    //   this.pageTitle = "Edit Branch";
    // } else {
    //   this.pageTitle = "Add Branch";
    // }
    this.pageTitle = this.getPageTitle();
    this.onChnages();
    this.SaveAccountWithAddressValidation();
  }

  getPageTitle(): string {
    if (sessionStorage.getItem('_agencyId') && sessionStorage.getItem('_branchId')) {
      this.getBranchById(sessionStorage.getItem('_agencyId'), sessionStorage.getItem('_branchId'));
      return 'Edit Branch';
    } else if (sessionStorage.getItem('_tempId')) {
      this.getBranchFromTemp();
      return 'Edit Branch';
    }
    return 'Add Branch';
  }

  ngOnDestroy() {
    if (this.validateAddressSubscription) {
      this.validateAddressSubscription.unsubscribe();
    }
    if (this.updateBranchSubscription) {
      this.updateBranchSubscription.unsubscribe();
    }
    if (this.zipDetailsSubscription) {
      this.zipDetailsSubscription.unsubscribe();
    }
    if (this.zipSubscription) {
      this.zipSubscription.unsubscribe();
    }
    if (this.updateBranchSubscription1) {
      this.updateBranchSubscription1.unsubscribe();
    }
  }

  getBranchFromTemp() {
    /* sessionStorage.getItem('_tempId') */
    let branchList: any[] = JSON.parse(sessionStorage.getItem('_newBranchList'));
    this.branchDetails = branchList.filter(branch => branch.tempId == sessionStorage.getItem('_tempId'));
    if (this.branchDetails.length) {
      this.assignValuetoBranchForm();
    }
  }

  getBranchById(agencyId: string, branchId: string) {
    this.branchDetails = this._agency.BranchById(agencyId, branchId);
    if (this.branchDetails?.length) {
      this.assignValuetoBranchForm();
    }
  }

  createBranchForm() {
    this.branchForm = this._fb.group({
      branchName: ['', Validators.required],
      streetAddress1: ['', Validators.required],
      streetAddress2: [''],
      city: [{ value: '', disabled: true }, Validators.required],
      state: [{ value: '', disabled: true }, Validators.required],
      zip: ['', [Validators.required, Validators.minLength(5)]]
    })
  }

  get branchName() {
    return this.branchForm.get("branchName");
  }

  get streetAddress1() {
    return this.branchForm.get("streetAddress1");
  }

  get streetAddress2() {
    return this.branchForm.get("streetAddress2");
  }

  get city() {
    return this.branchForm.get("city");
  }
  get state() {
    return this.branchForm.get("state");
  }
  get zip() {
    return this.branchForm.get("zip");
  }

  assignValuetoBranchForm() {
    this.branchForm.controls['branchName'].setValue(this.branchDetails[0].branchName)
    this.branchForm.controls['streetAddress1'].setValue(this.branchDetails[0].streetAddress1)
    this.branchForm.controls['streetAddress2'].setValue(this.branchDetails[0].streetAddress2)
    this.branchForm.controls['city'].setValue(this.branchDetails[0].city)
    this.branchForm.controls['state'].setValue(this.branchDetails[0].state)
    this.branchForm.controls['zip'].setValue(this.branchDetails[0].zip)
    this.validateAddress();
  }

  resetBranchForm() {
    /* this.branchForm.controls['branchName'].setValue('')
    this.branchForm.controls['streetAddress1'].setValue('')
    this.branchForm.controls['streetAddress2'].setValue('')
    this.branchForm.controls['city'].setValue('')
    this.branchForm.controls['state'].setValue('')
    this.branchForm.controls['zip'].setValue('') */
    this.branchForm.reset();

  }

  SaveAccountWithAddressValidation() {
    this.subject.subscribe(resp => {
      if (resp == 'validateAddress') {
        this.validateAddress();
      }
      if (resp == 'save' && this.IsEventFromPage) {
        this.saveBranch();
      }
    })
  }

  SaveAccountWithOserverPattern() {
    this.IsEventFromPage = true;
    this.subject.next("validateAddress");
  }

  saveBranch() {
    this.IsEventFromPage = false;
    if (this.branchForm.valid && !this.isAddress1Valid) {
      this.submitted = false;
      if (sessionStorage.getItem('_agencyId') && sessionStorage.getItem('_branchId')) {
        let requestBranchObj = this.branchForm.getRawValue();
        requestBranchObj['AgencyId'] = sessionStorage.getItem('_agencyId');
        requestBranchObj['BranchId'] = sessionStorage.getItem('_branchId');
        requestBranchObj['UserID'] = this._user.UserId();
        this._loader.show();
        let reqObject = this.trimValueService.TrimObjectValue(requestBranchObj)
        this.updateBranchSubscription = this._branchService.UpdateBranch(reqObject)
          .subscribe(data => {
            this._loader.hide();
            if (data && data.success) {

              this.resetBranchForm();
              this.goBack();

            } else {
              this._popup.showPopup('Branch', data.message);
            }
          }, (err) => {
            this._loader.hide();
          }, () => {
            this._loader.hide();
          });
      } else if (sessionStorage.getItem('_agencyId')) {
        let requestBranchObj = this.branchForm.getRawValue();
        requestBranchObj['AgencyId'] = sessionStorage.getItem('_agencyId');
        requestBranchObj['UserID'] = this._user.UserId();
        this._loader.show();
        this.updateBranchSubscription1 = this._branchService.UpdateBranch(requestBranchObj)
          .subscribe(data => {
            if (data && data.success) {
              this.goBack();
            }
          }, (err) => {
            this._loader.hide();
          }, () => {
            this._loader.hide();

          })
      } else if (sessionStorage.getItem('_tempId')) {
        if (sessionStorage.getItem('_newBranchList')) {
          let newBranchList: any[] = JSON.parse(sessionStorage.getItem('_newBranchList'));
          newBranchList.map(branch => {
            if (branch.tempId == sessionStorage.getItem('_tempId')) {
              let newBranch = this.branchForm.getRawValue();
              newBranch['tempId'] = branch.tempId;
              branch.branchName = newBranch.branchName;
              branch.streetAddress1 = newBranch.streetAddress1;
              branch.streetAddress2 = newBranch.streetAddress2;
              branch.city = newBranch.city;
              branch.state = newBranch.state;
              branch.zip = newBranch.zip;
            }
            return branch;
          })
          sessionStorage.setItem('_newBranchList', JSON.stringify(newBranchList));
          sessionStorage.removeItem('_tempId')
          this.goBack();
        }
      } else {
        let newBranch = this.branchForm.getRawValue();
        if (sessionStorage.getItem('_newBranchList')) {
          this.newBranchList = JSON.parse(sessionStorage.getItem('_newBranchList'));
          newBranch['tempId'] = this.newBranchList[this.newBranchList.length - 1]['tempId'] + 1;
          this.newBranchList.push(newBranch);
          this.goBack();
        } else {
          newBranch['tempId'] = 1;
          this.newBranchList.push(newBranch);
          /*  this._popup.show('Branch', 'Branch Added Successfully.');
           this._popup.response.subscribe(result => {
             if (result) {
               this.resetBranchForm();
             }
           }) */
          this.goBack();
        }
        sessionStorage.setItem('_newBranchList', JSON.stringify(this.newBranchList));
        /*  this._popup.show('Branch', "Branch added successfully."); */
      }
    } else {
      this.submitted = true;
    }
  }

  resetForm() {
    this.branchForm.reset();
  }

  goBack() {
    this._router.navigateByUrl('/agenciiq/agencies/addagency')
  }

  getZipDetails(zipcode) {
    this._loader.show();
    this.zipDetailsSubscription = this.zipDetails.ZipDetails(zipcode)
      .subscribe(data => {
        this._loader.hide();
        if (data && data['CityStateLookupResponse'] && data['CityStateLookupResponse']['ZipCode']) {
          let obj = data['CityStateLookupResponse']['ZipCode'];
          if (obj.Error) {
            this.isZipInvalid = true;
            this.zipErrorMessage = obj.Error.Description;
            this.zip.setErrors({ 'notvalid': true })
          } else {
            if (obj.City) {
              this.city.setValue(obj.City);
            }
            if (obj.State) {
              this.state.setValue(obj.State);
            }
            this.validateAddress();
          }

        }
      }, (err) => {
        this._loader.hide();
      }, () => {
        this._loader.hide();
      });
  }

  onChnages() {
    this.zipSubscription = this.zip.valueChanges.subscribe(zipcode => {
      this.isZipInvalid = false;
      if (String(zipcode).length == 5) {
        this.getZipDetails(zipcode);
      } else {
        this.city.setValue(null);
        this.state.setValue(null);
      }
    });
  }

  validateAddress() {
    this.address1ErrorMessage = "";
    this.isAddress1Valid = false;
    if (this.zip.value && this.city.value && this.state.value && (this.streetAddress1.value || this.streetAddress2.value)) {
      this._loader.show();
      this.validateAddressSubscription = this.zipDetails.ValidateAddressField(this.zip.value, null, this.city.value, this.state.value, this.streetAddress1.value, this.streetAddress2.value)
        .subscribe(data => {
          this._loader.hide();
          if (data) {
            let obj = data['data'];
            if (data['success'] == false) {
              this.isAddress1Valid = true;
              this.address1ErrorMessage = data['message'];
              this.submitted = false;
            } else {
              this.subject.next('save');
              this.isAddress1Valid = false;
              if (obj['City']) {
                this.city.setValue(obj['City']);
              }
              if (obj['State']) {
                this.state.setValue(obj['State']);
              }
              if (obj['Address1']) {
                this.streetAddress1.setValue(obj['Address1']);
              }
              if (obj['Address2']) {
                this.streetAddress2.setValue(obj['Address2']);
              }
            }
          }
        }, (err) => {
          this._loader.hide();
        }, () => {
          this._loader.hide();
        });
    } else if (!this.zip.value) {
      if (this.IsEventFromPage) {
        this.submitted = true;
      }
    } else {
      if (this.IsEventFromPage) {
        this.submitted = true;
      }
    }
  }

}
