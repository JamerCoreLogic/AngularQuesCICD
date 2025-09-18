import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { KpiService } from '@agenciiq/aqkpi';
import { PeriodSettings } from 'src/app/global-settings/periodSetting';
import { workboardSettings } from 'src/app/global-settings/workboardSetting';
import { AQAgentInfo, AQUserInfo } from '@agenciiq/login';
import { PeriodOption } from './period-options';
import { AqworkboardServiceService } from '@agenciiq/aqworkboard';
import { AQSession } from 'src/app/global-settings/session-storage';

@Component({
    selector: 'app-headerbar',
    templateUrl: './headerbar.component.html',
    styleUrls: ['./headerbar.component.sass'],
    standalone: false
})
export class HeaderbarComponent implements OnInit {

  resp: any[] = [];
  ChartsStatus: Boolean = false;
  sidebarfiltermodal: boolean = false;
  selectedPeriod: string = "";
  //selectedPeriodText: string = "";
  selectedPeriodText:any;
  selectedMonth: number = 0;
  selectedQuarter: number = 0;
  selectedYear: number = 0;
  yearCount: number = 0;
  workboardResponse: any;
  monthList: any[] = [];
  quarterList: any[] = [];
  yearList: any[] = [];
  subscribeWork: boolean = false;

  tempData = '{"data":{"kpiResponses":[{"performanceMeasureId":37,"performanceMeasureName":"Quote/Indications Ratio","agentId":16,"performanceMeasurePeriod":"Year","aqkpi":false,"value":"0","growth":"NA","growthFlag":"NA"},{"performanceMeasureId":38,"performanceMeasureName":"Bound/Indications Ratio","agentId":16,"performanceMeasurePeriod":"Year","aqkpi":false,"value":"0","growth":"NA","growthFlag":"NA"},{"performanceMeasureId":39,"performanceMeasureName":"Bound/Quote Ratio","agentId":16,"performanceMeasurePeriod":"Year","aqkpi":false,"value":"0","growth":"NA","growthFlag":"NA"},{"performanceMeasureId":40,"performanceMeasureName":"Issued/Bound Ratio","agentId":16,"performanceMeasurePeriod":"Year","aqkpi":false,"value":"0","growth":"NA","growthFlag":"NA"},{"performanceMeasureId":41,"performanceMeasureName":"Straight-thru/Quotes Ratio","agentId":16,"performanceMeasurePeriod":"Year","aqkpi":false,"value":"0","growth":"NA","growthFlag":"NA"},{"performanceMeasureId":42,"performanceMeasureName":"Renewed/Renewables Ratio","agentId":16,"performanceMeasurePeriod":"Year","aqkpi":false,"value":"0","growth":"NA","growthFlag":"NA"},{"performanceMeasureId":43,"performanceMeasureName":"Issued/Indications Ratio","agentId":16,"performanceMeasurePeriod":"Year","aqkpi":false,"value":"0","growth":"NA","growthFlag":"NA"},{"performanceMeasureId":201,"performanceMeasureName":"Issued/Quotes Ratio","agentId":16,"performanceMeasurePeriod":"Year","aqkpi":false,"value":"0","growth":"NA","growthFlag":"NA"},{"performanceMeasureId":44,"performanceMeasureName":"Me","agentId":16,"performanceMeasurePeriod":"Year","aqkpi":true,"value":"0","growth":"NA","growthFlag":"NA"},{"performanceMeasureId":45,"performanceMeasureName":"Agency","agentId":16,"performanceMeasurePeriod":"Year","aqkpi":true,"value":"0","growth":"NA","growthFlag":"NA"},{"performanceMeasureId":46,"performanceMeasureName":"Peers","agentId":16,"performanceMeasurePeriod":"Year","aqkpi":true,"value":"0","growth":"NA","growthFlag":"NA"}],"charts":null},"success":true,"message":null}';

  constructor(
    private _router: Router,
    private _apki: KpiService,
    private _period: PeriodSettings,
    private _workboard: workboardSettings,
    private agent: AQAgentInfo,
    private _user: AQUserInfo,
    private _periodOption: PeriodOption,
    private workboardService: AqworkboardServiceService,
    private _session: AQSession,
  ) { }

  ngOnInit() {
    this.displayTempData(JSON.parse(this.tempData));
    
    this.getPeriodType();
    this.SubscribePeriod();
   // this.subscribeWorkboard();
  }


  displayTempData(data){
    this.resp = data.data.kpiResponses.filter(data => {
      return  data['aqkpi'] == false;
     }).slice(0, 8);
               
     this.resp.map(data => {
       let performanceMeasureNameStr;
       let performanceMeasureName = data['performanceMeasureName'].toString().split(" ");
        if(performanceMeasureName.length > 1)   performanceMeasureNameStr = performanceMeasureName.pop();
       data["performanceMeasureName"] = performanceMeasureName.join(" ");
       data["performanceMeasureNameStr"] = performanceMeasureNameStr;
        data['aqkpi'] == false;
     });
  }


  getPeriodType(){
     
       this.workboardService.workboardPeriodList()
         .subscribe(data => {
           if (data && data.data && data.data.workboardResponse) {
            this.workboardResponse = data.data.workboardResponse;
            //this.workboardResponse.forEach(el => {
              this.monthList = this.workboardResponse.filter(item=>item.periodType == "Month");
              this.quarterList = this.workboardResponse.filter(item=>item.periodType == "Quarter");
              this.yearList = this.workboardResponse.filter(item=>item.periodType == "Year");
              //this.PeriodSettingService(this.selectedPeriod);
              this.showPeriodData('Month');
              
           }
         }, err => {
          // this.loader.hide();
         }, () => {
          // this.loader.hide();
         });
  }

