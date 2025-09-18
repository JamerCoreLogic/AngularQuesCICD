import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AQStates, AQParameterService } from '@agenciiq/aqadmin';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AQSession } from 'src/app/global-settings/session-storage';
import { AQFormsService, IFormGetRequest } from '@agenciiq/aqforms';
import { AQUserInfo } from '@agenciiq/login';
import { LOBService, ILOBGetRequest } from '@agenciiq/quotes';
import { MgaConfigService } from '@agenciiq/mga-config';
import { ProgramService } from '@agenciiq/aqadmin';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';
import { Manageformscreen } from 'src/app/global-settings/error-message/manageform-screen';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { SetDateService } from 'src/app/shared/services/setDate/set-date.service'
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';

@Component({
  selector: 'app-manage-screen',
  templateUrl: './manage-screen.component.html',
  styleUrls: ['./manage-screen.component.sass'],
  standalone: false
})
export class ManageScreenComponent implements OnInit {

  _Manageformscreen: Manageformscreen = null;
  aqFormsGroup: FormGroup;
  stateList: any;
  LOBList: any;
  userId: any;
  isSubmitted: boolean = false;
  bsEffectiveDate: string | Date;
  bsExpirationDate: string | Date;
  formTypeList: any;
  uploadedFile: File;
  excelData: any;
  FormName: string;
  minDate: Date;
  maxDate: Date;
  parameterDataSubscription: Subscription;
  formsDataSubscription: Subscription;
  LOBDataSubscription: Subscription;
  uploadFormSubscription: Subscription;
  saveFormSubscription: Subscription;
  base64EncodedExcel: any;
  base64EncodedJSON: any;
  isFormDefinitionExists: boolean = false;
  formId: any;
  isFileExists: boolean = false;
  isvalidExtension: boolean = false;
  showStateList: boolean = false;
  statesList: any;
  isStateSelected: boolean = false;
  selectedState: any = '';
  noofQuotes: number = 0;
  programData: any[] = [];
  programDataMaster: any[] = [];
  fileName: string;
  downloadExcelName: any;
  isEdit: boolean = false;
  disableDownExcel: boolean = false;
  formData: any;

  constructor(
    private formBuilder: FormBuilder,
    private _aqSate: AQStates,
    private parameter: AQParameterService,
    private loaderService: LoaderService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private aqSession: AQSession,
    private formsService: AQFormsService,
    private userInfo: AQUserInfo,
    private LOBService: LOBService,
    private _mgaConfig: MgaConfigService,
    private _programService: ProgramService,
    private trimValueService: TrimValueService,
    private activatedRoute: ActivatedRoute,
    private _popup: PopupService,
    private setDateService: SetDateService,
    private _checkRoleService: CheckRoleService,
  ) {
    this._Manageformscreen = new Manageformscreen();
  }

  ngOnInit() {
    this.fileName = "";
    this.base64EncodedExcel = "";
    this.formId = 0;
    this.userId = this.userInfo.UserId() ? this.userInfo.UserId() : 0;
    this.formData = this.aqSession.getData('formData')
    this.createForm();
    this.ResolveData();
    this.patchValue();
  }

  createForm() {
    this.aqFormsGroup = this.formBuilder.group({
      QuoteType: ['', Validators.required],
      EffectiveFrom: ['', Validators.required],
      EffectiveTo: [''],
      IsActive: [true]
    })
  }

  ResolveData() {
    this.activatedRoute.data.subscribe(data => {
      if (data?.parameter) {
        this.formTypeList = data.parameter.data.parameterList;
      }
    })
  }

  patchValue() {
    if (this.formData?.formId) {
      this.isFileExists = true;
      this.isvalidExtension = true;
      this.getFormById();
      this.FormName = "Edit Form";
      this.isEdit = true;
    } else {
      this.FormName = "Add Form";
      this.isEdit = false;
      // this.BusinessLine.patchValue(this.formData.LOB);
      // this.filteStateList(this.formData.LOB);
      this.FormType.patchValue(this.formData?.formType);
      // this.State.patchValue(this.formData.state);
      // this.BusinessLine.disable({ emitEvent: false });
      this.FormType.disable({ emitEvent: false });
      // this.State.disable({ emitEvent: false });
    }

    this.EffectiveFrom.valueChanges.subscribe(effectivedate => {
      this.minDate = new Date(effectivedate)
    });
  }

  get BusinessLine() {
    return this.aqFormsGroup.get('Lob');
  }
  get FormType() {
    return this.aqFormsGroup.get('QuoteType');
  }
  get State() {

    return this.aqFormsGroup.get('State');
  }
  get EffectiveFrom() {
    return this.aqFormsGroup.get('EffectiveFrom');

  }
  get EffectiveTo() {
    return this.aqFormsGroup.get('EffectiveTo');

  }
  get Status() {
    return this.aqFormsGroup.get('IsActive');

  }

