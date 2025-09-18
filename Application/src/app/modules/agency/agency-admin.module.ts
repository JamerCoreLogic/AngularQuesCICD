import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencyAdminRoutingModule } from './agency-admin-routing.module';
import { AgencylistComponent } from './component/agencylist/agencylist.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgencyMasterComponent } from './component/agency-master/agency-master.component';
import { AQAgencyModule } from "@agenciiq/agency";
import { AQComponentsModule, AQDataViewModule, AqMultiselectModule } from '@agenciiq/components';
import { AgencyComponent } from './component/agency/agency.component';
import { BranchComponent } from './component/branch/branch.component';
import { BranchListComponent } from './component/branch-list/branch-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [AgencylistComponent, AgencyMasterComponent, AgencyComponent, BranchComponent, BranchListComponent],
  imports: [
    CommonModule,
    AQAgencyModule,
    AQComponentsModule,
    FormsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    AQDataViewModule,
    AgencyAdminRoutingModule,
    SharedModule,
    AqMultiselectModule
  ]
})

export class AgencyAdminModule { }
