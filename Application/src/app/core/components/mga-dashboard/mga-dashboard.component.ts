import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mga-dashboard',
  templateUrl: './mga-dashboard.component.html',
  styleUrls: ['./mga-dashboard.component.sass'],
  standalone: false
})
export class MgaDashboardComponent implements OnInit {

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
