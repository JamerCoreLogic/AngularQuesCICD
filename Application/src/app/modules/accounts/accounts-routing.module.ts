import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountsMasterComponent } from './components/accounts-master/accounts-master.component';
import { ManageAccountsComponent } from './components/manage-accounts/manage-accounts.component';


const routes: Routes = [
  { path:'', component: AccountsMasterComponent, children : [
    { path:'', component: ManageAccountsComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
