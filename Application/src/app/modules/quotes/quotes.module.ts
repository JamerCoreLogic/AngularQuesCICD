import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotesRoutingModule } from './quotes-routing.module';
import { QuotelistComponent } from './component/quotelist/quotelist.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuotesMasterComponent } from './component/quotes-master/quotes-master.component';
import { AQAgencyModule } from '@agenciiq/agency';
import { AQComponentsModule, AQQuotesComponentModule, AQDataViewModule, QuoteViewModule } from '@agenciiq/components';
import { AQAdminModule } from '@agenciiq/aqadmin';
import { QuotesComponent } from './component/quotes/quotes.component';
import { DialogModule } from 'src/app/shared/utility/aq-dialog/dialog.module';
import { SelectNewQuoteOptionComponent } from './component/select-new-quote-option/select-new-quote-option.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PolicyViewResolver } from './service/policy-view-resolver';
import { InsuredViewResolver } from './service/insured-view-resolver';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { QuotesviewComponent } from './component/quotesview/quotesview.component';


@NgModule({
  declarations: [QuotelistComponent, QuotesMasterComponent, QuotesComponent, SelectNewQuoteOptionComponent, QuotesviewComponent],
  imports: [
    CommonModule,
    SharedModule,
    QuotesRoutingModule,
    AQComponentsModule,
    AQDataViewModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    DialogModule,
    AQAdminModule,
    AQQuotesComponentModule,
    AQAgencyModule,
    QuoteViewModule
  ],
  exports: [
    QuotelistComponent,
    QuotesComponent
  ],
  providers: [
    PolicyViewResolver,
    InsuredViewResolver
  ]

})
export class QuotesModule { }
