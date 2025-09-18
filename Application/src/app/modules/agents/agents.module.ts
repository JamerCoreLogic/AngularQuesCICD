import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentsRoutingModule } from './agents-routing.module';
import { AgentdashboardComponent } from './component/agentdashboard/agentdashboard.component';
import { AddagentComponent } from './component/addagent/addagent.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgentMasterComponent } from './component/agent-master/agent-master.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuotesModule } from '../quotes/quotes.module';
import { AQComponentsModule, AqMultiselectModule, AQTodoListComponent, AQAlfredAlertsModule, AQTodoModule, AQDataViewModule } from '@agenciiq/components';
import { AgentlistComponent } from './component/agentlist/agentlist.component';



@NgModule({
  declarations: [AgentdashboardComponent, AddagentComponent, AgentMasterComponent, AgentlistComponent],
  imports: [
    CommonModule,
    SharedModule,
    AgentsRoutingModule,
    AQComponentsModule, 
    AqMultiselectModule,  
    AQDataViewModule,  
    AQTodoModule,  
    QuotesModule,        
    ReactiveFormsModule,
    FormsModule
  ]
})

export class AgentsModule { }
