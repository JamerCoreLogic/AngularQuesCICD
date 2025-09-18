import { Component, OnInit, ViewChild, OnDestroy, Output } from '@angular/core';
import { AQQuotesListService, IQuotesFilterReq, AQSaveAdvanceFilterService, AQFormsService, LOBService, IQuoteViewReq } from '@agenciiq/quotes';
import { AQAgentInfo, AQUserInfo, AQAgencyInfo, AQRoleInfo } from '@agenciiq/login';
import { AQParameterService, AQTransactionType, AQStage, AQAlfredFlag, AQPeriod, AQProcessingType, AQCarrier, AQStates } from '@agenciiq/aqadmin';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQRoutesNavSettings } from 'src/app/global-settings/route-nav-setting';
import { Router, NavigationExtras } from '@angular/router';
import { AQSession } from 'src/app/global-settings/session-storage';
import { SessionIdList } from 'src/app/global-settings/session-id-constraint';
import { PeriodSettings } from 'src/app/global-settings/periodSetting';
import { AdvanceFilterType } from '../../../../global-settings/advance-filter-type';
import { Subscription, Observable, Subject } from 'rxjs';
import { QuotesDialogComponent } from 'src/app/shared/components/quotes-dialog/quotes-dialog.component';
import { DialogService } from 'src/app/shared/utility/aq-dialog/dialog.service';
import { ProgramService } from '@agenciiq/aqadmin';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ISaveAdvanceFilterReq } from './ISaveAdvanceFilterReq';
import { PopupService } from '../../../../shared/utility/Popup/popup.service';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { Roles } from 'src/app/global-settings/roles';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { SetDateService } from 'src/app/shared/services/setDate/set-date.service';
import { TransactionCodeMaster } from 'src/app/global-settings/transactionCodeList';


@Component({
  selector: 'app-quotelist',
  templateUrl: './quotelist.component.html',
  styleUrls: ['./quotelist.component.css'],
  standalone: false
})
export class QuotelistComponent implements OnInit, OnDestroy {

  newQuotes: string;
  dataSource;
  QuotesColumnList = ['ref', 'insuredName', 'lob', 'agentName', 'effectiveDate', 'endorsementDate', 'yearsInsured'];
  transactionTypeList: any;
  stageList: any;
  alfredList: any;
  NoRecordsMessage: any;
  SavedAdvanceFilterList: any[] = [];
  sortedColumnName: any;
  flag: boolean = true;
  programData: any = [];
  HideAdvFilterOption: boolean = false;
  periodList: any;
  carrierList: any;
  processingTypeList: any;
  stateList: any;
  FilterOpen: boolean = false;
  advanceFilterForm: FormGroup;
  alfredFlagListChecked: any[] = [];
  private _userId = 0;
  private _agencyId = 0;
  private _agentId = 0;
  CilentID: number = 0;
  lobList: any;

  private GetAdvanceFilterParameterSubscription: Subscription;
  private SaveAdvanceFilterSubscription: Subscription;
  private QuotesListSubscription: Subscription;
  private periodSubscription: Subscription;
  private getParameterSubscription: Subscription;
  private QuotesFilterSubscription: Subscription;
  private periodSubsubcription: Subscription;


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
  bsStartValue: any;
  bsEndValue: any;
  processTypeList: any[] = [];
  isFilterNameValid: boolean = true;
  isFilterDescValid: boolean = true;
  isSearched: boolean = false;
  IsQuotevisible: boolean = true;
  /* After Optimisation */
  PageNumber: number = 1;
  PageSize: string = "10";
  SearchText: any = "";
  SortingColumn: string = "ref";
  SortingOrder: string = "DESC";
  Subscription$: Subscription;
  totalItem: number = 0;
  quoteId: number;
  enabledForkJoin: boolean = true;
  results$: Observable<any>;
  subject = new Subject();
  workboardStatus: any;
  statusType: any;
  effectiveFromDate: any;
  effectiveToDate: any;
  periodType: string;
  advancedFilterRequest: IQuoteViewReq = null;
  SearchType: string = "";

