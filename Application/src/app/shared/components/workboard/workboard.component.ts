import { Component, OnDestroy, OnInit } from '@angular/core';
import { AQRoutesNavSettings } from 'src/app/global-settings/route-nav-setting';
import { Router } from '@angular/router';
import { AqworkboardServiceService } from '@agenciiq/aqworkboard';
import { PeriodSettings } from 'src/app/global-settings/periodSetting';
import { workboardSettings } from 'src/app/global-settings/workboardSetting';
import { AQAgentInfo, AQAgencyInfo, AQUserInfo } from '@agenciiq/login';
import { LoaderService } from '../../utility/loader/loader.service';
import { AQSession } from 'src/app/global-settings/session-storage';
import { SessionIdList } from 'src/app/global-settings/session-id-constraint';
import { DialogService } from '../../utility/aq-dialog/dialog.service';
import { QuotesDialogComponent } from '../quotes-dialog/quotes-dialog.component';
import { ProgramService } from '@agenciiq/aqadmin';
import { AQFormsService } from '@agenciiq/quotes';
import { PopupService } from '../../utility/Popup/popup.service';
import { SetDateService } from '../../services/setDate/set-date.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-workboard',
    templateUrl: './workboard.component.html',
    styleUrls: ['./workboard.component.sass'],
    standalone: false
})

export class WorkboardComponent implements OnInit, OnDestroy {


  quotesNav: any = AQRoutesNavSettings.Agent.quotes;
  forms: any = AQRoutesNavSettings.Agent.forms;
  newQuote: any = AQRoutesNavSettings.Agent.addQuotes;

  _router: any;
  workBoardData: any;
  StateList: any[] = [];
  LobList: any[] = [];
  programData: any[] = [];
  viewMode = 'trasaction';
  workboardType: any = '';
  workboardTemp: any = '';
  workboardList: any[] = [];
  period: any;
  periodStartDate: any;
  periodEndDate: any;
  alreadyLogin: boolean;

  //for carousel
  itemsPerSlide = 5;
  showIndicator = false;
  subscribeWork: boolean = false;
  item: any;
  statusType: any;

  private periodSubscription: Subscription;
  private workBoardDataSubscription: Subscription;

  /**
   * Temp Data: Show while loading component.
  */

