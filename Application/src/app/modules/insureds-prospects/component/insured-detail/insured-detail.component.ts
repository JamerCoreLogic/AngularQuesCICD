import { Component, OnInit } from '@angular/core';
import { AQSession } from 'src/app/global-settings/session-storage';

@Component({
  selector: 'app-insured-detail',
  templateUrl: './insured-detail.component.html',
  styleUrls: ['./insured-detail.component.sass'],
  standalone: false
})
export class InsuredDetailComponent implements OnInit {
  insuredDetail: any;
  FormDefinition: any;

  constructor(private _session: AQSession) { }

  ngOnInit() {
    this.insuredDetail = this._session.getData("insuredDetails");
    this.FormDefinition = this.insuredDetail?.formDefinition;
  }

}
