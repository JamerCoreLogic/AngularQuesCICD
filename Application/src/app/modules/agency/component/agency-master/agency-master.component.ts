import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQRoleInfo } from '@agenciiq/login';
import { Router, NavigationEnd } from '@angular/router';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { Roles } from 'src/app/global-settings/roles';


@Component({
  selector: 'app-agency-master',
  templateUrl: './agency-master.component.html',
  styleUrls: ['./agency-master.component.sass'],
  standalone: false
})
export class AgencyMasterComponent implements OnInit {

  roleCode: string;
  IsInnerHeader: boolean = false;

  constructor(
    private _loaderService: LoaderService,
    private _roleRoleInfo: AQRoleInfo,
    private _router: Router,
    private _checkRoleService: CheckRoleService
  ) {
    _loaderService.hide();
  }

  ngOnInit() {
    this.checkURL();
  }



  checkURL() {

    this.roleCode = this._roleRoleInfo?.Roles()[0]?.roleCode;
    let roles = this._roleRoleInfo?.Roles();
    // if (this.roleCode == 'MGAAdmin' && this._router.url == '/agenciiq/agencies'){
    if (this._checkRoleService.isRoleCodeAvailable(Roles.Underwriter.roleCode, roles)
      || this._checkRoleService.isRoleCodeAvailable(Roles.UnderwriterAssistant.roleCode, roles)
      || this._checkRoleService.isRoleCodeAvailable(Roles.UWManager.roleCode, roles)
      || this._checkRoleService.isRoleCodeAvailable(Roles.UWSupervisior.roleCode, roles)) {
      this.IsInnerHeader = false;
    }
    else if (this._checkRoleService.isRoleCodeAvailable(Roles.MGAAdmin.roleCode, roles)) {
      this.IsInnerHeader = true;
    }

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // if (this.roleCode == 'MGAAdmin' && event.url == '/agenciiq/agencies') {
        if (this._checkRoleService.isRoleCodeAvailable(Roles.Underwriter.roleCode, roles)
          || this._checkRoleService.isRoleCodeAvailable(Roles.UnderwriterAssistant.roleCode, roles)
          || this._checkRoleService.isRoleCodeAvailable(Roles.UWManager.roleCode, roles)
          || this._checkRoleService.isRoleCodeAvailable(Roles.UWSupervisior.roleCode, roles)) {
          this.IsInnerHeader = false;
        }
        else if (this._checkRoleService.isRoleCodeAvailable(Roles.MGAAdmin.roleCode, roles) && event.url == '/agenciiq/agencies') {
          this.IsInnerHeader = true;
        } else {
          this.IsInnerHeader = false;
        }
      }
    });
  }



}
