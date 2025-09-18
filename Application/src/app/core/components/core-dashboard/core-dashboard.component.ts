import { Component, OnInit } from '@angular/core';
import { AQRoleInfo } from '@agenciiq/login';
import { Router } from '@angular/router';
import { Roles } from '../../../global-settings/roles';

@Component({
  selector: 'app-core-dashboard',
  templateUrl: './core-dashboard.component.html',
  styleUrls: ['./core-dashboard.component.sass'],
  standalone: false
})
export class CoreDashboardComponent implements OnInit {

  roles: string;
  StaticRole: Roles;
  agencyAdmin: string;
  systemAdmin: string;
  agent: string;
  manager: string;
  supervisor: string;
  mgaAdmin: string;
  Underwriter: string;
  UnderwriterAssistant: string;
  UWManager: string;
  UWSupervisior: string;

  constructor(
    private _roleInfo: AQRoleInfo,
    private _router: Router
  ) {
    this.agencyAdmin = Roles.AgencyAdmin.roleCode;
    this.systemAdmin = Roles.SystemAdmin.roleCode;
    this.agent = Roles.Agent.roleCode;
    this.manager = Roles.Manager.roleCode;
    this.supervisor = Roles.Supervisor.roleCode;
    this.mgaAdmin = Roles.MGAAdmin.roleCode;
    this.Underwriter = Roles.Underwriter.roleCode;
    this.UnderwriterAssistant = Roles.UnderwriterAssistant.roleCode;
    this.UWManager = Roles.UWManager.roleCode;
    this.UWSupervisior = Roles.UWSupervisior.roleCode;
  }

  ngOnInit() {
    this.getRoles();
  }

  getRoles() {
    if (this._roleInfo?.Roles()[0]?.roleCode) {
      this.roles = this._roleInfo?.Roles()[0]?.roleCode;
      //alert(this.roles);
    } else {
      this._router.navigateByUrl("/");
    }
  }

}