  constructor(
    private _quotesService: AQQuotesListService,
    private _agentInfo: AQAgentInfo,
    private _userInfo: AQUserInfo,
    private parameter: AQParameterService,
    private transType: AQTransactionType,
    private stageType: AQStage,
    private alferd: AQAlfredFlag,
    private loaderService: LoaderService,
    private agencyInfo: AQAgencyInfo,
    private router: Router,
    private session: AQSession,
    private period: PeriodSettings,
    private saveFilterService: AQSaveAdvanceFilterService,
    private _dialogService: DialogService,
    private _aqPeriod: AQPeriod,
    private _aqProcessingType: AQProcessingType,
    private _aqCarrier: AQCarrier,
    private _aqSate: AQStates,
    private _programService: ProgramService,
    private _aqformsService: AQFormsService,
    private seesion: AQSession,
    private lobService: LOBService,
    private fb: FormBuilder,
    private trimValueService: TrimValueService,
    private _popupService: PopupService,
    private _userRoles: AQRoleInfo,
    private _checkRoleService: CheckRoleService,
    private setDateService: SetDateService,
    public transactionCodeMaster: TransactionCodeMaster,
    private _period: PeriodSettings,
  ) {
    this.newQuotes = AQRoutesNavSettings.Agent.addQuotes;
    this._userId = this._userInfo.UserId() ? this._userInfo.UserId() : 0;
    this._agencyId = this.agencyInfo.Agency() && this.agencyInfo.Agency().agencyId ? this.agencyInfo.Agency().agencyId : 0;
    this._agentId = this._agentInfo.Agent() && this._agentInfo.Agent().agentId ? this._agentInfo.Agent().agentId : 0;
    if (this._checkRoleService.isRoleCodeAvailable(Roles.Underwriter.roleCode, this._userRoles.Roles())
      || this._checkRoleService.isRoleCodeAvailable(Roles.UnderwriterAssistant.roleCode, this._userRoles.Roles())
      || this._checkRoleService.isRoleCodeAvailable(Roles.UWManager.roleCode, this._userRoles.Roles())
      || this._checkRoleService.isRoleCodeAvailable(Roles.UWSupervisior.roleCode, this._userRoles.Roles())) {
      this.IsQuotevisible = false;
    }
    this.createAdvanceFilterForm();
    let periodValue = localStorage.getItem('period');
    // if(periodValue) this._period.SetPeriod = periodValue;
  }

  ngOnInit() {
    this.flag = false;
    this.workboardStatus = null;
    this.getPeriod();
    this.getParameterList();
    this.getMGAPrograms();
    this.getLobList();
    this.DebounceApiCall();
  }

  DebounceApiCall() {
    this.subject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(value => {
      this.SearchText = value;
      this.quoteViewList();
    })
  }

  seprateDate(date: string) {
    let dateString = date;
    let dateString1 = dateString.split('T');
    return dateString1[0];
  }

  quoteViewList() {
    // if (this.Subscription$) {
    //   this.Subscription$.unsubscribe();
    // }
    let workboardStatus: any;
    if (this.workboardStatus == null || this.workboardStatus == undefined) workboardStatus = ""
    else workboardStatus = this.workboardStatus + ' ' + this.statusType;


    let request: IQuoteViewReq = null;
    if (this.advancedFilterRequest != null) {
      request = JSON.parse(JSON.stringify(this.advancedFilterRequest));
      // let dateString1 = [];
      // let dateString = request.PolicyStartDateFrom;
      // dateString1 = dateString.split('T');
      // request.PolicyStartDateFrom = dateString1[0];

      request.PageNumber = 1;
      request.PageSize = this.PageSize;
      request.SearchText = this.SearchText;
      request.SortingColumn = this.SortingColumn;
      request.SortingOrder = this.SortingOrder;
      request.SearchType = this.SearchType;
      request.CarrierID = request.CarrierID ? request.CarrierID : 0;
      request.PolicyStartDateFrom = this.seprateDate(request.PolicyStartDateFrom);
      request.PolicyStartDateTo = this.seprateDate(request.PolicyStartDateTo);
      request.PolicyExpiryDateFrom = this.seprateDate(request.PolicyExpiryDateFrom);
      request.PolicyExpiryDateTo = this.seprateDate(request.PolicyExpiryDateTo);
    } else {
      request = {
        AgencyId: this._agencyId,
        AgentId: this._agentId,
        PageNumber: this.PageNumber,
        PageSize: this.PageSize,
        SearchText: this.SearchText,
        SortingColumn: this.SortingColumn,
        SortingOrder: this.SortingOrder,
        UserId: this._userId,
        QuoteId: this.quoteId,
        EffectiveFromDate: this.effectiveFromDate,
        EffectiveToDate: this.effectiveToDate,
        Period: this.periodType,
        WorkboardStatus: workboardStatus
      }

    }

    //this.loaderService.show();
    this._quotesService.QuotesViewList(request, this.enabledForkJoin).subscribe(resp => {
      this.loaderService.hide();
      this.HideAdvFilterOption = true;
      if (resp[0]?.data?.quote) {
        setTimeout(() => {
          this.dataSource = resp[0].data.quote;
        }, 100);
        if (this.enabledForkJoin && resp[1]) {
          this.totalItem = resp[1].totalQuote;
        }
        this.NoRecordsMessage = '';
      } else {
        this.dataSource = [];
        this.NoRecordsMessage = 'No records found!';
      }
    }, (err) => {
      this.loaderService.hide();
      console.log("err", err);
    }, () => {
      this.loaderService.hide();
    });

  }

