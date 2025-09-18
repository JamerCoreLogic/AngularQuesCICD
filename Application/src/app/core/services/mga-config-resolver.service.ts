import { GetConfigurationService } from '@agenciiq/aqadmin';
import { Injectable } from "@angular/core";

import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';

@Injectable({
    providedIn: 'root'
})
export class MGAConfigResolver {
    constructor(
        private _loader: LoaderService,
        private _mgaConfiguration: GetConfigurationService
    ) {

    }

    resolve() {        
        this._loader.show();
        return new Observable(observer => {
            this._mgaConfiguration.GetConfiguration()
                .subscribe(mgaConfig => {
                    this._loader.hide();
                    observer.next(mgaConfig);
                    observer.complete();
                }, (err) => {
                    this._loader.hide();
                }, () => {
                    this._loader.hide();
                })
        })
    }
}