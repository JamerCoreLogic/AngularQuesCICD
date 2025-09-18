import { AQUserInfo } from '@agenciiq/login';
import { MgaConfigService } from '@agenciiq/mga-config';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { environment } from 'src/environments/environment';
import { loadMGAConfig } from 'store/actions/agent-dashboard.action';
import { selectMGAConfig, selectMGAConfigLoading } from 'store/selectors/agent-dashboard.selectors';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.sass'],
  standalone: false
})
export class AgentDashboardComponent implements OnInit {

  isAlfredAlertsExpanded: boolean = false;
  environment = environment;
  evt: boolean = false;
  identifier: any;
  userId: number;
  MGAConfigdata: any;
  mgaStateList: any[] = [];
  LobList: any[] = [];
  constructor(
    private _userInfo: AQUserInfo,
    private _mgaConfig: MgaConfigService,
    private store: Store,
    private _loader: LoaderService,
  ) {
    this.userId = this._userInfo.UserId();
  }

  ngOnInit() {
    this.GetMGAConfig(this.userId);
    let host = window.location.host;
    if (host.includes('localhost')) {
      host = 'convelo.agenciiq.net';
    }
    this.identifier = host;
  }

  toggleTodoExpand(evt: boolean) {
    this.evt = evt;
  }

  toggleAlfredExpand(value: boolean) {
    this.isAlfredAlertsExpanded = value;
  }

  // GetMGAConfig(userId: number) {
  //   this._mgaConfig.MGADetails(userId)?.subscribe(MGAConfig => {
  //     if (MGAConfig && MGAConfig && MGAConfig.data) {
  //       this.MGAConfigdata = MGAConfig.data;
  //       this.mgaStateList = MGAConfig.data.mgaStatesList;
  //       sessionStorage.setItem("mgaStateList", JSON.stringify(this.mgaStateList));
  //       sessionStorage.setItem("lobStateList", JSON.stringify(this.MGAConfigdata.lobStatesList));


  //       let data: any = null;
  //       data = MGAConfig.data
  //       this.LobList = data.userLobs != null && data.userLobs.length > 0 ?
  //         this.LobList.filter(x => data.userLobs.findIndex(y => y.lobId == x.lobId) > -1) : this.LobList

  //     }
  //   }, (err) => {

  //     console.log("err", err);
  //   }, () => {

  //   });
  // }

  GetMGAConfig(userId: number) {
    this.store.select(selectMGAConfig).pipe(take(1)).subscribe(data => {
      if (!data || data == null) {
        this.store.dispatch(loadMGAConfig({ userId }));
      }
    });

    // Subscribe reactively
    this.store.select(selectMGAConfig).subscribe(config => {
      this.MGAConfigdata = config;
      this.mgaStateList = config.mgaStatesList;

      sessionStorage.setItem("mgaStateList", JSON.stringify(this.mgaStateList || []));
      sessionStorage.setItem("lobStateList", JSON.stringify(config.lobStatesList || []));

      this.LobList = config.userLobs?.length > 0
        ? this.LobList.filter(x => config.userLobs.findIndex(y => y.lobId === x.lobId) > -1) : this.LobList;

    });

    // this.store.select(selectMGAConfigLoading).subscribe(isLoading => {
    //   if (isLoading) {
    //     this._loader.show();
    //   } else {
    //     this._loader.hide();
    //   }
    // });
  }

}
