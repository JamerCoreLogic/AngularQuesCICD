import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuotelistComponent } from './component/quotelist/quotelist.component';
import { QuotesMasterComponent } from './component/quotes-master/quotes-master.component';
import { QuotesComponent } from './component/quotes/quotes.component';
import { Roles } from 'src/app/global-settings/roles';
import { SelectNewQuoteOptionComponent } from './component/select-new-quote-option/select-new-quote-option.component';
import { PolicyViewResolver } from './service/policy-view-resolver';
import { InsuredViewResolver } from './service/insured-view-resolver';
import { QuotesviewComponent } from './component/quotesview/quotesview.component';
import { ChatbotResolverService } from './service/chatbot-resolver.service';
//import { QuoteviewComponent } from './component/quoteview/quoteview.component';



const routes: Routes = [
  {
    path: '', component: QuotesMasterComponent, children: [
      { path: '', component: QuotelistComponent, data: { roles: [Roles.AgencyAdmin.roleCode, Roles.MGAAdmin.roleCode] } },
      { path: 'quickquote', component: QuotesComponent, data: { roles: [Roles.AgencyAdmin.roleCode, Roles.MGAAdmin.roleCode] }, resolve: { policyViewResolver: PolicyViewResolver, insuredViewResolver: InsuredViewResolver, chatbotresolver: ChatbotResolverService } },
      { path: 'select-quote-options', component: SelectNewQuoteOptionComponent, data: { roles: [Roles.AgencyAdmin.roleCode, Roles.MGAAdmin.roleCode] } },
      { path: 'quoteView', component: QuotesviewComponent }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotesRoutingModule { }
