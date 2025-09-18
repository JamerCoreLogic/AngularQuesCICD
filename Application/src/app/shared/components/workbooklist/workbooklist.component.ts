import { Component, OnInit } from '@angular/core';
import { AQQuotesListService, AQFormsService, IQuoteViewReq } from '@agenciiq/quotes';
import { AQAgentInfo, AQUserInfo, AQAgencyInfo, AQRoleInfo } from '@agenciiq/login';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQRoutesNavSettings } from 'src/app/global-settings/route-nav-setting';
import { Router } from '@angular/router';
import { AQSession } from 'src/app/global-settings/session-storage';
import { SessionIdList } from 'src/app/global-settings/session-id-constraint';
import { Subscription, Subject, Observable } from 'rxjs';
import { DialogService } from '../../utility/aq-dialog/dialog.service';
import { QuotesDialogComponent } from '../quotes-dialog/quotes-dialog.component';
import { PopupService } from '../../utility/Popup/popup.service';
import { ProgramService } from '@agenciiq/aqadmin';
import { InsuredsProspectsService, IInsuredDetailReq } from '@agenciiq/quotes'
import { CheckRoleService } from '../../services/check-role/check-role.service';
import { Roles } from 'src/app/global-settings/roles';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { TransactionCodeMaster } from 'src/app/global-settings/transactionCodeList';
import { IQuotes } from '@agenciiq/quotes/lib/interfaces/base-quotes-list-resp';
import { selectNoRecordsMessage, selectPrograms, selectProgramsLoading, selectQuotes, selectQuotesLoading, selectQuotesTotal } from 'store/selectors/workboard.selectors';
import { Store } from '@ngrx/store';
import { loadMGAPrograms, loadQuotes } from 'store/actions/workboard.action';
import { PeriodSettings } from 'src/app/global-settings/periodSetting';

@Component({
  selector: 'app-workbooklist',
  templateUrl: './workbooklist.component.html',
  styleUrls: ['./workbooklist.component.sass'],
  standalone: false
})
export class WorkbooklistComponent implements OnInit {

  newQuotes: string;
  dataSource: any;
  QuotesColumnList = ['ref', 'insuredName', 'lob', 'agentName', 'effectiveDate', 'endorsementDate', 'yearsInsured'];
  transactionTypeList: any;
  stageList: any;
  alfredList: any;
  NoRecordsMessage: any;
  SavedAdvanceFilterList: any;
  sortedColumnName: any;
  flag: boolean = true;
  programData: any = [];
  pagination: boolean = true;
  periodList: any;
  carrierList: any;
  processingTypeList: any;
  stateList: any;
  Isvisible: boolean = false;
  IsQuotevisible: boolean = true;
  CilentID: number = 0;
  lobList: any;
  insuredDetails: any;
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
  private _userId = 0;
  private _agencyId = 0;
  private _agentId = 0;

  private GetAdvanceFilterParameterSubscription: Subscription;
  private SaveAdvanceFilterSubscription: Subscription;
  private QuotesListSubscription: Subscription;
  private periodSubscription: Subscription;
  private getParameterSubscription: Subscription;
  private QuotesFilterSubscription: Subscription;


  constructor(
    public transactionCodeMaster: TransactionCodeMaster,
    private _quotesService: AQQuotesListService,
    private _agentInfo: AQAgentInfo,
    private _userInfo: AQUserInfo,
    private loaderService: LoaderService,
    private agencyInfo: AQAgencyInfo,
    private router: Router,
    private session: AQSession,
    private dialogService: DialogService,
    private _aqformsService: AQFormsService,
    private _popupService: PopupService,
    private _programService: ProgramService,
    private _insuredsProspects: InsuredsProspectsService,
    private _userRoles: AQRoleInfo,
    private _checkRoleService: CheckRoleService,
    private store: Store,
    private period: PeriodSettings
  ) {
    this.newQuotes = AQRoutesNavSettings.Agent?.addQuotes;
    this._userId = this._userInfo.UserId() ? this._userInfo.UserId() : 0;
    this._agencyId = this.agencyInfo.Agency() && this.agencyInfo.Agency().agencyId ? this.agencyInfo.Agency().agencyId : 0;
    this._agentId = this._agentInfo.Agent() && this._agentInfo.Agent().agentId ? this._agentInfo.Agent().agentId : 0;
    if (this._checkRoleService.isRoleCodeAvailable(Roles.Underwriter.roleCode, this._userRoles.Roles())
      || this._checkRoleService.isRoleCodeAvailable(Roles.UnderwriterAssistant.roleCode, this._userRoles.Roles())
      || this._checkRoleService.isRoleCodeAvailable(Roles.UWManager.roleCode, this._userRoles.Roles())
      || this._checkRoleService.isRoleCodeAvailable(Roles.UWSupervisior.roleCode, this._userRoles.Roles())) {
      this.IsQuotevisible = false;
    }
  }

