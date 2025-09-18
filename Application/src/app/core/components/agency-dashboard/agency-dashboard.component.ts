import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agency-dashboard',
  templateUrl: './agency-dashboard.component.html',
  styleUrls: ['./agency-dashboard.component.sass'],
  standalone: false
})
export class AgencyDashboardComponent implements OnInit {

  isAlfredAlertsExpanded: boolean = false;
  evt: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleTodoExpand(evt: boolean) {
    this.evt = evt;
  }

  toggleAlfredExpand(value: boolean) {
    this.isAlfredAlertsExpanded = value;
  }
}
