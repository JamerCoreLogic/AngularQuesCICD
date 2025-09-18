import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'lib-row-count',
    template: `
  <span>Show</span>
  <select (change)="rowcount.emit($event.target.value)" [(ngModel)]="pageItemCount" >
      <option *ngFor="let count of countList"  [selected]="count == pageItemCount">{{count}}</option>
  </select>
  `,
    styles: [],
    standalone: false
})
export class RowCountComponent implements OnInit {

  countList: any[] = [];
  pageItemCount:number = 10;

  @Input('RowCountList') set rowCount(count: any[]) {
    if (count && count.length) {
      this.countList = count;
    }
  }

  @Input('pageItemCount') set setpageItemCount(pageItemCount: number) {
    if (pageItemCount ) {
      this.pageItemCount = pageItemCount;
    }
  }

  @Output('OutputRowCount') rowcount = new EventEmitter();

  chagneCount(value){
    console.log(value);
  }

  constructor() { }

  ngOnInit() {
  }

}
