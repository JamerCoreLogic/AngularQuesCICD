import { Component, OnInit } from '@angular/core';
import { DialogRef } from '../../utility/aq-dialog/dialog-ref';
import { Validators, UntypedFormControl, FormGroup, FormBuilder, FormControl, ValidationErrors, AbstractControl } from '@angular/forms';
import { DialogConfig } from '../../utility/aq-dialog/dialog-config';
import { DialogParameterScreen } from 'src/app/global-settings/error-message/dialogParameterScreen'
import { KeyboardValidation } from '../../services/aqValidators/keyboard-validation';
import { DialogSaveParameterService, AQParameterService } from '@agenciiq/aqadmin';
import { IDialogParamCreateReq } from '@agenciiq/aqadmin/lib/interfaces/dialog-save-parameter-req';
import { Router } from '@angular/router';
//import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { AQUserInfo } from '@agenciiq/login';
import { LoaderService } from '../../utility/loader/loader.service';
import { CheckRoleService } from '../../services/check-role/check-role.service';

@Component({
  selector: 'app-parameter-dialog',
  templateUrl: './parameter-dialog.component.html',
  styleUrls: ['./parameter-dialog.component.sass'],
  standalone: false
})
export class ParameterDialogComponent implements OnInit {
  ParameterForm: FormGroup
  parameterData: any;
  isParameterEdit: boolean = false;
  submitted: boolean = false;
  modalTitle: any;
  minDate: Date;
  dataSource: any[] = [];
  isModifyDate: boolean = true;
  _DialogParameterScreen: DialogParameterScreen = null;
  NoRecordsMessage: string = "";
  isParameterAddDisabled: boolean;
  userid: number;
  saveaddNewdata: any = null;
  count: number = 0;


  constructor(
    private config: DialogConfig,
    private dialog: DialogRef,
    public ValidateKey: KeyboardValidation,
    private DialogSaveParameterService: DialogSaveParameterService,
    private parameterService: AQParameterService,
    private _userInfo: AQUserInfo,
    private fb: FormBuilder,
    private _router: Router,
    private _popup: PopupService,
    private _loader: LoaderService,
    private _checkRoleService: CheckRoleService,
  ) {

    this.userid = this._userInfo.UserId();
    this.parameterData = this.config.data;
    this._DialogParameterScreen = new DialogParameterScreen();

  }



  ngOnInit() {

    if (this.parameterData.ParameterId == 0) {
      this.modalTitle = "Add";
      this.isParameterEdit = false
    }
    else {
      this.modalTitle = "Edit"
      this.isParameterEdit = true;
    }

    this.createDialogForm();
    this.ParameterForm.get('EffectiveFrom').valueChanges.subscribe(effectivedate => {
      //const effectiveTo = this.ParameterForm.get('EffectiveTo').value;
      this.minDate = new Date(effectivedate);
      this.minDate.setDate(this.minDate.getDate() + 1);
      this.ParameterForm.get('EffectiveTo').enable();
    })
    if (this.parameterData.ParameterId != 0 && this.parameterData.ParameterId != undefined)
      this.setFormData()

    //this.onFormChange();
  }

  // onFormChange(){
  //   this.EffectiveFrom.valueChanges.subscribe(value=>{
  //     if(value){
  //       this.EffectiveTo.setValidators([Validators.required]);
  //       this.EffectiveTo.updateValueAndValidity({emitEvent:false});
  //     }
  //   })
  // }



  createDialogForm() {
    this.count = 0;
    this.ParameterForm = this.fb.group({
      FullName: ['',
        [Validators.required, Validators.maxLength(100), this.noWhitespaceValidator]
      ],
      ShortName: ['', [Validators.required]],
      Value: [''],
      EffectiveFrom: [''],
      EffectiveTo: [''],
      Status: [{ disabled: true }]
    })
  }

