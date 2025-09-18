import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AQComponentsModule, AQDataViewModule } from '@agenciiq/components';
import { ProgramsRoutingModule } from './programs-routing.module';
import { ProgramsMasterComponent } from './components/programs-master/programs-master.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProgramListComponent } from './components/program-list/program-list.component';
import { AddAqProgramComponent } from './components/add-aq-program/add-aq-program.component';



@NgModule({
  declarations: [ProgramsMasterComponent, ProgramListComponent, AddAqProgramComponent],
  imports: [
    CommonModule,
    AQComponentsModule,
    AQDataViewModule,
    SharedModule,
    ProgramsRoutingModule,
    AQComponentsModule,
    AQDataViewModule
  ]
})
export class ProgramsModule { }
