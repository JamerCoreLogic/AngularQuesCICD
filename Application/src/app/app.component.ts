import { Component, Inject, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { DOCUMENT } from '@angular/common';
import { Router, RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';
import { endpointService } from '@agenciiq/aqtodo';
import { LoginApi } from '@agenciiq/login';
import { ParameterApi, GetConfigurationService } from '@agenciiq/aqadmin';
import { AgencyApi } from '@agenciiq/agency';
import { AgentListApi } from '@agenciiq/aqagent';
import { AlfredAlertAPI } from '@agenciiq/aqalfred';
import { AqkpiService } from '@agenciiq/aqkpi';
import { QuotesApi } from '@agenciiq/quotes';
import { WorkboardApi } from '@agenciiq/aqworkboard';
import { DialogService } from './shared/utility/aq-dialog/dialog.service';
import { PopupService } from './shared/utility/Popup/popup.service';
import { PopupComponent } from './shared/utility/Popup/popup.component';
import { BusinessTransferApi } from '@agenciiq/aqbusinesstransfer';
import { IconSettings } from './global-settings/icon-settings';
import { ProgramApi } from '@agenciiq/aq-programs';
import { AQFormsApi } from '@agenciiq/aqforms';
import { CarrierAPI } from '@agenciiq/aqcarrier';
import { StripePaymentApi } from '@agenciiq/payment-gateway';
import { MGAConfgApi } from '@agenciiq/mga-config';
import { ThemeService } from './global-settings/theme.service';
import { ApiUrlSettings } from './global-settings/url-settings';
// import { AutoLogoutService } from './shared/services/auto-logout/auto-logout.service';
import { Event } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass'],
    standalone: false
})

export class AppComponent implements OnInit {
  title = 'AQPortal';
  env = environment;

  url: string = '';
  styleUrl: string = '';
  favIcon: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private enpintSrv: endpointService,
    private loginApi: LoginApi,
    private paraApi: ParameterApi,
    private agenApi: AgencyApi,
    private agentApi: AgentListApi,
    private alfAlertApi: AlfredAlertAPI,
    private aqkpiSer: AqkpiService,
    private quoteApi: QuotesApi,
    private workApi: WorkboardApi,
    public dialog: DialogService,
    public businessTransfer: BusinessTransferApi,
    private iconSetting: IconSettings,
    private prograApi: ProgramApi,
    private aqFormsApi: AQFormsApi,
    private carrierApi: CarrierAPI,
    private mgaConfgApi: MGAConfgApi,
    private paymentAPI: StripePaymentApi,
    // private _autoLogoutService: AutoLogoutService,
    private _getConfigurationService: GetConfigurationService,
    private themeService: ThemeService
  ) {

    /*  if (this.env.multiClient && this.env.production) {
         this.url = window.location.origin;
     } else {
       if (this.env.ClientName == 'acme') {
         this.url = "10.130.205.163:8080";
       } else if (this.env.ClientName == 'insur') {
         this.url = "http://insur.agenciiq.net";
       } else {
         this.url = "http://insur.agenciiq.net"     
       }
     } */


    this.url = new ApiUrlSettings().getUrlForAPI();

    this.enpintSrv.apiEndPointValue = this.url;
    this.loginApi.loginApiEndPoint = this.url;
    this.paraApi.parameterApiEndPoint = this.url;
    this.agenApi.agencyListApiEndPoint = this.url;
    this.agentApi.AgentListApiEndPoint = this.url;
    this.alfAlertApi.AlfredAlertAPIEndPoint = this.url;
    this.aqkpiSer.aqkpiApiEndPoint = this.url;
    this.quoteApi.QuotesApiEndPoint = this.url;
    this.workApi.WorkboardApiEndPoint = this.url;
    this.businessTransfer.BusinessApiEndPoint = this.url;
    this.prograApi.programApiEndPoint = this.url;
    this.aqFormsApi.formsListApiEndPoint = this.url;
    this.carrierApi.CarrierAPiEndPoint = this.url;
    this.mgaConfgApi.MGAConfigApiEndPoint = this.url;
    this.paymentAPI.PaymentApiEndPoint = this.url;
  }

  ngOnInit() {
    this.manageIconSettings();
    this.getMGAConfiguration();
  }

  getMGAConfiguration() {

    this._getConfigurationService.GetConfiguration()
      .subscribe(mgaConfig => {
        if (mgaConfig) {
          this.favIcon = mgaConfig.data.mgaConfiguration.name,
            this.favIcon = mgaConfig.data.mgaConfiguration.aqFavIconURL
          if (this.favIcon) {
            this.themeService.loadStyle('favicon', 'icon', this.favIcon);
          }
        }
      })
  }

  // manageIconSettings() {

  //   this.router.events.subscribe((events: RouterEvent) => {
  //     if (events instanceof NavigationEnd) {
  //       this.iconSetting.ManageSetting(this.router.url);
  //     }
  //   })
  // }

  manageIconSettings() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.iconSetting.ManageSetting(this.router.url);
      }
    });
  }
}