  getFormById() {
    const formsGetRequest: IFormGetRequest = {
      "UserId": this.userId,
      "LOB": "",
      "State": "",
      "QuoteType": "",
      "FormId": this.formData.formId,
      "ClientID": 0
    }
    this.loaderService.show();
    this.formsDataSubscription = this.formsService.GetFormById(formsGetRequest).subscribe((form: any) => {
      this.loaderService.hide();
      if (form && form.success && form.data.aQFormResponses.length > 0) {
        this.FormType.patchValue(form.data.aQFormResponses[0].formType);
        this.Status.patchValue(form.data.aQFormResponses[0].isActive);
        this.bsEffectiveDate = form.data.aQFormResponses[0].effectiveFrom ? this.setDateService.setDate(form.data.aQFormResponses[0].effectiveFrom) : '';
        this.bsExpirationDate = form.data.aQFormResponses[0].effectiveTo ? this.setDateService.setDate(form.data.aQFormResponses[0].effectiveTo) : '';
        this.formId = this.formData.formId;
        this.noofQuotes = form.data.aQFormResponses[0].noofQuotes;
        this.downloadExcelName = form.data.aQFormResponses[0].fileName;
        this.base64EncodedJSON = form.data.aQFormResponses[0].formDefinition;
        this.base64EncodedExcel = form.data.aQFormResponses[0].formExcel;
        this.EffectiveFrom.valueChanges.subscribe(effectivedate => {
          this.minDate = new Date(effectivedate)
        })
        this.FormType.disable({ emitEvent: false });
      }
    },
      err => {
        this.loaderService.hide();
        console.error('Error occurred:', err);
      })
  }

  onCancel() {
    this.router.navigateByUrl('/agenciiq/other-screens/list');
  }

  onSaveForm() {
    this.aqSession.removeSession('formId');
    if (this.aqFormsGroup.valid && this.isvalidExtension && this.isFileExists) {
      this.isSubmitted = false;
      let uploadFormRequest = this.aqFormsGroup.getRawValue();
      if (uploadFormRequest.State == null) uploadFormRequest.State = "";
      uploadFormRequest.FormDefinition = this.base64EncodedExcel;
      uploadFormRequest.FormId = this.formId;
      uploadFormRequest.ClientID = 0;
      uploadFormRequest.UserId = this.userId;
      uploadFormRequest.XmlMapping = "";
      uploadFormRequest.FileName = this.fileName;
      uploadFormRequest.EffectiveFrom = this.setDateService.setDate(uploadFormRequest.EffectiveFrom);
      uploadFormRequest.EffectiveTo = this.setDateService.setDate(uploadFormRequest.EffectiveTo);
      let reqObject = this.trimValueService.TrimObjectValue(uploadFormRequest)
      this.loaderService.show();
      this.saveFormSubscription = this.formsService.SaveAQFormWithExcel(reqObject)
        .subscribe((response: any) => {
          if (response && response.success) {
            //this.resetControls();
            this._checkRoleService.addNewOtherScreenSubject.next('AddOtherScreen');
            this.router.navigateByUrl('/agenciiq/other-screens/list');
          } else {
            this._popup.showPopup('Manage Form', response['message']);
          }
          this.loaderService.hide();
        },
          err => {
            this.loaderService.hide();
            console.error('Error occurred:', err);
          })
    }
    else {
      this.isSubmitted = true;
    }

  }

  s2ab(s: string) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  Download() {
    let reqObj = {
      "UserId": this.userId,
      "FormId": this.formData?.formId,
      "ClientID": 0
    }
    this.formsService.DowloadFormExcel(reqObj)?.subscribe(data => {
      if (data?.data?.formExcel) {
        let blob = new Blob([this.s2ab(atob(data?.data?.formExcel))], {
          type: ''
        });
        let temp = atob(data.data.formExcel);
        let ele = document.createElement('a');
        ele.href = window.URL.createObjectURL(blob);
        let fileName = this.downloadExcelName;
        ele.download = `${fileName}`;
        ele.style.display = 'none';
        document.body.appendChild(ele);
        ele.click();
        document.body.removeChild(ele);
      }
    })
  }


  uploadExcel(event: any) {
    let allowedFiles = [".xlsx", ".xls"];
    let regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + allowedFiles.join('|') + ")$");
    if (event.target.files.length > 0) {
      this.disableDownExcel = true;
      this.fileName = event.target.files[0].name;
      this.uploadedFile = event.target.files[0];
      this.isFileExists = true;
      if (!regex.test(this.fileName.toLowerCase())) {
        this.isvalidExtension = false;
      }
      else {
        this.isvalidExtension = true;
        this.readAQFormExcel();
      }
    }
    else {
      this.isFileExists = false;
    }
  }

  readAQFormExcel() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.excelData = fileReader.result;
      var uInt8Data = new Uint8Array(this.excelData);
      var array = Array.prototype.slice.call(uInt8Data);
      var mappedArray = array.map(function (item) {
        return String.fromCharCode(item);
      });
      this.base64EncodedExcel = btoa(mappedArray.join(''));
      //this.getAQFormJSON();
    }
    fileReader.readAsArrayBuffer(this.uploadedFile);
  }

  resetControls() {
    this.isSubmitted = false;
    this.base64EncodedJSON = "";
    this.aqFormsGroup.reset();
  }

  filteStateList(lob: any) {
    this.statesList = [];
    this.statesList = this.programDataMaster.filter(item => item.mgaLobs.lob == lob).map(data => data.mgaStates)[0];
    this.statesList?.push({
      "state": "Other State",
      "stateCode": null,
      "stateId": null
    })
  }

  ngOnDestroy() {
    if (this.parameterDataSubscription) {
      this.parameterDataSubscription.unsubscribe();
    }
    if (this.formsDataSubscription) {
      this.formsDataSubscription.unsubscribe();
    }
    if (this.LOBDataSubscription) {
      this.LOBDataSubscription.unsubscribe();
    }
    if (this.saveFormSubscription) {
      this.saveFormSubscription.unsubscribe();
    }
    if (this.uploadFormSubscription) {
      this.uploadFormSubscription.unsubscribe();
    }
  }

}