  ngOnInit() {
    //this.getQuoteList();
    this.getMGAPrograms();
    this.DebounceApiCall();
    setTimeout(() => {
      //console.clear();
    }, 1000);
    this._checkRoleService.addNewQuoteSubject
      .pipe(take(1))
      .subscribe(value => {
        if (value === 'AddQuote') {
          //this.quoteViewListChange();
          let request: IQuoteViewReq = {
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
          this.store.dispatch(loadQuotes({ request, enabledForkJoin: this.enabledForkJoin }));
          this._checkRoleService.addNewQuoteSubject.next('');
        }
      });
    this.quoteViewList();
  }


  DebounceApiCall() {
    this.subject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(value => {
      this.SearchText = value;
      //this.quoteViewList();
      this.quoteViewListChange();
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
    sessionStorage.setItem("edit", "true");
    sessionStorage.setItem("generatePremiumClicked", 'false')
    this.router.navigate(['agenciiq/workbook/quickquote']);
  }

  quotesViewUW() {
    this.router.navigate(['agenciiq/workbook/quoteView']);
  }
  // getMGAPrograms() {
  //   debugger
  //   this._programService.MGAPrograms(this._userId, 1).subscribe(programs => {
  //     if (programs?.data?.mgaProgramList) {
  //       this.programData = programs.data.mgaProgramList;
  //     }
  //   })
  // }

  getMGAPrograms() {
    // First check store
    this.store.select(selectPrograms).pipe(take(1)).subscribe(data => {
      if (!data || data.length === 0) {
        this.store.dispatch(loadMGAPrograms({ userId: 123, agencyId: 1 }));
      }
    });

    // Subscribe reactively
    this.store.select(selectPrograms).subscribe(data => {
      this.programData = data;
    });

    // this.store.select(selectProgramsLoading).subscribe(isLoading => {
    //   if (isLoading) {
    //     this.loaderService.show();
    //   } else {
    //     this.loaderService.hide();
    //   }
    // });
  }

  ngOnDestroy() {
    /* this.session.removeSession(SessionIdList.AlfredAlertsRefenceId); */
    /*   this.session.removeSession(SessionIdList.WorkBoardStatus); */

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


  quikquotes() {
    const ref = this.dialogService.open(QuotesDialogComponent, {
      data: this.programData
    });

    ref.afterClosed.subscribe(data => {
      if (data && data.LOB && data.State && data.QuoteType) {
        // this.loaderService.show();
        this._aqformsService.AQForms(this._userId, data.LOB.toString(), data.State, data.QuoteType)
          .subscribe(dataResp => {
            //this.loaderService.hide();
            if (dataResp?.success) {
              this.session.removeSession('insuredReqObj');
              this.session.removeSession("insuredView");
              this.session.setData('QuoteDialogData', JSON.stringify(data));
              this.session.setData('navType', 'dashboard');
              this.router.navigateByUrl('agenciiq/workbook/quickquote');
            } else {
              this._popupService.showPopup('Quote', dataResp.message);
            }
          }, (err) => {
            // this.loaderService.hide();
            console.log("err", err);
          }, () => {
            // this.loaderService.hide();
          })
      }
    })
  }

  // quoteViewList() {  
  //   let request: IQuoteViewReq = {
  //     AgencyId: this._agencyId,
  //     AgentId: this._agentId,
  //     PageNumber: this.PageNumber,
  //     PageSize: this.PageSize,
  //     SearchText: this.SearchText,
  //     SortingColumn: this.SortingColumn,
  //     SortingOrder: this.SortingOrder,
  //     UserId: this._userId,
  //     QuoteId: this.quoteId
  //   }

  //   //this.loaderService.show();
  //   this._quotesService.QuotesViewList(request, this.enabledForkJoin).subscribe(resp => {  //    
  //     if (resp[0]?.data?.quote) {
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
  //   },
  //     err => {
  //       this.loaderService.hide();
  //       console.log("err", err);
  //     },
  //     () => {
  //       // this.loaderService.hide();
  //     });

  // }


  quoteViewListChange() {
    let request: IQuoteViewReq = {
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

    //this.loaderService.show();
    this._quotesService.QuotesViewList(request, this.enabledForkJoin).subscribe(resp => {
      //this.loaderService.hide();
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
    },
      err => {
        //this.loaderService.hide();
        console.log("err", err);
      },
      () => {
        // this.loaderService.hide();
      });

  }

  quoteViewList() {
    let request: IQuoteViewReq = {
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
    this.store.select(selectQuotes).pipe(take(1)).subscribe(data => {
      if (!data || data.length === 0) {
        // first time → call API
        this.store.dispatch(loadQuotes({ request, enabledForkJoin: this.enabledForkJoin }));
      }
    });

    // always subscribe to selectors (reactive binding)
    this.store.select(selectQuotes).subscribe(data => {
      if (data && data.length > 0) {
        setTimeout(() => {
          this.dataSource = data;
        }, 100);

      }
    });

    this.store.select(selectQuotesTotal).subscribe(total => {
      this.totalItem = total;
      //this.loaderService.hide(); // ✅ hide loader when data actually comes
    });

    // this.store.select(selectQuotesLoading).subscribe(isLoading => {
    //   if (isLoading) {
    //     this.loaderService.show();
    //   } else {
    //     this.loaderService.hide();
    //   }
    // });

    this.store.select(selectNoRecordsMessage).subscribe(msg => {
      this.NoRecordsMessage = msg;
    });


  }

  ChangePageSize(pageSize: string) {
    this.PageSize = pageSize;
    this.enabledForkJoin = false;
    this.PageNumber = 1;
    //this.quoteViewList();
    this.quoteViewListChange();
  }

  NewPage(pageNumber: number) {
    this.PageNumber = pageNumber;
    this.enabledForkJoin = false;
    //this.quoteViewList();
    this.quoteViewListChange();
  }

  SearchQuote(searchText: any) {
    this.subject.next(searchText);
    this.SearchText = searchText;
    this.enabledForkJoin = true;
    this.PageNumber = 1;
  }


  sortQuotes(columnName: string) {
    this.SortingColumn = columnName;
    this.SortingOrder == 'DESC' ? 'ASC' : 'DESC'
    this.enabledForkJoin = false;
    // this.quoteViewList();
    this.quoteViewListChange();
  }


  /* ---------------- */


  getQuoteList() {
    this.flag = false;
    this._quotesService.QuotesList(this._userId, this._agentId, this._agencyId).subscribe(data => {
      if (data?.data?.quote) {
        this.Isvisible = true;
        this.dataSource = data.data.quote;
        //this.sortedColumnName = { 'columnName': 'quoteId', isAsc: this.flag };
        this.NoRecordsMessage = '';
      } else {
        this.Isvisible = false;
        this.NoRecordsMessage = 'No records found!';
      }
    },
      err => {
        // this.loaderService.hide();
        console.log("err", err);
      },
      () => {
        // this.loaderService.hide();
      });
  }

  navigateTo() {
    //this.session.removeSession(SessionIdList.WorkBoardStatus);
    localStorage.removeItem('workboardstatus');
    localStorage.removeItem('period');
    this.period.SetPeriod = ""
    this.session.setData(SessionIdList.statusType, "");
    this.session.removeSession(SessionIdList.AlfredAlertsRefenceId);
    this.router.navigateByUrl("agenciiq/workbook");
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

    this.session.removeSession('insuredReqObj');
    this.session.removeSession("insuredView");
    this.session.setData("viewPolicyParams", policyParams);
    this.session.setData("navType", 'dashboard');
    //this.router.navigate(['agenciiq/workbook/quickquote']);


    if ((this._checkRoleService.isRoleCodeAvailable(Roles.Underwriter.roleCode, this._userRoles.Roles())
      || this._checkRoleService.isRoleCodeAvailable(Roles.UnderwriterAssistant.roleCode, this._userRoles.Roles())
      || this._checkRoleService.isRoleCodeAvailable(Roles.UWManager.roleCode, this._userRoles.Roles())
      || this._checkRoleService.isRoleCodeAvailable(Roles.UWSupervisior.roleCode, this._userRoles.Roles()))
      && data.actionName != 'Documents'
    ) {

      this.router.navigate(['agenciiq/workbook/quoteView']);

    } else {
      sessionStorage.setItem("generatePremiumClicked", 'false')
      if (data.actionName == 'COPY') {
        sessionStorage.setItem("edit", "false");
      } else {
        sessionStorage.setItem("edit", "true");
      }
      this.router.navigate(['agenciiq/workbook/quickquote']);
    }

  }

}
