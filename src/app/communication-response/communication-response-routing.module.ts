import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunicationResponseComponent } from './communication-response.component';
import { SubmitResponseComponent } from './submit-response/submit-response.component';
import { ThanksFpdComponent } from './thanks-fpd/thanks-fpd.component';

const routes: Routes = [
  { path: '', component: CommunicationResponseComponent },
  { path: 'communication', component: CommunicationResponseComponent },
  { path: 'submit', component: SubmitResponseComponent },
  { path: 'thanks', component: ThanksFpdComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicationResponseRoutingModule { }
