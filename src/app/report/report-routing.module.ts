import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report.component';
import { CustomViewComponent } from './custom-view/custom-view.component';
import { ViewEditorComponent } from './view-editor/view-editor.component';

const routes: Routes = [{ path: '', component: ReportComponent },
  { path: 'custom-view', component: CustomViewComponent },
  {path:'view-editor',component:ViewEditorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
