import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmOtpRoutingModule } from './confirm-otp-routing.module';
import { ConfirmOtpComponent, TooltipListPipe } from './confirm-otp.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';


@NgModule({
  declarations: [
    ConfirmOtpComponent,
    TooltipListPipe
  ],
  imports: [
    CommonModule,
    ConfirmOtpRoutingModule,
    ReactiveFormsModule,
    SharedMaterialModule
  ]
})
export class ConfirmOtpModule { }
