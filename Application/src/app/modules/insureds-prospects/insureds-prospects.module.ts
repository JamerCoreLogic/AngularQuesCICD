import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { InsuredsProspectsRoutingModule } from './insureds-prospects-routing.module';
import { InsuredsProspectsMasterComponent } from './component/insureds-prospects-master/insureds-prospects-master.component';
import { AQComponentsModule, AQQuotesComponentModule, AQDataViewModule } from '@agenciiq/components';
import { GetInsuredsProspectsComponent } from './component/get-insureds-prospects/get-insureds-prospects.component';
import { InsuredDetailComponent } from './component/insured-detail/insured-detail.component';


@NgModule({
  declarations: [InsuredsProspectsMasterComponent, GetInsuredsProspectsComponent, InsuredDetailComponent],
  imports: [
    CommonModule,
    InsuredsProspectsRoutingModule,
    AQComponentsModule,
    AQQuotesComponentModule,
    AQDataViewModule,

    SharedModule,
    AccordionModule.forRoot(),
    FormsModule,
    AQDataViewModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
  ]
})
export class InsuredsProspectsModule { }
