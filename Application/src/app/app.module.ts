
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

import { AQAgentModule } from '@agenciiq/aqagent';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AQDialogModule } from './shared/utility/dialog/aqdialog.module';
import { DialogModule } from './shared/utility/aq-dialog/dialog.module';
import { ThemeService } from './global-settings/theme.service';
import { TokenInterceptor } from './shared/services/Interceptors/token.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export function initializeTheme(theme: ThemeService) {
    return () => theme.apply();
}

export function initializeNewTheme(theme: ThemeService) {
    return () => theme.loadThemeColor();
}

@NgModule({ declarations: [
        AppComponent,
    ],
    bootstrap: [
        AppComponent
    ], imports: [BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        AQDialogModule,
        DialogModule,
        NgbModule,
        ReactiveFormsModule,
        CommonModule,
        AppRoutingModule, BsDatepickerModule.forRoot()], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: initializeTheme,
            deps: [ThemeService],
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: initializeNewTheme,
            deps: [ThemeService],
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
