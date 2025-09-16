import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterTabsRoutingModule } from './register-tabs-routing.module';
import { RegisterTabsComponent } from './register-tabs.component';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { HistoryInfoComponent } from './history-info/history-info.component';
import { CertificateInfoComponent } from './certificate-info/certificate-info.component';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedPipesModule } from '../shared-material/shared-pipes.module';
import { WelcomeFPDComponent } from './welcome-fpd/welcome-fpd.component';
import { CanDeactivateRegisterService } from '../services/can-deactivate-register.service';
import { CoreValuesComponent } from './core-values/core-values.component';

 


@NgModule({
  declarations: [
    RegisterTabsComponent,
    ContactInfoComponent,
    HistoryInfoComponent,
    CertificateInfoComponent,
    WelcomeFPDComponent,
    CoreValuesComponent   
  ],
  imports: [
    CommonModule,
    RegisterTabsRoutingModule,
    SharedMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedPipesModule,
   
  ],
  providers: [
CanDeactivateRegisterService
]
})
export class RegisterTabsModule { }