  showPeriodData(selectedPeriod){
     
    this.selectedPeriod = selectedPeriod;
    this.OpenSidebarFilter();
    let selectedPeriodText = [];
    if(selectedPeriod == "Month") this.selectedPeriodText = this.monthList[0];
    if(selectedPeriod == "Quarter") this.selectedPeriodText = this.quarterList[0];
    if(selectedPeriod == "Year") this.selectedPeriodText = this.yearList[0];
    this._session.setData("periodStartDate",this.selectedPeriodText.startDate);
    this._session.setData("periodEndtDate",this.selectedPeriodText.endDate);
    this.getkpi(selectedPeriod);
    this.filterData(selectedPeriod);
    let workboardData = {
      period: this.selectedPeriod,
      startDate: this.selectedPeriodText.startDate,
      endDate: this.selectedPeriodText.endDate,
    }
  }

  

  SubscribePeriod() {
     
    this._period.period.subscribe(period => {
      if (period) {
        //this.getkpi(period);
        this.selectedPeriod = period;
        //this.PeriodSettingService(this.selectedPeriod);
      }
    })
  }


  PeriodSettingService(selectedPeriod: string) {
     
    if (selectedPeriod == 'Month') {
      this.showPeriodData("Month");
      // this.selectedMonth = new Date().getMonth();
      // this.selectedYear = new Date().getFullYear();
      // this.selectedPeriodText = this._periodOption.getMonthName(this.selectedMonth) +" " +this.selectedYear;
    } else if (selectedPeriod == 'Quarter') {
      this.selectedMonth = new Date().getMonth()
      this.selectedQuarter = this._periodOption.getQuarterName(this.selectedMonth);
      let resp = this._periodOption.QuarterOptions(this.selectedQuarter);
      this.selectedPeriodText = resp.DisplayText;
    } else if (this.selectedPeriod == 'Year') {
      this.selectedYear = new Date().getFullYear();
      //this.selectedPeriodText = this._periodOption.YearOptions(this.selectedYear);
    }
  }

  ChangePeriod(filter: string, text) {
    
    let selectedPeriodText = [];
    let monthList = this.monthList;
    let data = [];
    if (this.selectedPeriod == "Month") data = this.monthList;
    if (this.selectedPeriod == "Quarter") data = this.quarterList;
    if (this.selectedPeriod == "Year") data = this.yearList;

    if (filter == '<') {
      data.forEach(function(el,i){
          if(el.retSeq == text.retSeq)
          selectedPeriodText = (i == data.length-1) ? data[i]:data[i+1];
        })
        //this.selectedPeriodText = selectedPeriodText;
    }
    else if (filter == '>') {
      data.forEach(function(el,i){
        if(el.retSeq == text.retSeq)
          selectedPeriodText = (i == 0) ? data[i]:data[i-1];
      })
    }
    else
    selectedPeriodText = data[0];

    this.selectedPeriodText = selectedPeriodText;
    this._session.setData("periodStartDate",this.selectedPeriodText.startDate);
    this._session.setData("periodEndtDate",this.selectedPeriodText.endDate);
    this.filterData(this.selectedPeriod);
    this.getkpi(this.selectedPeriod);
  }


  getkpi(period) {
      
     let startDate = this.selectedPeriodText.startDate;
     let  endDate = this.selectedPeriodText.endDate;
    if (this.agent.Agent() && this.agent.Agent().agentId) {
      this._apki.AqkpiList(this._user.UserId(), period, startDate, endDate, 0, this.agent.Agent().agentId, "")
        .subscribe(data => {
          if (data && data.data && data.data.kpiResponses) {

            this.resp = data.data.kpiResponses.filter(data => {
             return  data['aqkpi'] == false;
            }).slice(0, 8);
                      
            this.resp.map(data => {
              let performanceMeasureNameStr;
              let performanceMeasureName = data['performanceMeasureName'].toString().split(" ");
               if(performanceMeasureName.length > 1)   performanceMeasureNameStr = performanceMeasureName.pop();
              data["performanceMeasureName"] = performanceMeasureName.join(" ");
              data["performanceMeasureNameStr"] = performanceMeasureNameStr;
               data['aqkpi'] == false;
            });

          }
         })
    } else {
      this._router.navigate['/'];
    }
  }

  navigate() {
    this._router.navigateByUrl("agent/quotes");
  }

  MoveHeader(obj) {
    if (obj == "left") {
      document.getElementById('ScrollingDiv').style.marginLeft = "0px";
    } else if (obj == "right") {
      document.getElementById('ScrollingDiv').style.marginLeft = "-190px";
    }
  }



  ChartsToggle() {
    if (this.ChartsStatus == false) {
      this.ChartsStatus = true;
    } else if (this.ChartsStatus = true) {
      this.ChartsStatus = false;
    }
  }

  OpenSidebarFilter() {
    if (this.sidebarfiltermodal == true) {
      this.sidebarfiltermodal = false;
    } else if (this.sidebarfiltermodal == false) {
      this.sidebarfiltermodal = true;
    }
  }


  filterData(value) {
    this._period.SetPeriod = value;
    localStorage.setItem('period',value);
    this.OpenSidebarFilter();
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {

    if (targetElement.id == 'periodFilterMenu') {
      this.OpenSidebarFilter();
    } else {
      this.sidebarfiltermodal = false;
    }
  }


}
