import { Component, OnInit, OnDestroy } from '@angular/core';
import { AQAgencyService } from '@agenciiq/agency';
import { Router } from '@angular/router';
import { AQUserInfo, AQAgencyInfo, AQRoleInfo, AQAgentInfo } from '@agenciiq/login';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { Subscription } from 'rxjs';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { Roles } from 'src/app/global-settings/roles';
import { AQSession } from 'src/app/global-settings/session-storage';

@Component({
  selector: 'app-agencylist',
  templateUrl: './agencylist.component.html',
  styleUrls: ['./agencylist.component.css'],
  standalone: false
})
export class AgencylistComponent implements OnInit, OnDestroy {

  dataSource = [];
  NoRecordsMessage: string | null = null;
  Pagination: any;
  ColumnList: string[] = [];
  upload: boolean = false;
  sortedColumnName: {
    columnName: string;
    isAsc: boolean;
  } | null = null;
  flag: boolean = true;
  viewMode: "list" | "add" | "edit" | 'branch' = "list";
  agencyType = 'register';

  isAddAgency: boolean = false;

  private agencyId: number;

  private agentId: Number;

  private agencyListSubscription: Subscription
  registerType: any;
  agencyData: any;

  constructor(
    private _agencyService: AQAgencyService,
    private _agencyInfo: AQAgencyInfo,
    private _agentInfo: AQAgentInfo,
    private _router: Router,
    private _user: AQUserInfo,
    private _loader: LoaderService,
    private _role: AQRoleInfo,
    private _checkRoleService: CheckRoleService,
    private _aqSession: AQSession,
  ) {

    if (this._checkRoleService.isRoleCodeAvailable(Roles.MGAAdmin.roleCode, this._role.Roles())) {
      this.isAddAgency = true;
    } else {
      this.isAddAgency = false;
    }
    this.agencyId = this._agencyInfo.Agency() && this._agencyInfo.Agency().agencyId ? this._agencyInfo.Agency().agencyId : 0;
    this.agentId = this._agentInfo.AgentId() && this._agentInfo.AgentId() ? this._agentInfo.AgentId() : 0;
  }

  ngOnInit() {

    this.agencyData = this._aqSession.getData('_agencyData');
    this._aqSession.removeSession('_agencyData');
    sessionStorage.removeItem('_agencyId');
    sessionStorage.removeItem('_newBranchList');
    sessionStorage.removeItem('_tempId');
    if ((this.agencyData && this.agencyData.agencyType == 'register') || this.agencyData == null) { this.agencyType = 'register'; this.getAgencyList('Yes'); }
    else { this.agencyType = 'unRegister'; this.getAgencyList('No'); }

  }

  ngOnDestroy() {
    if (this.agencyListSubscription) {
      this.agencyListSubscription.unsubscribe();
    }
  }

  getAgencyList(registerType) {


    this.agencyType = registerType == 'Yes' ? 'register' : 'unRegister';
    this.registerType = registerType;
    let agencyData = {
      'agencyType': this.agencyType,
      'registerType': this.registerType
    }
    this._aqSession.setData('_agencyData', agencyData);
    this._loader.show();
    this.agencyListSubscription = this._agencyService.NewAgencyList(this._user.UserId(), this.agencyId, this.agentId)
      .subscribe(agencyList => {

        this._loader.hide();
        if (agencyList && agencyList.data && agencyList.data.agencyList) {
          this.ColumnList = Object.keys(agencyList.data.agencyList[0]);
          this.dataSource = agencyList.data.agencyList.filter(item => { return item.registered == registerType });
          //.map((item) => item.agency);
          this.sortedColumnName = { 'columnName': 'agencyName', isAsc: this.flag };
          this.NoRecordsMessage = "";
        } else {
          this.NoRecordsMessage = "No Record Found.";
        }
      }, (err) => {
        this._loader.hide();
      }, () => {
        this._loader.hide();
      });
  }


  sortAgents(columnName: any) {
    this.flag = !this.flag;
    this.sortedColumnName = { 'columnName': columnName, isAsc: this.flag };
  }

  EditAgency(agencyId: string) {
    let agencyData = {
      'agencyType': this.agencyType,
      'registerType': this.registerType
    }
    this._router.navigateByUrl('agenciiq/agencies/addagency');
    sessionStorage.setItem('_agencyId', agencyId);
    this._aqSession.setData('_agencyData', agencyData);
  }

  AddAgency() {
    this._router.navigateByUrl('agenciiq/agencies/addagency');
  }

  Events(event) {
    this.viewMode = event;
  }
}
