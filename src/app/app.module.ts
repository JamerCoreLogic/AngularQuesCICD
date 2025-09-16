import { SharedMaterialModule } from './shared-material/shared-material.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';
import { NgxSpinnerModule,  } from 'ngx-spinner';
import { RoleGuardGuard } from './guard/role-guard.guard';
import { LowercaseUrlInterceptor } from './interceptor/lowercase-url.interceptor';
import { JwtInterceptorInterceptor } from './interceptor/jwt-interceptor.interceptor';
import { FilterModule } from '@progress/kendo-angular-filter';
import { ConfigProvider } from './explorer/services/config.provider';
import { NgeExplorerConfig } from './explorer/shared/types';
import { MaintenanceComponent } from './maintenance/maintenance.component';




interface NgxSpinnerConfig {
  type?: string;
}

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    HeaderComponent,
    FooterComponent,
    MaintenanceComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonToggleModule,
    MatIconModule,
    SharedMaterialModule,
    ChartsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple'}),
    FilterModule,

  ],
  providers: [RoleGuardGuard , {
    provide: HTTP_INTERCEPTORS,
    useClass: LowercaseUrlInterceptor,
    multi: true,
  },
{provide:HTTP_INTERCEPTORS,
  useClass:JwtInterceptorInterceptor,
  multi:true,
},
{
  provide: ConfigProvider,
  useValue: new ConfigProvider({
    // Set appropriate configuration values here for NgeExplorerConfig
  } as NgeExplorerConfig)
}
],
  bootstrap: [AppComponent]
})
export class AppModule { }
