import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'lib-aqstate-auto-complete',
    template: `
  <input list="browsers" name="states">
  <datalist id="states">
    <option *ngFor="let state of stateList" value="Internet Explorer">   
  </datalist>
  `,
    styles: [],
    standalone: false
})
export class AQStateAutoCompleteComponent implements OnInit {

 stateList: any[] = [];

  @Input("StateList") set setStateList(stateList: any[]) {
    if (stateList.length) {
      this.stateList = stateList;
    }
  }

  @Output('SelectState') seletedState = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
