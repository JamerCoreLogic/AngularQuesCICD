import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Subscription, from } from 'rxjs'
import { Router } from '@angular/router';
import { ISaveAdvanceFilterReq } from './ISaveAdvanceFilterReq';
import { AQAgentInfo, AQUserInfo } from 'projects/aqlogin/src/public-api';
import { AQParameterService, AQTransactionType, AQStage, AQAlfredFlag, AQProcessingType, AQCarrier, AQStates, AQPeriod } from 'projects/aqadmin/src/public-api';
import { AQSaveAdvanceFilterService } from 'projects/aqquotes/src/lib/services/save-advance-filter/save-advance-filter.service'
import { LOBService } from 'projects/aqquotes/src/lib/services/lob/lob.service';

@Component({
  selector: 'app-advance-filter',
  templateUrl: './advance-filter.component.html',
  styleUrls: ['./advance-filter.component.sass'],
  standalone: false
})
export class AdvanceFilterComponent implements OnInit {


  SavedAdvanceFilterList: any[] = [];
  dataSource;
  flag: boolean = true;
  programData: any = [];
  HideAdvFilterOption: boolean = false;
  alfredFlagListChecked: any[] = [];
  transactionTypeList: any;
  FilterOpen: boolean = false;
  advanceFilterForm: FormGroup;
  alfredList: any;
  stateList: any;
  processingTypeList: any;
  stageList: any;
  periodList: any;
  carrierList: any;
  private _userId = 0;
  private _agencyId = 0;
  private agentId = 0;
  CilentID: number = 0;
  lobList: any;

  private GetAdvanceFilterParameterSubscription: Subscription;
  private SaveAdvanceFilterSubscription: Subscription;
  private QuotesListSubscription: Subscription;
  private periodSubscription: Subscription;
  private getParameterSubscription: Subscription;
  private QuotesFilterSubscription: Subscription;


  /* ----------------------------- */



  pagination: boolean = true;
  columns: any[] = [];
  TransactionTypeList: any[] = [];
  BusinessTypeList: any[] = [];
  LOBList: any[] = [];
  STAGEList: any[] = [];
  AlfredFlagList: any[] = [];
  agentNameList: any[] = [];
  SavedAdvanceFilterParameter: any[];
  SelecteFilter: any;
  advancedFilterId: number;

  filterName: any;
  isFilterFlag: boolean = false;
  isDefaultChecked: boolean = false;
  SavedAdvanceFilterParameterID: any;
  bsValue: '';
  bsStartValue;
  bsEndValue;
  processTypeList: any[] = [];
  isFilterNameValid: boolean = true;
  isFilterDescValid: boolean = true;
  isSearched: boolean = false;

  @Output() filterSearch = new EventEmitter();
  @Output() clearAll = new EventEmitter();
  @Output() cancel = new EventEmitter();

  constructor(

    private _agentInfo: AQAgentInfo,
    private _userInfo: AQUserInfo,
    private parameter: AQParameterService,
    private transType: AQTransactionType,
    private stageType: AQStage,
    private alferd: AQAlfredFlag,

    private _aqProcessingType: AQProcessingType,
    private router: Router,

    private _aqCarrier: AQCarrier,
    private _aqSate: AQStates,
    private saveFilterService: AQSaveAdvanceFilterService,
    private _aqPeriod: AQPeriod,
    private lobService: LOBService,
    private fb: FormBuilder,

  ) {
    this._userId = this._userInfo.UserId();
    this.agentId = this._agentInfo.Agent().agentId;
    this.createAdvanceFilterForm();
  }

  ngOnInit() {


    this.getParameterList();
    // this.getMGAPrograms();
    this.getParameterData()
    this.getLobList();
  }

  cancelAdvanceFilterForm() {
    this.cancel.emit(true);
  }

  clearAdvanceFilterForm() {
    this.clearAll.emit(true);
  }

