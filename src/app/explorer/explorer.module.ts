import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExplorerRoutingModule } from './explorer-routing.module';
import { ExplorerComponent } from './explorer.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { FilterComponent } from './components/filter/filter.component';
import { IconsComponent } from './components/icons/icons.component';
import { ListComponent } from './components/list/list.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { SecondMenuBarComponent } from './components/second-menu-bar/second-menu-bar.component';
import { TreeComponent } from './components/tree/tree.component';
import { ViewSwitcherComponent } from './components/view-switcher/view-switcher.component';
import { DragDropDirective } from './directives/drag-drop.directive';
import { ExplorerService } from './services/explorer.service';
import { ConcreteDataService } from './services/concrete-data.service';
import { HttpClientModule } from '@angular/common/http';
import { SecureViewerComponent } from './components/secure-viewer/secure-viewer.component';


import { MatIconModule } from '@angular/material/icon';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FormsModule } from '@angular/forms';
import { SpreadsheetModule } from '@progress/kendo-angular-spreadsheet';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LayoutModule } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatButtonModule } from '@angular/material/button';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [
    ExplorerComponent,
    BreadcrumbsComponent,
    FilterComponent,
    IconsComponent,
    ListComponent,
    MenuBarComponent,
    SecondMenuBarComponent,
    TreeComponent,
    ViewSwitcherComponent,
    DragDropDirective,
    SecureViewerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ExplorerRoutingModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    NgxDocViewerModule,
    SpreadsheetModule,
    ButtonsModule,
    LayoutModule,
    MatMenuModule,
    MatToolbarModule,
    PdfViewerModule
   
  ],
  providers: [
    ExplorerService,
    ConcreteDataService,
  ],
 
})
export class ExplorerModule { }

