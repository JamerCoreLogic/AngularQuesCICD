import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AQAgencyService, IAgencyProgram } from '@agenciiq/agency';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AQRoleInfo, AQAgencyInfo } from '@agenciiq/login';
import { Roles } from '../../../../global-settings/roles';
import { AQUserInfo } from '@agenciiq/login';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { DatePipe } from '@angular/common';
import { AQZipDetailsService } from '@agenciiq/aqadmin';
import { KeyboardValidation } from 'src/app/shared/services/aqValidators/keyboard-validation';
import { Subject, Subscription } from 'rxjs';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { AQSession } from 'src/app/global-settings/session-storage';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';
import { NewAgencyScreen } from 'src/app/global-settings/error-message/newagency-screen';
import { CancelButtonService } from 'src/app/shared/services/cancelButtonSerrvice/cancelButton.service'
import { SetDateService } from 'src/app/shared/services/setDate/set-date.service'

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.sass'],
  providers: [DatePipe],
  standalone: false
})
export class AgencyComponent implements OnInit, OnDestroy {
  _NewAgencyScreen: NewAgencyScreen = null;
  f = true;
  AgencyDetails = [];
  BranchList = [];
  AddAgencyForm: FormGroup;
  isMGAEdit = false;
  isAgencyEdit: boolean = false;
  roles = [];
  submitted: boolean = false;
  programList = [];
  ExpirationDate: any;
  bsValue: Date;
  zipErrorMessage: string;
  isZipInvalid: boolean = false;
  address1ErrorMessage: string;
  isAddress1Valid: boolean = false;
  tempAgencyData: any;
  pageTitle: string;
  isAgencyAdmin: boolean = false;
  public agencyId: number;
  today: any = new Date();
  programCheckBoxName = 'programName';
  programCheckBoxValue = "programId"
  programDropDown = "programdd"
  selectedProgram = [];
  showMultiSelect: boolean = true;


  private agencyProgramListSubscription: Subscription;
  private agencyListSubscription: Subscription;
  private createAgencySubscription: Subscription;
  private zipDetailSubscription: Subscription;
  private addressLine1Subscription: Subscription;
  private addressLine2Subscription: Subscription;
  private validateAddressSubscription: Subscription;
  private zipSubscription: Subscription;
  private popupSubscription: Subscription;
  saveType: any;
  agenctType: any;
  registerType: any;
  agencyData: any;
  agencyType: any;
  subject = new Subject();
  IsEventFromPage: boolean = false;

  constructor(
    private _router: Router,
    private _agency: AQAgencyService,
    private _agencyInfo: AQAgencyInfo,
    public _role: AQRoleInfo,
    private _userInfo: AQUserInfo,
    private _popupService: PopupService,
    private _fb: FormBuilder,
    private _loader: LoaderService,
    public _datePipe: DatePipe,
    public ValidateKey: KeyboardValidation,
    private zipDetails: AQZipDetailsService,
    public checkRoleService: CheckRoleService,
    public _session: AQSession,
    private trimValueService: TrimValueService,
    private cancelButtonService: CancelButtonService,
    public setDateService: SetDateService,
    private _checkRoleService: CheckRoleService,
    private _aqSession: AQSession,
  ) {
    if (this._checkRoleService.isRoleCodeAvailable(Roles.AgencyAdmin.roleCode, this._role.Roles())) {
      this.isAgencyAdmin = true;
    } else {
      this.isAgencyAdmin = false;
    }
    this.agencyId = this._agencyInfo.Agency() && this._agencyInfo.Agency().agencyId ? this._agencyInfo.Agency().agencyId : 0;
    this._NewAgencyScreen = new NewAgencyScreen();
  }

  ngOnInit() {

    this.today.setDate(this.today.getDate() + 1);
    sessionStorage.removeItem("_branchId");
    this.agencyData = this._aqSession.getData('_agencyData');
    this.agencyType = this.agencyData ? this.agencyData.agencyType : null;

    if (sessionStorage.getItem('_agencyId')) {
      this.isEditable();
      this.getAgencyDetail();
      this.pageTitle = "Edit Agency";
    } else {
      this.pageTitle = "Add Agency";
      //this.registerType = false;
      this.getProgramList();
      if (sessionStorage.getItem('_newBranchList')) {
        this.BranchList = JSON.parse(sessionStorage.getItem('_newBranchList'));
      }
      this.tempAgencyData = this._session.getData('_tempAgencyFormData');

    }

    this.createAddAgencyForm();
    this.onChnages();
    this.SaveAccountWithAddressValidation();
  }

