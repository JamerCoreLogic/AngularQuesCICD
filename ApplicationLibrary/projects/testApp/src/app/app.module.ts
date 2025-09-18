import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AQAgencyModule } from 'projects/aqagency/src/public-api';
import { AQTodoModule } from 'projects/aqcomponents/src/lib/todo-module/aqtodo.module';
import { AQDataViewModule } from 'projects/aqcomponents/src/lib/data-view-module/data-view.module';
import { AlfredComponent } from './alfred.component';
import { AQAlfredAlertsModule } from 'projects/aqcomponents/src/lib/alfred-alerts-module/aqalfred-alerts.module';
import { AQQuotesComponentModule } from 'projects/aqcomponents/src/lib/quotes-componets-module/aqquotescomponents.module';
import { AQAdminModule } from 'projects/aqadmin/src/lib/aqadmin.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AQComponentsModule } from 'projects/aqcomponents/src/public-api';
import{ AQAgentModule} from 'projects/aqagent/src/lib/aqagent.module';

import  { AqMultiselectModule } from 'projects/aqcomponents/src/lib/aq-multiselect/aq-multiselect.module';

import { QuoteViewModule } from 'projects/aqcomponents/src/lib/quote-view-module/quote-view-module'
import { AdvanceFilterComponent } from './advance-filter/advance-filter.component';
import { AqchatboardModule } from 'projects/aqchatboard/src/lib/aqchatboard.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

]



@NgModule({
  declarations: [
    AppComponent,
    AdvanceFilterComponent
  ],
  imports: [
    BrowserModule, 
    ReactiveFormsModule,    
    FormsModule,
    AqchatboardModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    AQComponentsModule,
    AQDataViewModule,
    AQAgencyModule,
    AQQuotesComponentModule,
    AQAlfredAlertsModule,   
    AQAdminModule,
    AqMultiselectModule,
    AQAgentModule,
    QuoteViewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