  isChecked(id) {
    if (this.alfredFlagListChecked.length > 0) {
      if (this.alfredFlagListChecked.indexOf(id) > -1) {
        return true;
      } else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  createAdvanceFilterForm() {
    this.advanceFilterForm = this.fb.group({
      Ref: [''],
      InsuredName: [''],
      LOB: [''],
      AgentName: [''],
      TransactionType: [''],
      BusinessType: [{ value: '', disabled: true }],
      Status: [''],
      PremiumStart: [''],
      PremiumEnd: [''],
      AlfredFlags: [''],
      filterName: [''],
      Agency: [{ value: '', disabled: true }],
      Agent: [''],
      State: [{ value: '', disabled: false }],
      ProcessingType: [{ value: '', disabled: true }],
      Period: [{ value: '', disabled: true }],
      Carrier: [{ value: 0, disabled: false }],
      filterDetails: [''],
      EffectiveFromDate: [''],
      EffectiveToDate: [''],
      ExpirationFromDate: [''],
      ExpirationToDate: [''],
    })
  }

  getAdvanceFilter(value) {
    this.FilterOpen = value;
    this.HideAdvFilterOption = false;
  }

  getParameterData() {


    this.parameter.getParameter("", this._userId)
      .subscribe(data => {

        if (data && data.success && data.message == null) {
          this.transactionTypeList = this.transType.TransactionTypeList();
          this.alfredList = this.alferd.AlfredFlagList();
          this.stageList = this.stageType.StageList();
          this.periodList = this._aqPeriod.PeriodList();
          this.processingTypeList = this._aqProcessingType.ProcessingTypeList();
          this.carrierList = this._aqCarrier.CarrierList();
          this.stateList = this._aqSate.StateList();
        }
      },
        err => {

        },
        () => {

        })
  }



  getParameterList() {

    this.saveFilterService.GetAdvanceFilterParameter('QuoteFilter', this._userId.toString(), this.agentId)
      .subscribe(parameters => {
        if (parameters && parameters.data && parameters.data.advancedFilterList) {
          this.SavedAdvanceFilterList = [];
          this.SavedAdvanceFilterList = parameters.data.advancedFilterList.filter(item => item.filterName !== null);
          let _tempFilterList: any[] = this.SavedAdvanceFilterList.filter(filter => filter.isDefault);
          if (_tempFilterList.length > 0) {
            this.SavedAdvanceFilterParameterID = _tempFilterList[0].advancedFilterId;
            this.changeFilter(this.SavedAdvanceFilterParameterID);
            this.DefaultChecked(true);
          }
        }
      })
  }

  getLobList() {
    this.lobService.GetLOBList(this._userId)
      .subscribe(response => {
        this.LOBList = response.data.lobsList;
      },
        err => {
          // this.loaderService.hide();
        })
  }


  saveFilterOption(filter) {
    this.saveFilterService.SaveAdvanceFilter('QuoteFilter', filter.FilterName, filter.FilterParticulars, filter.Parameters, filter.IsDefault, this._userId, this.agentId, filter.AdvancedFilterId)
      .subscribe(data => {
        this.getParameterList();
      })
  }





  ngOnDestroy() {


    if (this.GetAdvanceFilterParameterSubscription) {
      this.GetAdvanceFilterParameterSubscription.unsubscribe();
    }
    if (this.SaveAdvanceFilterSubscription) {
      this.SaveAdvanceFilterSubscription.unsubscribe();
    }

    if (this.QuotesListSubscription) {
      this.QuotesListSubscription.unsubscribe();
    }
    if (this.periodSubscription) {
      this.periodSubscription.unsubscribe();
    }
    if (this.getParameterSubscription) {
      this.getParameterSubscription.unsubscribe();
    }
    if (this.QuotesFilterSubscription) {
      this.QuotesFilterSubscription.unsubscribe();
    }
  }





  SearchQuoteslist() {

    this.isSearched = true;
    if (this.isFilterFlag) {
      let filterName = this.advanceFilterForm.get('filterName').value;
      let filterDetails = this.advanceFilterForm.get('filterDetails').value;
      this.isFilterNameValid = (filterName != "" && filterName != null) ? true : false;
      this.isFilterDescValid = (filterDetails != "" && filterDetails != null) ? true : false;
      let reqObject = this.advanceFilterForm.value;
      if (this.isFilterNameValid && this.isFilterDescValid) {
        this.saveAdvanceFilterOptions();
        this.filterSearch.emit(reqObject);
      }
    }
    else {
      this.isFilterNameValid = true;
      this.isFilterDescValid = true;
      let reqObject = this.advanceFilterForm.value;
      this.filterSearch.emit(reqObject);
      // this.saveAdvanceFilterOptions();
    }
  }




  checkFilterName(value) {
    this.isFilterFlag = value;
  }
  saveAdvanceFilterOptions() {
    if (this.isFilterFlag) {
      let reqObj: ISaveAdvanceFilterReq = {
        AdvancedFilterId: this.advancedFilterId,
        FilterName: this.advanceFilterForm.controls['filterName'].value,
        FilterParticulars: this.advanceFilterForm.controls['filterDetails'].value,
        IsDefault: this.isDefaultChecked,
        Parameters: btoa(JSON.stringify(this.advanceFilterForm.value))
      }
      this.saveFilterOption(reqObj);
    }
  }









  checkAlfredFlag(id, checked) {
    if (checked) {
      this.alfredFlagListChecked.push(id);
    } else {
      this.alfredFlagListChecked.splice(this.alfredFlagListChecked.indexOf(id), 1);
    }
    this.advanceFilterForm.controls['AlfredFlags'].setValue(this.alfredFlagListChecked);
  }





  resetSelectControls() {
    this.advanceFilterForm.controls['Ref'].setValue("");
    this.advanceFilterForm.controls['InsuredName'].setValue("");
    this.advanceFilterForm.controls['LOB'].setValue("");
    this.advanceFilterForm.controls['AgentName'].setValue("");
    this.advanceFilterForm.controls['TransactionType'].setValue("");
    this.advanceFilterForm.controls['BusinessType'].setValue("");
    this.advanceFilterForm.controls['Status'].setValue("");
    this.advanceFilterForm.controls['PremiumStart'].setValue("");
    this.advanceFilterForm.controls['PremiumEnd'].setValue("");
    this.advanceFilterForm.controls['AlfredFlags'].setValue("");
    this.advanceFilterForm.controls['filterName'].setValue("");
    this.advanceFilterForm.controls['Agency'].setValue("");
    this.advanceFilterForm.controls['Agent'].setValue("");
    this.advanceFilterForm.controls['State'].setValue("");
    this.advanceFilterForm.controls['ProcessingType'].setValue("");
    this.advanceFilterForm.controls['Period'].setValue("");
    this.advanceFilterForm.controls['Carrier'].setValue(0);
    this.advanceFilterForm.controls['filterDetails'].setValue("");
    this.advanceFilterForm.controls['EffectiveFromDate'].setValue("");
    this.advanceFilterForm.controls['EffectiveToDate'].setValue("");
    this.advanceFilterForm.controls['ExpirationFromDate'].setValue("");
    this.advanceFilterForm.controls['ExpirationToDate'].setValue("");
    this.SavedAdvanceFilterParameterID = "";
    this.alfredFlagListChecked = [];
    this.DefaultChecked(false);
  }

  DefaultChecked(value) {
    this.isDefaultChecked = value;
  }



  // getMGAPrograms() {
  //   this._programService.MGAPrograms(this._userId, 1)
  //     .subscribe(programs => {
  //       this.programData = programs.data.mgaProgramList;
  //       /* if (programs && programs.data && programs.data.programLob) {
  //         this.programData = programs.data.programLob.map(program => {
  //           return {
  //             state: program.state,
  //             lob: program.lob,
  //             lobName: program.lobName
  //           }
  //         });
  //       } */
  //     })
  // }

  setViewPolicyData(data: any) {

    let policyParams: any = {
      "QuoteId": data.quoteId,
      "UserId": this._userId,
      "AgentId": this.agentId
    }


    this.router.navigate(['agenciiq/workbook/quickquote']);

  }

  changeFilter(advancedFilterId) {

    if (advancedFilterId != 0) {
      this.checkFilterName(true);
      this.advancedFilterId = advancedFilterId;
      let SelecteFilter = this.SavedAdvanceFilterList.filter(item => item['advancedFilterId'] == advancedFilterId);

      if (SelecteFilter) {
        let parameters: any = JSON.parse(atob(SelecteFilter[0].parameters));
        if (parameters) {
          this.setFormValue(parameters);
        }
      }
    } else {
      this.advanceFilterForm.reset();
      this.DefaultChecked(false);
      this.checkFilterName(false);
      this.resetSelectControls();

      console.log(this.advanceFilterForm);
    }
  }



  setFormValue(parameters) {

    this.advanceFilterForm.controls['Ref'].setValue(parameters.Ref);
    this.advanceFilterForm.controls['InsuredName'].setValue(parameters.InsuredName);
    if (parameters.EffectiveFromDate != "" && parameters.EffectiveFromDate != null) { this.advanceFilterForm.controls['EffectiveFromDate'].setValue(new Date(parameters.EffectiveFromDate)); }

    if (parameters.EffectiveToDate != "" && parameters.EffectiveToDate != null) { this.advanceFilterForm.controls['EffectiveToDate'].setValue(new Date(parameters.EffectiveToDate)); }

    if (parameters.ExpirationFromDate != "" && parameters.ExpirationFromDate != null) { this.advanceFilterForm.controls['ExpirationFromDate'].setValue(new Date(parameters.ExpirationFromDate)); }

    if (parameters.ExpirationToDate != "" && parameters.ExpirationToDate != null) { this.advanceFilterForm.controls['ExpirationToDate'].setValue(new Date(parameters.ExpirationToDate)); }

    this.advanceFilterForm.controls['PremiumStart'].setValue(parameters.PremiumStart);
    this.advanceFilterForm.controls['PremiumEnd'].setValue(parameters.PremiumEnd);
    this.advanceFilterForm.controls['filterName'].setValue(parameters.filterName);

    this.advanceFilterForm.controls['ProcessingType'].setValue(parameters.ProcessingType);
    this.advanceFilterForm.controls['Agency'].setValue(parameters.Agency);
    this.advanceFilterForm.controls['AgentName'].setValue(parameters.AgentName);
    this.advanceFilterForm.controls['filterDetails'].setValue(parameters.filterDetails);

    if (parameters.Status != null && parameters.Status != "" && parameters.Status != "0")
      this.advanceFilterForm.controls['Status'].setValue(parameters.Status);
    else
      this.advanceFilterForm.controls['Status'].setValue("");

    if (parameters.BusinessType != null && parameters.BusinessType != "" && parameters.BusinessType != "0")
      this.advanceFilterForm.controls['BusinessType'].setValue(parameters.BusinessType);
    else
      this.advanceFilterForm.controls['BusinessType'].setValue("");


    if (parameters.TransactionType != null && parameters.TransactionType != "" && parameters.TransactionType != "0")
      this.advanceFilterForm.controls['TransactionType'].setValue(parameters.TransactionType);
    else
      this.advanceFilterForm.controls['TransactionType'].setValue("");

    if (parameters.LOB != null && parameters.LOB != "" && parameters.LOB != "0")
      this.advanceFilterForm.controls['LOB'].setValue(parameters.LOB);
    else
      this.advanceFilterForm.controls['LOB'].setValue("");

    // if (parameters.Period != null && parameters.Period != "" && parameters.Period != "0")
    //   this.advanceFilterForm.controls['Period'].setValue(parameters.Period);
    // else
    //   this.advanceFilterForm.controls['Period'].setValue("");

    if (parameters.Carrier != null && parameters.Carrier != "" && parameters.Carrier != "0")
      this.advanceFilterForm.controls['Carrier'].setValue(parameters.Carrier);
    else
      this.advanceFilterForm.controls['Carrier'].setValue("");

    if (parameters.State != null && parameters.State != "" && parameters.State != "0")
      this.advanceFilterForm.controls['State'].setValue(parameters.State);
    else
      this.advanceFilterForm.controls['State'].setValue("");


    if (parameters.AlfredFlags.length > 0) {
      this.alfredFlagListChecked = parameters.AlfredFlags;
      this.advanceFilterForm.controls['AlfredFlags'].setValue(this.alfredFlagListChecked);
    }
    this.SavedAdvanceFilterParameterID = this.advancedFilterId;
  }
}
