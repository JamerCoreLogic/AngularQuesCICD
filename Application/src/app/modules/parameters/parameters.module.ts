import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametersComponent } from './components/parameters/parameters.component';
import { AQComponentsModule, AQDataViewModule } from '@agenciiq/components';
import { SharedModule } from 'src/app/shared/shared.module';

import { ParametersMasterComponent } from './components/parameters-master/parameters-master/parameters-master.component';
import { ParametersRoutingModule } from './parameters-routing.module';



@NgModule({
  declarations: [ParametersComponent,ParametersMasterComponent],
  imports: [
    CommonModule,
    AQComponentsModule,
    AQDataViewModule,
    SharedModule,
   ParametersRoutingModule,
    AQComponentsModule,
    AQDataViewModule
  ]
})
export class ParametersModule { }
