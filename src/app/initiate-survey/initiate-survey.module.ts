import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitiateSurveyRoutingModule } from './initiate-survey-routing.module';
import { InitiateSurveyComponent } from './initiate-survey.component';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { ChartModule, ChartsModule } from '@progress/kendo-angular-charts';
import { SharedPipesModule } from '../shared-material/shared-pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreviewComponent } from './preview/preview.component';
import { EmailComponent } from './email/email.component';


@NgModule({
  declarations: [
    InitiateSurveyComponent,
    PreviewComponent,
    EmailComponent
  ],
  imports: [
    CommonModule,
    InitiateSurveyRoutingModule,
    SharedMaterialModule,
    ChartModule,
    ChartsModule,
    SharedPipesModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class InitiateSurveyModule { }
