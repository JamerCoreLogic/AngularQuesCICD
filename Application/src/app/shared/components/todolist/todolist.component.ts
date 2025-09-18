import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AQRoutesNavSettings } from '../../../global-settings/route-nav-setting';
import { TodoListService } from '@agenciiq/aqtodo';
import { AQUserInfo, AQAgentInfo, AQAgencyInfo } from '@agenciiq/login';
import { LoaderService } from '../../utility/loader/loader.service';
import { Router } from '@angular/router';
import { AQSession } from 'src/app/global-settings/session-storage';
import { SessionIdList } from 'src/app/global-settings/session-id-constraint';
import { TransactionCodeMaster } from 'src/app/global-settings/transactionCodeList';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectTodoLists, selectTodoLoading } from 'store/selectors/myDiary.selectors';
import { loadTodoList } from 'store/actions/myDiary.action';
import { CheckRoleService } from '../../services/check-role/check-role.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.sass'],
  standalone: false
})
export class TodolistComponent implements OnInit {

  workbook = AQRoutesNavSettings.Agent.quotes;
  todoDataSource$: Observable<any[]>;
  private TodoListSubscription: Subscription;

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
    public transactionCodeMaster: TransactionCodeMaster,
    private store: Store,
    private _checkRoleService: CheckRoleService,
  ) { }

  ngOnInit() {
    this._checkRoleService.addNewMyDiarySubject
      .pipe(take(1))
      .subscribe(value => {
        if (value === 'AddMyDiary') {
          this.store.dispatch(loadTodoList({
            userId: this.userInfo.UserId(),
            agentId: this.agentInfo.Agent().agentId,
            agencyId: 0,
            date: new Date()
          }));
          this._checkRoleService.addNewMyDiarySubject.next('');
        }
      });

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


  // getTodoList() {
  //   this.todoLists = [];
  //   // this.loaderService.show();
  //   this.todolistService.todo_list(this.userInfo.UserId(), this.agentInfo.Agent().agentId, 0, new Date()).subscribe(data => {
  //     // this.loaderService.hide();
  //     if (data?.data?.toDoLists) {
  //       this.IsNoRecordFound = false;
  //       this.todoLists = data.data.toDoLists;
  //       // this.todoSummary = data.data.taskSummaries;
  //     }
  //   },
  //     err => {
  //       // this.loaderService.hide();
  //       this.IsNoRecordFound = true;
  //       console.log("err", err);
  //     },
  //     () => {
  //       //  this.loaderService.hide();
  //     })

  // }


  getTodoList() {
    this.todoDataSource$ = this.store.select(selectTodoLists);
    this.TodoListSubscription?.unsubscribe();

    this.todoLists = [];
    // this.loaderService.show();
    //this.todolistService.todo_list(this.userInfo.UserId(), this.agentInfo.Agent().agentId, 0, new Date()).subscribe(data => {
    this.TodoListSubscription = this.todoDataSource$.pipe().subscribe((data: any) => {
      if (!data || !data.success) {
        this.store.dispatch(loadTodoList({
          userId: this.userInfo.UserId(),
          agentId: this.agentInfo.Agent().agentId,
          agencyId: 0,
          date: new Date()
        }));
      }
      // this.loaderService.hide();
      if (data?.data?.toDoLists) {
        this.IsNoRecordFound = false;
        this.todoLists = data.data.toDoLists;
        // this.todoSummary = data.data.taskSummaries;
      }
    },
      err => {
        // this.loaderService.hide();
        this.IsNoRecordFound = true;
        console.log("err", err);
      },
      () => {
        //  this.loaderService.hide();
      })

    // this.store.select(selectTodoLoading).subscribe(isLoading => {
    //   if (isLoading) {
    //     this.loaderService.show();
    //   } else {
    //     this.loaderService.hide();
    //   }
    // });

  }

  todoView(quote: any) {
    if (quote?.quoteId) {
      //this.session.removeSession(SessionIdList.WorkBoardStatus);
      //localStorage.setData("quoteId",quote.quoteId);
      this._checkRoleService.fromDiarySubject.next('fromDiary');
      this.session.setData(SessionIdList.AlfredAlertsRefenceId, quote.quoteId);
      this.router.navigate(['agenciiq/workbook']);
    }
  }

  onResize(evt: any) {
    this.toggleTodoExpand.emit(evt);
  }



}
