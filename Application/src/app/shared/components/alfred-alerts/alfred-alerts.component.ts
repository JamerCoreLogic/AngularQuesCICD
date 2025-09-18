import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AQAlfredAlertsService } from '@agenciiq/aqalfred';
import { LoaderService } from '../../utility/loader/loader.service';
import { AQUserInfo, AQAgentInfo, AQAgencyInfo } from '@agenciiq/login';
import { AQSession } from 'src/app/global-settings/session-storage';
import { Router } from '@angular/router';
import { SessionIdList } from 'src/app/global-settings/session-id-constraint';
import { TransactionCodeMaster } from 'src/app/global-settings/transactionCodeList';

@Component({
    selector: 'app-alfred-alerts',
    templateUrl: './alfred-alerts.component.html',
    styleUrls: ['./alfred-alerts.component.sass'],
    standalone: false
})
export class AlfredAlertsComponent implements OnInit {

  AlfredAlerts:any[] = [];
  alfredAlertsViewMode = 'grid';
  pageSize = 12;
  IsAlfredExpand:boolean = false;

  @Output('ToggleExpand') toggleExpandView = new EventEmitter();

  constructor(
    private alfredService: AQAlfredAlertsService,
    private loaderService: LoaderService,
    private userInfo: AQUserInfo,
    private agentInfo: AQAgentInfo,
    private agencyInfo: AQAgencyInfo,
    private router: Router,
    private session: AQSession,
    public transactionCodeMaster: TransactionCodeMaster
  ) { }

  ngOnInit() {
     
    if (this.userInfo.UserId() && this.agentInfo.Agent().agentId) {
      this.getAlfredAlerts();
    } else {
      this.router.navigate(['/']);
    }
  }
  getAlfredAlerts() {
   // this.loaderService.show();
    this.alfredService.AlfredAlerrts(this.userInfo.UserId(), this.agentInfo.Agent().agentId, 0)
      .subscribe(data => {
      //  this.loaderService.hide();
        if (data && data.data && data.data.alfredAlert) {
           this.AlfredAlerts = data.data.alfredAlert; 
        }
      },
        err => {
        //  this.loaderService.hide();
        },
        () => {
        //  this.loaderService.hide();
        })
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
   
    if(!value) {
    this.alfredAlertsViewMode = 'grid';
    }    
  }

}
