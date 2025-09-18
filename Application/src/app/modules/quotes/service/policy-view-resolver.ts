import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { IPolicyGetRequest, AQPolicyGetService, AQSavePolicyService, ISavePolicy } from '@agenciiq/quotes';
import { AQSession } from 'src/app/global-settings/session-storage';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';

import { Observable } from 'rxjs';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';

@Injectable()
export class PolicyViewResolver  {

    constructor(
        private _getPolicyService: AQPolicyGetService,
        private _savePolicy:AQSavePolicyService,
        private _session: AQSession,
        private _router: Router,
        private _loader: LoaderService,
        private _popupService: PopupService,) {

    }


    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
     
        let viewPolicyParams: any = this._session.getData("viewPolicyParams");

        if (viewPolicyParams && viewPolicyParams.Action == "Documents"){

                let QuoteId = viewPolicyParams.QuoteId;
                let UserId = viewPolicyParams.UserId;

            this._loader.show();
            return new Observable((observer) => {
                
                let somePromiseOrObservableToGetDate = this._savePolicy.getQuoteForm(QuoteId,UserId);
                
                somePromiseOrObservableToGetDate.subscribe(data => {
                   this._loader.hide();
                    if (data && data.data && data.data.formDefinition && data.data.formData) {
                        observer.next(data);
                        observer.complete();
                    }
                    
                })
            });
        }

        else if (viewPolicyParams && viewPolicyParams.Action == "Risk"){

            let QuoteId = viewPolicyParams.QuoteId;
            let UserId = viewPolicyParams.UserId;

        this._loader.show();
        return new Observable((observer) => {
            
            let somePromiseOrObservableToGetDate = this._savePolicy.getRiskAnalysisForms(QuoteId,UserId);
            
            somePromiseOrObservableToGetDate.subscribe(data => {
               this._loader.hide();
                if (data && data.data && data.data.formDefinition && data.data.formData) {
                    observer.next(data);
                    observer.complete();
                }
                
            })
        });
    }
        else if (viewPolicyParams != null) {
            let viewPolicyRequest: ISavePolicy = {
                "QuoteId": viewPolicyParams.QuoteId,
                "UserId": viewPolicyParams.UserId,
                "AgentId": viewPolicyParams.AgentId,
                "FormId": 0,
                "LOB": viewPolicyParams.lob,
                "QuoteDetails": "",
                "QuoteType": "",
                "State": "",
                "XMLObject": "",
                ClientID: 1,                
                IsOpenTask: false,
                Action: viewPolicyParams.Action,
                BusinessName: ''
            }
            viewPolicyParams && viewPolicyParams.Action.toLowerCase() == "view"? sessionStorage.setItem("view","true"): sessionStorage.setItem("view","false");;
            this._loader.show();
            return new Observable((observer) => {
                
                let somePromiseOrObservableToGetDate = this._savePolicy.SavePolicy(viewPolicyRequest);
                
                somePromiseOrObservableToGetDate.subscribe(data => {
                   this._loader.hide();
                    if (data && data.data && data.data.formDefinition && data.data.formDefinition.formId != 0 && data.data.formDefinition.formId != null) {
                        observer.next(data);
                        observer.complete();
                    }else if(!data.success){
                        this._popupService.showPopup('Quote', data.message);
                    }
                    
                })
            });
 
        }
        else {
           
            return null;
        }
       
    }
/* 
    savePolicy(savePolicyRequest) {
        
        this._loader.show();

        return new Observable((observer) => {
            let somePromiseOrObservableToGetDate = this._savePolicy.SavePolicy(savePolicyRequest);

            somePromiseOrObservableToGetDate.subscribe(data => {
               this._loader.hide();
                if (data && data.data && data.data.formDefinition && data.data.formDefinition.formId != 0 && data.data.formDefinition.formId != null) {
                    observer.next(data);
                }
                observer.complete();
            })
        });

      } */

}