  ChangePageSize(pageSize: any) {
    this.PageSize = pageSize;
    this.enabledForkJoin = false;
    this.SearchType = "";
    this.PageNumber = 1;
    this.quoteViewList();
  }

  NewPage(pageNumber: any) {
    this.PageNumber = pageNumber;
    this.SearchType = "";
    this.enabledForkJoin = false;
    this.quoteViewList();
  }

  SearchQuote(searchText: any) {
    this.SearchType = "";
    this.subject.next(searchText);
    this.PageSize = "10";
    this.SearchText = searchText;
    this.enabledForkJoin = true;
    this.PageNumber = 1;
    this.quoteId = 0;

  }


  sortQuotes(columnName: string) {
    this.SearchType = "";
    this.SortingColumn = columnName;
    this.SortingOrder == 'DESC' ? 'ASC' : 'DESC'
    this.enabledForkJoin = false;
    this.quoteViewList();
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
      State: [{ value: '', disabled: true }],
      ProcessingType: [{ value: '', disabled: true }],
      Period: [{ value: '', disabled: true }],
      Carrier: [{ value: '', disabled: true }],
      filterDetails: [''],
      EffectiveFromDate: [''],
      EffectiveToDate: [''],
      ExpirationFromDate: [''],
      ExpirationToDate: ['']
    })
  }

  getAdvanceFilter(value) {
    this.FilterOpen = value;
    this.HideAdvFilterOption = false;
  }

  getParameterList() {
    this.saveFilterService.GetAdvanceFilterParameter(AdvanceFilterType.quotesFilter, this._userId.toString(), this._agentId)
      .subscribe(parameters => {
        if (parameters?.data?.advancedFilterList) {
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

  saveFilterOption(filter) {
    this.saveFilterService.SaveAdvanceFilter(AdvanceFilterType.quotesFilter, filter.FilterName, filter.FilterParticulars, filter.Parameters, filter.IsDefault, this._userId, this._agentId, filter.AdvancedFilterId)
      .subscribe(data => {
        this.getParameterList();
      })
  }


  getPeriod() {
    let quoteId = this.session.getData(SessionIdList.AlfredAlertsRefenceId);
    let workboardStatus = localStorage.getItem('workboardstatus');
    this.statusType = localStorage.getItem('statusType');
    this.workboardStatus = workboardStatus;
    this.periodSubscription = this.period.period.subscribe(period => {

      if (period) {
        if (quoteId) {
          //this.getFilterQuotesData(this._userId, this._agencyId, this._agentId, period, referenceId);
          this.quoteId = quoteId;
          this.totalItem = 1;
          this.PageSize = "1";
          this.enabledForkJoin = false;
          this.periodType = "";
          this.workboardStatus = null;
          this.effectiveFromDate = "";
          this.effectiveToDate = "";
          this.quoteViewList()
        } else if (workboardStatus) {
          this.quoteId = 0;
          this.totalItem = 1;
          this.PageSize = "10";
          this.enabledForkJoin = true;
          this.periodType = period;
          this.workboardStatus = workboardStatus;
          //this.setDateService.setDate
          this.effectiveFromDate = (this.seesion.getData("periodStartDate"));
          this.effectiveToDate = (this.seesion.getData("periodEndtDate"));
          this.quoteViewList()
          //this.getFilterQuotesData(this._userId, this._agencyId, this._agentId, period, '', '', '', '', '', '', '', '', '', '', '', '', '', workboardStatus);
        } else {
          //this.getQuoteList();
          this.quoteViewList();
        }
      }
      else {
        this.workboardStatus = null;
        this.quoteViewList();
      }
    })
  }

  ngOnDestroy() {

    //this.session.removeSession(SessionIdList.AlfredAlertsRefenceId);
    //this.session.removeSession(SessionIdList.WorkBoardStatus);

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

    if (this.periodSubsubcription) {
      this.periodSubsubcription.unsubscribe();
    }

    //this.session.removeSession(SessionIdList.WorkBoardStatus);
  }

  getQuoteList() {
    this.loaderService.show();
    this._quotesService.QuotesList(this._userId, this._agentId, this._agencyId).subscribe(data => {
      this.getParameterData();
      if (data?.data?.quote) {
        this.dataSource = data.data.quote;
        this.NoRecordsMessage = '';
        //this.sortedColumnName = { 'columnName': 'ref', isAsc: this.flag }; 
      } else {
        this.NoRecordsMessage = 'No records found!';
      }
    },
      err => {
        this.loaderService.hide();
        console.log("err", err);
      },
      () => {
        this.loaderService.hide();
      });
  }

  getParameterData() {
    this.loaderService.show();
    this.parameter.getParameter("", this._userId).subscribe(data => {
      this.loaderService.hide();
      if (data?.message == null) {
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
        this.loaderService.hide();
      },
      () => {
        this.loaderService.hide();
      })
  }

  SearchQuoteslist() {
    this.isSearched = true;
    if (this.isFilterFlag) {
      let filterName = this.advanceFilterForm.get('filterName').value;
      let filterDetails = this.advanceFilterForm.get('filterDetails').value;
      this.isFilterNameValid = (filterName != "" && filterName != null) ? true : false;
      this.isFilterDescValid = (filterDetails != "" && filterDetails != null) ? true : false;
      let reqObject = this.trimValueService.TrimObjectValue(this.advanceFilterForm.value);
      if (this.isFilterNameValid && this.isFilterDescValid) {
        this.filterQuotes(reqObject);
        this.saveAdvanceFilterOptions();
      }
    }
    else {
      this.isFilterNameValid = true;
      this.isFilterDescValid = true;
      let reqObject = this.trimValueService.TrimObjectValue(this.advanceFilterForm.value)
      this.filterQuotes(reqObject);
      this.saveAdvanceFilterOptions();
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

  filterQuotes(value: string) {
    if (value == 'Clear') {
      // this.getQuoteList();
      this.advancedFilterRequest = null;
      this.quoteViewList();
    } else {
      this.SearchType = "ADVANCED SEARCH";
      let alfreds: any[] = value['AlfredFlags'];
      this.advancedFilterRequest = {
        AgencyId: this._agencyId,
        AgentId: this._agentId,
        PageNumber: this.PageNumber,
        PageSize: this.PageSize,
        SearchText: this.SearchText,
        SortingColumn: this.SortingColumn,
        SortingOrder: this.SortingOrder,
        UserId: this._userId,
        EffectiveFromDate: this.effectiveFromDate,
        EffectiveToDate: this.effectiveToDate,
        Period: this.periodType,
        QuoteId: this.quoteId,
        WorkboardStatus: "",
        AgentName: value['AgentName'],
        AlfredFlags: alfreds.length > 0 ? alfreds.join(',') : '',
        CarrierID: value["Carrier"],
        PolicyStartDateFrom: value['EffectiveFromDate'],
        PolicyStartDateTo: value['EffectiveToDate'],
        PolicyExpiryDateFrom: value['ExpirationFromDate'],
        PolicyExpiryDateTo: value['ExpirationToDate'],
        InsuredName: value['InsuredName'],
        Lob: value['LOB'],
        PremiumEnd: value['PremiumEnd'],
        PremiumStart: value['PremiumStart'],
        ProcessingTypeId: value["ProcessingType"],
        QuoteNumber: value['Ref'],
        SearchType: 'ADVANCED SEARCH',
        State: value["State"],
        TranscationType: value['TransactionType'],
        Status: value['Status']
      }

      this.quoteViewList();
      /* 
              value['Ref'], value['InsuredName'], value['LOB'], value['AgentName'], value['EffectiveFromDate'],
               value['EffectiveToDate'],
                value['ExpirationFromDate'], value['ExpirationToDate'],
                value['TransactionType'], value['Status'], value['PremiumStart'],
                value['PremiumEnd'], value['AlfredFlags'], '', value["BusinessType"], value["State"],
                 value["Period"], value["Carrier"], value["ProcessingType"], value["Agency"]
            } */
    }
  }

  getFilterQuotesData(userid: any = "", agencyid: any = "", agentid: any = "", Period: any = "", ref: any = "", insuredName: any = "",
    lob: any = "", AgentName: any = "", EffectiveFromDate: any = "", EffectiveToDate: any = "",
    ExpirationFromDate: any = "", ExpirationToDate: any = "", TranscationType: any = "",
    Status: any = "", PremiumStart: any = "", PremiumEnd: any = "", AlfredFlags: any = "", WorkboardStatus: any = "",
    businessType: any = "", state: any = "", period: any = "", carrier: any = "", processingType: any = "", agencyName: any = "") {

    let reqObject: IQuotesFilterReq = {
      "UserId": userid,
      "AgencyId": agencyid,
      "AgentId": agentid,
      "Period": Period,
      "Ref": ref,
      "InsuredName": insuredName,
      "Lob": lob,
      "AgentName": AgentName,
      "EffectiveFromDate": EffectiveFromDate,
      "EffectiveToDate": EffectiveToDate,
      "ExpirationFromDate": ExpirationFromDate,
      "ExpirationToDate": ExpirationToDate,
      "TranscationType": TranscationType,
      "Status": Status,
      "PremiumStart": PremiumStart,
      "PremiumEnd": PremiumEnd,
      "AlfredFlags": AlfredFlags ? AlfredFlags.join(',') : '',
      "WorkboardStatus": WorkboardStatus,
      "State": state,
      "CarrierID": carrier ? carrier : 0
    }

    this.loaderService.show();
    this.HideAdvFilterOption = true;
    this._quotesService.QuotesFilter(reqObject).subscribe(data => {
      this.loaderService.hide();
      if (data && data.data && data.data.quote) {
        this.loaderService.hide();
        this.getParameterData();
        if (data && data.success && data.message == null) {
          this.dataSource = data.data.quote;
          this.NoRecordsMessage = '';
        } else if (data == undefined) {
          this.dataSource = [];
          this.NoRecordsMessage = 'No Record Found.';
        }
      } else {
        this.dataSource = [];
        this.NoRecordsMessage = 'No Record Found.';
      }
    }, err => {
      this.loaderService.hide();
    },
      () => {
        this.loaderService.hide();
      })
  }

  filterSearch(event: string) {
    this.filterQuotes(event);
  }

  quikquotes() {
    const ref = this._dialogService.open(QuotesDialogComponent, {
      data: this.programData
    });

    ref.afterClosed.subscribe(data => {
      if (data && data.LOB && data.State && data.QuoteType) {
        this.loaderService.show();
        this._aqformsService.AQForms(this._userId, data.LOB.toString(), data.State, data.QuoteType)
          .subscribe(dataResp => {
            this.loaderService.hide();
            if (dataResp && dataResp.success) {
              this.session.removeSession('insuredReqObj');
              this.session.removeSession("insuredView");
              this.session.setData('navType', 'workbook');
              this.seesion.setData('QuoteDialogData', JSON.stringify(data));
              this.router.navigateByUrl('agenciiq/workbook/quickquote');
            }
            else {
              this._popupService.showPopup('Quote', dataResp.message);
            }
          }, (err) => {
            this.loaderService.hide();
          }, () => {
            this.loaderService.hide();
          })
      }
    })
  }

  clearAdvanceFilterForm() {
    this.session.removeSession(SessionIdList.AlfredAlertsRefenceId);
    this.isFilterFlag = false;
    this.flag = false;
    this.alfredFlagListChecked = [];
    this.HideAdvFilterOption = true;
    //this.getQuoteList();  

    //this.PageSize = "10";
    this.SearchText = "";
    this.quoteId = 0;
    this.enabledForkJoin = true;
    this.effectiveFromDate = "";
    this.effectiveToDate = "";
    this.periodType = "";
    this.workboardStatus = null;

    this.advancedFilterRequest = null;
    this.quoteViewList();
    this.resetSelectControls();
  }

  clearAllFilter() {
    this.clearAdvanceFilterForm();

  }

  checkAlfredFlag(id: any, checked: any) {
    if (checked) {
      this.alfredFlagListChecked.push(id);
    } else {
      this.alfredFlagListChecked.splice(this.alfredFlagListChecked.indexOf(id), 1);
    }
    this.advanceFilterForm.controls['AlfredFlags'].setValue(this.alfredFlagListChecked);
  }

  isChecked(id: any) {
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
    this.advanceFilterForm.controls['Carrier'].setValue("");
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

  cancelAdvanceFilterForm() {
    this.advanceFilterForm.reset();
    this.alfredFlagListChecked = [];
    this.isFilterFlag = false;
    this.HideAdvFilterOption = true;
    this.resetSelectControls();
  }

  getMGAPrograms() {
    this._programService.MGAPrograms(this._userId, 1).subscribe(programs => {
      this.programData = programs.data.mgaProgramList;
      /* if (programs && programs.data && programs.data.programLob) {
        this.programData = programs.data.programLob.map(program => {
          return {
            state: program.state,
            lob: program.lob,
            lobName: program.lobName
          }
        });
      } */
    })
  }

  getInsuredDetail(data: any, type: any) {
    let reqObj = {
      UserId: this._userId,
      InsuredId: data.insuredID,
      QuoteId: data.quoteId,
      ClientId: 0,
      type: type
    }
    this.session.removeSession('viewPolicyParams');
    this.session.setData("insuredReqObj", reqObj);
    this.session.setData("insuredView", "insuredView");
    this.router.navigate(['agenciiq/workbook/quickquote']);
  }

  setViewPolicyData(data: any) {
    let policyParams: any = {
      "QuoteId": data.quoteId,
      "UserId": this._userId,
      "AgentId": this._agentId,
      "Action": data.actionName,
      'lob': data.quoteDetails.lob,
      'referenceNumber': '',
      'aqquoteId': ''
    }

    if (data.actionName != 'COPY' && data.actionName != 'ENDORSEMENT' && data.actionName != 'RENEWAL') {
      policyParams['referenceNumber'] = data.quoteDetails.ref;
      policyParams['aqquoteId'] = data.quoteId;
    }

    this.session.removeSession("insuredView");
    this.session.removeSession("insuredReqObj");
    this.session.setData("navType", "workbook");
    this.session.setData("viewPolicyParams", policyParams);

    if ((this._checkRoleService.isRoleCodeAvailable(Roles.Underwriter.roleCode, this._userRoles.Roles())
      || this._checkRoleService.isRoleCodeAvailable(Roles.UnderwriterAssistant.roleCode, this._userRoles.Roles())
      || this._checkRoleService.isRoleCodeAvailable(Roles.UWManager.roleCode, this._userRoles.Roles())
      || this._checkRoleService.isRoleCodeAvailable(Roles.UWSupervisior.roleCode, this._userRoles.Roles()))
      && data.actionName != 'Documents') {
      this.router.navigate(['agenciiq/workbook/quoteView']);

    } else {
      this.router.navigate(['agenciiq/workbook/quickquote']);
    }

  }

  changeFilter(advancedFilterId: number) {
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
    }
  }

  getLobList() {
    this.lobService.GetLOBList(this._userId)
      .subscribe(response => {
        this.lobList = response.data.lobsList;
      })
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

    if (parameters.Period != null && parameters.Period != "" && parameters.Period != "0")
      this.advanceFilterForm.controls['Period'].setValue(parameters.Period);
    else
      this.advanceFilterForm.controls['Period'].setValue("");

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

  trackByAlert(index: number, alert: any): string {
    return alert?.id || index;
  }
}