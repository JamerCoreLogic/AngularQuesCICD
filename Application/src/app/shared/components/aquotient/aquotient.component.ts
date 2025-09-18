import { Component, OnInit, OnDestroy } from '@angular/core';
import { AQQuotient, KpiService } from '@agenciiq/aqkpi';
import { PeriodSettings } from 'src/app/global-settings/periodSetting';
import { Router } from '@angular/router';
import { AQAgentInfo, AQUserInfo } from '@agenciiq/login';

@Component({
  selector: 'app-aquotient',
  templateUrl: './aquotient.component.html',
  styleUrls: ['./aquotient.component.sass'],
  standalone: false
})
export class AQuotientComponent implements OnInit, OnDestroy {

  quotientData: any;
  tempData = '[{"performanceMeasureId":44,"performanceMeasureName":"Me","agentId":16,"performanceMeasurePeriod":"Month","aqkpi":true,"value":"0","growth":"NA","growthFlag":"NA"},{"performanceMeasureId":45,"performanceMeasureName":"Agency","agentId":16,"performanceMeasurePeriod":"Month","aqkpi":true,"value":"0","growth":"NA","growthFlag":"NA"},{"performanceMeasureId":46,"performanceMeasureName":"Peers","agentId":16,"performanceMeasurePeriod":"Month","aqkpi":true,"value":"0","growth":"NA","growthFlag":"NA"}]';

  constructor(
    private quotiont: AQQuotient,
    private periodSetting: PeriodSettings,
    private _router: Router,
    private _apki: KpiService,
    private agent: AQAgentInfo,
    private _user: AQUserInfo
  ) { }

  ngOnInit() {
    this.subscribePeriod();
    this.quotientData = JSON.parse(this.tempData);
  }

  ngOnDestroy() {

  }

  subscribePeriod() {
    this.periodSetting.period.subscribe(period => {

      this.getkpi(period);
    })
  }

  generateArray(num) {
    if (num > 0) {
      return new Array(Math.round(num)).slice(0, 5);
    }

  }



  getkpi(period) {
    if (this.agent.Agent() && this.agent.Agent().agentId) {

      this._apki.getQuotionData().subscribe(resp => {
        this.quotientData = resp;

      })
    } else {
      this._router.navigate['/'];
    }
  }
}
