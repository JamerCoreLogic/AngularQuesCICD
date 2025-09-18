import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQRoleInfo } from '@agenciiq/login';
import { Router, NavigationEnd, NavigationStart, NavigationError } from '@angular/router';
import { Roles } from 'src/app/global-settings/roles';

@Component({
  selector: 'app-agent-master',
  templateUrl: './agent-master.component.html',
  styleUrls: ['./agent-master.component.sass'],
  standalone: false
})
export class AgentMasterComponent implements OnInit {

  roleCode: string;
  IsInnerHeader: boolean = false;
  currentUrl: string;

  constructor(
    private _loaderService: LoaderService,
    private _roleInfo: AQRoleInfo,
    private _router: Router
  ) {
    _loaderService.hide();
  }

  ngOnInit() {
    this.checkURL();
  }


  checkURL() {
    this.roleCode = this._roleInfo.Roles()[0]?.roleCode;
    if ((this.roleCode == Roles.AgencyAdmin.roleCode || this.roleCode == Roles.SystemAdmin.roleCode) && this._router.url == '/agenciiq/users') {
      this.IsInnerHeader = true;
    }
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if ((this.roleCode == Roles.AgencyAdmin.roleCode || this.roleCode == Roles.SystemAdmin.roleCode) && event.url == '/agenciiq/users') {
          this.IsInnerHeader = true;
        } else {
          this.IsInnerHeader = false;
        }
      }
    });
  }


}
