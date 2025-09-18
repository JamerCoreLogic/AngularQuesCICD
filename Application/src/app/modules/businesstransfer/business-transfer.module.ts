import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BusinessTransferMasterComponent } from './component/business-transfer-master/business-transfer-master.component';
import { BusinessTransferRoutingModule } from './business-transfer-routing.module';
import { AQComponentsModule, AQQuotesComponentModule, AQDataViewModule, QuoteViewModule } from '@agenciiq/components';
import { AQAdminModule } from '@agenciiq/aqadmin';
import { AQAgencyModule } from '@agenciiq/agency';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DialogModule } from 'src/app/shared/utility/aq-dialog/dialog.module';

@NgModule({
  declarations: [BusinessTransferMasterComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    DialogModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    BusinessTransferRoutingModule,
    AQComponentsModule,   
    AQAdminModule,
    AQQuotesComponentModule,
    AQAgencyModule,
    AQDataViewModule        ,
    QuoteViewModule
  ]  
  
})
export class BusinessTransferModule { }
