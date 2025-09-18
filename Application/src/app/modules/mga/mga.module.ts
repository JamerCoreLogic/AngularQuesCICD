import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MgaRoutingModule } from './mga-routing.module';
import { MgaMasterComponent } from './component/mga-master/mga-master.component';
import { MgaConfigurationComponent } from './component/mga-configuration/mga-configuration.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AQComponentsModule, AqMultiselectModule } from '@agenciiq/components';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MgaMasterComponent, MgaConfigurationComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AQComponentsModule,
    AqMultiselectModule,
    MgaRoutingModule
  ]
})
export class MgaModule { }
