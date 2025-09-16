import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitiateSurveyComponent } from './initiate-survey.component';

const routes: Routes = [{ path: '', component: InitiateSurveyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InitiateSurveyRoutingModule { }
