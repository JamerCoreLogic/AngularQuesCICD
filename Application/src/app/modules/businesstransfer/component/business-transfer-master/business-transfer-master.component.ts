import { Component, OnInit, ViewChild, OnDestroy, Input, ElementRef, ContentChild, TemplateRef, ViewChildren, QueryList, Output, EventEmitter, ContentChildren } from '@angular/core';
import { AQQuotesListService, IQuotesFilterReq, AQSaveAdvanceFilterService, LOBService, IQuoteViewReq } from '@agenciiq/quotes';
import { AQAgentInfo, AQUserInfo, AQAgencyInfo, AQRoleInfo } from '@agenciiq/login';
import { AQParameterService, AQTransactionType, AQStage, AQAlfredFlag, AQPeriod, AQProcessingType, AQCarrier, AQStates } from '@agenciiq/aqadmin';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { Router } from '@angular/router';
import { AQSession } from 'src/app/global-settings/session-storage';
import { SessionIdList } from 'src/app/global-settings/session-id-constraint';
import { PeriodSettings } from 'src/app/global-settings/periodSetting';
import { AdvanceFilterType } from '../../../../global-settings/advance-filter-type';
import { AQAgentListService } from '@agenciiq/aqagent';
import { SortingService } from 'src/app/shared/services/sorting-service/sorting.service';
import { Subscription, Observable, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BusinessTransferService } from '@agenciiq/aqbusinesstransfer';
import { DialogService } from 'src/app/shared/utility/aq-dialog/dialog.service';
import { BusinessTransferDialogComponent } from 'src/app/shared/components/business-transfer-dialog/business-transfer-dialog.component';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectAgents, selectBob, selectLobLoading, selectLobs, selectNoRecordsMessage, selectParameterData, selectParameterLoading, selectTotalItems } from 'store/selectors/bookTransfer.selectors';
import { loadAgents, loadBobList, loadLobList, loadParameters } from 'store/actions/bookTransfer.action';


@Component({
  selector: 'app-business-transfer-master',
  templateUrl: './business-transfer-master.component.html',
  styleUrls: ['./business-transfer-master.component.sass'],
  standalone: false
})
export class BusinessTransferMasterComponent implements OnInit, OnDestroy {


  private _userId = 0;
  private _agencyId = 0;
  private _agentId = 0;

  dataSource: any[] = [];
  QuotesColumnList = ['ref', 'insuredName', 'lob', 'agentName', 'effectiveDate', 'endorsementDate', 'yearsInsured'];
  subColumnList = ['description']
  transactionTypeList: any;
  stageList: any;
  alfredList: any;
  NoRecordsMessage: any;
  SavedAdvanceFilterList: any;
  sortedColumnName: any;
  flag: boolean = true;
  FilterOpen: boolean = false;
  pagination = true;
  AlfredFlagList: any[] = [];
  alfredFlagListChecked: any[] = [];
  processTypeList: any[] = [];
  GetAdvanceFilterParameterSubscription: Subscription;
  SaveAdvanceFilterSubscription: Subscription;
  QuotesListSubscription: Subscription;
  periodSubscription: Subscription;
  getParameterSubscription: Subscription;
  QuotesFilterSubscription: Subscription;
  AgentListSubscription: Subscription;
  isDefaultFilterMarkReq: boolean = false;
  isSavedFiltersReq: boolean = false;
  isSaveSearchCriteriaReq: boolean = false;
  isCancelButtonReq: boolean = false;
  isCheckboxEnable: boolean = true;
  agentList: any[] = [];
  advanceFilterForm: FormGroup;
  isHeaderChkSelected: boolean = false;
  checkedItems: any[] = [];
  transferFrmAgentId: string;
  isFilterNameValid: boolean = true;
  isFilterDescValid: boolean = true;
  isSearched: boolean = false;
  HideAdvFilterOption: boolean = false;
  selectHeaderChk: boolean = false;
  transferToAgentId: number;
  finalQuotationIds: string;
  transferFrmAgentName: string;
  transferToAgentName: string;
  LOBList: any[] = [];
  BusinessTypeList: any[] = [];
  IsCancelButtonReq: boolean = false;
  isHeaderChecked: boolean = false;

