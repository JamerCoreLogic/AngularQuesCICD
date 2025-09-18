import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { Subscription } from 'rxjs';
import { AQUserInfo } from '@agenciiq/login';
import { AQFormsService, IFormsListRequest, IaqFormListReq } from '@agenciiq/aqforms';
import { Router, ActivatedRoute } from '@angular/router';
import { AQSession } from 'src/app/global-settings/session-storage';
import { ProgramService } from '@agenciiq/aqadmin';


@Component({
  selector: 'app-aqformtype',
  templateUrl: './aqformtype.component.html',
  styleUrls: ['./aqformtype.component.sass'],
  standalone: false
})
export class AqformtypeComponent implements OnInit {

  dataSource: any[] = [];
  formsListSubscription: Subscription;
  userId: any;
  clientId: number;
  dataSourceAccordian: any[] = [];
  LOBList: any[] = [];
  selectedLOB: any;
  selectedLOBName: any;
  selectedState: any;
  selectedStateCode: any;
  formTypeList: any;
  formTypeListFlag: any;
  stateList: any;
  ColumnList = ['parameterName', 'shortName', 'parameterId'];
  listState: any;
  programData: any = [];
  formData: any;
  arrowkeyLocation = 0;

  constructor(private _loader: LoaderService,
    private _formsService: AQFormsService,
    private _userInfo: AQUserInfo,
    private _router: Router,
    private _aqSession: AQSession,
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private _programService: ProgramService,
  ) {
    this.userId = this._userInfo.UserId() ? this._userInfo.UserId() : 0;
  }

  ngOnInit() {
    this.formData = this._aqSession.getData('dataSourceAccordian');
    this.removeSession();
    this.getMGAPrograms();
    if (this.formData != null && this.formData.State == 'Other State') this.ResolveOtherStateData();
    else this.ResolveData();
  }

  removeSession() {
    this._aqSession.removeSession("dataSourceAccordian");
  }

  ResolveData() {
    this.activatedRoute.data.subscribe(data => {
      if (data?.parameter) {
        this.formTypeList = data.parameter?.data?.parameterList.sort(function (a: { parameterId: number; }, b: { parameterId: number; }) { return a.parameterId - b.parameterId });
        this.formTypeList = this.formTypeList.filter((item: any) => {
          if (item.parameterName != 'Program' && item.parameterName != 'Account'
            && item.parameterName != 'UW Review' && item.parameterName != 'Risk Analysis' && item.parameterName != 'Forms') {
            return item
          }
        })
        //this.sortedColumnName = { 'columnName': 'parameterId', isAsc: true };
        this.formTypeListFlag = this.formTypeList;
      }
    })
  }

  ResolveOtherStateData() {
    this.activatedRoute.data.subscribe(data => {
      if (data?.parameter) {
        this.formTypeList = data.parameter.data.parameterList.sort(function (a: { parameterId: number; }, b: { parameterId: number; }) { return a.parameterId - b.parameterId });
        this.formTypeList = this.formTypeList.filter((item: any) => {
          if (item.parameterName != 'Program' && item.parameterName != 'Account') {
            return item
          }
        })
        //this.sortedColumnName = { 'columnName': 'parameterId', isAsc: true };
      }
    })
  }

  getMGAPrograms() {
    //this.loaderService.show();
    this._programService.MGAPrograms(this.userId, 1)
      .subscribe(programs => {
        if (programs?.data?.mgaProgramList) {
          this.programData = programs.data.mgaProgramList;
          this.LOBList = this.programData.map((data: { mgaLobs: any; }) => data.mgaLobs);
          this.LOBList.sort(function (a, b) {
            if (a.lobName.toLowerCase() < b.lobName.toLowerCase()) {
              return -1;
            }
            else if ((a.lobName.toLowerCase()) > (b.lobName.toLowerCase())) {
              return 1;
            }
            return 0;
          });
          //if(this.formData)
          this.selectedLOB = this.formData ? this.formData.LOBCode : this.LOBList[0].lob;
          this.selectedLOBName = this.formData ? this.formData.LOB : this.LOBList[0].lobName;
          this.getStateList(this.selectedLOB);
          this.loaderService.hide();
        }
      })
  }

