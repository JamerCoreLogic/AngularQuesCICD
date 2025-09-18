
import './polyfills';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {

  if (environment.production) {
    enableProdMode();
  } else {
    //console.log('From Main Method : ',window.location.host)
  }

})