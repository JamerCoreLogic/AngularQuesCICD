
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FindAdjusterRoutingModule } from './find-adjuster-routing.module';
import { FindAdjusterComponent } from './find-adjuster.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SharedMaterialModule } from "../shared-material/shared-material.module";
import { AdjusterOverviewComponent } from './adjuster-overview/adjuster-overview.component';
import { SearchLocationComponent } from './search-location/search-location.component';
import { RadiusSliderComponent } from './radius-slider/radius-slider.component';
import { AdjusterListComponent } from './adjuster-list/adjuster-list.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { NotificationComponent } from './notification/notification.component';
import { InitiateRequestComponent } from './initiate-request/initiate-request.component';
import { ViewAdjusterInfoComponent } from './view-adjuster-info/view-adjuster-info.component';
import { SharedPipesModule } from '../shared-material/shared-pipes.module';
import { JwtInterceptorInterceptor } from '../interceptor/jwt-interceptor.interceptor';
import { FilterModule, } from '@progress/kendo-angular-filter';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FilterListComponent } from './filter-list/filter-list.component';
import { DateInputsModule, DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { FloatingLabelModule } from '@progress/kendo-angular-label';



@NgModule({
  declarations: [
    FindAdjusterComponent,
    AdjusterOverviewComponent,
    SearchLocationComponent,
    RadiusSliderComponent,
    AdjusterListComponent,
    GoogleMapComponent,
    ViewProfileComponent,
    NotificationComponent,
    InitiateRequestComponent,
    ViewAdjusterInfoComponent,
    FilterListComponent,


  ],
  imports: [
    CommonModule,
    FindAdjusterRoutingModule,
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
    

  ],
  exports: [
    FindAdjusterComponent,
    FilterListComponent,

  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true}]
})
export class FindAdjusterModule { }