  setLob(lob: any) {
    this.formData = "";
    this.selectedLOB = lob;
    this.LOBList.filter(el => {
      if (el.lob == lob) this.selectedLOBName = el.lobName
    })
    this.getStateList(lob);
  }


  getStateList(lob: any) {
    this._programService.MGAPrograms(this.userId, 1).subscribe(programs => {
      if (programs?.data?.mgaProgramList) {
        this.programData = programs.data.mgaProgramList;
        let stateList = [];
        let listState = [];
        stateList = this.programData.filter((state: { mgaLobs: { lob: any; }; }) => state.mgaLobs.lob == lob).map((program: { mgaStates: any; }) => program.mgaStates)[0];
        stateList.push({
          'state': "Other State",
          'stateCode': null,
          'stateId': null
        })
        this.stateList = stateList;
        this.listState = this.stateList;
        this.selectedStateCode = this.formData ? this.formData.stateCode : this.listState[0].stateCode;
        this.selectedState = this.formData ? this.formData.State : this.listState[0].state
      }
    })

  }



  OnstateChange(option: { stateCode: any; state: any; }) {
    this.selectedStateCode = option.stateCode;
    this.selectedState = option.state;
    if (this.selectedState == 'Other State') {
      this.ResolveOtherStateData();
    } else {
      this.ResolveData();
      //this.formTypeList = this.formTypeListFlag  ;
    }
  }

  keyDownState(e, option, i) {

    let statesList = this.stateList;
    let selectedStateCode, selectedState;

    switch (e.keyCode) {
      case 38: // this is the ascii of arrow up
        this.arrowkeyLocation--;
        this.arrowkeyLocation = this.arrowkeyLocation == -1 ? 0 : this.arrowkeyLocation;

        if (e.srcElement.previousElementSibling) {
          e.srcElement.previousElementSibling.focus();
        }
        statesList.filter(function (el, index) {
          if (i == 0 && index == 0) {
            selectedStateCode = el.stateCode; selectedState = el.state

          }
          else {
            if ((i - 1) == index) {
              selectedStateCode = el.stateCode; selectedState = el.state;
            }
          }
        })
        break;
      case 40: // this is the ascii of arrow down
        this.arrowkeyLocation++;
        if (e.srcElement.nextElementSibling) {
          e.srcElement.nextElementSibling.focus();
        }
        statesList.filter(function (el, index) {
          if (i == statesList.length - 1 && index == statesList.length - 1) {
            selectedStateCode = el.stateCode.toString(); selectedState = el.state.toString();
          }
          else {
            if ((i + 1) == index) { selectedStateCode = el.stateCode; selectedState = el.state; }
          }
        })
        break;
      default:
        selectedStateCode = option.stateCode; selectedState = option.state;
    }
    this.selectedStateCode = selectedStateCode;
    this.selectedState = selectedState;
    // this.OnParameterOptionChange(this.selectedKeys);
  }

  onFormEdit(formId: any) {
    this._aqSession.setData('formId', formId);
    this._router.navigateByUrl('agenciiq/aqforms/manage');
  }


  getAqFormList(formTypeData: { parameterName: any; shortName: any; }) {
    let formType = formTypeData.parameterName;
    let formTypeCode = formTypeData.shortName;

    let obj = {
      'LOB': this.selectedLOBName,
      'LOBCode': this.selectedLOB,
      'FormType': formType,
      'FORMCode': formTypeCode,
      'State': this.selectedState,
      'stateCode': this.selectedStateCode,
    }

    this._aqSession.setData('dataSourceAccordian', obj);
    this._router.navigateByUrl('agenciiq/aqforms/list');
  }

  addForm() {
    this._router.navigateByUrl('agenciiq/aqforms/manage');
  }

}
