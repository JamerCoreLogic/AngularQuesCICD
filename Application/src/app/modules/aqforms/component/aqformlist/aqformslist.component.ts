import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { Subscription } from 'rxjs';
import { AQUserInfo } from '@agenciiq/login';
import { AQFormsService, IFormsListRequest, IaqFormListReq } from '@agenciiq/aqforms';
import { Router, ActivatedRoute } from '@angular/router';
import { AQSession } from 'src/app/global-settings/session-storage';
import { DialogService } from 'src/app/shared/utility/aq-dialog/dialog.service';
import { AqformlistDialogComponent } from 'src/app/shared/components/aqformlist-dialog/aqformlist-dialog.component';
import { LOBService } from '@agenciiq/quotes';
import { AQParameterService, AQTransactionType, AQStage, ProgramService, AQAlfredFlag, AQPeriod, AQProcessingType, AQCarrier, AQStates } from '@agenciiq/aqadmin';




@Component({
  selector: 'app-aqforms-list',
  templateUrl: './aqformslist.component.html',
  styleUrls: ['./aqformslist.component.sass'],
  standalone: false
})
export class AQFormsListComponent implements OnInit {

  dataSource: any[] = [];
  formsListSubscription: Subscription;
  noRecordsMessage: string;
  userId: number;
  clientId: number;
  formsColumnList = ['lobCode', 'formType', 'stateCode', 'xmlMapping', 'effectiveFrom', 'effectiveTo', 'isActive'];
  dataSourceAccordian: any[] = [];
  programDataMaster: any[] = [];
  LOBList: any[] = [];
  statesList: any[];
  selectedLOB: any;
  selectedState: any;
  selectedStateCode: any;
  formTypeList: any;
  stateList: any;
  formList: any[] = [];
  showError: boolean = false;
  arrowkeyLocation = 0;

  constructor(
    private _loader: LoaderService,
    private _formsService: AQFormsService,
    private _userInfo: AQUserInfo,
    private _router: Router,
    private lobService: LOBService,
    private _aqSession: AQSession,
    private dialogService: DialogService,
    private activatedRoute: ActivatedRoute,
    private _aqSate: AQStates,
    private parameter: AQParameterService,
    private loaderService: LoaderService,
  ) {
    this.userId = this._userInfo.UserId() ? this._userInfo.UserId() : 0;
  }

  ngOnInit() {
    this.showError = false;
    this.dataSourceAccordian = this._aqSession.getData('dataSourceAccordian');
    this.getAqFormList(this.dataSourceAccordian);
  }

  keyDown(e, option, i) {

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
            selectedStateCode = el.shortName; selectedState = el.parameterName

          }
          else {
            if ((i - 1) == index) {
              selectedStateCode = el.shortName?.toString(); selectedState = el.parameterName?.toString();
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
            selectedStateCode = el.shortName.toString(); selectedState = el.parameterName.toString();
          }
          else {
            if ((i + 1) == index) { selectedStateCode = el.shortName?.toString(); selectedState = el.parameterName?.toString(); }
          }
        })
        break;
      default:
        selectedStateCode = option?.shortName; selectedState = option?.parameterName;
    }
    this.selectedStateCode = selectedStateCode;
    this.selectedState = selectedState;
  }

  onFormEdit(formId: any) {
    let formData = {
      'LOB': this.dataSourceAccordian['LOBCode'],
      'state': this.dataSourceAccordian['State'],
      'formType': this.dataSourceAccordian['FormType']
    }
    this._aqSession.setData('formId', formId);
    this._aqSession.setData('formData', formData);
    this._router.navigateByUrl('agenciiq/aqforms/manage');
  }


  getAqFormList(data: any) {
    this.formList = [];
    const formsListRequest: IFormsListRequest = {
      "UserId": this.userId,
      "LOB": data.LOB,
      "State": data.State,
      "QuoteType": data.FormType,
      "ClientID": 0
    }

    this._loader.show();
    this.formsListSubscription = this._formsService.GetFormsList(formsListRequest).subscribe((formsList: any) => {
      this.showError = false;
      this._loader.hide();
      if (formsList?.data?.aQFormResponses) {
        this.dataSource = formsList.data.aQFormResponses;
        this.dataSource.filter(item => {
          if (item.stateCode != null) {
            if (data.LOBCode == item.lobCode && data.stateCode == item.stateCode
              && data.FORMCode == item.formType) {
              this.formList.push(item);
            }
          }
          else {
            if (data.LOBCode == item.lobCode && data.FORMCode == item.formType && data.stateCode == null) {
              this.formList.push(item);
            }
          }
        })
        this.formList.map(item => {
          let arr = [];
          if (item?.multilineForms?.length > 0) {
            item.multilineForms.forEach((el: any) => {
              arr.push(el.lob);
            })
          }
          item["selectedLob"] = arr.toString();
        })
      }
      if (this.formList.length == 0) this.showError = true;
    }, (err) => {
      this.showError = true;
      this._loader.hide();
    })
  }

  addForm() {
    let formData = {
      'LOB': this.dataSourceAccordian['LOBCode'],
      'state': this.dataSourceAccordian['stateCode'],
      'formType': this.dataSourceAccordian['FORMCode']
    }
    this._aqSession.setData('formData', formData);
    this._router.navigateByUrl('agenciiq/aqforms/manage');
  }

  onCancel() {
    this._router.navigateByUrl('/agenciiq/aqforms');
  }

}
