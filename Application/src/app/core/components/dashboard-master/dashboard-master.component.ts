import { Component, OnInit } from '@angular/core';
import { AQRoleInfo, AQAgentInfo, AQUserInfo } from '@agenciiq/login';
import { Router } from '@angular/router';
import { AQSession } from 'src/app/global-settings/session-storage';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { Roles } from 'src/app/global-settings/roles';

@Component({
  selector: 'app-dashboard-master',
  templateUrl: './dashboard-master.component.html',
  styleUrls: ['./dashboard-master.component.sass'],
  standalone: false
})
export class DashboardMasterComponent implements OnInit {

  isAgent: boolean = false;
  identifier: any = "";
  email: any = "";
  name: any = "";
  userid: any = "";
  //reset :any ="enable";
  portallink: boolean = true;
  agentInfo: any = "";
  isOpen: boolean = false;
  isFQOpen: boolean = true;

  constructor(
    private _role: AQRoleInfo,
    private user: AQUserInfo,
    private _agentInfo: AQAgentInfo,
    private _router: Router,
    private _session: AQSession,
    private _checkroleService: CheckRoleService
  ) {
    this.isAgent = this._checkroleService.isRoleCodeAvailable(Roles.Agent.roleCode, this._role.Roles());
    let host = window.location.host;
    if (host.includes('localhost')) {
      host = 'convelo.agenciiq.net';
    }
    this.identifier = host; //'insur.agenciiq.net';//
    this.agentInfo = this._agentInfo.Agent();
    this.userid = this.user.UserId();
    if (this.agentInfo) {
      this.name = `${this.agentInfo.firstName ? this.agentInfo.firstName : ''} ${this.agentInfo.middleName ? this.agentInfo.middleName : ''} ${this.agentInfo.lastName ? this.agentInfo.lastName : ''}`
    }
    this.email = this.agentInfo.email;
  }

  ngOnInit() {

  }

  NavigateToPortal(event: any) {
    this._session.removeSession('viewPolicyParams');
    this._session.removeSession('insuredReqObj');
    this._session.removeSession('IsNavigationFromFQ');
    this.isOpen = false;
    sessionStorage.setItem('IsNavigationFrom', "true");
    this._router.navigateByUrl('agenciiq/workbook/quickquote');
  }

  NavigateToPortalFQ(event: any) {
    this._session.removeSession('viewPolicyParams');
    this._session.removeSession('insuredReqObj');
    this.isOpen = false;
    sessionStorage.setItem('IsNavigationFromFQ', "true");
    sessionStorage.setItem('IsNavigationFrom', "true");
    this._router.navigateByUrl('agenciiq/workbook/quickquote');
  }

}
