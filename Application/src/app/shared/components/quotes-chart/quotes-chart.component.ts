import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { KpiService } from '@agenciiq/aqkpi';
import { Router } from '@angular/router';
import { PeriodSettings } from 'src/app/global-settings/periodSetting';
import { AQAgentInfo, AQUserInfo } from '@agenciiq/login';
import { ChartsService } from './charts.service';
import * as Highcharts from 'highcharts';
import { SetDateService } from '../../services/setDate/set-date.service';
import { AQSession } from 'src/app/global-settings/session-storage';
import Boost from 'highcharts/modules/boost';
import noData from 'highcharts/modules/no-data-to-display';
import More from 'highcharts/highcharts-more';

declare var require: any;
// let Boost = require('highcharts/modules/boost');
// let noData = require('highcharts/modules/no-data-to-display');
// let More = require('highcharts/highcharts-more');



Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts)

@Component({
  selector: 'app-quotes-chart',
  templateUrl: './quotes-chart.component.html',
  styleUrls: ['./quotes-chart.component.sass'],
  standalone: false
})
export class QuotesChartComponent implements OnInit, AfterViewInit {

  ChartsStatus: Boolean = true;
  ChartsData: any[] = [];


  @ViewChild('ChartContainer1', { static: true }) chartContainer1: ElementRef;
  @ViewChild('ChartContainer2', { static: true }) chartContainer2: ElementRef;
  @ViewChild('ChartContainer3', { static: true }) chartContainer3: ElementRef;

  constructor(
    private _router: Router,
    private _apki: KpiService,
    private _period: PeriodSettings,
    private agent: AQAgentInfo,
    private chartService: ChartsService,
    private _user: AQUserInfo,
    private setDateService: SetDateService,
    private seesion: AQSession,
  ) { }

  ngAfterViewInit() {

  }

  ChartsToggle() {
    if (this.ChartsStatus == false) {
      this.ChartsStatus = true;
    } else if (this.ChartsStatus = true) {
      this.ChartsStatus = false;
    }
  }

  ngOnInit() {
    this.SubscribePeriod();
  }


  SubscribePeriod() {
    this._period.period.subscribe(period => {
      if (period) {
        // this.setDateService.setDate
        let periodStartDate = (this.seesion.getData("periodStartDate"));
        let periodEndDate = (this.seesion.getData("periodEndtDate"));
        this.getkpi(period, periodStartDate, periodEndDate,);
      }
    })
  }

  getkpi(period, startDate, endDate) {
    this.ChartsData = [];
    if (this.agent.Agent() && this.agent.Agent().agentId) {
      this._apki.AqkpiList(this._user.UserId(), period, startDate, endDate, 0, this.agent.Agent().agentId, "")
        .subscribe(data => {

          if (data && data.data && data.data.charts) {
            let seriesForNb = data.data.charts[0].nbPremiumsChart;
            let seriesForRN = data.data.charts[0].rnPremiumsChart;
            let seriesForTI = data.data.charts[0].totalIndications;
            let seriesforquotes = data.data.charts[0].totalQuotes;

            /* 
                        if (seriesForNb.some(item => item.value > 0)) {
                          let chartForNB = this.chartService.getCharts('column', 'Total New Business Premium', seriesForNb.map(val => val.month), seriesForNb.map(val => val.value));
                          Highcharts.chart(this.chartContainer1.nativeElement, chartForNB);
                        } else {
                          this.chartContainer1.nativeElement.innerHTML = `<p class="noRecordMessage">No Record Found</p>`;
                        }
            
                        if (seriesforquotes.some(item => item.value > 0)) {
                          let chartForFQ = this.chartService.getCharts('column', 'Total New Business Premium', seriesforquotes.map(val => val.month), seriesforquotes.map(val => val.value));
                          Highcharts.chart(this.chartContainer2.nativeElement, chartForFQ);
                        } else {
                          this.chartContainer2.nativeElement.innerHTML = `<p class="noRecordMessage">No Record Found</p>`;
                        }
            
                        if (seriesForTI.some(item => item.value > 0)) {
                          let chartForTI = this.chartService.getCharts('column', 'Total New Business Premium', seriesForTI.map(val => val.month), seriesForTI.map(val => val.value));
                          Highcharts.chart(this.chartContainer3.nativeElement, chartForTI);
                        } else {
                          this.chartContainer3.nativeElement.innerHTML = `<p class="noRecordMessage">No Record Found</p>`;
                        } */


            /*  this.ChartsData.push(this.chartService.getCharts('line', 'Total Quotes', seriesforquotes.map(val => val.month), seriesforquotes.map(val => val.value)));
             this.ChartsData.push(this.chartService.getCharts('scatter', 'Total Indication', seriesForTI.map(val => val.month), seriesForTI.map(val => val.value)));
 
 
             Highcharts.chart(this.chartContainer2.nativeElement, this.ChartsData[1]);
             Highcharts.chart(this.chartContainer3.nativeElement, this.ChartsData[2]); */

            let chartForNB = this.chartService.getCharts('column', 'Total New Business Premium', seriesForNb.map(val => val.month), seriesForNb.map(val => val.value));
            Highcharts.chart(this.chartContainer1.nativeElement, chartForNB);

            let chartForFQ = this.chartService.getCharts('line', 'Total Quotes', seriesforquotes.map(val => val.month), seriesforquotes.map(val => val.value));
            Highcharts.chart(this.chartContainer2.nativeElement, chartForFQ);

            let chartForTI = this.chartService.getCharts('scatter', 'Total Indication', seriesForTI.map(val => val.month), seriesForTI.map(val => val.value));
            Highcharts.chart(this.chartContainer3.nativeElement, chartForTI);
          }
        })
    } else {
      this._router.navigate['/'];
    }
  }


}