  setFormData() {

    this.ParameterForm.get('FullName').setValue(this.parameterData?.parameterName);
    //this.ParameterForm.get('').setValue(this.parameterData.parameterValue);
    this.ParameterForm.get('ShortName').setValue(this.parameterData?.ShortName);
    this.ParameterForm.get('Value').setValue(this.parameterData?.Value);
    if (this.parameterData?.effectiveFrom) {
      // let efValue = new Date(this.parameterData.effectiveFrom);
      // let UTCEffectiveFrom = Date.UTC(efValue.getFullYear(), efValue.getMonth(), efValue.getDate()) - efValue.getTimezoneOffset();
      this.ParameterForm.get('EffectiveFrom').setValue(this.setDate(this.parameterData?.effectiveFrom));
    }
    else
      this.ParameterForm.get('EffectiveTo').setValue('');
    if (this.parameterData?.effectiveTo) {
      //   let etValue = new Date(this.parameterData.effectiveTo);
      //   let UTCEffectiveTo= Date.UTC(etValue.getFullYear(), etValue.getMonth(), etValue.getDate()) - etValue.getTimezoneOffset();
      this.ParameterForm.get('EffectiveTo').setValue(this.setDate(this.parameterData?.effectiveTo));
    }
    else
      this.ParameterForm.get('EffectiveTo').setValue('');
    this.ParameterForm.get('Status').setValue(this.parameterData?.IsActive);
    if (this.parameterData?.isNotEditable) {
      this.FullName.disable();
      this.ShortName.disable();
      this.EffectiveFrom.disable();
      this.EffectiveTo.disable();
      this.Status.disable();
    }
  }


  noWhitespaceValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value || '').toString();
    return value.trim().length === 0 ? { whitespace: true } : null;
  }

  saveData(type: string) {
    let data = this.ParameterForm.getRawValue();
    if (this.ParameterForm.valid) {
      let paramData: IDialogParamCreateReq = {
        UserId: this.parameterData.UserId,
        ParameterId: this.parameterData.ParameterId,
        ParameterKey: this.parameterData.ParameterKey.parameterAlias,
        ParameterName: data.FullName,
        // ParameterValue: data.ShortName,
        ShortName: data.ShortName,
        Value: data.Value,
        effectiveFrom: this.setDate(data.EffectiveFrom),
        effectiveTo: this.setDate(data.EffectiveTo),
        //isActive: data.Status
        isActive: (typeof data.Status === 'object' && data.Status !== null)
          ? data.Status.disabled
          : data.Status
      }

      if ((this.count == 0 && type == 'open') || type == 'close') {
        this.count++;
        this.DialogSaveParameterService.SaveDialogParamForm(paramData)
          .subscribe(data => {
            if (data) {
              this._checkRoleService.addNewMasterSubject.next('AddNewMaster');
              this.resetControls();
              if (type == "close") {
                this.dialog.close(data);
                this.saveaddNewdata = null
              }
              else {
                this.parameterData.ParameterId = 0;
                this.saveaddNewdata = data;
                this.createDialogForm();
              }
            }
          })
      }
    }
    else
      this.submitted = true
  }

  OnParameterOptionChange(option) {
    // this.paramSearchText = "";
    // this.selectedKeys = option;
    //   this.elements = document.getElementsByClassName('list-group-item border-0');
    //     for(let i = 0;i<this.elements.length;i++){
    //     this.elements[i].addEventListener('keydown',function(){
    //       alert('Event Triggered');
    //   })
    // }
    this.parameterService.getAllParameterByKey(option, this.userid)
      .subscribe(data => {
        if (data?.data?.parameterList) {
          this.NoRecordsMessage = "";
          let paramList = data.data.parameterList;
          paramList.forEach(function (el, index, arr) {
            if (el.parameterName == null) {
              paramList.splice(index, 1);
            }
          })
          if (paramList.length != 0) {
            this.dataSource = paramList;
            let dataDisabled = this.dataSource[0];
            this.isParameterAddDisabled = dataDisabled.isParameterAddDisabled;
          }
          else
            this.dataSource = [];
        } else {
          this.dataSource = [];
          this.NoRecordsMessage = "No Record Found."
        }
      })
  }


  setDate(value: any) {
    if (value != null) {
      let dateValue = new Date(value);
      let UTCDate = Date.UTC(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate()) - dateValue.getTimezoneOffset();
      return new Date(UTCDate);
    }
    else
      return null;
  }

  resetControls() {
    this.submitted = false;
    this.ParameterForm.reset();
  }

  get FullName() {
    return this.ParameterForm.get('FullName');

  }

  get ShortName() {
    return this.ParameterForm.get('ShortName');

  }

  get Value() {
    return this.ParameterForm.get('Value');

  }

  get EffectiveFrom() {
    return this.ParameterForm.get('EffectiveFrom');

  }
  get EffectiveTo() {
    return this.ParameterForm.get('EffectiveTo');

  }

  get Status() {
    return this.ParameterForm.get('Status');

  }

  cancel() {
    this.dialog?.close(this.saveaddNewdata);
    this.ParameterForm.reset();
    //this._router.navigateByUrl("agenciiq/parameters");
  }

}
