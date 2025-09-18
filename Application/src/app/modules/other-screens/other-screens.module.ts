import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { OtherScreensRoutingModule } from './other-screens-routing.module';
import { AQComponentsModule, AQDataViewModule } from '@agenciiq/components';
import { SharedModule } from 'src/app/shared/shared.module';
import { OtherScreenMasterComponent } from './component/other-screen-master/other-screen-master.component';
import { OtherScreenComponent } from './component/other-screen/other-screen.component';
import { ManageScreenComponent } from './component/manage-screen/manage-screen.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [OtherScreenMasterComponent, OtherScreenComponent, ManageScreenComponent],
  imports: [
    CommonModule,AQComponentsModule,
    AQDataViewModule,
    SharedModule,
    OtherScreensRoutingModule, 
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class OtherScreensModule { }
