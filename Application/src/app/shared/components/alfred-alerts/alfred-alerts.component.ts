import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AQAlfredAlertsService } from '@agenciiq/aqalfred';
import { LoaderService } from '../../utility/loader/loader.service';
import { AQUserInfo, AQAgentInfo, AQAgencyInfo } from '@agenciiq/login';
import { AQSession } from 'src/app/global-settings/session-storage';
import { Router } from '@angular/router';
import { SessionIdList } from 'src/app/global-settings/session-id-constraint';
import { TransactionCodeMaster } from 'src/app/global-settings/transactionCodeList';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAlfredAlerts, selectAlfredLoading, selectAlfredNoRecordMessage } from 'store/selectors/alfred-alert.selectors';
import { loadAlfredAlerts } from 'store/actions/alfred-alert.action';

@Component({
  selector: 'app-alfred-alerts',
  templateUrl: './alfred-alerts.component.html',
  styleUrls: ['./alfred-alerts.component.sass'],
  standalone: false
})
export class AlfredAlertsComponent implements OnInit {

  AlfredAlerts: any[] = [];
  alfredAlertsViewMode = 'grid';
  pageSize = 12;
  IsAlfredExpand: boolean = false;
  alfredData$: Observable<any[]>;
  noRecordsMessage$: Observable<string>;



  @Output('ToggleExpand') toggleExpandView = new EventEmitter();

  constructor(
    private alfredService: AQAlfredAlertsService,
    private loaderService: LoaderService,
    private userInfo: AQUserInfo,
    private agentInfo: AQAgentInfo,
    private agencyInfo: AQAgencyInfo,
    private router: Router,
    private session: AQSession,
    public transactionCodeMaster: TransactionCodeMaster,
    private store: Store,
  ) { }

  ngOnInit() {

    if (this.userInfo.UserId() && this.agentInfo.Agent().agentId) {
      this.getAlfredAlerts();
    } else {
      this.router.navigate(['/']);
    }
  }
  // getAlfredAlerts() {
  //   // this.loaderService.show();
  //   this.alfredService.AlfredAlerrts(this.userInfo.UserId(), this.agentInfo.Agent().agentId, 0)
  //     .subscribe(data => {
  //       //  this.loaderService.hide();
  //       if (data && data.data && data.data.alfredAlert) {
  //         this.AlfredAlerts = data.data.alfredAlert;
  //       }
  //     },
  //       err => {
  //         //  this.loaderService.hide();
  //       },
  //       () => {
  //         //  this.loaderService.hide();
  //       })
  // }

  getAlfredAlerts() {
    // this.loaderService.show();
    const userId = this.userInfo.UserId();
    const agentId = this.agentInfo.Agent().agentId;
    this.alfredData$ = this.store.select(selectAlfredAlerts);
    this.noRecordsMessage$ = this.store.select(selectAlfredNoRecordMessage);
    this.alfredData$.subscribe((data: any) => {
      if (!data || !data.success) {
        this.store.dispatch(loadAlfredAlerts({
          userId: this.userInfo.UserId(),
          agentId
        }));
      } else {
        if (data && data.data && data.data.alfredAlert) {
          this.AlfredAlerts = data.data.alfredAlert;
        }
      }
    });

    // this.store.select(selectAlfredLoading).subscribe(isLoading => {
    //   if (isLoading) {
    //     this.loaderService.show();
    //   } else {
    //     this.loaderService.hide();
    //   }
    // });
  }

  viewAlerts(quote) {
    if (quote && quote.quoteId) {
      this.session.setData(SessionIdList.AlfredAlertsRefenceId, quote.quoteId);
      this.router.navigate(['/agenciiq/workbook']);
    }
  }

  toggleMode(value) {
    this.IsAlfredExpand = true;
    this.alfredAlertsViewMode = value;

  }

  toggleExpand(value) {

    this.toggleExpandView.emit(value);

    if (!value) {
      this.alfredAlertsViewMode = 'grid';
    }
  }

}
