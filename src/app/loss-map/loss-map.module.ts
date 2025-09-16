import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from "../shared-material/shared-material.module";
import { SharedPipesModule } from '../shared-material/shared-pipes.module';
import { JwtInterceptorInterceptor } from '../interceptor/jwt-interceptor.interceptor';
import { FilterModule } from '@progress/kendo-angular-filter';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule, DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { FloatingLabelModule } from '@progress/kendo-angular-label';


import { LossMapViewComponent } from './loss-map-view/loss-map-view.component';
import { LossAdjusterListComponent } from './loss-adjuster-list/loss-adjuster-list.component';

import { LossMapRoutingModule } from './loss-map-routing.module';
import { LossMapComponent } from './loss-map.component';
import { LossOverviewComponent } from './loss-overview/loss-overview.component';
import { FindAdjusterModule } from '../find-adjuster/find-adjuster.module';
import { LossRadiusSliderComponent } from './loss-radius-slider/loss-radius-slider.component';
import { LossSearchLocationComponent } from './loss-search-location/loss-search-location.component';
import { LossViewProfileComponent } from './loss-view-profile/loss-view-profile.component';


@NgModule({
  declarations: [
    LossMapViewComponent,
    LossAdjusterListComponent,
    LossMapComponent,
    LossOverviewComponent,
    LossRadiusSliderComponent,
    LossSearchLocationComponent,
    LossViewProfileComponent,

  ],
  imports: [
    CommonModule,
    LossMapRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NgbModule,
    SharedMaterialModule,
    SharedPipesModule,
    FilterModule,
    DropDownsModule,
    DatePickerModule,
    TextBoxModule,
    DateInputsModule,
    InputsModule,
    FloatingLabelModule,
    FindAdjusterModule,

    
  ],
  exports: [
    LossMapComponent
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true }]
})
export class LossMapModule { } 