import { Component, OnInit } from "@angular/core";
import { MgaConfigService } from '../../../mga-config/src/lib/services/mga-config.service';
import { AQQuotesListService } from 'projects/aqquotes/src/lib/services/quotes-list/aqquotes-list.service';
import { QuotesApi } from 'projects/aqquotes/src/lib/classes/quotes-api';
import { Subscription } from 'rxjs';
import { BusinessTransferService, BusinessTransferApi } from 'projects/aqbusinesstransfer/src/public-api';


@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    standalone: false
})
export class AppComponent implements OnInit {
  title = "testApp";


  
  roleCode: string;
  identifier: any = "";
  email: any = "";
  name: any = "";
  //reset :any ="enable";
  portallink: boolean = true;
  agentInfo: any = "";
  isOpen: boolean = false;



  optionList;
  checkBoxName = 'name';
  checkBoxValue = 'value';

  private _userId = 16;
  private _agencyId = 2;
  private _agentId = 16;
  private _ClientID = 1;
  // {"AgentId":16,"UserId":16,"AgencyId":2,"ClientID":1}

  dataSource: any;
  url: any;

  QuotesColumnList = ['ref', 'insuredName', 'lob', 'agentName', 'effectiveDate', 'endorsementDate', 'yearsInsured'];

  NoRecordsMessage: any;

  constructor(
    private _quotesService: AQQuotesListService,
    private quoteApi: QuotesApi,
    private _businessTranferService: BusinessTransferService,
    private businessTransferAPI : BusinessTransferApi,
    
  ) {
    this.url = "http://10.130.205.163:8080"//"http://united.agenciiq.net"
    this.quoteApi.QuotesApiEndPoint = this.url;
    this.businessTransferAPI.BusinessApiEndPoint = this.url;
  }

  HideAdvFilterOption: boolean = false;
  subscriptions$: Subscription;
  SortingOrder: string = "DESC";
  CurrentPageNumber: number = 1;
  SearchText: string = "";
  SortedColumn: string = "";
  PageSize: string = "10";
  FilterOpen: string
  isFilterFlag;
  flag;
  alfredFlagListChecked;
  totalItem;

  isCheckboxEnable: boolean = true;
  agentList:any[] = []
  isHeaderChkSelected: boolean = false;
  transferToAgentId: number;

  ngOnInit() {
    this.getQuoteList();
    this.getAgents();
  }



  clearAllFilter() {
    this.clearAdvanceFilterForm();
  }

  clearAdvanceFilterForm() {
    this.isFilterFlag = false;
    this.flag = false;
    this.alfredFlagListChecked = []; 
    this.HideAdvFilterOption = true;   
    //this.getQuoteList();  
    this.getQuoteList();
    
  }

  getAdvanceFilter(value) {
    this.FilterOpen = value;
    this.HideAdvFilterOption = false;
  }

  SearchQuote(seacrhText) {
    this.SearchText = seacrhText;
    this.getQuoteList();
  }

  NewPage(pageNumber) {
    this.CurrentPageNumber = pageNumber;
    this.getQuoteList();
  }
  order = true;
  sortQuotes(columnName) {
    this.SortedColumn = columnName;
    if (this.SortingOrder == 'DESC') {
      this.SortingOrder = "ASC";
    } else {
      this.SortingOrder = 'DESC';
    }
    this.getQuoteList();
  }

  ChangePageSize(pageSize) {
    this.PageSize = pageSize;
    this.getQuoteList();
  }


  getQuoteList() {
    if (this.subscriptions$) {
      this.subscriptions$.unsubscribe();
    }

    let reqObj = {
      "AgentId": 13,
      "UserId": 13,
      "AgencyId": 2,
      "PageNumber": this.CurrentPageNumber,
      "PageSize": this.PageSize,
      "SortingOrder": this.SortingOrder,
      "SortingColumn": this.SortedColumn,
      "SearchText": this.SearchText,
    }
    this.subscriptions$ = this._quotesService.QuotesViewList(reqObj, true)
      .subscribe(data => {
        console.log(data);
        if (data && data[0].data && data[0].data.quote) {
          // this.Isvisible = true;
          this.dataSource = data[0].data.quote;
          this.totalItem = data[1].totalQuote;
          //this.sortedColumnName = { 'columnName': 'quoteId', isAsc: this.flag }; 
          console.log("this.dataSourceNew34", this.dataSource);
          this.NoRecordsMessage = '';
        } else {
          // this.Isvisible = false;
          this.NoRecordsMessage = 'No records found!';
        }
      },
        err => {
          //this.loaderService.hide();
        },
        () => {
          // this.loaderService.hide();
        });
  }

  SelectedListOutput(event) {
    
    console.log(event);
  }


  getAgents() {
    this._businessTranferService.GetAgents(13, 13)
      .subscribe(resp => {
        let agents: any[] = resp.data.agentsList;
        let filteredAgentList = agents.map(agent => {
          return {
            agentId: agent.agentId,
            agentName: agent.firstName + " " + agent.middleName + " " + agent.lastName
          }
        });

        this.agentList = filteredAgentList;
      }, (err) => {
       
      })
  }

  setTransferToAgentId(agentId: number) {

    this.transferToAgentId = agentId;

  }
  
  finalQuotationIds;
  transferToAgentName;
  transferMessage;
  transferFrmAgentId;
  setFinalTransferQuotesId(quotationIds: string) {

    this.finalQuotationIds = quotationIds;
  }
  setTransferToAgentName(agentName: string) {
    this.transferToAgentName = agentName;

  }
  setTransferMessage(transferMessage: string) {

    this.transferMessage = transferMessage;
  }
  transferBusiness() {
    
    let message = '', quotationCount = 0;

    if (this.finalQuotationIds != "") {

      if (this.finalQuotationIds.indexOf(',') > -1) {
        quotationCount = this.finalQuotationIds.split(',').length;
      }
      else {
        quotationCount = 1;
      }
    }
/* 
    const ref = this.dialogService.open(BusinessTransferDialogComponent, {
      data: `${this.transferMessage} will be transferred to ${this.transferToAgentName}`
    }); */
/* 
    ref.afterClosed.subscribe(data => {

      

      if (data != null) {

        

        this._businessTranferService.TransferBusiness(this._userId, this.transferFrmAgentId, this.transferToAgentId, this.finalQuotationIds)
          .subscribe(data => {
            
            if (data && data.success) {
              this.isTransferred = true;
              
              this.getQuoteList();
            }
          }, (err) => {
            
          }, () => {
            
          })
        this.clearAdvanceFilterForm();
      }
    }) */
  }


}


