import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-system-admin-dashboard',
  templateUrl: './system-admin-dashboard.component.html',
  styleUrls: ['./system-admin-dashboard.component.sass'],
  standalone: false
})
export class SystemAdminDashboardComponent implements OnInit {

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
