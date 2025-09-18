import { NgModule } from '@angular/core';
import { HttpErrorInterceptor } from './shared/http-error-interceptors';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

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

export class AQQuotesModule { }
