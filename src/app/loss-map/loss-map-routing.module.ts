import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LossMapComponent } from './loss-map.component';


const routes: Routes = [
  {
    path: '',
    component: LossMapComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LossMapRoutingModule { } 