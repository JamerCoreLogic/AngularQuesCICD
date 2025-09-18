import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { InsuredsProspectsService, IInsuredDetailReq } from '@agenciiq/quotes'
import { AQSession } from 'src/app/global-settings/session-storage';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { Observable } from 'rxjs';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';

@Injectable()
export class InsuredViewResolver  {

    constructor(
        private _insuredsProspects: InsuredsProspectsService,
        private _session: AQSession,
        private _router: Router,
        private _loader: LoaderService,
        private _popup: PopupService,) {

    }


    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        let insuredReqObj: any = this._session.getData("insuredReqObj");


        if (insuredReqObj != null) {
            let insuredDetailObj = {
                "UserId": insuredReqObj.UserId,
                "InsuredId": insuredReqObj.InsuredId,
                "QuoteId": insuredReqObj.QuoteId,
                "ClientId": insuredReqObj.ClientId,
            }
            this._loader.show();
            this._session.setData("navType", insuredReqObj.type);
            return new Observable((observer) => {
                let somePromiseOrObservableToGetDate = this._insuredsProspects.getInsuredDetail(insuredDetailObj);

                somePromiseOrObservableToGetDate.subscribe(data => {
                    this._loader.hide();
                    if (data && data.data && data.data.formDefinition) {
                        observer.next(data);
                        observer.complete();
                    }
                    else {
                        this._popup.showPopup('Insured', data.message);
                      }
                    

                })

            });

        }
        else {
            
            //this._session.setData("navType", null);
            return null;
        }
        
    }

}