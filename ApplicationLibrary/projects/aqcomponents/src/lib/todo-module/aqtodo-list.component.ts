import { Component, OnInit, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';

@Component({
    selector: 'lib-aqtodo-list',
    template: `
  <div class="page-content-left">
  <div class="pcl-header">
      <div class="todoList-heading">
          <h4>My Diary</h4>
      </div>
      <div class="todoList-notification">
          <div class="todoList-filter">
          </div>
          <!----<span>
              <img src="assets/images/notify.png">
          </span>-->
         <!-- <span (click)="onResize()">
              <img style="cursor:pointer" [src]="iconUrl">
          </span> 
          <span *ngIf="TodoSummary" class="notify_count">{{TodoSummary['count']}}</span>-->
      </div>
      <div class="todo-search">
          <input type="text" class="greybg-input" placeholder="Search" (keyup)="filter($event.target.value)">
      </div>
  </div>
  <ng-container *ngFor="let item of TodoList">
  <div (click)="todoView.emit(item)" class="pcl-todoList">
      <div class="singletoDoList">
        <div class="todoList-para">
          <h4>
            <span>{{item.lob}}</span>
            <span style="padding-left: 15px;/* color: #0078ff; */">{{item.state}}</span>
            
            <ng-container *ngTemplateOutlet="transactionCode, context: {data : item}"></ng-container>   
          </h4>
          <h4>
            <span style="/* padding-left: 10px; */color: #0078ff;"><strong>{{item.ref}}</strong></span>
            <span class="todolist_status"><strong style="margin-left:3px">{{item.currentStatus}}</strong></span>
          </h4>
          <h4 style="font-weight:bold;font-size: 12px;color: #000;">{{item.insuredName}}</h4>
          <p style="font-size: 11px;margin-bottom: 0px;">{{item.note}}</p>
          <p style="padding-bottom:0px">
            <span style="color: #000;font-weight: 600;font-weight: 11px; float:left;">{{item.agentName}}</span>
            <span style="float: right;margin-right: 0px;">{{item.createdOn | date:'MM/dd/yyyy'}}</span>
          </p>
        </div>
        <div class="todoList-more">
            <img src="assets/images/more.png">
        </div>
        <!--
        <div class="todoList-icon bgorange">
              E
          </div>
          <div class="todoList-para">
              <h4>{{item.insuredName}}</h4>
              
              <span class="todolist_status">Status <strong>{{item.currentStatus}}</strong></span>
              <p><span><strong>{{item.ref}}</strong></span>
              <span  *ngIf="isOn">Agent Name <strong>{{item.agentName}} </strong></span>
              <span *ngIf="isOn">Effective Date <strong>{{item.effectiveDate | date:'MM/dd/yyyy'}} </strong></span>
              <span *ngIf="isOn">Expiration Date <strong>{{item.expiryDate | date:'MM/dd/yyyy'}} </strong></span>
              <span *ngIf="isOn">Years Insured <strong>{{item.yearsInsured}} </strong></span>
              <span *ngIf="isOn">Alfred Alerts <span *ngFor="let alfred of item.alerts"><img [src]="alfred.iconURL"/></span></span>
              </p>
          </div>
          <div class="todoList-more">
              <img src="assets/images/more.png">
          </div>
        -->
      </div>
  </div>
  </ng-container> 
  <ng-container *ngIf="IsNoRecordFound">
    <p class="noRecordMessage">No Record Found</p>
  </ng-container>
</div>
  `,
    styles: [],
    standalone: false
})
export class AQTodoListComponent {

  TodoList: any[] = [];
  ColumnsList: any[] = [];
  TodoSummary: any;
  private dataAll: any[] = [];
  isOn = false;
  iconUrl = "assets/images/todo_share.png";
  IsNoRecordFound: boolean = false;
  @ContentChild('transactionCode', { static: false }) transactionCode: TemplateRef<any>;
  
  @Input('TodoList')
  set todoList(list: any[]) {
    if (list && list.length > 0) {
      this.TodoList = list;
      this.dataAll = list;
      this.IsNoRecordFound = false;
    } else {
      this.IsNoRecordFound = true;
    }
  }

  @Input('IsNoRecordFound') set isNoRecordFound(value:boolean){
    this.IsNoRecordFound = value;
  }

  @Input('ColumnList') set columns(cols: any[]) {
    if (cols && cols.length > 0) {
      this.ColumnsList = cols;
    }
  }

  @Input('TodoSummary') set todoSummary(summary: any) {
    if (summary) {
      this.TodoSummary = summary[0];
    }
  }  

  @Output('TodoView') todoView = new EventEmitter();
  @Output('onResize') size = new EventEmitter<any>();


  filter(filterValue) {
    this.TodoList = this.filterData(filterValue).length > 0 ? this.filterData(filterValue) : null;
    if(this.TodoList && this.TodoList.length){
      this.IsNoRecordFound = false;
    } else {
      this.IsNoRecordFound = true;
    }
  }

  private filterData(filterValue) {
    if (this.dataAll && this.ColumnsList) {
      return this.dataAll.filter(item => {
        return this.ColumnsList.some(key => {
          return String(item[key]).toLowerCase().includes(filterValue.toLowerCase());
        });
      });
    }
  }
  onResize() {
    this.isOn = !this.isOn;
    this.isOn ? this.iconUrl = 'assets/images/todo_share_1.png' : this.iconUrl = 'assets/images/todo_share.png';
    this.size.emit(this.isOn);
  }
}
