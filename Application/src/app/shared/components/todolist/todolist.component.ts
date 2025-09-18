import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AQRoutesNavSettings } from '../../../global-settings/route-nav-setting';
import { TodoListService } from '@agenciiq/aqtodo';
import { AQUserInfo, AQAgentInfo, AQAgencyInfo } from '@agenciiq/login';
import { LoaderService } from '../../utility/loader/loader.service';
import { Router } from '@angular/router';
import { AQSession } from 'src/app/global-settings/session-storage';
import { SessionIdList } from 'src/app/global-settings/session-id-constraint';
import { TransactionCodeMaster } from 'src/app/global-settings/transactionCodeList';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.sass'],
  standalone: false
})
export class TodolistComponent implements OnInit {

  workbook = AQRoutesNavSettings.Agent.quotes;

  todoLists: any;
  todoSummary: any;
  columnList = ['ref', 'insuredName', 'currentStatus'];
  evt: boolean = false;
  IsNoRecordFound: boolean = false;
  @Output('toggleTodoExpand') toggleTodoExpand = new EventEmitter();

  constructor(
    private todolistService: TodoListService,
    private userInfo: AQUserInfo,
    private agentInfo: AQAgentInfo,
    private agencyInfo: AQAgencyInfo,
    private loaderService: LoaderService,
    private router: Router,
    private session: AQSession,
    public transactionCodeMaster: TransactionCodeMaster
  ) { }

  ngOnInit() {
    if (this.userInfo && this.userInfo.UserId() && this.agentInfo.Agent() && this.agentInfo.Agent().agentId) {
      this.getTodoList();
    } else {
      this.router.navigate(['/']);
    }
    let ele = document.getElementsByClassName('page-content-left') as HTMLCollectionOf<HTMLElement>
    let Rightele = document.getElementsByClassName('page-content-right dashboard_wb') as HTMLCollectionOf<HTMLElement>
    let headerEle = document.getElementsByClassName('todoList-heading') as HTMLCollectionOf<HTMLElement>
    if (ele && window.location.host.includes('convelo') || window.location.host.includes('local')) {
      ele[0].style.height = 'calc(100vh - 145px)'
      Rightele[0].style.padding = '10px 10px 15px 10px'
      headerEle[0].innerHTML = `<h4>Reminders</h4>`
    }
  }


  getTodoList() {

    this.todoLists = [];
    // this.loaderService.show();
    this.todolistService.todo_list(this.userInfo.UserId(), this.agentInfo.Agent().agentId, 0, new Date())
      .subscribe(data => {
        // this.loaderService.hide();
        if (data && data.data && data.data.toDoLists) {
          this.IsNoRecordFound = false;
          this.todoLists = data.data.toDoLists;
          // this.todoSummary = data.data.taskSummaries;
        }
      },
        err => {
          // this.loaderService.hide();
          this.IsNoRecordFound = true;
        },
        () => {
          //  this.loaderService.hide();
        })

  }





  todoView(quote) {
    if (quote && quote.quoteId) {
      //this.session.removeSession(SessionIdList.WorkBoardStatus);
      //localStorage.setData("quoteId",quote.quoteId);
      this.session.setData(SessionIdList.AlfredAlertsRefenceId, quote.quoteId);
      this.router.navigate(['agenciiq/workbook']);
    }
  }




  onResize(evt) {
    this.toggleTodoExpand.emit(evt);
  }



}
