import { Component, OnInit, ɵConsole, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AQAgentListService } from '@agenciiq/aqagent';
import { AQLoginService, AQUserInfo } from '@agenciiq/login';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQParameterService, AQZipDetailsService } from '@agenciiq/aqadmin';
import { KeyboardValidation } from 'src/app/shared/services/aqValidators/keyboard-validation';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { SortingService } from 'src/app/shared/services/sorting-service/sorting.service';
import { Subject, Subscription } from 'rxjs';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';
import { AddGuestScreen } from 'src/app/global-settings/error-message/addGuestScreen';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { GetappointService } from '../../getappoint.service';

@Component({
  selector: 'app-getappointed',
  templateUrl: './getappointed.component.html',
  styleUrls: ['./getappointed.component.sass'],
  standalone: false
})
export class GetappointedComponent implements OnInit {

  _AddGuestScreen: AddGuestScreen = null;
  f = true;
  agentdetails = [];
  agentlist: any;
  addagent: FormGroup;
  _agentIdTab = "agent";
  flag = false;
  isEdit: boolean = false;
  submitted: boolean = false;
  hitNext: boolean = false;
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
  selectedRoleCode: any;
  userRoleCode: any;
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
  private selectedUWAssistant: any[];
  validateField: boolean = false;
  checkSave: boolean = false;
  nextClicked: boolean = false;
  private fileInformation: { [key: string]: string } = {};

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
    private getAppointService: GetappointService,
  ) {
    this.userId = this._userinfo.UserId();
    this._AddGuestScreen = new AddGuestScreen();
    this.pageTitle = _router.url.includes('appointed') ? 'Get Appointed' : 'Submit Business';
  }

  ngOnInit() {
    this.createform();
    // this.onChnages();

  }

  guestQuoteOption() {
    this._router.navigate(['agenciiq/guest-user/guest-quote']);
  }

  next() {
    // this.nextClicked = !this.nextClicked;
    if (this.pageTitle == 'Get Appointed') {
      this.addagent.get('Website').clearValidators();
      this.addagent.get('Website').updateValueAndValidity();
      if (this.addagent.get('FirstName').invalid || this.addagent.get('LastName').invalid || this.addagent.get('Email').invalid || this.addagent.get('PhoneCell').invalid || this.addagent.get('AgencyName').invalid) {
        this.hitNext = true;
      }
      else {

        // let addGuestReqObj = this.addagent.getRawValue();
        // let guestUserReq = {
        //   "IsCheckAgency": true,
        //   "BusinessType": 1,
        //   "FirstName": addGuestReqObj.FirstName,
        //   "MiddleName": addGuestReqObj.Middlename,
        //   "LastName": addGuestReqObj.LastName,
        //   "Email": addGuestReqObj.Email,
        //   "PhoneNumber": addGuestReqObj.PhoneCell,
        //   "AgencyName": addGuestReqObj.AgencyName,
        //   "Website": addGuestReqObj.Website,
        //   "CopyOfYourAgency": addGuestReqObj.CopyOfYourAgency,
        //   "CopyOfResident": addGuestReqObj.CopyOfResident,
        //   "CopyOfSurplus": addGuestReqObj.CopyOfSurplus,
        //   "CopyOfYourEandO": addGuestReqObj.CopyOfYourEandO,
        //   "CompletedProducerApplication": addGuestReqObj.CompletedProducerApplication,
        //   "CompletedAgencyW9": addGuestReqObj.CompletedAgencyW9,
        //   "ConveloProducerAgreement": addGuestReqObj.ConveloProducerAgreement,
        //   "DirectDepositInformation": addGuestReqObj.DirectDepositInformation,
        //   "TargetPremiums": addGuestReqObj.TargetPremiums,
        //   "AcordApplication": addGuestReqObj.AcordApplication,
        //   "SupplementalApplication": addGuestReqObj.SupplementalApplication,
        //   "ThreeToFiveYearsLoss": addGuestReqObj.ThreeToFiveYearsLoss,
        //   "CurrentExperienceMod": addGuestReqObj.CurrentExperienceMod,
        // }
        // // console.log("All form value on submit", this.addagent.getRawValue())
        // this._loader.show();
        // let reqObject = this.trimValueService.TrimObjectValue(guestUserReq)
        // this.getAppointService.appointAgent(reqObject).subscribe((data: any) => {
        //   this._loader.hide();
        //   if (data && !data.success) {
        //     this._popupService.show('Guest User', data.message);
        //   } else {
        //     this.nextClicked = !this.nextClicked;
        //   }
        // }, (err) => {
        //   this._loader.hide();
        // }, () => {
        //   this._loader.hide();
        // });
        this.nextClicked = !this.nextClicked;
      }
    }
    else {
      if (this.addagent.get('FirstName').invalid || this.addagent.get('LastName').invalid || this.addagent.get('Email').invalid || this.addagent.get('PhoneCell').invalid || this.addagent.get('AgencyName').invalid || this.addagent.get('Website').invalid) {
        this.hitNext = true;
      }
      else {
        this.nextClicked = !this.nextClicked;
      }
    }
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
  get agency() {
    return this.addagent.get('AgencyName');
  }
  get Website() {
    return this.addagent.get('Website');
  }
  get CopyOfYourAgency() {
    return this.addagent.get('CopyOfYourAgency');
  }
  get CopyOfResident() {
    return this.addagent.get('CopyOfResident');
  }
  get CopyOfSurplus() {
    return this.addagent.get('CopyOfSurplus');
  }
  get CopyOfYourEandO() {
    return this.addagent.get('CopyOfYourEandO');
  }
  get CompletedProducerApplication() {
    return this.addagent.get('CompletedProducerApplication');
  }
  get CompletedAgencyW9() {
    return this.addagent.get('CompletedAgencyW9');
  }
  get ConveloProducerAgreement() {
    return this.addagent.get('ConveloProducerAgreement');
  }
  get DirectDepositInformation() {
    return this.addagent.get('DirectDepositInformation');
  }

  get AcordApplication() {
    return this.addagent.get('AcordApplication');
  }
  get SupplementalApplication() {
    return this.addagent.get('SupplementalApplication');
  }
  get ThreeToFiveYearsLoss() {
    return this.addagent.get('ThreeToFiveYearsLoss');
  }
  get CurrentExperienceMod() {
    return this.addagent.get('CurrentExperienceMod');
  }
  get TargetPremiums() {
    return this.addagent.get('TargetPremiums');
  }


  createform() {
    const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})(\/[^\s]*)?$/;
    this.addagent = this.fb.group({
      FirstName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^((?!\s{2,}).)*$/)]],
      Middlename: ['', Validators.pattern(/^((?!\s{2,}).)*$/)],
      LastName: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]],
      Email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      // Zip: ['', [Validators.required, Validators.minLength(5)]],
      // City: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(50)]],
      // State: [{ value: '', disabled: true }, [Validators.required]],
      // AddressLine1: ['', [Validators.required, Validators.maxLength(50)]],
      // AddressLine2: [''],
      PhoneCell: ['', [Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/), Validators.required]],
      // PhoneOffice: ['', [Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/)]],
      // PhoneHome: ['', [Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/)]],
      // Fax: ['', [Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/)]],

      // AgencyId: [null],
      // supervisorId: [0],
      // managerId: [0],
      AgencyName: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]],
      Website: ['', [Validators.required, Validators.pattern(urlPattern)]],

      CopyOfYourAgency: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]],
      CopyOfResident: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]],
      CopyOfSurplus: [],
      CopyOfYourEandO: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]],
      CompletedProducerApplication: ['', [Validators.required]],
      CompletedAgencyW9: ['', [Validators.required]],
      ConveloProducerAgreement: ['', [Validators.required]],
      DirectDepositInformation: ['', [Validators.required]],
      TargetPremiums: ['', [Validators.required]],
      AcordApplication: ['', [Validators.required]],
      SupplementalApplication: [''],
      ThreeToFiveYearsLoss: [''],
      CurrentExperienceMod: [''],
    });

    this.addagent.patchValue({ isActive: true });
    this.addagent.patchValue({ isLocked: false });
  }

  downloadPdfTemplate(fileName: string): void {
    this.getAppointService.downloadPdf(fileName).subscribe(data => {
      const blob = new Blob([data], { type: 'application/pdf' });
      // saveAs(blob, fileName); // Initiates the download with the specified file name

      // Create a link element
      const link = document.createElement('a');

      // Set the download attribute and file name
      link.setAttribute('download', fileName);

      // Create a URL for the blob and set it as the link's href
      link.href = window.URL.createObjectURL(blob);

      // Append the link to the document and trigger a click event
      document.body.appendChild(link);
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);

      // const url = window.URL.createObjectURL(blob);
      // window.open(url); // Opens the PDF in a new tab for the user to download
    });
  }


  private convertToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result ? reader.result.toString().split(',')[1] : '';
        // Extract base64 string from data URL
        if (base64String) {
          resolve(base64String);
        } else {
          reject('Invalid file format');
        }
      };
      reader.readAsDataURL(file);
    });
  }

  getFileName(controlName: string): string {
    return this.fileInformation[controlName] || '';
  }

  onFileChange(event: Event, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      // let removeEle=document.getElementById(controlName+'Remove')
      // removeEle.style.display='block';
      // let spanEle=document.getElementById(controlName+'Name')
      // spanEle.innerHTML=file.name;
      this.fileInformation[controlName] = file.name;

      // Convert the file to base64
      this.convertToBase64(file).then(base64String => {
        // Set the base64String to the respective form control
        this.addagent.patchValue({ [controlName]: base64String });
        // this.addagent.get(controlName).setValue(base64String);
        // this.addagent.controls[controlName].setValue(base64String);

        //console.log("Base64", base64String)        
      }).catch(error => {
        console.error('Error converting file to base64:', error);
      });
    }
    // console.log("All form", this.addagent.getRawValue())
  }



  addAgent() {
    var BusinessType: number;
    if (this.pageTitle == 'Get Appointed') {
      BusinessType = 1
      //Removing the submit business form validation, while submitting Agent
      this.addagent.get('TargetPremiums').setValidators(Validators.nullValidator);
      this.addagent.get('TargetPremiums').setValue(null);
      this.addagent.get('TargetPremiums').updateValueAndValidity();

      this.addagent.get('TargetPremiums').setValidators(Validators.nullValidator);
      this.addagent.get('TargetPremiums').setValue(null);
      this.addagent.get('TargetPremiums').updateValueAndValidity();

      this.addagent.get('AcordApplication').setValidators(Validators.nullValidator);
      this.addagent.get('AcordApplication').setValue(null);
      this.addagent.get('AcordApplication').updateValueAndValidity();

      this.addagent.get('SupplementalApplication').setValue(null);
      this.addagent.get('ThreeToFiveYearsLoss').setValue(null);
      this.addagent.get('CurrentExperienceMod').setValue(null);
    }
    else {
      BusinessType = 2
      //Removing the submit Agent form validation while submitting business
      this.addagent.get('CopyOfYourAgency').setValidators(Validators.nullValidator);
      this.addagent.get('CopyOfYourAgency').setValue(null);
      this.addagent.get('CopyOfYourAgency').updateValueAndValidity();

      this.addagent.get('CopyOfResident').setValidators(Validators.nullValidator);
      this.addagent.get('CopyOfResident').setValue(null);
      this.addagent.get('CopyOfResident').updateValueAndValidity();

      // this.addagent.get('CopyOfSurplus').setValidators(Validators.nullValidator);\\ Already Null
      // this.addagent.get('CopyOfSurplus').setValue(null);
      // this.addagent.get('CopyOfSurplus').updateValueAndValidity();

      this.addagent.get('CopyOfYourEandO').setValidators(Validators.nullValidator);
      this.addagent.get('CopyOfYourEandO').setValue(null);
      this.addagent.get('CopyOfYourEandO').updateValueAndValidity();

      this.addagent.get('CompletedProducerApplication').setValidators(Validators.nullValidator);
      this.addagent.get('CompletedProducerApplication').setValue(null);
      this.addagent.get('CompletedProducerApplication').updateValueAndValidity();

      this.addagent.get('CompletedAgencyW9').setValidators(Validators.nullValidator);
      this.addagent.get('CompletedAgencyW9').setValue(null);
      this.addagent.get('CompletedAgencyW9').updateValueAndValidity();

      this.addagent.get('ConveloProducerAgreement').setValidators(Validators.nullValidator);
      this.addagent.get('ConveloProducerAgreement').setValue(null);
      this.addagent.get('ConveloProducerAgreement').updateValueAndValidity();

      this.addagent.get('DirectDepositInformation').setValidators(Validators.nullValidator);
      this.addagent.get('DirectDepositInformation').setValue(null);
      this.addagent.get('DirectDepositInformation').updateValueAndValidity();
    }

    let addGuestReqObj = this.addagent.getRawValue();

    let guestUserReq = {
      "IsCheckAgency": false,
      "BusinessType": BusinessType,
      "FirstName": addGuestReqObj.FirstName,
      "MiddleName": addGuestReqObj.Middlename,
      "LastName": addGuestReqObj.LastName,
      "Email": addGuestReqObj.Email,
      // "Zip": addGuestReqObj.Zip,
      // "City": addGuestReqObj.City,
      // "State": addGuestReqObj.State,
      // "AddressLine1": addGuestReqObj.AddressLine1,
      // "AddressLine2": addGuestReqObj.AddressLine2,
      // "PhoneNumber": addGuestReqObj.PhoneCell,
      // "PhoneHome": addGuestReqObj.PhoneHome,
      // "PhoneOffice": addGuestReqObj.PhoneOffice,
      // "Role": "",
      "PhoneNumber": addGuestReqObj.PhoneCell,
      "AgencyName": addGuestReqObj.AgencyName,
      "Website": addGuestReqObj.Website,
      "CopyOfYourAgency": addGuestReqObj.CopyOfYourAgency,
      "CopyOfResident": addGuestReqObj.CopyOfResident,
      "CopyOfSurplus": addGuestReqObj.CopyOfSurplus,
      "CopyOfYourEandO": addGuestReqObj.CopyOfYourEandO,
      "CompletedProducerApplication": addGuestReqObj.CompletedProducerApplication,
      "CompletedAgencyW9": addGuestReqObj.CompletedAgencyW9,
      "ConveloProducerAgreement": addGuestReqObj.ConveloProducerAgreement,
      "DirectDepositInformation": addGuestReqObj.DirectDepositInformation,
      "TargetPremiums": addGuestReqObj.TargetPremiums,
      "AcordApplication": addGuestReqObj.AcordApplication,
      "SupplementalApplication": addGuestReqObj.SupplementalApplication,
      "ThreeToFiveYearsLoss": addGuestReqObj.ThreeToFiveYearsLoss,
      "CurrentExperienceMod": addGuestReqObj.CurrentExperienceMod,
    }

    if (this.addagent.valid) {
      this._loader.show();
      let reqObject = this.trimValueService.TrimObjectValue(guestUserReq)
      this.getAppointService.appointAgent(reqObject).subscribe((data: any) => {
        this._loader.hide();

        if (data?.success) {
          if (this.pageTitle == 'Get Appointed') {
            this._popupService.show('Guest User', 'Agency registration request submitted successfully.');
            this._router.navigateByUrl('');
          }
          else {
            this._router.navigateByUrl('');
          }
        } else {
          if (this.pageTitle == 'Get Appointed') {
            this._popupService.show('Guest User', data.message);
          }
          else {
            this._popupService.show('Guest User', data.message);
          }
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

  deleteList(assistant: any) {
    if (Array.isArray(assistant)) {
      this.AssistantList = [];
      assistant.filter(el => {
        this.UWAssistantList.push(el)
      })
    }
    else {
      this.AssistantList = this.AssistantList.filter(el => { return el.UWAssistantId != assistant.UWAssistantId });
      this.UWAssistantList.push(assistant);
    }
    this.UWAssistantList = this._sortingService.SortObjectArray('UWAssistantName', 'ASC', this.UWAssistantList);
  }

  selectValue(value: any) {
    this.addagent.patchValue({ "State": value });
    this.showDropDown = false;
  }

  closeDropDown() {
    this.showDropDown = !this.showDropDown;
  }

  getZipDetails(zipcode: number) {
    this.isZipInvalid = false;
    this._loader.show();
    this.zipDetails.ZipDetails(zipcode).subscribe(data => {
      this._loader.hide();
      if (data['CityStateLookupResponse']['ZipCode']) {
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
    }, () => {
      this._loader.hide();
    });
  }



  onChnages() {
    this.addressline1.valueChanges.subscribe(x => {
      if (x.trim()) {
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
      if (x.trim()) {
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
    //this.uwAssistantIdControl.valueChanges
  }

  validateAddress() {
    let a = this.addagent.getRawValue();
    this.address1ErrorMessage = "";
    this.isAddress1Valid = false;
    if (this.zip.value && this.city.value && this.state.value && (this.addressline1.value || this.addressline2.value)) {
      this._loader.show();
      this.validateAddressSubscription = this.zipDetails.ValidateAddressField(this.zip.value, null, this.city.value, this.state.value, this.addressline1.value, this.addressline2.value)
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

      //this.isZipInvalid = true;
      //this.zipErrorMessage = "Zip Required."
    } else {
      if (this.IsEventFromPage) {
        this.submitted = true;
      }
    }
  }

  openFIle(id: any) {
    var fileButton = document.getElementById(id);
    // creates a event that triggers click on fileButton 
    var clickEvent = new MouseEvent('click', { bubbles: true });
    fileButton.dispatchEvent(clickEvent);
  }

  RemoveFile(id: any) {
    this.addagent.get(id).setValue(null);
    if (this.fileInformation[id]) {
      delete this.fileInformation[id];
    }
  }

}