  getProgramList() {
    this._loader.show();
    this.agencyProgramListSubscription = this._agency.AgencyProgramList(this._userInfo.UserId())
      .subscribe(programList => {
        this._loader.hide();
        if (programList?.data?.agencyPrograms) {
          if (this.tempAgencyData && this.tempAgencyData['programList']) {
            this.programList = this.tempAgencyData['programList']
          } else {
            this.programList = programList.data.agencyPrograms;
          }
        }
      }, (err) => {
        this._loader.hide();
      }, () => {
        this._loader.hide();
      });
  }

  getAgencyDetail() {

    this._loader.show();
    this.agencyId = parseInt(sessionStorage.getItem('_agencyId'));
    this.agencyListSubscription = this._agency.AgencyDetail(this._userInfo.UserId(), this.agencyId, this.agencyId)
      .subscribe(agencyList => {
        this._loader.hide();
        if (agencyList.success && agencyList.message == null && agencyList.data && agencyList.data.agencyList) {
          this.AgencyDetails = agencyList?.data?.agencyList;
          if (this.AgencyDetails?.length) {
            this.BranchList = this.AgencyDetails[0].branches;
            this.registerType = this.AgencyDetails[0].agency.registered == 'No' ? false : true;
            if (this.isAgencyAdmin) {
              this.programList = this.AgencyDetails[0].agencyPrograms.filter(item => { return item.checked == true });
              this.showMultiSelect = false;
            }
            else {
              this.programList = this.AgencyDetails[0]?.agencyPrograms;
              this.showMultiSelect = true;
            }

            this.programList = this.programList.map(program => {
              let _tempProgramList = {
                programId: program.programId,
                programName: program.programName,
                isActive: program.isActive,
                checked: program.checked
              }
              return _tempProgramList;
            })
            this.assignValueToAddAgencyForm();
          }
          //this.getAgencyDetails(sessionStorage.getItem('_agencyId'));
        }
      }, (err) => {
        this._loader.hide();
      }, () => {
        this._loader.hide();
      });
  }

  SelectedProgramList(stateList: any[]) {

    this.selectedProgram = this.programList.filter(program => program.checked).map(program => { return { programId: program.programId } });
  }

  isEditable() {
    if (this.checkRoleService.isRoleCodeAvailable('MGAAdmin', this._role.Roles())) {
      this.isAgencyEdit = false;
    } else {
      this.isAgencyEdit = true;
    }
  }


  async getRoleInfo() {
    this.roles = this._role.Roles();
  }

  getAgencyDetails(agencyId: any) {
    this.AgencyDetails = this._agency?.AgencyById(agencyId);
    if (this.AgencyDetails?.length) {
      this.BranchList = this.AgencyDetails[0]?.branches;
      if (this.isAgencyAdmin) this.programList = this.AgencyDetails[0]?.agencyPrograms?.filter(item => { return item.checked == true });
      else this.programList = this.AgencyDetails[0]?.agencyPrograms;
      this.assignValueToAddAgencyForm();
    }
  }

