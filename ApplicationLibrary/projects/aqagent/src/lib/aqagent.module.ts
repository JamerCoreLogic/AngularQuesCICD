import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './shared/http-error-interceptors';

@NgModule({
  declarations: [],
  imports: [
  ],  
  providers:[
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  exports: []
})
export class AQAgentModule { }
