import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ViewClientsComponent } from './Client/view-clients/view-clients.component';
import { ViewAssignmentComponent } from './Assignment/view-assignment/view-assignment.component';
import { AddUserTabsComponent } from './add-user-tabs/add-user-tabs.component';
import { CanDeactivateGuardService } from '../services/can-deactivate-guard.service';
import { TasksComponent } from './Tasks/tasks/tasks.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'clients', component: ViewClientsComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'assignment', component: ViewAssignmentComponent },
  { path: 'add-user-tabs', component: AddUserTabsComponent ,
  canDeactivate: [CanDeactivateGuardService]},
  { path: 'update-profile', component: AddUserTabsComponent },
  { path:'view-profile',component:AddUserTabsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
