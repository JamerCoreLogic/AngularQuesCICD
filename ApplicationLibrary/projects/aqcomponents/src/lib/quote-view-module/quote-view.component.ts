import { Component, OnInit, Input, TemplateRef, ContentChild, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { PaginationService } from './pagination.service';
import { pipe } from 'rxjs';
// import { FilterService } from './filter.service';
// import { SortingService } from './sorting.service';

@Component({
  selector: 'lib-quote-view',
  template: `
  <div class="ql-cont-inner">
  <div class="qlist-table-header">
    <div class="qth-left">
      <span *ngIf="Pagination"><input type="text" class="greybg-input" placeholder="Search" [(ngModel)]="searchText" (keyup)="searchEmit(searchText)" /></span>
    </div>
    <div  class="qth-right">
    <span *ngIf="AdvanceFilterEnabled" class="advancefilterbtn" (click)="clearAll()" style="margin-left:16% !important;">Clear Filter</span>        
      <span *ngIf="AdvanceFilterEnabled" class="advancefilterbtn" (click)="OpenFilter()">Advanced Filter</span> 
          <div *ngIf="IsCheckboxEnable" class="business-search" style="display:inline-block; width:431px; float:left; margin-left: 240px;">
            <div class="form-group" style="display: inline-block; width: 216px;float: left;margin-left: 95px;line-height: 8px; text-align:left; margin-top:7px; position: relative">
          <label class="textbox_borderlabel" style="position: absolute;left: -5rem;top: 14px;padding: 0; color: #212529 !important">Transfer to</label>
          <select class="form-control dropdown_border" [(ngModel)]="selectedAgent"  (change)="selectAgent($event.target.value)" style="height:32px; margin-top:-4px; padding-top:5px;">
            <option value='0' selected>Select</option> 
            <option *ngFor="let agent of AgentList" [value]="agent.agentId">{{agent.agentName}}</option>
          </select>
        </div>
        <button *ngIf="IsCheckboxEnable" [ngClass]="{disabledButton:!isValidTransfer}" [disabled]="!isValidTransfer" type="submit" (click)="transferBusiness()" class="btn-theme fix_width" style="display: inline-block;float: left; margin-left: 35px; margin-top: 5px;">
                        Transfer
        </button>
      </div>   

      <div *ngIf="!FilterOpen && Pagination" class="show-record">
        <lib-row-count [RowCountList]="rowCountList" [pageItemCount]="pageItemCount" (OutputRowCount)="setPageItemCount($event)"></lib-row-count>
      </div>

    </div>
  </div>
  <!-- Business Transfer -->
  

 
  <ng-container *ngTemplateOutlet="AdvanceFilter"></ng-container>      

  <div class="overlay-filter" *ngIf="FilterOpen"></div>
  <table class="quote-table row-border hover">
    <thead>
      <tr>
      <th> 
      <div class="styled-checkbox" *ngIf="IsCheckboxEnable &&  DataSource?.length > 0">
          <div class="checkboxgrid">             
              <input type="checkbox" id="SelectAll" [checked]="selectHeader"  (change)="selectAllBusinessTransfer($event.target.checked)" >
              <label for="SelectAll">
                  <div class="checkercheckboxgrid"></div>
              </label>
          </div>
      </div>
   </th>
        <ng-container *ngTemplateOutlet="DataViewHeading"> </ng-container>             
      </tr>
    </thead>
    <tbody>
    <ng-container *ngIf="PageItems">
    <ng-container *ngFor="let item of PageItems; let i = index">
      <tr class="main-row">
       
        <td>
            <span  *ngIf="item.data && IsCheckboxEnable==false" class="expandable-icon" (click)="ExpandTable(i)">
              <img [src]="isActive != i? 'assets/images/tableplus.png' : 'assets/images/tableminus.png'"/>
            </span>
            
            <div class="styled-checkbox" *ngIf="IsCheckboxEnable && DataSource?.length > 0">
              <div class="checkboxgrid">
                  
                  <input type="checkbox" [id]="item.quoteId" [checked]="getHeaderChkStatus(item.quoteId)" (change)="setHeaderCheckbox($event.target.checked,item.quoteId,item.agentId)">
                  <label [for]="item.quoteId">
                      <div class="checkercheckboxgrid"></div>
                  </label>
              </div>
          </div>
        </td>
        <ng-container *ngTemplateOutlet="DataViewContent, context: {data : item}"></ng-container>                   
      </tr>
      <ng-container *ngIf="item.data">
      <tr class="table-row-expandable" *ngIf="isActive == i">
        <td colspan="9">
          <table class="quote-table-inner">
            <thead>
              <tr>
                <th></th>
                <ng-container *ngTemplateOutlet="DataViewInnerHeading"></ng-container>                     
              </tr>
            </thead>
            <tbody>
            <ng-container *ngFor="let inneritem of item.data; let i = index">
              <tr *ngIf="inneritem['isActive']">
                  <ng-container *ngTemplateOutlet="DataViewInnerLink, context: {innerdata : inneritem, item: item}"></ng-container>               
              <ng-container *ngTemplateOutlet="DataViewInnerContent, context: {innerdata : inneritem}"></ng-container>                    
              </tr>
             </ng-container>
            </tbody>
          </table>
        </td>
      </tr>
      </ng-container>
      </ng-container>
      </ng-container>
    </tbody>     
  </table>       
  
 <div class="qlist-table-footer">    
  <p class="noRecordMessage">{{PageItemsMessage}}</p>       
  <ng-container *ngIf="Pagination">
    <lib-pagination [Pager]="pager" (OutputPage)="setPageEvent($event)"></lib-pagination>
  </ng-container>         
  </div>        
</div>   
  `,
  styles: [`
  .aq-data-view-cover {
    position: absolute;
    top: 48px;
    bottom: 0;
    left: 0;
    right: 0;
    background: #faf9f9b5;
    z-index: 1071;
  }
  `],
  standalone: false
})
export class QuoteViewComponent implements OnInit, OnChanges {

  isActive = -1;
  FilterOpen = false;
  rowCountList: any[] = [10, 20, 50];
  pager: any;
  pageItemCount: number;
  DataSource: any[] = [];
  DataSourceTemp: any[] = [];
  PageItems: any[] = [];
  ColumnList: any[] = [];
  Pagination = false;
  HideAdvanceFilterOption: boolean = false;
  AdvanceFilterEnabled: boolean = false;
  isAcsending: boolean = true;
  CheckedItems: any[] = [];
  transferToAgent: string;
  isValidTransfer: boolean = false;
  resetAgent: boolean = true;
  selectedAgentId: number;
  selectedAgentName: string;
  selectedAgent: any = "";
  distinctFromAgents: any[];
  searchText: any;
  TotalItems: number = 0;
  private sortedColumnName: string;
  private currentPage: number = 1;

  @Input('Pagination') set setPagination(pagiantion: boolean) {

    if (pagiantion !== undefined) {
      this.Pagination = pagiantion;
    }
  }


  @Input('NoRecordsMessage') PageItemsMessage: string;

  @Input('ColumnList') set setColumnList(cols: any[]) {
    if (cols && cols.length) {
      this.ColumnList = cols;
    }
  }

  @Input('TotalItems') set totalItems(_totalItems: number) {
    this.TotalItems = _totalItems;
  }

  @Input('HideAdvanceFilterOption') set setAdvanceFilter(option) {
    if (this.FilterOpen && option) {
      this.OpenFilter();
    }
  }

  @Input('AdvanceFilterEnabled') set setAdvanceFilterEnabled(value: boolean) {
    this.AdvanceFilterEnabled = value;
  }

  @Input('SortingColumn') set setSortingColumn(columnName: string) {

    this.sortedColumnName = columnName;
  }

  @Input('DataSource') set setDataSource(data: any[]) {
    if (data && data.length) {
      this.DataSourceTemp = data;
      this.DataSource = data;
      this.setPage(this.currentPage);
      this.createCheckList(this.DataSource);
      this.createSelectAgentsList();
    } else {
      this.PageItems = [];
      this.DataSource = [];
      this.DataSourceTemp = [];
      this.pager = null;
    }
    if (this.HideAdvanceFilterOption && this.OpenFilter) {
      this.OpenFilter();
    }
  }

  @Output('OutputAdvanceFilter') advanceFilterEmit = new EventEmitter();
  @Output('OutputClearAllFilter') clearAllFilter = new EventEmitter();

  @ContentChild('DataViewHeading', { static: false }) DataViewHeading: TemplateRef<any>;
  @ContentChild('DataViewContent', { static: false }) DataViewContent: TemplateRef<any>;
  @ContentChild('DataViewInnerHeading', { static: false }) DataViewInnerHeading: TemplateRef<any>;
  @ContentChild('DataViewInnerContent', { static: false }) DataViewInnerContent: TemplateRef<any>;
  @ContentChild('AdvanceFilter', { static: true }) AdvanceFilter: TemplateRef<any>;
  @ContentChild('DataViewInnerLink', { static: false }) DataViewInnerLink: TemplateRef<any>;



  //@ViewChild('hdChk', { static: true }) headerChk: ElementRef;

  //-------24/12/2019-------

  //isHeaderChecked: boolean = false;

  public ControlType: string = "";
  @Input('ControlType') set setControlType(ctrlType: string) {
    this.ControlType = ctrlType;
  }

  @Input() IsCheckboxEnable: boolean = false;

  @Input()
  AgentList: any[] = [];

  @Input()
  IsHeaderChkSelected: boolean = false;


  @Output()
  SelectHeaderChk = new EventEmitter<boolean>();

  /*   @Input() CheckedItems: any[] = []; */

  //@Input()
  //TransferFrmAgentId: number;

  transferToAgentId: number;

  @Output()
  TransferToAgentId = new EventEmitter<number>();

  @Output()
  FinalTransferQuotesId = new EventEmitter<string>();

  @Output()
  TransferBusiness = new EventEmitter<any>();

  @Output()
  TransferToAgentName = new EventEmitter<string>();

  selectHeader: boolean = false;

  @Output()
  TransferFrmAgentId = new EventEmitter<string>();

  @Output()
  TransferFrmAgentName = new EventEmitter<string>();

  @Output()
  TransferViewPolicyParam = new EventEmitter<any>();

  @Output()
  TransferMessage = new EventEmitter<any>();

  @Output() NewPage = new EventEmitter<any>();

  @Output() SearchQuote = new EventEmitter<any>()

  @Output() ChangePageSize = new EventEmitter<any>();

  //@ViewChild('chk1', { static: true }) headerChk1: ElementRef;
  //@ViewChild('hdChk2', { static: true }) headerChk2: ElementRef;

  constructor(
    private pagerService: PaginationService,
    // private filterService: FilterService,
    // private sortingService: SortingService,

  ) { }

  ngOnInit() {

  }


  setPageEvent(pageNumber) {
    this.currentPage = pageNumber;
    this.isActive = -1;
    this.NewPage.emit(pageNumber);

  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log("SimpleChanges", changes)
    let tempDatasource;
    if (changes.setSortingColumn && !changes.setSortingColumn.firstChange) {
      this.isAcsending = changes.setSortingColumn.currentValue['isAsc'];
      if (changes.setSortingColumn.currentValue && changes.setSortingColumn.previousValue) {
        if (changes.setSortingColumn.currentValue['columnName'] == (changes.setSortingColumn.previousValue && changes.setSortingColumn.previousValue['columnName'])) {
          //this.isAcsending = !this.isAcsending;
          //tempDatasource = this.sortingService.SortData(changes.setSortingColumn.currentValue['columnName'], this.isAcsending, this.DataSource);
        } else {
          //tempDatasource = this.sortingService.SortData(changes.setSortingColumn.currentValue['columnName'], true, this.DataSource);
        }
      } else {
        //tempDatasource = this.sortingService.SortData(changes.setSortingColumn.currentValue['columnName'], this.isAcsending, this.DataSource);
      }

      this.DataSource = tempDatasource;
      this.DataSourceTemp = tempDatasource;
      this.setPage(1);
    } else {

    }
  }


  ExpandTable(i) {
    if (this.isActive == i) {
      this.isActive = -1;
    } else {
      this.isActive = i;
    }
  }

  OpenFilter() {
    if (this.FilterOpen === false) {
      this.FilterOpen = true;
    } else if (this.FilterOpen === true) {
      this.FilterOpen = false;
    }
    this.advanceFilterEmit.emit(this.FilterOpen);
  }

  clearAll() {

    this.searchText = "";
    this.selectedAgent = 0;
    this.clearAllFilter.emit();
  }


  setPage(page: number) {
    if (this.DataSource) {
      if (this.Pagination) {
        let pageSize: number = 0;
        if (this.DataSource[0] && this.DataSource[0].totalQuote) {
          pageSize = this.DataSource[0].totalQuote;
        } else {
          pageSize = this.TotalItems;
        }
        this.pager = this.pagerService.getPager(pageSize, page, this.pageItemCount);
        this.PageItems = this.DataSource.slice(this.pager.startIndex, this.pager.endIndex + 1);
      } else {
        this.PageItems = this.DataSource;
      }
    }
  }

  SortData(value) {
    if (value !== '#') {
      this.DataSource.sort((a, b) => {
        const isAsc = true;
        return this.compare(a[value], b[value], isAsc);
      })
    }
  }

  private compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // filter(filterValue) {
  //   
  //   let filterdData: any[] = this.filterService.filterData(this.DataSourceTemp, this.ColumnList, filterValue);
  //   this.DataSource = filterdData.length > 0 ? filterdData : null;
  //   this.PageItems = this.DataSource;
  //   if (this.DataSource && this.DataSource.length) {
  //     this.PageItemsMessage = "";
  //   } else {
  //     this.PageItemsMessage = "No Record Found.";
  //   }
  //   this.setPage(1);
  // }

  searchEmit(searchtext) {
    this.currentPage = 1;
    this.SearchQuote.emit(searchtext);
  }


  setPageItemCount(pageItemCount) {
    this.currentPage = 1;
    this.pageItemCount = parseInt(pageItemCount);
    this.ChangePageSize.emit(this.pageItemCount);
  }
  //-------24/12/2019-------
  getCheckedItemsCount() {

    return this.CheckedItems.filter(item => item.checked == true).length;

  }
  setHeaderCheckbox(isContentChkSelected: boolean, quoteId: number, agentId: number) {

    this.CheckedItems = this.CheckedItems.map(checkBox => {
      if (checkBox.quoteId == quoteId) {
        checkBox.checked = isContentChkSelected
      }
      return checkBox
    });

    let checkedItemsCount = this.getCheckedItemsCount();
    this.isValidTransfer = (checkedItemsCount > 0 && this.transferToAgentId > 0) ? true : false;

    if (this.CheckedItems.length > 0) {

      if (checkedItemsCount == this.DataSource.length) {
        this.selectHeader = true;
      }
      else {
        this.selectHeader = false;
      }
    }

    //-------------------------------

    let selectedAgentsCounter = this.CheckedItems.filter(x => x.agentId == agentId && x.checked == true).length;

    this.distinctFromAgents.map((element, index) => {

      if (element.agentId == agentId) {
        this.distinctFromAgents[index].counter = selectedAgentsCounter;
      }
    })


    //---------------------------
  }

  selectAgent(agentId: number) {


    this.isValidTransfer = (this.getCheckedItemsCount() > 0 && agentId > 0) ? true : false;
    this.transferToAgentId = agentId;
    if (agentId > 0)
      this.transferToAgent = this.AgentList.find(el => el.agentId == agentId).agentName;

  }
  transferBusiness() {


    if (this.CheckedItems.length > 0) {
      let selectedQuotes = this.CheckedItems.filter(item => item.checked == true).map(item => {
        return item.quoteId
      }).join(',');

      if (selectedQuotes != "") {
        //console.log("selectedQuotes",selectedQuotes);
        //console.log("this.CheckedItems",this.CheckedItems);
        this.TransferToAgentId.emit(this.transferToAgentId);
        this.FinalTransferQuotesId.emit(selectedQuotes);
        this.TransferToAgentName.emit(this.transferToAgent);

        let fromAgents = this.distinctFromAgents.filter(agent => agent.counter > 0);

        let message = fromAgents.reduce((accumulator, currentval, index) => {
          return index == 0 ? `${currentval.counter} item(s) from ${currentval.agentName}` :
            accumulator + `, ${currentval.counter}  item(s) from ${currentval.agentName}`

        }, '')


        let fromAgentIds: string = fromAgents.map(element => element.agentId).join(',');
        this.TransferFrmAgentId.emit(fromAgentIds);
        this.TransferMessage.emit(message);


        this.TransferBusiness.emit();
        this.selectedAgent = 0;

      }
    }
  }
  cancelAdvanceFilterForm() {

    this.AdvanceFilterEnabled = false;
    this.OpenFilter();


  }

  selectAllBusinessTransfer(isHeaderChkSelected: any) {

    this.selectHeader = !this.selectHeader;
    this.CheckedItems = this.DataSource.map(_data => {
      return { 'quoteId': _data.quoteId, 'checked': this.selectHeader, 'agentId': _data.agentId }
    })
    this.IsHeaderChkSelected = isHeaderChkSelected;

    this.isValidTransfer = (this.getCheckedItemsCount() > 0 && this.transferToAgentId > 0) ? true : false;

    this.distinctFromAgents = this.distinctFromAgents.map((element, index) => {

      return {
        agentId: element.agentId,
        counter: this.CheckedItems.filter(data => data.agentId === element.agentId && data.checked == true).length,
        agentName: element.agentName
      }

    })

  }
  ngAfterViewInit() {

    this.resetAgent = true;
    this.selectedAgent = 0;
  }
  createCheckList(dataSource: any[]) {


    this.CheckedItems = [];
    this.CheckedItems = this.DataSource.map(data => {
      return { 'quoteId': data.quoteId, 'checked': false, 'agentId': data.agentId }
    })

    this.isValidTransfer = false;
    this.selectHeader = false;

  }
  getHeaderChkStatus(quoteId: number): boolean {
    if (this.selectHeader) {
      return true;
    }
    else {
      if (this.CheckedItems.length > 0) {
        let item = this.CheckedItems.find(item => item.quoteId == quoteId);
        return item.checked;
      }

    }

  }

  // setViewPolicyData(quoteId: number, formId: number, item, actionName: string) {

  //   this.TransferViewPolicyParam.emit({ 'quoteId': quoteId, 'formId': formId, 'actionName': actionName })

  // }

  createSelectAgentsList() {

    this.distinctFromAgents = Array.from(new Set(this.DataSource.map(x => x.agentId)))
      .map(id => {
        return {
          agentId: id,
          counter: 0,
          agentName: this.DataSource.find(nm => nm.agentId === id).agentName
        }
      });


  }


}
