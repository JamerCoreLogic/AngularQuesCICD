import { Component, OnInit } from '@angular/core';
import { TodoListService } from '@agenciiq/aqtodo';
import { AQUserInfo, AQAgentInfo, AQAgencyInfo } from '@agenciiq/login';
import { AQAlfredAlertsService } from '@agenciiq/aqalfred';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { Router } from '@angular/router';
import { AQSession } from 'src/app/global-settings/session-storage';
import { AQRoutesNavSettings } from 'src/app/global-settings/route-nav-setting';
import { SessionIdList } from 'src/app/global-settings/session-id-constraint';

@Component({
  selector: 'app-agentdashboard',
  templateUrl: './agentdashboard.component.html',
  styleUrls: ['./agentdashboard.component.sass'],
  standalone: false
})
export class AgentdashboardComponent implements OnInit {

  todoLists: any;
  todoSummary: any;
  columnList = ['ref', 'insuredName', 'currentStatus'];
  isAlfredAlertsExpanded: boolean = false;
  chatBotShow = false;
  ChatbotsActive: boolean = false;
  evt: boolean = false;

  constructor(
    private todolistService: TodoListService,
    private userInfo: AQUserInfo,
    private agentInfo: AQAgentInfo,
    private agencyInfo: AQAgencyInfo,
    private loaderService: LoaderService,
    private router: Router,
    private session: AQSession
  ) { }

  ngOnInit() {
    if (this.userInfo.UserId() && this.agentInfo.Agent().agentId && this.agencyInfo.Agency().agencyId) {
      this.getTodoList();
    } else {
      this.router.navigate(['/']);
    }
  }

  toggleAlfredExpand(value) {
    this.isAlfredAlertsExpanded = value;
  }

  getTodoList() {
    this.loaderService.show();
    this.todolistService.todo_list(this.userInfo?.UserId(), this.agentInfo?.Agent()?.agentId, this.agencyInfo?.Agency()?.agencyId, "2019-10-10")
      .subscribe(data => {
        if (data && data.data && data.data.taskSummaries && data.data.toDoLists) {
          this.todoLists = data.data.toDoLists;
          this.todoSummary = data.data.taskSummaries;
        }
        this.loaderService.hide();
      },
        err => {
          this.loaderService.hide();
        },
        () => {
          this.loaderService.hide();
        })
  }

  todoView(reference: any) {
    if (reference) {
      this.session.setData(SessionIdList.AlfredAlertsRefenceId, reference);
      this.router.navigate(['/agent/workbook']);
    }
  }




  onResize(evt) {
    this.evt = evt;

  }


}
