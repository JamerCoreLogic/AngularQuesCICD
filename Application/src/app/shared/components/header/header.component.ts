import { Component, OnInit, HostListener } from '@angular/core';
import { AQLogoutService, AQUserInfo, AQAgentInfo, AQAgencyInfo, AQRightsInfo, AQRoleInfo } from '@agenciiq/login';
import { Router } from '@angular/router';
import { PopupService } from '../../utility/Popup/popup.service';
import { MainMenuList } from '../../../global-settings/menulist';
import { GetConfigurationService } from "@agenciiq/aqadmin";
import { environment } from '../../../../environments/environment';
import { error } from 'protractor';
import { IAgent } from '@agenciiq/login/lib/interfaces/base-login-resp';
import { MsalService } from '@azure/msal-angular';
import { PeriodSettings } from 'src/app/global-settings/periodSetting';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
  standalone: false
})
export class HeaderComponent implements OnInit {
  env = environment
  username: string;
  agentInfo: IAgent;
  agencyName: String;
  private headerMenu: MainMenuList = new MainMenuList();
  menuList: any[];
  SettingMenu: boolean = false;
  rights: any[] = [];
  mgaName: string;
  mgaLogo: any;
  aqLogo: any;
  constructor(
    private _logout: AQLogoutService,
    private _userInfo: AQUserInfo,
    private _agentInfo: AQAgentInfo,
    private _agencyInfo: AQAgencyInfo,
    private _router: Router,
    private _popup: PopupService,
    private _roles: AQRoleInfo,
    private _rightsInfo: AQRightsInfo,
    private _mgaConfiguration: GetConfigurationService,
    private msalService: MsalService,
    private period: PeriodSettings
  ) {

  }

  ngOnInit() {
    this.getAgentInfo();
    this.getAgencyName();
    this.menuList = this.getMenuList();

    /* Rights */
    this.RightsInfo();
    this.getMGAConfiguration();
  }

  getMGAConfiguration() {
    this._mgaConfiguration.GetConfiguration().subscribe(mgaConfig => {
      this.mgaName = mgaConfig.data.mgaConfiguration.name;
      this.mgaLogo = mgaConfig.data.mgaConfiguration.logoURL;
      this.aqLogo = mgaConfig.data.mgaConfiguration.aqLogoURL
    })
  }


  RightsInfo() {
    this.rights = this._rightsInfo.Rights();
    // this.rights.push(
    // {
    //   "roles": [
    //     418
    //   ],
    //   "screenId": 7,
    //   "description": "other screens",
    //   "routing": "agenciiq/other-screens",
    //   "menuOrder": 5,
    //   "rights": [
    //     {
    //       "rightId": 1,
    //       "rightName": "View"
    //     },
    //     {
    //       "rightId": 2,
    //       "rightName": "Edit"
    //     },
    //     {
    //       "rightId": 3,
    //       "rightName": "Delete"
    //     },
    //     {
    //       "rightId": 4,
    //       "rightName": "Add"
    //     }
    //   ]
    // }
    // )
  }

  getAgencyName() {
    this.agencyName = this._agencyInfo.AgencyName()
  }

  getAgentInfo() {
    this.agentInfo = this._agentInfo.Agent();
    if (this.agentInfo) {
      this.username = `${this.agentInfo.firstName ? this.agentInfo.firstName : ''} ${this.agentInfo.middleName ? this.agentInfo.middleName : ''} ${this.agentInfo.lastName ? this.agentInfo.lastName : ''}`
    }
  }

  logOut() {
    /* this._popup.show('Logout', 'Do you want to logout?'); */
    /* this._popup.response.subscribe(data => {
      if (data) { */
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: '/', // Change this to your login or landing page if needed
    });

    this._logout.Logout().subscribe(resp => {
      // this._router.navigateByUrl('/');
    }, (error: any) => {
      console.log("err", error);
    }, () => { })

    /*     }
      }) */
  }

  hideSettingMenu(url) {
    this.SettingMenu = false;
    if (url == 'agenciiq/workbook') {
      localStorage.removeItem('period');
      localStorage.removeItem('workboardstatus');
      this.period.SetPeriod = ""
    }
    this._router.navigateByUrl(url);
  }

  getMenuList() {

    if (this.headerMenu?.HeaderMenuList && this._roles.Roles()) {
      return this.headerMenu.HeaderMenuList.filter(item =>
        this._roles.Roles().some((role) =>
          item.roles.some((_role) =>
            _role == role.roleCode)))
    }

  }

  OpenSettingMenu() {
    if (this.SettingMenu == false) {
      this.SettingMenu = true;
    } else if (this.SettingMenu == true) {
      this.SettingMenu = false;
    }
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    if (targetElement.id == 'settinIcon') {
      this.OpenSettingMenu();
    } else {
      this.SettingMenu = false;
    }
  }

}
