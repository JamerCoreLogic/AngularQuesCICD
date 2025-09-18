import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { AlfredAlretsPaginationService } from './alfred-alrets-pagination.service';

@Component({
    selector: 'lib-alfred-alrets',
    template: `
  <div class="page-content-right">
  <div class="alfred-alerts-header">
      <div class="alfred-alerts-heading">
          <h4>Alfred Alerts <span class="alfred_icon"><img src="assets/images/alfred_alerts.png"></span>  
          <span class="alfred-alert-pagination" *ngIf="pager">{{pager.startIndex + 1}} to {{pager.endIndex + 1}} of {{pager.totalItems}}
          <span class="arrow" (click)="setPage(pager.currentPage - 1)"><</span><span  class="arrow" (click)="setPage(pager.currentPage + 1)">></span></span>
          </h4>
      </div>      
      <div class="alfred-alerts-header-right">
          <div class="todo-search">
              <input type="text" class="greybg-input" (keyup)="filter($event.target.value)" placeholder="Search">
          </div> 
          <div  class="alfred-toggle-button">
            <span *ngIf="isExpanded" (click)="toggleEmit()">
              <img *ngIf="viewMode == 'grid'" src="assets/images/gridview.png"/>
              <img *ngIf="viewMode == 'list'" src="assets/images/listview.png"/>
            </span>
          </div>        
         <!-- <span (click)="expandToggle()">
              <img [src]="iconUrl">
          </span> -->
      </div>
    </div>
      <div class="pcr-block" *ngIf = "!IsAlfredExpand">
          <div [ngClass]="{'alfred-alerts-container': viewMode == 'grid', 'alfred-alerts-container-block' : viewMode == 'list'}" class="alfred-alerts-container">         
              <div [ngClass]="{'alfred-alert-item': viewMode == 'grid', 'alfred-alert-item_block' : viewMode == 'list'}" *ngFor="let item of PageItems" (click)="viewAlerts.emit(item)">
              <ng-container *ngTemplateOutlet="alfredAlertsItem;  context: {alfredAlertsItem : item}">
          
              </ng-container>                 
              </div>  
              <ng-container *ngIf="IsNoRecordFound">
              <p class="noRecordMessage">No Record Found</p>
            </ng-container>           
          </div>          
      </div>
      <div class="pcr-block" *ngIf = "IsAlfredExpand">
          <div [ngClass]="{'alfred-alerts-container-expand': viewMode == 'grid', 'alfred-alerts-container-block' : viewMode == 'list'}" class="alfred-alerts-container">         
              <div [ngClass]="{'alfred-alert-item': viewMode == 'grid', 'alfred-alert-item_block' : viewMode == 'list'}" *ngFor="let item of PageItems" (click)="viewAlerts.emit(item.ref)">
              <ng-container *ngTemplateOutlet="alfredAlertsItem;  context: {alfredAlertsItem : item}">
          
              </ng-container>                 
              </div>  
              <ng-container *ngIf="IsNoRecordFound">
              <p class="noRecordMessage">No Record Found</p>
            </ng-container>           
          </div>          
      </div>
  </div>

`,
    standalone: false
})
export class AlfredAlretsComponent implements OnInit {

  DataSource: any[] = [];
  DataSourceTemp: any[] = [];
  PageItems: any[] = [];
  ColumnList: any[] = [];
  pager: any;
  viewMode = "list";
  isExpanded: boolean = false;
  iconUrl = "assets/images/todo_share.png"
  pageSize: number = 12;
  IsNoRecordFound: boolean = false;
  IsAlfredExpand:boolean = false;

  @Input('DataSource') set setDataSource(data: any[]) {
    
    if (data && data.length) {
      this.DataSource = data;
      this.DataSourceTemp = data;
      this.ColumnList = Object.keys(data[0]);
      //this.subColList = Object.keys(data[0]);
      this.setPage(1)
      this.IsNoRecordFound = false;
    } else {
      this.setPage(1)
      this.IsNoRecordFound = true;
    }
  }

  @Input('PageSize') setPageSize(page: number) {
    
    
    this.pageSize = page;
    this.setPage(1);
  }

  @Input('ViewMode') set setViewMode(mode: any) {
    if (mode) {
      this.viewMode = mode;
    }
  }

  @Output('ViewAlerts') viewAlerts = new EventEmitter();
  @Output('ToggleViewMode') ViewToggle = new EventEmitter();
  @Output('ToggleExpand') expandView = new EventEmitter();

  @ContentChild('alfredAlertsItem', { static: false }) alfredAlertsItem: TemplateRef<any>;

  constructor(
    private pagination: AlfredAlretsPaginationService
  ) { }

  ngOnInit() {
    
  }

  toggleEmit() {
    if (this.viewMode == 'list') {
      this.viewMode = 'grid';
      this.ViewToggle.emit('grid');
    } else {
      this.viewMode = 'list';
      this.ViewToggle.emit('list');
    }
  }

  setPage(page: number) {
    
    this.pager = this.pagination.getPager(this.DataSource.length, page, this.pageSize);
    this.PageItems = this.DataSource.slice(this.pager.startIndex, this.pager.endIndex + 1);
    console.log("this.pager",this.pager);
    console.clear();
  }

  filter(filterValue) {
    let filterdData: any[] = this.filterData(this.DataSourceTemp, this.ColumnList, filterValue);
    console.log("filterdData",filterdData);
    this.DataSource = filterdData.length > 0 ? filterdData : null;
    this.PageItems = this.DataSource;
    if (this.DataSource && this.DataSource.length) {
      this.IsNoRecordFound = false;
    } else {
      this.IsNoRecordFound = true;
    }
    this.setPage(1);
  }

  filterData(DataSource: any[], ColumnList: any[], filterValue: string) {
    
    return DataSource.filter(item => {
      console.log("DataSource",DataSource);
      return ColumnList.some(key => {
        let Checked;
        if(Array.isArray(item[key])) {
          let subColumnList =["description"];
          console.log("subColumnList",subColumnList);
           let arrayItem = item[key];
           arrayItem.filter(el=>{
            subColumnList.some(col=>{
              console.log("el[col]",el[col]);
              Checked =  String(el[col]).toLowerCase().includes(filterValue.toLowerCase());
             //return String(el[col]).toLowerCase().includes(filterValue.toLowerCase())
            })
          })
          } 
        else {
            console.log("keys",item[key]);
             //return
              Checked = String(item[key]).toLowerCase().includes(filterValue.toLowerCase())
          }
          return Checked;
      })
    })
  }

  expandToggle() {
    this.isExpanded = !this.isExpanded;
    this.IsAlfredExpand = this.isExpanded;
    this.isExpanded ? this.iconUrl = 'assets/images/todo_share_1.png' : this.iconUrl = 'assets/images/todo_share.png';
    this.expandView.emit(this.isExpanded);
    if(this.IsAlfredExpand == true){
      this.pageSize = 15;
      this.setPage(1)
    }
    else{
      this.pageSize = 8;
      this.setPage(1)
    }
  }

}
