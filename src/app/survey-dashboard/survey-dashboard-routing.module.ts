import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyDashboardComponent } from './survey-dashboard.component';
import { SurveyResponceGridComponent } from './survey-responce-grid/survey-responce-grid.component';

const routes: Routes = [
  { path: '', component: SurveyDashboardComponent },
  {path:'survey-response', component:SurveyResponceGridComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyDashboardRoutingModule { }
