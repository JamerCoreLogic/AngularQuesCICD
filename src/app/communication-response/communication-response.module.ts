import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from './../shared-material/shared-material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationResponseRoutingModule } from './communication-response-routing.module';
import { CommunicationResponseComponent } from './communication-response.component';
import { SubmitResponseComponent } from './submit-response/submit-response.component';
import { SubmissionReceivedComponent } from './submission-received/submission-received.component';
import { DeclineResponseComponent } from './decline-response/decline-response.component';

import { ThanksFpdComponent } from './thanks-fpd/thanks-fpd.component';
import { CommunicationHeaderComponent } from './communication-header/communication-header.component';
import { CommunicationFooterComponent } from './communication-footer/communication-footer.component';
import { SharedPipesModule } from '../shared-material/shared-pipes.module';



@NgModule({
  declarations: [
    CommunicationResponseComponent,
    SubmitResponseComponent,
    SubmissionReceivedComponent,
    DeclineResponseComponent,
    ThanksFpdComponent,
    CommunicationHeaderComponent,
    CommunicationFooterComponent,

  ],
  imports: [
    CommonModule,
    CommunicationResponseRoutingModule,
    SharedMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedPipesModule,

  ]
})
export class CommunicationResponseModule { }