  createAddAgencyForm() {
    this._session.removeSession('_tempAgencyFormData');
    this.AddAgencyForm = this._fb.group({
      AgencyName: [{ value: '', disabled: this.isAgencyEdit }, [Validators.required, Validators.maxLength(100), this.noWhitespaceValidator]],
      ContactPerson: ['', [Validators.required, this.noWhitespaceValidator]],
      PhoneCell: [''],
      PhoneHome: [''],
      //PhoneOffice: new FormControl('', [Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/),  Validators.required ]),
      /*PhoneOffice: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern("^[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*$")])),*/
      PhoneOffice: ['', [Validators.required, Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/)]],

      //Fax: new FormControl('', [Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)]),
      Fax: ['', [Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/)]],
      Email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')]],
      NPN: [{ value: '', disabled: this.isAgencyEdit }, [Validators.required, Validators.maxLength(100)]],
      NPNExpirationDate: [{ value: null, disabled: this.isAgencyEdit }, Validators.required],
      AddressLine1: ['', Validators.required],
      AddressLine2: [''],
      City: [{ value: '', disabled: true }, Validators.required],
      State: [{ value: '', disabled: true }, Validators.required],
      Zip: ['', [Validators.required, Validators.minLength(5)]]
    });


    if (this.tempAgencyData) {
      this.AddAgencyForm.patchValue(this.tempAgencyData);
    }

  }



  assignValueToAddAgencyForm() {
    let _agencyDetails = this.AgencyDetails[0]['agency'];
    // this.AddAgencyForm?.controls['AgencyName']?.setValue(this.AgencyDetails[0]?.agencyName);
    this.AddAgencyForm?.controls['AgencyName']?.setValue(this.AgencyDetails[0]?.agency?.agencyName);
    this.AddAgencyForm?.controls['ContactPerson']?.setValue(this.AgencyDetails[0]['agency']?.contactPerson);
    this.AddAgencyForm?.controls['PhoneCell']?.setValue(_agencyDetails.phoneCell ? _agencyDetails.phoneCell?.replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '');
    this.AddAgencyForm?.controls['PhoneHome']?.setValue(_agencyDetails.phoneHome ? _agencyDetails.phoneHome?.replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '');
    this.AddAgencyForm?.controls['PhoneOffice']?.setValue(_agencyDetails.phoneOffice ? _agencyDetails.phoneOffice?.replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '');
    this.AddAgencyForm?.controls['Fax']?.setValue(_agencyDetails.fax ? _agencyDetails.fax?.replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '');
    this.AddAgencyForm?.controls['Email']?.setValue(this.AgencyDetails[0]['agency']?.email);
    this.AddAgencyForm?.controls['NPN']?.setValue(this.AgencyDetails[0]['agency']?.npn);
    if (this.AgencyDetails[0]['agency']?.npnExpirationDate != null) {
      this.AddAgencyForm?.controls['NPNExpirationDate']?.setValue(this.setDateService?.setDate(this.AgencyDetails[0]['agency']?.npnExpirationDate));
      this.bsValue = new Date(this.AgencyDetails[0]['agency']?.npnExpirationDate);
    }
    this.AddAgencyForm?.controls['AddressLine1']?.setValue(this.AgencyDetails[0]['agency']?.addressLine1);
    this.AddAgencyForm?.controls['AddressLine2']?.setValue(this.AgencyDetails[0]['agency']?.addressLine2);
    this.AddAgencyForm?.controls['City']?.setValue(this.AgencyDetails[0]['agency']?.city);
    this.AddAgencyForm?.controls['State']?.setValue(this.AgencyDetails[0]['agency']?.state);
    this.AddAgencyForm?.controls['Zip']?.setValue(this.AgencyDetails[0]['agency']?.zip);

    this.validateAddress();
  }

  SaveAccountWithAddressValidation() {

    this.subject.subscribe(resp => {
      if (resp == 'validateAddress') {
        this.validateAddress();
      }
      if (resp == 'save' && this.IsEventFromPage) {
        this.addAgency();
      }
    })
  }

  SaveAccountWithOserverPattern(type) {
    if (type == 'register')
      this.saveType = type;
    else this.saveType = this.agencyData.agencyType;
    this.IsEventFromPage = true;
    this.subject.next("validateAddress");
  }



  addAgency() {
    this.IsEventFromPage = false;
    if (this.saveType == 'register') this.registerType = true;
    else this.registerType = this.registerType == 'Yes' ? true : false
    if (this.AddAgencyForm?.valid && !this.isAddress1Valid) {
      let AgencyRequestObject = this.AddAgencyForm?.getRawValue();
      AgencyRequestObject['PhoneCell'] = String(AgencyRequestObject['PhoneCell']).split("").filter(d => !isNaN(Number(d)) && d.trim() !== "").join("");
      AgencyRequestObject['PhoneHome'] = String(AgencyRequestObject['PhoneHome']).split("").filter(d => !isNaN(Number(d)) && d.trim() !== "").join("");
      AgencyRequestObject['PhoneOffice'] = String(AgencyRequestObject['PhoneOffice']).split("").filter(d => !isNaN(Number(d)) && d.trim() !== "").join("");
      AgencyRequestObject['Fax'] = String(AgencyRequestObject['Fax']).split("").filter(d => !isNaN(Number(d)) && d.trim() !== "").join("");
      AgencyRequestObject["UserId"] = this._userInfo.UserId();
      AgencyRequestObject["ClientId"] = "";
      AgencyRequestObject["AgencyId"] = sessionStorage.getItem('_agencyId') || 0;
      AgencyRequestObject["AgencyPrograms"] = this.programList;
      AgencyRequestObject["IsActive"] = true;
      AgencyRequestObject["NPNExpirationDate"] = this.setDateService.setDate(AgencyRequestObject["NPNExpirationDate"]);
      AgencyRequestObject["registered"] = this.registerType;
      let branchList = JSON.parse(sessionStorage.getItem("_newBranchList"))
      if (branchList && branchList.length) {
        AgencyRequestObject["branches"] = [...branchList];
      } else {
        AgencyRequestObject["branches"] = []
      }
      this._loader.show();
      let reqObject = this.trimValueService.TrimObjectValue(AgencyRequestObject)
      this.createAgencySubscription = this._agency.CreateAgency(reqObject)
        .subscribe(data => {
          this._loader.hide();
          if (data && data.success) {
            this._session.removeSession('_tempAgencyFormData');
            this._checkRoleService.addNewAgencySubject.next('AddAgency');
            this._router.navigateByUrl('agenciiq/agencies');
            if (sessionStorage.getItem('_newBranchList')) {
              sessionStorage.removeItem('_newBranchList')
              sessionStorage.removeItem('_tempId');
            }
          } else {
            this._popupService.showPopup('Agency', data.message);
          }
        }, (err) => {
          this._loader.hide();
        }, () => {
          this._loader.hide();
        });
    } else {
      this.submitted = true;
    }
  }

  updateProgram(programId: any, checkStatus: any) {
    this.programList.map(program => {
      if (program.programId == programId) {
        {
          program.checked = checkStatus;
        }
      };
    })
  }

  EditBranch(branchId: string, tempId: string) {
    if (branchId) {
      sessionStorage.setItem("_branchId", branchId);
    } else if (tempId) {
      sessionStorage.setItem("_tempId", tempId);
    }
    this.addBranch();
    this._router.navigateByUrl('/agenciiq/agencies/addbranch');
  }

  goBack() {
    this._session.removeSession('_tempAgencyFormData')
    this._router.navigateByUrl('/agenciiq/agencies')
  }



  get agencyName() {
    return this.AddAgencyForm.get('AgencyName');
  }
  get ContactPerson() {
    return this.AddAgencyForm.get('ContactPerson');
  }
  get PhoneOffice() {
    return this.AddAgencyForm.get('PhoneOffice');
  }
  get Email() {
    return this.AddAgencyForm.get('Email');
  }
  get NPN() {
    return this.AddAgencyForm.get('NPN');
  }
  get NPNExpirationDate() {
    return this.AddAgencyForm.get('NPNExpirationDate');
  }

  get AddressLine1() {
    return this.AddAgencyForm?.get('AddressLine1');
  }
  get AddressLine2() {
    return this.AddAgencyForm?.get('AddressLine2');
  }
  get City() {
    return this.AddAgencyForm?.get('City');
  }
  get State() {
    return this.AddAgencyForm?.get('State');
  }
  get Zip() {
    return this.AddAgencyForm?.get('Zip');
  }
  get Fax() {
    return this.AddAgencyForm.get('Fax');
  }


  getZipDetails(zipcode) {
    this._loader.show();
    this.zipDetailSubscription = this.zipDetails.ZipDetails(zipcode)
      .subscribe(data => {
        this._loader.hide();
        if (data && data['CityStateLookupResponse'] && data['CityStateLookupResponse']['ZipCode']) {
          let obj = data['CityStateLookupResponse']['ZipCode'];
          if (obj.Error) {
            this.isZipInvalid = true;
            this.zipErrorMessage = obj.Error.Description;
            this.Zip?.setErrors({ 'notvalid': true })
            this.City?.setValue('');
            this.State?.setValue('');
          } else {
            this.isZipInvalid = false;
            if (obj.City) {
              this.City?.setValue(obj?.City);
            }
            if (obj.State) {
              this.State?.setValue(obj?.State);
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
    this.addressLine1Subscription = this.AddressLine1?.valueChanges.subscribe(x => {
      if (x && x.trim()) {
        this.AddressLine2.setValidators(null);
        this.AddressLine1.setValidators(null);
        this.AddressLine1.updateValueAndValidity({ emitEvent: false });
        this.AddressLine2.updateValueAndValidity({ emitEvent: false });
      } else {
        if (!this.AddressLine2.value) {
          this.AddressLine1.setValidators([Validators.required]);
          this.AddressLine1.updateValueAndValidity({ emitEvent: false });
        }
      }
    });

    this.addressLine2Subscription = this.AddressLine2?.valueChanges.subscribe(x => {
      if (x && x.trim()) {
        this.AddressLine2.setValidators(null);
        this.AddressLine1.setValidators(null);
        this.AddressLine1.updateValueAndValidity({ emitEvent: false });
        this.AddressLine2.updateValueAndValidity({ emitEvent: false });
      } else {
        if (!this.AddressLine1.value) {
          this.AddressLine1.setValidators([Validators.required]);
          this.AddressLine1.updateValueAndValidity({ emitEvent: false });
        }
      }
    });

    this.zipSubscription = this.Zip?.valueChanges.subscribe(zipcode => {
      if (String(zipcode).length == 5) {
        this.getZipDetails(zipcode);
      } else {
        this.isZipInvalid = false;
      }
    })
  }


  validateAddress() {
    this.isAddress1Valid = false;
    this.address1ErrorMessage = "";
    if (this.Zip?.value && this.City.value && this.State.value && (this.AddressLine1.value || this.AddressLine2.value)) {
      this._loader.show();
      this.validateAddressSubscription = this.zipDetails.ValidateAddressField(this.Zip?.value, null, this.City.value, this.State.value, this.AddressLine1.value, this.AddressLine2.value)
        .subscribe(data => {

          this._loader.hide();
          if (data) {
            let obj = data['data'];
            if (data['success'] == false) {
              this.isAddress1Valid = true;
              this.address1ErrorMessage = data['message'];

            } else {
              this.subject.next('save');
              this.isAddress1Valid = false;
              if (obj['City']) {
                this.City?.setValue(obj['City']);
              }
              if (obj['State']) {
                this.State?.setValue(obj['State']);
              }
              if (obj['Address1']) {
                this.AddressLine1?.setValue(obj['Address1']);
              }
              if (obj.Address2) {
                this.AddressLine2?.setValue(obj['Address2']);
              }
            }
          }
        }, (err) => {
          this._loader.hide();
        }, () => {
          this._loader.hide();
        });
    } else if (!this.Zip?.value) {
      if (this.IsEventFromPage) {
        this.submitted = true;
      }
    } else {
      if (this.IsEventFromPage) {
        this.submitted = true;
      }

    }

  }

  addBranch() {
    if (this.AddAgencyForm?.value) {
      let _tempAgencyData = this.AddAgencyForm.getRawValue();
      _tempAgencyData['programList'] = this.programList;
      this._session.setData('_tempAgencyFormData', _tempAgencyData);
    }
  }

  ValidateZip() {
    if (this.Zip?.valid) {
      this.getZipDetails(this.Zip?.value);
    }
  }

  ngOnDestroy() {
    if (this.validateAddressSubscription) {
      this.validateAddressSubscription.unsubscribe();
    }
    if (this.zipDetailSubscription) {
      this.zipDetailSubscription.unsubscribe();
    }
    if (this.addressLine1Subscription) {
      this.addressLine1Subscription.unsubscribe();
    }
    if (this.addressLine2Subscription) {
      this.addressLine2Subscription.unsubscribe();
    }
    if (this.agencyProgramListSubscription) {
      this.agencyProgramListSubscription.unsubscribe();
    }
    if (this.agencyListSubscription) {
      this.agencyListSubscription.unsubscribe();
    }
    if (this.createAgencySubscription) {
      this.createAgencySubscription.unsubscribe();
    }
    if (this.zipSubscription) {
      this.zipSubscription.unsubscribe();
    }
    if (this.popupSubscription) {
      this.popupSubscription.unsubscribe();
    }
    this.subject.unsubscribe();
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control && control.value && control.value.toString() || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

}