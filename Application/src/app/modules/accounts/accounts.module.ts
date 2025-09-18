import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsRoutingModule } from './accounts-routing.module';
import { ManageAccountsComponent } from './components/manage-accounts/manage-accounts.component';
import { AccountsMasterComponent } from './components/accounts-master/accounts-master.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AQLoginModule } from '@agenciiq/login';


@NgModule({
  declarations: [ManageAccountsComponent, AccountsMasterComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    AQLoginModule,
    ReactiveFormsModule,
    AccountsRoutingModule
  ]
})
export class AccountsModule { }