  @Output('OutputAdvanceFilter') advanceFilterEmit = new EventEmitter();
  @Output('SaveAdvanceFilter') SaveFilterOptions = new EventEmitter();
  advancedFilterRequest: IQuoteViewReq = null;
  periodList: any;
  carrierList: any;
  processingTypeList: any;
  stateList: any;
  isTransferred: boolean = false;
  transferMessage: string;
  SearchType = "";
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


  constructor(
    private agent: AQAgentListService,
    public _role: AQRoleInfo,
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
    private _sortingService: SortingService,
    private fb: FormBuilder,
    private _businessTranferService: BusinessTransferService,
    private dialogService: DialogService,
    private _router: Router,
    private _aqPeriod: AQPeriod,
    private _aqProcessingType: AQProcessingType,
    private _aqCarrier: AQCarrier,
    private _aqSate: AQStates,
    private lobService: LOBService,
    private trimValueService: TrimValueService,
    private store: Store,
  ) {
    this._userId = this._userInfo.UserId() ? this._userInfo.UserId() : 0;
    this._agencyId = this.agencyInfo.Agency() && this.agencyInfo.Agency().agencyId ? this.agencyInfo.Agency().agencyId : 0;
    this._agentId = this._agentInfo.Agent() && this._agentInfo.Agent().agentId ? this._agentInfo.Agent().agentId : 0;
    this.createForm();
  }

  createForm() {
    this.advanceFilterForm = this.fb.group({
      Agent: [''],
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
      State: [{ value: '', disabled: false }],
      Period: [{ value: '', disabled: true }],
      Agency: [{ value: '', disabled: false }],
      Carrier: [{ value: 0, disabled: false }],
      ProcessingType: [{ value: '', disabled: true }],
      EffectiveFromDate: [''],
      EffectiveToDate: [''],
      ExpirationFromDate: [''],
      ExpirationToDate: [''],
    })
  }

