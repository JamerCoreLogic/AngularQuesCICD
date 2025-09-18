import { Component, HostListener, OnInit } from '@angular/core';
import { AQLogoutService, AQUserInfo, AQAgentInfo, AQAgencyInfo } from '@agenciiq/login';
import { Router } from '@angular/router';
import { PopupService } from '../../utility/Popup/popup.service';
import { IPopup } from '../../utility/Popup/popup';
import { MainMenuList } from '../../../global-settings/menulist';
import { AQRoleInfo } from "@agenciiq/login";
import { IconSettings, IIconList, ICON_STATUS } from 'src/app/global-settings/icon-settings';
import { Roles } from 'src/app/global-settings/roles';
import { GetConfigurationService } from '@agenciiq/aqadmin';
import { CancelButtonService } from 'src/app/shared/services/cancelButtonSerrvice/cancelButton.service'
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-outer-header',
  templateUrl: './outer-header.component.html',
  styleUrls: ['./outer-header.component.sass'],
  standalone: false
})
export class OuterHeaderComponent implements OnInit {

  env = environment;
  username: string;
  agentInfo;
  agencyName: String;
  private headerMenu: MainMenuList = new MainMenuList();
  menuList: any[];
  SettingMenu: boolean = false;
  homeIconStatus: ICON_STATUS;
  logoutIconStatus: ICON_STATUS;
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
    private _iconSetting: IconSettings,
    private _mgaConfiguration: GetConfigurationService,
    private cancelButtonService: CancelButtonService
  ) { }

  ngOnInit() {
    this.getAgentInfo();
    this.getAgencyName();
    this.getHomeIconStatus();
    this.menuList = this.getMenuList();
    this.getMGAConfiguration();
  }

  getHomeIconStatus() {
    this._iconSetting.IconSettingStatus().subscribe((icons: IIconList) => {
      this.homeIconStatus = icons.homeIcon;
      this.logoutIconStatus = icons.logoutIcon;
    })
  }

  getAgencyName() {
    this.agencyName = this._agencyInfo.AgencyName()
  }

  getMGAConfiguration() {
    this._mgaConfiguration.GetConfiguration().subscribe(mgaConfig => {
      this.mgaName = mgaConfig.data.mgaConfiguration.name;
      this.mgaLogo = mgaConfig.data.mgaConfiguration.logoURL;
      this.aqLogo = mgaConfig.data.mgaConfiguration.aqLogoURL
    })
  }

  redirectToHome() {

    this.cancelButtonService.NavigateToHome();
    // let role = this._roles.Roles()[0].roleCode;
    // if(role == Roles.MGAAdmin.roleCode) {
    //   this._router.navigateByUrl('/agenciiq/agencies');
    // } else if(role == Roles.AgencyAdmin.roleCode || role ==  Roles.SystemAdmin.roleCode) {
    //   this._router.navigateByUrl('/agenciiq/users');
    // } else {
    //   this._router.navigateByUrl('/agenciiq');
    // }
  }

  getAgentInfo() {
    this.agentInfo = this._agentInfo.Agent();
    if (this.agentInfo) {
      this.username = `${this.agentInfo.firstName ? this.agentInfo.firstName : ''} ${this.agentInfo.middleName ? this.agentInfo.middleName : ''} ${this.agentInfo.lastName ? this.agentInfo.lastName : ''}`
    }
  }

  logOut() {
    this._logout.Logout().subscribe(resp => {
      this._router.navigateByUrl('/');
    });

  }

  hideSettingMenu(url) {
    this.SettingMenu = false;
    this._router.navigateByUrl(url);
  }

  getMenuList() {
    if (this.headerMenu && this.headerMenu.HeaderMenuList && this._roles.Roles()) {
      return this.headerMenu.HeaderMenuList.filter(item =>
        this._roles.Roles().some((role) => item.roles.some((_role) => _role == role.roleCode)))
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
