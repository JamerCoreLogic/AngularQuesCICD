import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterTabsComponent } from './register-tabs.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { HistoryInfoComponent } from './history-info/history-info.component';
import { CertificateInfoComponent } from './certificate-info/certificate-info.component';
import { CanDeactivateRegisterService } from '../services/can-deactivate-register.service';

const routes: Routes = [
  { path: '', component: RegisterTabsComponent },
  { path: 'contact', component: ContactInfoComponent },
  { path: 'history', component: HistoryInfoComponent},
  { path: 'certificate', component: CertificateInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterTabsRoutingModule { }
