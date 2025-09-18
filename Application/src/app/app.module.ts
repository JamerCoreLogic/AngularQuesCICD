import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AQAgentModule } from '@agenciiq/aqagent';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AQDialogModule } from './shared/utility/dialog/aqdialog.module';
import { DialogModule } from './shared/utility/aq-dialog/dialog.module';
import { ThemeService } from './global-settings/theme.service';
import { TokenInterceptor } from './shared/services/Interceptors/token.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
// ModuleRegistry.registerModules([AllCommunityModule]);
import {
  MsalModule,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptor,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MSAL_GUARD_CONFIG,
  MsalInterceptorConfiguration,
  MsalGuardConfiguration
} from '@azure/msal-angular';
import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  LogLevel
} from '@azure/msal-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { agencyReducer } from 'store/reducers/agency.reducer';
import { AgencyEffects } from 'store/effects/agency.effects';
// import { AgGridModule } from 'ag-grid-angular';
import { AgentEffects } from 'store/effects/agent.effects';
import { agentReducer } from 'store/reducers/agent.reducer';
import { programReducer } from 'store/reducers/program.reducer';
import { ProgramEffects } from 'store/effects/program.effects';
import { quoteReducer } from 'store/reducers/quote.reducer';
import { Quoteffects } from 'store/effects/quote.effects';
import { manageAccountReducer } from 'store/reducers/manage.account.reduce';
import { ManageAccountEffects } from 'store/effects/manage.account.effects';
import { parameterReducer } from 'store/reducers/master-table-reducer';
import { OtherScrenEffects } from 'store/effects/other-screen.effects';
import { formsReducer } from 'store/reducers/other.screen-reducer';
import { ParameterEffects } from 'store/effects/master-table.effects';
import { submissionsReducer } from 'store/reducers/submission.reducer';
import { submissionEffects } from 'store/effects/submission.effects';
import { mgaReducer } from 'store/reducers/mga-config.reducer';
import { MgaConfigEffects } from 'store/effects/mga-config.effect';
import { kpiReducer } from 'store/reducers/agent-dashboard.reducer';
import { KpiEffects } from 'store/effects/agent-dashboard.effects';
import { WorkboardEffects } from 'store/effects/workboard.effects';
import { workboardReducer } from 'store/reducers/workboard.reducer';
import { AlfredEffects } from 'store/effects/alfred-alert.effects';
import { alfredReducer } from 'store/reducers/alfred-alert.reducer';
import { bobReducer } from 'store/reducers/bookTransfer.reducer';
import { BOBEffects } from 'store/effects/bookTransfer.effects';
import { insuredProspectsReducer } from 'store/reducers/insured.reducer';
import { InsuredEffects } from 'store/effects/insured.effects';
import { todoReducer } from 'store/reducers/myDiary.reducer';
import { TodoEffects } from 'store/effects/myDiary.effects';
import { workboardPeriodReducer } from 'store/reducers/workPeriod.reducer';
import { WorkboardPeriodEffects } from 'store/effects/workPeriodType.effects';
import { mgaProgramReducer } from 'store/reducers/mgaProgram.reducer';
import { MgaProgramEffects } from 'store/effects/mgaProgram.effects';
import { workBookReducer } from 'store/reducers/workBookList.reducer';
import { WorkBookEffects } from 'store/effects/workBookList.effects';
import { carrierReducer } from 'store/reducers/carrier-list.reducer';
import { CarrierEffects } from 'store/effects/carrier-list.effects';
import { lobReducer } from 'store/reducers/lob-list.reducer';
import { LobEffects } from 'store/effects/lob-list.effects';
import { stateReducer } from 'store/reducers/parameterkey.reducer';
import { StateEffects } from 'store/effects/parameterkey.effects';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

export function initializeTheme(theme: ThemeService) {
  return () => theme.apply();
}

export function initializeNewTheme(theme: ThemeService) {
  return () => theme.loadThemeColor();
}

// export function MSALInstanceFactory(): IPublicClientApplication {
//     return new PublicClientApplication({
//         auth: {
//             clientId: environment.ClientId, // Adjust this
//             authority: 'https://login.microsoftonline.com/' + environment.TenantId, // Adjust this
//             redirectUri: environment.RedirectUri, // Adjust this
//         },
//         cache: {
//             cacheLocation: 'localStorage',
//             storeAuthStateInCookie: isIE,
//         },
//     });
// }
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      authority:
        'https://login.microsoftonline.com/' + environment.TenantId,
      clientId: environment.ClientId,
      redirectUri: environment.RedirectUri,
      navigateToLoginRequestUrl: false,
      // postLogoutRedirectUri: '/'
    },
    cache: {
      // cacheLocation: BrowserCacheLocation.LocalStorage,
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: isIE, // set to true for IE 11. Remove this line to use Angular Universal
    },
    system: {
      loggerOptions: {
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false,
      },
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);
  protectedResourceMap.set(environment.ApiUrl, [`api://${environment.ClientId}/access_as_user`]);
  protectedResourceMap.set('https://aqnextapi.azurewebsites.net/gateway/gateway/fbapi/', ['api://ac2bfa54-4b4b-4251-8e25-03d3e67177f8/access_as_user']);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read']
    },
    loginFailedRoute: '/login',
  };
}

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MsalModule,
    BrowserAnimationsModule,
    SharedModule,
    AQDialogModule,
    DialogModule,
    NgbModule,
    ReactiveFormsModule,
    CommonModule,
    AppRoutingModule,
    BsDatepickerModule.forRoot(),
    // AgGridModule,
    StoreModule.forRoot({
      agency: agencyReducer, agent: agentReducer,
      program: programReducer, quotes: quoteReducer,
      parameter: parameterReducer, accountDetails: manageAccountReducer, forms: formsReducer, submission: submissionsReducer, mgaConfig: mgaReducer,
      kpi: kpiReducer,
      workboard: workboardReducer,
      alfred: alfredReducer,
      magProgramList: quoteReducer,
      filters: quoteReducer,
      bob: bobReducer,
      insuredProspects: insuredProspectsReducer,
      todo: todoReducer,
      workboardPeriod: workboardPeriodReducer,
      mgaPrograms: mgaProgramReducer,
      workBookList: workBookReducer,
      carrierList: carrierReducer,
      lobList: lobReducer,
      stateList: stateReducer
    }),
    EffectsModule.forRoot([AgencyEffects,
      AgentEffects,
      ProgramEffects,
      Quoteffects,
      ParameterEffects,
      ManageAccountEffects,
      OtherScrenEffects,
      submissionEffects,
      MgaConfigEffects,
      KpiEffects,
      WorkboardEffects,
      AlfredEffects,
      BOBEffects,
      InsuredEffects,
      TodoEffects,
      WorkboardPeriodEffects,
      MgaProgramEffects,
      WorkBookEffects,
      CarrierEffects,
      LobEffects,
      StateEffects
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Keep last 25 states
      logOnly: environment.production, // Restrict extension in production
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    // {
    //     provide: HTTP_INTERCEPTORS,
    //     useClass: TokenInterceptor,
    //     multi: true
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    // {
    //     provide: HTTP_INTERCEPTORS,
    //     useClass: TokenInterceptor,
    //     multi: true
    // },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTheme,
      deps: [ThemeService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeNewTheme,
      deps: [ThemeService],
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule { }
