import { Component, OnInit, OnDestroy } from '@angular/core';
import { AQAgencyInfo, AQAgentInfo, AQUserInfo, AQRoleInfo } from '@agenciiq/login';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { KeyboardValidation } from 'src/app/shared/services/aqValidators/keyboard-validation';
import { ManageUserService } from '@agenciiq/login';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQZipDetailsService } from '@agenciiq/aqadmin';
import { Observable, Subject, Subscription } from 'rxjs';
import { IconSettings, ICON_LIST, ICON_STATUS } from 'src/app/global-settings/icon-settings';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';
import { ManageAccountScreen } from 'src/app/global-settings/error-message/manageaccount-screen';
import { CancelButtonService } from 'src/app/shared/services/cancelButtonSerrvice/cancelButton.service'
import { Store } from '@ngrx/store';
import { selectFilteredManageAccount, selectManageAccountNoRecordMessage } from 'store/selectors/manage.account.selectors';
import { loadAccountDetails } from 'store/actions/manage.account.actions';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-manage-accounts',
  templateUrl: './manage-accounts.component.html',
  styleUrls: ['./manage-accounts.component.sass'],
  standalone: false
})
export class ManageAccountsComponent implements OnInit, OnDestroy {

  _ManageAccontScreen: ManageAccountScreen = null;
  accountForm: FormGroup;
  roles = [];
  superVisorName = "";
  submitted: boolean = false;
  isHierarchyVisible: boolean = false;
  isMangerVisible: boolean = false;
  isSupervisorVisible: boolean = false;
  zipErrorMessage: string;
  isZipInvalid: boolean = false;
  isAddress1Valid: boolean = false;
  address1ErrorMessage: string = '';
  isChangePassword: boolean = false;
  RoleCode: string;
  isAgencyNameVisible: boolean = false;
  subject = new Subject();
  IsEventFromPage: boolean = false;

  accountAddDetailDataSource$: Observable<any>;
  noRecordsMessage$: Observable<any>;
  private accountAddressDetailSubscription: Subscription;

  private zipDetailsSupscription: Subscription;
  private manageUserSupscription: Subscription;
  private address1Supscription: Subscription;
  private address2Supscription: Subscription;
  private validateAddressSubscription: Subscription;
  private zipSupscription: Subscription;
  private popupSubscription: Subscription;

  constructor(
    private _user: AQUserInfo,
    private _agent: AQAgentInfo,
    private _agency: AQAgencyInfo,
    public _fb: FormBuilder,
    private _roles: AQRoleInfo,
    public ValidateKey: KeyboardValidation,
    private _manageUser: ManageUserService,
    private _router: Router,
    private _popup: PopupService,
    private _loader: LoaderService,
    private zipDetails: AQZipDetailsService,
    private iconSetting: IconSettings,
    private trimValueService: TrimValueService,
    private cancelButtonService: CancelButtonService,
    private store: Store,
  ) {
    //this.RoleCode = this._roles.Roles()[0].roleCode;
    const roles = this._roles.Roles();
    this.RoleCode = roles?.length ? roles[0].roleCode : null;
    this.iconSetting.IconSetting(ICON_LIST.homeIcon, ICON_STATUS.Disabled);
    this._ManageAccontScreen = new ManageAccountScreen();
  }

  ngOnInit() {
    this.createAccountForm();
    this.roles = this._roles.Roles();
    if (this._agent.Agent() && (this._agent.Agent().managerName || this._agent.Agent().supervisorname)) {
      this.isHierarchyVisible = true;
    }
    this.onFormValueChange();
    this.SaveAccountWithAddressValidation();
  }