  tempData = '{"data":{"trasaction":[[{"status":"Indications","totalValue":0,"nb":0,"e":0,"r":0,"_type":"Indications","rn":1,"_cat":"Transaction"},{"status":"Incomplete","totalValue":0,"nb":0,"e":0,"r":0,"_type":"Indications","rn":2,"_cat":"Transaction"},{"status":"Pending","totalValue":0,"nb":0,"e":0,"r":0,"_type":"Indications","rn":3,"_cat":"Transaction"}],[{"status":"Quotes","totalValue":0,"nb":0,"e":0,"r":0,"_type":"Quotes","rn":1,"_cat":"Transaction"},{"status":"Incomplete","totalValue":0,"nb":0,"e":0,"r":0,"_type":"Quotes","rn":2,"_cat":"Transaction"},{"status":"Pending","totalValue":0,"nb":0,"e":0,"r":0,"_type":"Quotes","rn":3,"_cat":"Transaction"}],[{"status":"Bound","totalValue":0,"nb":0,"e":0,"r":0,"_type":"Bound","rn":1,"_cat":"Transaction"},{"status":"Incomplete","totalValue":0,"nb":0,"e":0,"r":0,"_type":"Bound","rn":2,"_cat":"Transaction"},{"status":"Pending","totalValue":0,"nb":0,"e":0,"r":0,"_type":"Bound","rn":3,"_cat":"Transaction"}],[{"status":"Issued","totalValue":0,"nb":0,"e":0,"r":0,"_type":"Issued","rn":1,"_cat":"Transaction"},{"status":"Incomplete","totalValue":0,"nb":0,"e":0,"r":0,"_type":"Issued","rn":2,"_cat":"Transaction"},{"status":"Pending","totalValue":0,"nb":0,"e":0,"r":0,"_type":"Issued","rn":3,"_cat":"Transaction"}],[{"status":"Renewals Due","totalValue":0,"nb":0,"e":0,"r":0,"_type":"Renewals Due","rn":1,"_cat":"Transaction"},{"status":"Cancellations","totalValue":0,"nb":0,"e":0,"r":0,"_type":"Renewals Due","rn":2,"_cat":"Transaction"},{"status":"Reinstatements","totalValue":0,"nb":0,"e":0,"r":0,"_type":"Renewals Due","rn":3,"_cat":"Transaction"}]],"notifications":[{"status":"Indications Received","total":0},{"status":"Quote Received","total":0},{"status":"Declined by Underwriter","total":0},{"status":"Knock outs","total":0},{"status":"Binder Created","total":0},{"status":"Policy Issued","total":0},{"status":"Policy Cancelled","total":0},{"status":"Renewals Due","total":0},{"status":"Policy Renewed","total":0},{"status":"Expiring Quotes","total":0},{"status":"Expiring Quick Indications","total":0}],"alerts":[{"status":"Possibility of Property Damage","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Possibility-of-Property-Damage.png"},{"status":"Overseas Travel","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Overseas-Travel.png"},{"status":"Legal Events","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Legal-Events.png"},{"status":"Lawsuits","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Lawsuits.png"},{"status":"Bankruptcies","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Bankruptcies.png"},{"status":"Financial Issues","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Financial-Issues.png"},{"status":"Criminal Proceedings","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Criminal-Proceedings.png"},{"status":"Insolvencies","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Insolvencies.png"},{"status":"Wild Fire","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Wild-Fire.png"},{"status":"Wind Zone","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Wind-Zone.png"},{"status":"Earthquake","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Earthquake.png"},{"status":"Fire Protection","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Fire-Protection.png"},{"status":"Sinkhole","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Sinkhole.png"},{"status":"Wind","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Wind.png"},{"status":"Flood Risk","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Flood-Risk.png"},{"status":"Crime","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Crime.png"},{"status":"Hail","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Hail.png"},{"status":"Tornado","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Tornado.png"},{"status":"Lightning","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Lightning.png"},{"status":"Net Worth Medium","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Net-Worth-Medium.png"},{"status":"Financial Strength Medium","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Financial-Strength-Medium.png"},{"status":"Risk Assessment","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Risk-Assessment.png"},{"status":"Risk Assessment High","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Risk-Assessment-High.png"},{"status":"Risk Assessment Moderate","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Risk-Assessment-Moderate.png"},{"status":"Risk Assessment ModerateHigh","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Risk-Assessment-ModerateHigh.png"},{"status":"Net Worth Low","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Net-Worth-Low.png"},{"status":"Net Worth High","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Net-Worth-High.png"},{"status":"Financial Strength Low","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Financial-Strength-Low.png"},{"status":"Financial Strength High","total":0,"url":"https://federal.agenciiq.net/AQAPI/AlertIcons/Financial-Strength-High.png"}]},"success":true,"message":"Success"}';


  constructor(
    private _rout: Router,
    private workboardService: AqworkboardServiceService,
    private _period: PeriodSettings,
    private _workboard: workboardSettings,
    private agent: AQAgentInfo,
    private agency: AQAgencyInfo,
    private loader: LoaderService,
    private seesion: AQSession,
    private _user: AQUserInfo,
    private dialogService: DialogService,
    private _programService: ProgramService,
    private _aqformsService: AQFormsService,
    private _popupService: PopupService,
    private setDateService: SetDateService,
  ) {

    this.subscribePeriod();

  }

  ngOnInit() {
    
    this.workboardType = this.seesion.getData("workboardType");
    this.workBoardData = JSON.parse(this.tempData).data;
    this.getWorkboardList('trasaction');

    
    this.getMGAPrograms();
    

  }

  ngOnDestroy() {
    if (this.periodSubscription) {
      this.periodSubscription.unsubscribe();
    }

    if (this.workBoardDataSubscription) {
      this.workBoardDataSubscription.unsubscribe();
    }
  }