  ngOnInit() {
    this.getAgents();
    this.getParameterData();
    //this.getBusinessData();
    this.quoteViewList();
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

  filterSearch(event: string) {
    this.filterQuotes(event);
  }

  // quoteViewList() {
  //   if (this.Subscription$) {
  //     this.Subscription$.unsubscribe();
  //   }
  //   let request: IQuoteViewReq = null;
  //   if (this.advancedFilterRequest != null) {
  //     request = JSON.parse(JSON.stringify(this.advancedFilterRequest));
  //     request.PageNumber = this.PageNumber;
  //     request.PageSize = this.PageSize;
  //     request.SearchText = this.SearchText;
  //     request.SortingColumn = this.SortingColumn;
  //     request.SortingOrder = this.SortingOrder;
  //     request.SearchType = this.SearchType
  //   } else {
  //     request = {
  //       AgencyId: this._agencyId,
  //       AgentId: this._agentId,
  //       PageNumber: this.PageNumber,
  //       PageSize: this.PageSize,
  //       SearchText: this.SearchText,
  //       SortingColumn: this.SortingColumn,
  //       SortingOrder: this.SortingOrder,
  //       UserId: this._userId,
  //       QuoteId: this.quoteId
  //     }
  //   }
  //   this.loaderService.show();
  //   this._quotesService.QuotesViewList(request, this.enabledForkJoin).subscribe(resp => {
  //     this.loaderService.hide();
  //     this.HideAdvFilterOption = true;
  //     if (resp[0].data.quote) {
  //       //this.dataSource = resp[0].data.quote;
  //       setTimeout(() => {
  //         this.dataSource = resp[0].data.quote;
  //       }, 100);
  //       if (this.enabledForkJoin && resp[1]) {
  //         this.totalItem = resp[1].totalQuote;
  //       }
  //       this.NoRecordsMessage = '';
  //     } else {
  //       this.dataSource = [];
  //       this.NoRecordsMessage = 'No records found!';
  //     }
  //   });

  // }

  quoteViewList() {
    const request = this.advancedFilterRequest
      ? {
        ...this.advancedFilterRequest,
        PageNumber: this.PageNumber,
        PageSize: this.PageSize,
        SearchText: this.SearchText,
        SortingColumn: this.SortingColumn,
        SortingOrder: this.SortingOrder,
        SearchType: this.SearchType
      }
      : {
        AgencyId: this._agencyId,
        AgentId: this._agentId,
        PageNumber: this.PageNumber,
        PageSize: this.PageSize,
        SearchText: this.SearchText,
        SortingColumn: this.SortingColumn,
        SortingOrder: this.SortingOrder,
        UserId: this._userId,
        QuoteId: this.quoteId
      };

    this.store.select(selectBob).pipe(take(1)).subscribe(data => {
      if (!data || data.length === 0) {
        // first time → call API
        this.store.dispatch(loadBobList({ request, enabledForkJoin: this.enabledForkJoin }));
      }
    });

    // always subscribe to selectors (reactive binding)
    this.store.select(selectBob).subscribe(data => {
      if (data && data.length > 0) {
        this.HideAdvFilterOption = true;
        setTimeout(() => {
          this.dataSource = data;
        }, 100);

      }
    });

    this.store.select(selectTotalItems).subscribe(total => {
      this.totalItem = total;
      this.loaderService.hide(); // ✅ hide loader when data actually comes
    });

    this.store.select(selectNoRecordsMessage).subscribe(msg => {
      this.NoRecordsMessage = msg;
    });
  }

  ChangePageSize(pageSize: string) {
    this.PageSize = pageSize;
    this.enabledForkJoin = false;
    this.SearchType = "";
    this.PageNumber = 1;
    //this.quoteViewList();
    this.sizeMethod();
  }

  NewPage(pageNumber: any) {
    this.SearchType = "";
    this.PageNumber = pageNumber;
    this.enabledForkJoin = false;
    this.sizeMethod();
    // this.quoteViewList();
    // const request = this.advancedFilterRequest
    //   ? {
    //     ...this.advancedFilterRequest,
    //     PageNumber: this.PageNumber,
    //     PageSize: this.PageSize,
    //     SearchText: this.SearchText,
    //     SortingColumn: this.SortingColumn,
    //     SortingOrder: this.SortingOrder,
    //     SearchType: this.SearchType
    //   }
    //   : {
    //     AgencyId: this._agencyId,
    //     AgentId: this._agentId,
    //     PageNumber: this.PageNumber,
    //     PageSize: this.PageSize,
    //     SearchText: this.SearchText,
    //     SortingColumn: this.SortingColumn,
    //     SortingOrder: this.SortingOrder,
    //     UserId: this._userId,
    //     QuoteId: this.quoteId
    //   };
    // this.store.dispatch(loadBobList({ request, enabledForkJoin: this.enabledForkJoin }));
    // this.store.select(selectBob).subscribe(data => {
    //   this.HideAdvFilterOption = true;

    //   this.dataSource = data;

    //   this.loaderService.hide();
    // });

    // this.store.select(selectTotalItems).subscribe(total => {
    //   this.totalItem = total;
    // });

    // this.store.select(selectNoRecordsMessage).subscribe(msg => {
    //   this.NoRecordsMessage = msg;
    // });   


    // }
  }

  sizeMethod() {
    if (this.Subscription$) {
      this.Subscription$.unsubscribe();
    }
    let request: IQuoteViewReq = null;
    if (this.advancedFilterRequest != null) {
      request = JSON.parse(JSON.stringify(this.advancedFilterRequest));
      request.PageNumber = this.PageNumber;
      request.PageSize = this.PageSize;
      request.SearchText = this.SearchText;
      request.SortingColumn = this.SortingColumn;
      request.SortingOrder = this.SortingOrder;
      request.SearchType = this.SearchType
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
        QuoteId: this.quoteId
      }
    }
    this.loaderService.show();
    this._quotesService.QuotesViewList(request, this.enabledForkJoin).subscribe(resp => {
      this.loaderService.hide();
      this.HideAdvFilterOption = true;
      if (resp[0].data.quote) {
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
    });
  }

  SearchQuote(searchText: any) {
    this.SearchType = "";
    this.subject.next(searchText);
    this.SearchText = searchText;
    this.enabledForkJoin = true;
    this.PageNumber = 1;
  }


  sortQuotes(columnName: string) {
    this.SearchType = "";
    this.SortingColumn = columnName;
    this.SortingOrder = this.SortingOrder === 'DESC' ? 'ASC' : 'DESC';
    this.enabledForkJoin = false;
    // this.quoteViewList();
    this.sizeMethod();
  }

  getParameterList() {
    this.saveFilterService.GetAdvanceFilterParameter(AdvanceFilterType.quotesFilter, this._userId.toString(), this._agentId)
      .subscribe(parameters => {
        if (parameters?.data?.advancedFilterList) {
          this.SavedAdvanceFilterList = parameters.data.advancedFilterList.filter(item => item.filterName !== null);
        }
      })
  }

  getBusinessData() {
    let referenceId = this.session.getData(SessionIdList.AlfredAlertsRefenceId);
    let workboardStatus = this.session.getData(SessionIdList.WorkBoardStatus);
    this.period?.period?.subscribe(period => {
      if (period) {
        if (referenceId) {
          this.getFilterQuotesData(this._userId, this._agencyId, this._agentId, period, referenceId);
        } else if (workboardStatus) {
          this.getFilterQuotesData(this._userId, this._agencyId, this._agentId, period, '', '', '', '', '', '', '', '', '', '', '', workboardStatus);
        } else {
          // this.getQuoteList();
          //this.quoteViewList();
          this.sizeMethod();
        }
      }
    })
  }

  ngOnDestroy() {
    this.session.removeSession(SessionIdList.AlfredAlertsRefenceId);
    this.session.removeSession(SessionIdList.WorkBoardStatus);

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


  getQuoteList() {
    this.loaderService.show();
    this._quotesService.QuotesList(this._userId, this._agentId, this._agencyId).subscribe(data => {
      this.loaderService.hide();
      if (data?.data?.quote) {
        this.dataSource = data.data.quote;

        this.NoRecordsMessage = "";
        this.dataSource.forEach((element, index) => {
          this.checkedItems.push({ 'quoteId': element.quoteId, 'checked': false });
        });

        // this.sortedColumnName = { 'columnName': 'ref', isAsc: this.flag };
      } else {
        this.NoRecordsMessage = 'No records found!';
      }
    },
      () => {

        this.loaderService.hide();
      });
  }


  // getParameterData() {
  //   this.parameter.getParameter("", this._userId).subscribe(data => {
  //     if (data && data.success && data.message == null) {
  //       this.transactionTypeList = this.transType.TransactionTypeList();
  //       this.alfredList = this.alferd.AlfredFlagList();
  //       this.stageList = this.stageType.StageList();
  //       this.periodList = this._aqPeriod.PeriodList();
  //       this.processingTypeList = this._aqProcessingType.ProcessingTypeList();
  //       this.carrierList = this._aqCarrier.CarrierList();
  //       this.stateList = this._aqSate.StateList();
  //     }
  //   },
  //     err => {
  //       this.loaderService.hide();
  //     })
  // }

  getParameterData() {
    this.store.select(selectParameterData).pipe(take(1)).subscribe(data => {
      if (!data || data.length === 0) {
        // first time → call API
        this.store.dispatch(loadParameters({ userId: this._userId }));
      }
    });

    // always subscribe to selectors (reactive binding)
    this.store.select(selectParameterData).subscribe(data => {
      if (data && data.message == null) {
        this.transactionTypeList = this.transType.TransactionTypeList();
        this.alfredList = this.alferd.AlfredFlagList();
        this.stageList = this.stageType.StageList();
        this.periodList = this._aqPeriod.PeriodList();
        this.processingTypeList = this._aqProcessingType.ProcessingTypeList();
        this.carrierList = this._aqCarrier.CarrierList();
        this.stateList = this._aqSate.StateList();
      }
    });

    this.store.select(selectParameterLoading).subscribe(isLoading => {
      if (isLoading) {
        this.loaderService.show();
      } else {
        this.loaderService.hide();
      }
    });
  }


  filterQuotes(value: string) {
    if (value == 'Clear') {
      //this.getQuoteList();
      this.advancedFilterRequest = null;
      // this.quoteViewList();
      this.sizeMethod();
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
        EffectiveFromDate: null,
        EffectiveToDate: null,
        Period: '',
        QuoteId: this.quoteId,
        WorkboardStatus: '',
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
      //this.quoteViewList();
      this.sizeMethod();
    }
  }

  getFilterQuotesData(userid: any = "", agencyid: any = "", agentid: any = "", Period: any = "", ref: any = "", insuredName: any = "",
    lob: any = "", AgentName: any = "", EffectiveFromDate: any = "", EffectiveToDate: any = "",
    ExpirationFromDate: any = "", ExpirationToDate: any = "",
    TranscationType: any = "",
    Status: any = "", PremiumStart: any = "", PremiumEnd: any = "", AlfredFlags: any = "", WorkboardStatus: any = "", state: any = "", Carrier: any = "") {

    let reqObject: IQuotesFilterReq = {
      "UserId": userid,
      "AgentId": agentid,
      "AgencyId": agencyid,
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
      "CarrierID": Carrier ? Carrier : 0
    }

    this.loaderService.show();
    this.HideAdvFilterOption = true;
    this._quotesService.QuotesFilter(reqObject).subscribe(data => {
      this.loaderService.hide();

      if (data && data.success && data.message == null) {
        this.dataSource = data.data.quote;
        this.NoRecordsMessage = '';

      } else if (data == undefined) {
        this.dataSource = [];
        this.NoRecordsMessage = 'No Record Found!';
      }
    }, err => {
      this.loaderService.hide();
      console.log("err", err);
    },
      () => {
        this.loaderService.hide();
      })
  }

  getAdvanceFilter(value: boolean) {
    this.FilterOpen = value;
    this.HideAdvFilterOption = false;
  }
  getDefaultFilterMarkDisplay(): string {
    if (!this.isDefaultFilterMarkReq) {
      return "none";
    }

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
    if (this.alfredFlagListChecked.indexOf(id) > -1) {
      return true;
    } else {
      return false;
    }
  }

  selectAllBusinessTransfer(event: any) {
    this.checkedItems = [];
    this.isHeaderChkSelected = event.target.checked;
    this.dataSource.forEach((element, index) => {
      this.checkedItems.push({ 'quoteId': element.quoteId, 'checked': this.isHeaderChkSelected });
    });
  }

  // getAgents() {
  //   this._businessTranferService.GetAgents(this._userId, this._agentId).subscribe(resp => {
  //     let agents: any[] = resp.data.agentsList;
  //     let filteredAgentList = agents.map(agent => {
  //       return {
  //         agentId: agent.agentId,
  //         agentName: agent.firstName + " " + agent.middleName + " " + agent.lastName
  //       }
  //     });
  //     this.agentList = this._sortingService.SortObjectArray('agentName', 'ASC', filteredAgentList);
  //   }, (err) => {
  //     this.loaderService.hide();
  //   })
  // }

  getAgents() {
    this.store.select(selectAgents).pipe(take(1)).subscribe((data: any) => {
      if (!data || !data.success) {
        // first time → call API
        this.store.dispatch(loadAgents({ userId: this._userId, agentId: this._agentId }));
      }
    });

    // always subscribe to selectors (reactive binding)   
    this.store.select(selectAgents).subscribe((data: any) => {
      if (data && data.success) {
        let filteredAgentList = data.data.agentsList.map(agent => ({
          agentId: agent.agentId,
          agentName: `${agent.firstName} ${agent.middleName || ''} ${agent.lastName}`.trim()
        }));

        this.agentList = this._sortingService.SortObjectArray(
          'agentName',
          'ASC',
          filteredAgentList
        );
      }
    })


    // this.store.dispatch(loadAgents({ userId: this._userId, agentId: this._agentId }));

    // this.store.select(selectAgents).subscribe(agents => {
    //   this.agentList = agents;
    // });

    // this.store.select(selectAgentsLoading).subscribe(isLoading => {
    //   if (isLoading) {
    //     this.loaderService.show();
    //   } else {
    //     this.loaderService.hide();
    //   }
    // });
  }



  resetSelectControls() {
    this.advanceFilterForm.controls['Period'].setValue("");
    this.advanceFilterForm.controls['Carrier'].setValue(0);
    this.advanceFilterForm.controls['State'].setValue("");
    this.advanceFilterForm.controls['BusinessType'].setValue("");
    this.advanceFilterForm.controls['TransactionType'].setValue("");
    this.advanceFilterForm.controls['Status'].setValue("");
    this.advanceFilterForm.controls['LOB'].setValue("");
    this.advanceFilterForm.controls['EffectiveFromDate'].setValue("");
    this.advanceFilterForm.controls['EffectiveToDate'].setValue("");
    this.advanceFilterForm.controls['ExpirationFromDate'].setValue("");
    this.advanceFilterForm.controls['ExpirationToDate'].setValue("");

  }

  clearAdvanceFilterForm() {
    this.session.removeSession(SessionIdList.AlfredAlertsRefenceId);
    this.session.removeSession(SessionIdList.WorkBoardStatus);

    // this.isFilterFlag = false;
    this.flag = false;
    this.alfredFlagListChecked = [];
    this.HideAdvFilterOption = true;
    //this.getQuoteList();  

    this.PageSize = "10";
    this.SearchText = "";
    this.quoteId = 0;
    this.enabledForkJoin = true;


    this.advancedFilterRequest = null;
    //this.quoteViewList();
    this.sizeMethod();
    this.resetSelectControls();
  }

  clearAllFilter() {
    this.SearchText = "";
    this.enabledForkJoin = true;
    this.clearAdvanceFilterForm();
  }

  setTransferToAgentId(agentId: number) {
    this.transferToAgentId = agentId;
  }

  setFinalTransferQuotesId(quotationIds: string) {
    this.finalQuotationIds = quotationIds;
  }

  setTransferToAgentName(agentName: string) {
    this.transferToAgentName = agentName;
  }

  setTransferMessage(transferMessage: string) {
    this.transferMessage = transferMessage;
  }

  transferBusiness() {
    let message = '', quotationCount = 0;
    if (this.finalQuotationIds != "") {
      if (this.finalQuotationIds.indexOf(',') > -1) {
        quotationCount = this.finalQuotationIds.split(',').length;
      }
      else {
        quotationCount = 1;
      }
    }

    const ref = this.dialogService.open(BusinessTransferDialogComponent, {
      data: `${this.transferMessage} will be transferred to ${this.transferToAgentName}`
    });

    ref.afterClosed.subscribe(data => {
      // this.loaderService.show();
      if (data != null) {
        this.loaderService.show();
        this._businessTranferService.TransferBusiness(this._userInfo.UserId(), this.transferFrmAgentId, this.transferToAgentId, this.finalQuotationIds)
          .subscribe(data => {
            this.loaderService.hide();
            if (data?.success) {
              this.isTransferred = true;
              //this.getQuoteList();
              //this.quoteViewList();
              this.sizeMethod();
            }
          }, (err) => {
            this.loaderService.hide();
          }, () => {
            /*  this.loaderService.hide(); */
          })
        this.clearAdvanceFilterForm();
      }
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

  OpenFilter() {
    if (this.FilterOpen === false) {
      this.FilterOpen = true;
    } else if (this.FilterOpen === true) {
      this.FilterOpen = false;
    }
    this.advanceFilterEmit.emit(this.FilterOpen);
  }

  cancelAdvanceFilterForm() {
    this.advanceFilterForm.reset();
    this.alfredFlagListChecked = [];
    this.HideAdvFilterOption = true;
    this.resetSelectControls();
  }
  //-------------------------------
  SearchQuoteslist() {
    let reqObject = this.trimValueService.TrimObjectValue(this.advanceFilterForm.value)
    this.filterQuotes(reqObject);

  }
  setTransferFrmAgentName(frmAgentName: string) {
    this.transferFrmAgentName = frmAgentName;
  }

  setTransferFrmAgentId(frmAgentId: string) {
    this.transferFrmAgentId = frmAgentId;
  }

  // getLobList() {
  //   this.lobService.GetLOBList(this._userId).subscribe(response => {
  //     this.LOBList = response.data.lobsList;
  //   },
  //     err => {        
  //     })
  // }

  getLobList() {
    // First check store
    this.store.select(selectLobs).pipe(take(1)).subscribe(data => {
      if (!data || data.length === 0) {
        this.store.dispatch(loadLobList({ userId: this._userId }));
      }
    });

    // Subscribe reactively
    this.store.select(selectLobs).subscribe(lobs => {
      this.LOBList = lobs;
    });

    this.store.select(selectLobLoading).subscribe(isLoading => {
      if (isLoading) {
        this.loaderService.show();
      } else {
        this.loaderService.hide();
      }
    });
  }
}
