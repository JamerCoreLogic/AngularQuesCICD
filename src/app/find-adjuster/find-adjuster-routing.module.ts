import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FindAdjusterComponent } from './find-adjuster.component';

const routes: Routes = [
  { path: '', component: FindAdjusterComponent }
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FindAdjusterRoutingModule { }