  subscribePeriod() {
    this.periodSubscription = this._period.period.subscribe(period => {
     // console.log('asd', period)
      this.seesion.setData("selectedPeriod", period);
      this.period = period;
      this.periodStartDate = (this.seesion.getData("periodStartDate"));
      this.periodEndDate = (this.seesion.getData("periodEndtDate"));
      this.getWorkBoardData(period, this.periodStartDate, this.periodEndDate);
    })
  }

  nav() {
    this._rout.navigateByUrl("agenciiq/workbook");
    /*  this._rout.navigateByUrl("agent/" + this.quotesNav); */
  }


  getWorkBoardData(period, startDate, endDate) {

    this.workboardTemp = (this.workboardType != '' && this.workboardType != null) ? this.workboardType : 'trasaction'
    //this.workboardType = '';
    if (period && ((this.agent.Agent() && this.agent.Agent().agentId))) {
      //this.loader.show();
    
      this.workBoardDataSubscription = this.workboardService.newWorkboardList(period, startDate, endDate, 0, this.agent.Agent().agentId, this._user.UserId().toString(), "")
        .subscribe(data => {
          //   this.loader.hide();
          if (data && data.data) {
            this.workBoardData = data.data;
            this.getWorkboardList(this.workboardTemp);

          }
        }, err => {
          this.loader.hide();
        }, () => {
          this.loader.hide();
        });
    }
  }

  getWorkboardList(type) {
    
   // this.workboardList = [];
    if (type == 'trasaction') this.workboardList = this.workBoardData.trasaction ? this.workBoardData.trasaction : [];
    if (type == 'notifications') this.resetData('notifications');
    if (type == 'alerts') this.resetData('alerts');
    this.workboardType = type;

  }

  resetData(type) {

    let tempArray = []; let finalArray = [];
    let workboardList;
    if (type == 'notifications') workboardList = this.workBoardData.notifications ? this.workBoardData.notifications.filter(el => { return el.total != 0 }) : [];
    if (type == 'alerts') workboardList = this.workBoardData.alerts ? this.workBoardData.alerts.filter(el => { return el.total != 0 }) : [];

    workboardList.forEach(function (el, i) {
      if (i % 2 == 0 && i != 0) {
        finalArray.push(tempArray);
        tempArray = [];
      }
      tempArray.push(el);
    })
    if (tempArray.length != 0) {
      finalArray.push(tempArray); tempArray = [];
    }
    this.workboardList = finalArray;
  }

  redirectToQuoteslist(workboardstatus, StatusType) {

    if (workboardstatus) {
      this.seesion.removeSession(SessionIdList.AlfredAlertsRefenceId);
      //this.seesion.setData(SessionIdList.WorkBoardStatus, workboardstatus);
      localStorage.setItem('workboardstatus', workboardstatus);
      let statusType = StatusType != undefined ? StatusType : "";
      //this.seesion.setData(SessionIdList.statusType, statusType);
      localStorage.setItem('statusType', statusType);
      this.seesion.setData("workboardType", this.workboardType);
      this._rout.navigateByUrl("agenciiq/workbook");
      /* this._rout.navigateByUrl("agent/" + this.quotesNav); */
    }
  }

  quikquotes() {
    const ref = this.dialogService.open(QuotesDialogComponent, {
      data: this.programData
    });

    ref.afterClosed.subscribe(data => {
      ;
      if (data && data.LOB && data.State && data.QuoteType) {
        // this.loader.show();
        this._aqformsService.AQForms(this._user.UserId(), data.LOB.toString(), data.State, data.QuoteType)
          .subscribe(dataResp => {
            // this.loader.hide();
            if (dataResp && dataResp.success) {
              this.seesion.setData('QuoteDialogData', JSON.stringify(data));
              this.seesion.removeSession("insuredView");
              this._rout.navigateByUrl('agenciiq/workbook/quickquote');
            } else {
              this._popupService.showPopup('Quote', dataResp.message);
            }
          }, (err) => {
            //  this.loader.hide();
          }, () => {
            //  this.loader.hide();
          })
      }
    })
  }

  getMGAPrograms() {
    this._programService.MGAPrograms(this._user.UserId(), 1)
      .subscribe(programs => {
        if (programs && programs.data && programs.data.mgaProgramList) {
          this.programData = programs.data.mgaProgramList;
        }
      })
  }





  /* Temp data */



}

