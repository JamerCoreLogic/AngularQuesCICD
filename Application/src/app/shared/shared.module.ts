import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../shared/utility/Popup/popup.component';
import { LoaderComponent } from '../shared/utility/loader/loader.component';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AQuotientComponent } from './components/aquotient/aquotient.component';
import { WorkboardComponent } from './components/workboard/workboard.component';
import { AlfredAlertsComponent } from './components/alfred-alerts/alfred-alerts.component';
import { TodolistComponent } from './components/todolist/todolist.component';
import { HeaderbarComponent } from './components/headerbar/headerbar.component';
import { AQDateFormatPipe } from './pipes/aqdate-format.pipe';
import { FormsComponent } from './components/forms/forms.component';
import { AQComponentsModule, AQAlfredAlertsModule, AQTodoModule, AQDataViewModule, AQQuotesComponentModule, QuoteViewModule, } from '@agenciiq/components';
import { AqworkboardModule } from '@agenciiq/aqworkboard';
import { AQControlModule } from '@agenciiq/aqcontrol-lib';
import { QuotesChartComponent } from './components/quotes-chart/quotes-chart.component'
import { AQPhoneMaskPipe } from './pipes/phone-mask';
import { PhoneMaskDirective } from './directives/phonemask.directive';
import { DateFormatDirective } from './directives/date-format.directive';
import { ClickOutsideDirective } from './directives/drop.down-directive';
import { SearchFilterPipe } from './pipes/filter-pipe';
import { LetterBoldPipe } from './pipes/letter-bold.pipe'
import { BlockCopyPasteDirective } from './services/aqValidators/copypaste';
import { InnerHeaderComponent } from './components/inner-header/inner-header.component';
import { DialogModule } from './utility/aq-dialog/dialog.module';
import { QuotesDialogComponent } from './components/quotes-dialog/quotes-dialog.component';
import { LoginPopupFocusDirective } from './directives/login-popup-focus.directive';
import { TextFocusDirective } from './directives/text-focus.directive';
import { MyaccountChangePasswordComponent } from './components/myaccount-change-password/myaccount-change-password.component';
import { BusinessTransferDialogComponent } from './components/business-transfer-dialog/business-transfer-dialog.component';
import { WorkbooklistComponent } from './components/workbooklist/workbooklist.component';
import { NewPopupComponent } from './utility/Popup/newPopup.component';
import { AdvanceFilterComponent } from './components/advance-filter/advance-filter.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ParameterDialogComponent } from './components/parameter-dialog/parameter-dialog.component';
import { UploadXMLDialogComponent } from './components/upload-xmldialog/upload-xmldialog.component';
import { AqformlistDialogComponent } from './components/aqformlist-dialog/aqformlist-dialog.component';
import { AddParameterDialogComponent } from './components/add-parameter-dialog/add-parameter-dialog.component';
import { QuoteListLinkComponent } from './components/quote-list-link/quote-list-link.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { OuterHeaderComponent } from './components/outer-header/outer-header.component';


@NgModule({
    declarations: [
        PopupComponent,
        NewPopupComponent,
        LoaderComponent,
        HeaderbarComponent,
        QuotesDialogComponent,
        HeaderComponent,
        FooterComponent,
        ChangepasswordComponent,
        ResetpasswordComponent,
        AQuotientComponent,
        WorkboardComponent,
        AlfredAlertsComponent,
        TodolistComponent,
        AQDateFormatPipe,
        AQPhoneMaskPipe,
        FormsComponent,
        QuotesChartComponent,
        PhoneMaskDirective,
        DateFormatDirective,
        ClickOutsideDirective,
        SearchFilterPipe,
        LetterBoldPipe,
        BlockCopyPasteDirective,
        InnerHeaderComponent,
        LoginPopupFocusDirective,
        TextFocusDirective,
        MyaccountChangePasswordComponent,
        BusinessTransferDialogComponent,
        WorkbooklistComponent,
        AdvanceFilterComponent,
        ParameterDialogComponent,
        UploadXMLDialogComponent,
        AqformlistDialogComponent,
        AddParameterDialogComponent,
        QuoteListLinkComponent,
        OuterHeaderComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        AQComponentsModule,
        QuoteViewModule,
        AQDataViewModule,
        AQQuotesComponentModule,
        AQTodoModule,
        DialogModule,
        CarouselModule.forRoot(),
        AQAlfredAlertsModule,
        AqworkboardModule,
        ReactiveFormsModule,
        AQControlModule,
        BsDatepickerModule,
        FormsModule
    ],
    providers: [],
    exports: [
        LoaderComponent,
        ChangepasswordComponent,
        ResetpasswordComponent,
        HeaderComponent,
        QuoteListLinkComponent,
        FooterComponent,
        HeaderbarComponent,
        AQuotientComponent,
        WorkboardComponent,
        AlfredAlertsComponent,
        OuterHeaderComponent,
        TodolistComponent,
        PopupComponent,
        AQControlModule,
        AQPhoneMaskPipe,
        QuotesChartComponent,
        PhoneMaskDirective,
        DateFormatDirective,
        InnerHeaderComponent,
        // AQControlModule
        MyaccountChangePasswordComponent,
        ClickOutsideDirective,
        SearchFilterPipe,
        LetterBoldPipe,
        TextFocusDirective,
        WorkbooklistComponent,
        AdvanceFilterComponent,
        // AQControlModule,
    ]
})
export class SharedModule { }
