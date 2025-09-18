import { Component, OnInit, ɵConsole, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AQAgentListService } from '@agenciiq/aqagent';
import { AQLoginService, AQUserInfo } from '@agenciiq/login';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQParameterService, AQZipDetailsService } from '@agenciiq/aqadmin';
import { KeyboardValidation } from 'src/app/shared/services/aqValidators/keyboard-validation';
import { SortingService } from 'src/app/shared/services/sorting-service/sorting.service';
import { Subject, Subscription } from 'rxjs';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';
import { AddGuestScreen } from 'src/app/global-settings/error-message/addGuestScreen';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';


@Component({
  selector: 'app-guestuser',
  templateUrl: './guestuser.component.html',
  styleUrls: ['./guestuser.component.sass'],
  standalone: false
})
export class GuestuserComponent implements OnInit {

  _AddGuestScreen: AddGuestScreen = null;
  f = true;
  agentdetails = [];
  agentlist;
  addagent: FormGroup;
  _agentIdTab = "agent";
  flag = false;
  isEdit: boolean = false;
  submitted: boolean = false;
  addressSubmitted: boolean = false;
  zipSubmitted: boolean = false;
  showDropDown: boolean = false;
  roles: any = [];
  roleinfo: any[];
  mgadmin: boolean = false;
  agancyadmin: boolean = false;
  agt: boolean = false;
  selectitem: any;
  stateName: any;
  isZipInvalid = false;
  zipErrorMessage: any;
  agencyN = [];
  isAddress1Valid: boolean = false;
  selectedRoled = [];
  selectedRoledForRequest = [];
  agencyList = [];
  supervisorList = [];
  UWSupervisorList = [];
  mangerList = [];
  UWMangerList = [];
  UWAssistantList = [];
  isUserMGAAdmin: boolean = false;
  address1ErrorMessage: string = '';
  pageTitle: string;
  _isChecked: boolean;
  roleCode: any;
  userName: any
  updatedManagerList: any[] = [];
  updatedSupervisorList: any[] = [];
  updatedUWSupervisorList: any[] = [];
  updatedUWManagerList: any[] = [];
  updateUWAssistantList: any[] = [];
  private agentId = 0;
  private agencyId: number;
  agencyAdminCheck: boolean = false;
  stateDropDown = 'statedd';
  stateList: any[] = [];
  stateCheckBoxName = 'parameterName';
  stateCheckBoxValue = 'parameterId';
  lobDropDown = 'lobdd';
  lobList: any;
  lobCheckBoxName = "lobDescription";
  lobCheckBoxValue = "lobId";
  UWassistantDropdown = 'UWAssistantdd';
  UWAssistantName = "UWAssistantName";
  uwAssistantCheckBoxValue = "UWAssistantId";
  AssistantList: any[] = [];
  userId: number;
  parameterStateKey = "STATE";
  savedLobList: any[] = [];
  saveStateList: any[] = [];
  private selectedUWAssistant: any[];
  validateField: boolean = false;
  checkSave: boolean = false;
  subject = new Subject();
  IsEventFromPage: boolean = false;