  createAccountForm() {
    this.accountForm = this._fb.group({
      UserId: [this._user.UserId()],
      UserName: [{ value: this._user.UserName(), disabled: true }],
      ClientID: [""],
      FirstName: [this._agent.Agent().firstName, [Validators.required, Validators.maxLength(50), Validators.pattern(/^((?!\s{2,}).)*$/)]],
      Middlename: [this._agent.Agent().middleName, [Validators.maxLength(50), Validators.pattern(/^((?!\s{2,}).)*$/)]],
      LastName: [this._agent.Agent().lastName, [Validators.required, Validators.maxLength(50), Validators.pattern(/^((?!\s{2,}).)*$/)]],
      Zip: [this._agent.Agent().zip, [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      City: [{ value: this._agent.Agent().city, disabled: true }, [Validators.required]],
      State: [{ value: this._agent.Agent().state, disabled: true }, [Validators.required]],
      Email: [{ value: this._agent.Agent().email, disabled: true }, [Validators.required, Validators.email]],
      SupervisorName: [{ value: this._agent.AgentSupervisorName(), disabled: true }],
      ManagerName: [{ value: this._agent.AgentManagerName(), disabled: true }],
      AddressLine1: [this._agent.Agent().addressLine1, [Validators.required]],
      AddressLine2: [this._agent.Agent().addressLine2],
      PhoneCell: [this.formatPhone(this._agent.Agent().phoneCell), [Validators.required, Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/)]],
      PhoneHome: [this.formatPhone(this._agent.Agent().phoneHome), [Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/)]],
      PhoneOffice: [this.formatPhone(this._agent.Agent().phoneOffice), [Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/)]],

      //Fax: new FormControl(this._agent.Agent().fax ? this._agent.Agent().fax.replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '', [Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)]),
      Fax: [this.formatPhone(this._agent.Agent().fax), [Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/)]],
      AgencyName: [{ value: this._agency.Agency()?.agencyName || null, disabled: true }]
    });
    this.validateAddress();
  }

  formatPhone(phone: string | null | undefined): string {
    return phone ? phone.replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '';
  }

  SaveAccountWithAddressValidation() {
    this.subject.subscribe(resp => {
      if (resp == 'validateAddress') {
        this.validateAddress();
      }
      if (resp == 'save' && this.IsEventFromPage) {
        this.SaveAccount();
      }
    })
  }

  SaveAccountWithOserverPattern() {
    this.IsEventFromPage = true;
    this.subject.next("validateAddress");
  }

  SaveAccount() {
    this.IsEventFromPage = false;
    if (this.accountForm.valid && !this.isAddress1Valid) {
      let accountForm = this.accountForm.getRawValue();
      accountForm['PhoneOffice'] = String(accountForm['PhoneOffice']).split("").filter(d => !isNaN(Number(d)) && d.trim() !== "").join("");
      accountForm['PhoneHome'] = String(accountForm['PhoneHome']).split("").filter(d => !isNaN(Number(d)) && d.trim() !== "").join("");
      accountForm['PhoneCell'] = String(accountForm['PhoneCell']).split("").filter(d => !isNaN(Number(d)) && d.trim() !== "").join("");
      accountForm['Fax'] = String(accountForm['Fax']).split("").filter(d => !isNaN(Number(d)) && d.trim() !== "").join("");

      this._loader.show();
      let reqObject = this.trimValueService.TrimObjectValue(accountForm)
      this.manageUserSupscription = this._manageUser.ManageUser(reqObject).subscribe(user => {
        this._loader.hide();
        if (user && user.success) {
          this.redirectToHome();
        } else {
          this._popup.showPopup("My Account", user.message);
        }
      }, (err) => {
        this._loader.hide();
        console.log("err", err)
      }, () => {
        this._loader.hide();
      })
    } else {
      this.submitted = true;
    }
  }

  redirectToHome() {
    this.cancelButtonService.NavigateToHome();
  }

  get UserName() {
    return this.accountForm.get("UserName");
  }

  get FirstName() {
    return this.accountForm.get("FirstName");
  }

  get LastName() {
    return this.accountForm.get("LastName");
  }

  get middleName() {

    return this.accountForm.get("Middlename")
  }
  get Zip() {
    return this.accountForm.get("Zip");
  }

  get City() {
    return this.accountForm.get("City");
  }

  get State() {
    return this.accountForm.get("State");
  }

  get Email() {
    return this.accountForm.get("Email");
  }

  get AddressLine1() {
    return this.accountForm.get("AddressLine1");
  }

  get AddressLine2() {
    return this.accountForm.get("AddressLine2");
  }

  get PhoneCell() {
    return this.accountForm.get("PhoneCell");
  }

  get PhoneOffice() {
    return this.accountForm.get("PhoneOffice");
  }

  get PhoneHome() {
    return this.accountForm.get("PhoneHome");
  }

  get Fax() {
    return this.accountForm.get("Fax");
  }
  get AgencyName() {
    return this.accountForm.get("AgencyName");
  }

  get SupervisorName() {
    return this.accountForm.get("SupervisorName");
  }

  get ManagerName() {
    return this.accountForm.get("ManagerName");
  }

  onFormValueChange() {
    this.address1Supscription = this.AddressLine1.valueChanges.subscribe(x => {
      if (x.trim()) {
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

    this.address2Supscription = this.AddressLine2.valueChanges.subscribe(x => {
      if (x.trim()) {
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

    this.zipSupscription = this.Zip.valueChanges.subscribe(zipcode => {
      this.isZipInvalid = false;
      if (String(zipcode).length == 5) {
        this.getZipDetails(zipcode);
      } else {
        this.City.setValue(null);
        this.State.setValue(null);
      }
    });

  }


  getZipDetails(zipcode: number) {
    this.isZipInvalid = false;
    this.zipErrorMessage = "";
    this._loader.show();
    this.zipDetailsSupscription = this.zipDetails.ZipDetails(zipcode)
      .subscribe(data => {
        this._loader.hide();
        if (data['CityStateLookupResponse']['ZipCode']) {
          let obj = data['CityStateLookupResponse']['ZipCode'];
          if (obj.Error) {
            this.isZipInvalid = true;
            this.zipErrorMessage = obj.Error.Description;
            this.Zip.setErrors({ 'notvalid': true });
          } else {
            if (obj.City) {
              this.City.setValue(obj.City);
            }
            if (obj.State) {
              this.State.setValue(obj.State);
            }
            this.validateAddress();
          }
        }
      }, (err) => {
        this._loader.hide();
        console.log("err", err);
      }, () => {
        this._loader.hide();
      });
  }

  ValidateZip() {
    if (this.Zip?.valid) {
      this.getZipDetails(this.Zip?.value);
    }
  }

  ngOnDestroy() {
    if (this.manageUserSupscription) {
      this.manageUserSupscription.unsubscribe();
    }
    if (this.zipDetailsSupscription) {
      this.zipDetailsSupscription.unsubscribe();
    }
    if (this.address1Supscription) {
      this.address1Supscription.unsubscribe();
    }
    if (this.address2Supscription) {
      this.address2Supscription.unsubscribe();
    }
    if (this.zipSupscription) {
      this.zipSupscription.unsubscribe();
    }
    if (this.validateAddressSubscription) {
      this.validateAddressSubscription.unsubscribe();
    }
    if (this.popupSubscription) {
      this.popupSubscription.unsubscribe();
    }
  }


  // validateAddress() {
  //   this.isAddress1Valid = false;
  //   this.address1ErrorMessage = "";
  //   if (this.Zip.value && this.City.value && this.State.value && (this.AddressLine1.value || this.AddressLine2.value)) {
  //     this._loader.show();
  //     //this.validateAddressSubscription = this.zipDetails.ValidateAddress(this.Zip.value, this.City.value, this.State.value, this.AddressLine1.value, this.AddressLine2.value)
  //     this.validateAddressSubscription = this.zipDetails.ValidateAddressField(this.Zip.value, null, this.City.value, this.State.value, this.AddressLine1.value, this.AddressLine2.value)
  //       .subscribe(data => {

  //         this._loader.hide();
  //         if (data) {
  //           let obj = data['data'];
  //           if (data['success'] == false) {
  //             this.isAddress1Valid = true;
  //             this.address1ErrorMessage = data['message'];

  //           } else {
  //             this.subject.next('save');
  //             this.isAddress1Valid = false;
  //             if (obj['City']) {
  //               this.City.setValue(obj['City']);
  //             }
  //             if (obj['State']) {
  //               this.State.setValue(obj['State']);
  //             }
  //             if (obj['Address1']) {
  //               this.AddressLine1.setValue(obj['Address1']);
  //             }
  //             if (obj['Address2']) {
  //               this.AddressLine2.setValue(obj['Address2']);
  //             }
  //           }
  //         }
  //       }, (err) => {
  //         this._loader.hide();
  //       }, () => {
  //         this._loader.hide();
  //       });

  //   } else if (!this.Zip.value) {
  //     if (this.IsEventFromPage) {
  //       this.submitted = true
  //     }
  //   } else {
  //     if (this.IsEventFromPage) {
  //       this.submitted = true
  //     }
  //   }
  // }

  validateAddress(): void {
    this.isAddress1Valid = false;
    this.address1ErrorMessage = "";

    // Early return if Zip is missing and from page
    if (!this.Zip.value) {
      if (this.IsEventFromPage) {
        this.submitted = true;
      }
      return;
    }

    // Early return if required fields are missing
    if (!this.City.value || !this.State.value || (!this.AddressLine1.value && !this.AddressLine2.value)) {
      if (this.IsEventFromPage) {
        this.submitted = true;
      }
      return;
    }

    const addressPayload = {
      Zip4: this.Zip.value,
      Zip5: null,
      City: this.City.value,
      State: this.State.value,
      Address1: this.AddressLine1.value,
      Address2: this.AddressLine2.value
    };

    this.accountAddDetailDataSource$ = this.store.select(selectFilteredManageAccount, addressPayload);
    this.noRecordsMessage$ = this.store.select(selectManageAccountNoRecordMessage, addressPayload);

    this.accountAddressDetailSubscription?.unsubscribe();
    this.accountAddressDetailSubscription = this.accountAddDetailDataSource$
      .pipe(take(1))
      .subscribe((data) => {
        if (this.isEmptyObject(data)) {
          this.store.dispatch(loadAccountDetails(addressPayload));
          return;
        }

        const obj = data['data'];
        if (data['success'] === false) {
          this.isAddress1Valid = true;
          this.address1ErrorMessage = data['message'];
        } else {
          this.subject.next('save');
          this.isAddress1Valid = false;

          if (obj['City']) this.City.setValue(obj['City']);
          if (obj['State']) this.State.setValue(obj['State']);
          if (obj['Address1']) this.AddressLine1.setValue(obj['Address1']);
          if (obj['Address2']) this.AddressLine2.setValue(obj['Address2']);
        }
      });
  }

  // Utility to check for empty object
  private isEmptyObject(obj: any): boolean {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control && control.value && control.value.toString() || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ShowChangePassword() {
    this.isChangePassword = !this.isChangePassword;
  }

  confirmPasswordChange(isChanged: boolean) {
    if (isChanged) {
      this.isChangePassword = false;
    }
  }

}
