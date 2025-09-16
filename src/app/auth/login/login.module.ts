import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePassAtFirstloginComponent, TooltipListPipe } from './change-pass-at-firstlogin/change-pass-at-firstlogin.component';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { LoginInfoComponent } from './login-info/login-info.component';

@NgModule({
  declarations: [
    LoginComponent,
    ChangePassAtFirstloginComponent,
    TooltipListPipe,
    LoginInfoComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedMaterialModule
  ],
})
export class LoginModule { }