  private validateAddressSubscription: Subscription;
  private zipDetailsSubscription: Subscription;
  private createAgentSubscription: Subscription;
  private popupSubscription: Subscription;
  private agencyListSubscription: Subscription;
  private agentListSubscription: Subscription;
  private agentRoleSubscription: Subscription;
  private address1Subscription: Subscription;
  private address2Subscription: Subscription;
  private zipSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private login: AQLoginService,
    private _router: Router,
    private _userinfo: AQUserInfo,
    private _loader: LoaderService,
    private zipDetails: AQZipDetailsService,
    public ValidateKey: KeyboardValidation,
    private _sortingService: SortingService,
    private trimValueService: TrimValueService,
    private _popupService: PopupService,
  ) {
    this.userId = this._userinfo.UserId();
    this._AddGuestScreen = new AddGuestScreen();
  }

  ngOnInit() {
    this.pageTitle = "Guest User"
    this.createform();
    this.onChnages();
  }

  ngOnDestroy() {
    if (this.validateAddressSubscription) {
      this.validateAddressSubscription.unsubscribe()
    }
    if (this.zipDetailsSubscription) {
      this.zipDetailsSubscription.unsubscribe();
    }
    if (this.createAgentSubscription) {
      this.createAgentSubscription.unsubscribe();
    }
    if (this.popupSubscription) {
      this.popupSubscription.unsubscribe();
    }
    if (this.agencyListSubscription) {
      this.agencyListSubscription.unsubscribe()
    }
    if (this.agentListSubscription) {
      this.agentListSubscription.unsubscribe();
    }
    if (this.agentRoleSubscription) {
      this.agentRoleSubscription.unsubscribe();
    }
    if (this.address1Subscription) {
      this.address1Subscription.unsubscribe();
    }
    if (this.address2Subscription) {
      this.address2Subscription.unsubscribe();
    }
    if (this.zipSubscription) {
      this.zipSubscription.unsubscribe();
    }
  }

  get fname() {
    return this.addagent.get('FirstName');
  }

  get Mname() {
    return this.addagent.get('Middlename');

  }
  get lname() {
    return this.addagent.get('LastName');
  }
  get email() {
    return this.addagent.get('Email');
  }
  get city() {
    return this.addagent.get('City');
  }
  get state() {
    return this.addagent.get('State');
  }
  get zip() {
    return this.addagent.get('Zip');
  }
  get addressline1() {
    return this.addagent.get('AddressLine1');
  }

  get addressline2() {
    return this.addagent.get('AddressLine2');
  }
  get phonecell() {
    return this.addagent.get('PhoneCell');
  }
  get phoneoffice() {
    return this.addagent.get('PhoneOffice');
  }

  get phone() {
    return this.addagent.get('PhoneHome');
  }

  get roleControl() {
    return this.addagent.get('userRoles');
  }

  get agencyIdControl() {
    return this.addagent.get('AgencyId');
  }

  get managerIdControl() {
    return this.addagent.get('managerId');
  }

  get supervisorIdControl() {
    return this.addagent.get('supervisorId');
  }

  get udSupervisorIdControl() {
    return this.addagent.get('udSupervisorId');
  }

  get uwAssistantIdControl() {
    return this.addagent.get('uwAssistantId');
  }

  get lobIdControl() {
    return this.addagent.get('LobId');
  }

  get stateIdControl() {
    return this.addagent.get('StateId');
  }

  get fax() {
    return this.addagent.get('Fax');
  }

  get agency() {
    return this.addagent.get('AgencyName');
  }

  createform() {
    this.addagent = this.fb.group({
      FirstName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^((?!\s{2,}).)*$/)]],
      Middlename: ['', Validators.pattern(/^((?!\s{2,}).)*$/)],
      LastName: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]],
      Email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      Zip: ['', [Validators.required, Validators.minLength(5)]],
      City: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(50)]],
      State: [{ value: '', disabled: true }, [Validators.required]],
      AddressLine1: ['', [Validators.required, Validators.maxLength(50)]],
      AddressLine2: [''],
      PhoneCell: ['', [Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/), Validators.required]],
      PhoneOffice: ['', [Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/)]],
      PhoneHome: ['', [Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/)]],
      Fax: ['', [Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/)]],
      AgencyId: [null],
      supervisorId: [0],
      managerId: [0],
      AgencyName: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]],
    });

    this.addagent.patchValue({ isActive: true });
    this.addagent.patchValue({ isLocked: false });
  }


  assignvalue() {
    this.addagent.controls['FirstName'].setValue(this.agentlist?.firstName ? this.agentlist?.firstName : '');
    this.addagent.controls['Middlename'].setValue(this.agentlist?.middleName);
    this.addagent.controls['LastName'].setValue(this.agentlist?.lastName);
    this.addagent.controls['Email'].setValue(this.agentlist?.email);
    this.addagent.controls['Zip'].setValue(this.agentlist?.zip);
    this.addagent.controls['City'].setValue(this.agentlist?.city);
    this.addagent.controls['State'].setValue(this.agentlist?.state);
    this.addagent.controls['AddressLine1'].setValue(this.agentlist?.addressLine1);
    this.addagent.controls['AddressLine2'].setValue(this.agentlist?.addressLine2);
    this.addagent.controls['PhoneCell'].setValue(this.agentlist?.phoneCell ? this.agentlist?.phoneCell.replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '');
    this.addagent.controls['PhoneOffice'].setValue(this.agentlist?.phoneOffice ? this.agentlist?.phoneOffice?.replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '');
    this.addagent.controls['PhoneHome'].setValue(this.agentlist?.phoneHome ? this.agentlist?.phoneHome?.replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '');
    this.addagent.controls['Fax'].setValue(this.agentlist?.fax ? this.agentlist?.fax?.replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '');
    this.addagent.controls['AgencyName'].setValue(this.agentlist?.agencyName);
    this.addagent.controls['isActive']?.setValue(this.agentlist?.isActive);
    this.addagent.controls['isLocked']?.setValue(this.agentlist?.isLocked);

    this.email.disable();
    this.validateAddress();
  }

  addAgent() {
    this.IsEventFromPage = false;
    let addGuestReqObj = this.addagent.getRawValue();
    let guestUserReq = {
      "FirstName": addGuestReqObj.FirstName,
      "MiddleName": addGuestReqObj.Middlename,
      "LastName": addGuestReqObj.LastName,
      "Email": addGuestReqObj.Email,
      "Zip": addGuestReqObj.Zip,
      "City": addGuestReqObj.City,
      "State": addGuestReqObj.State,
      "AddressLine1": addGuestReqObj.AddressLine1,
      "AddressLine2": addGuestReqObj.AddressLine2,
      "PhoneCell": addGuestReqObj.PhoneCell,
      "PhoneHome": addGuestReqObj.PhoneHome,
      "PhoneOffice": addGuestReqObj.PhoneOffice,
      "Role": "",
      "AgencyName": addGuestReqObj.AgencyName
    }

    if (this.addagent.valid && !this.isAddress1Valid && !this.validateField) {
      this._loader.show();
      let reqObject = this.trimValueService?.TrimObjectValue(guestUserReq)
      this.login.CreateGuest(reqObject).subscribe(data => {
        this._loader.hide();
        if (data?.success) {
          this._router.navigateByUrl('/agenciiq');

        } else {
          this._popupService.show('Guest User', data.message);
        }
      }, (err) => {
        this._loader.hide();
        console.log("err", err);
      }, () => {
        this._loader.hide();
      });
    } else {
      this.submitted = true;

    }
  }

  cancel() {
    this._router.navigateByUrl('')
  }

  getZipDetails(zipcode) {
    this.isZipInvalid = false;
    this._loader.show();
    this.zipDetails.ZipDetails(zipcode).subscribe(data => {
      this._loader.hide();
      if (data && data['CityStateLookupResponse'] && data['CityStateLookupResponse']['ZipCode']) {
        let obj = data['CityStateLookupResponse']['ZipCode'];
        if (obj.Error) {
          this.isZipInvalid = true;
          this.zipErrorMessage = obj.Error.Description;
          this.zip.setErrors({ 'notvalid': true });
        } else {
          if (obj.City) {
            this.city.setValue(obj.City);
          }
          if (obj.State) {
            this.state.setValue(obj.State);
          }
        }
        this.validateAddress();
      }
    }, (err) => {
      this._loader.hide();
      console.log("err", err);
    }, () => {
      this._loader.hide();
    });
  }

  onChnages() {
    this.addressline1.valueChanges.subscribe(x => {
      if (x?.trim()) {
        this.addressline2.setValidators(null);
        this.addressline1.setValidators(null);
        this.addressline1.updateValueAndValidity({ emitEvent: false });
        this.addressline2.updateValueAndValidity({ emitEvent: false });
      } else {
        if (!this.addressline2.value) {
          this.addressline1.setValidators([Validators.required]);
          this.addressline1.updateValueAndValidity({ emitEvent: false });
        }
      }
    });

    this.addressline2.valueChanges.subscribe(x => {
      if (x?.trim()) {
        this.addressline2.setValidators(null);
        this.addressline1.setValidators(null);
        this.addressline1.updateValueAndValidity({ emitEvent: false });
        this.addressline2.updateValueAndValidity({ emitEvent: false });
      } else {
        if (!this.addressline1.value) {
          this.addressline1.setValidators([Validators.required]);
          this.addressline1.updateValueAndValidity({ emitEvent: false });
        }
      }
    });

    this.zip.valueChanges.subscribe(zipcode => {
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
    if (this.zip.value && this.city.value && this.state.value && (this.addressline1.value || this.addressline2.value)) {
      this._loader.show();
      this.validateAddressSubscription = this.zipDetails.ValidateAddressField(this.zip.value, null, this.city.value, this.state.value, this.addressline1.value, this.addressline2.value).subscribe(data => {
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
              this.addressline1.setValue(obj['Address1']);
            }
            if (obj['Address2']) {
              this.addressline2.setValue(obj['Address2']);
            }
            /* if (obj.Zip5 || obj.Zip5) {
              this.Zip.setValue(obj.Zip5 + obj.Zip4, { emitEvent: false })
            } */
          }
          // this.subject.next(true);
        }
      }, (err) => {
        this._loader.hide();
        console.log("err", err);
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

  validateOtherCtrl() {
    if ((!this.fname.valid || !this.lname.valid || !this.email.valid || !this.phonecell.valid || !this.roleControl.valid) && this.checkSave) {
      this.validateField = true; this.checkSave = false;
    }
    else this.validateField = false;
  }

}
