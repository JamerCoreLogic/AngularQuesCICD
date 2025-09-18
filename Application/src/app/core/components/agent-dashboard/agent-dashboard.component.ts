import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.sass'],
  standalone: false
})
export class AgentDashboardComponent implements OnInit {

  isAlfredAlertsExpanded: boolean = false;
  evt: boolean = false;
  identifier: any
  constructor() { }

  ngOnInit() {
    let host = window.location.host;
    if (host.includes('localhost')) {
      host = 'convelo.agenciiq.net';
    }
    this.identifier = host;
  }

  toggleTodoExpand(evt: boolean) {
    this.evt = evt;
  }

  toggleAlfredExpand(value: boolean) {
    this.isAlfredAlertsExpanded = value;
  }

}
