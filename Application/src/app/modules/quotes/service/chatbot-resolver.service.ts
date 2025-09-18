import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AqchatboardService } from '@agenciiq/aqchatboard';
import { AQFormsService, AQSavePolicyService, ISavePolicy } from '@agenciiq/quotes';
import { AQAgentInfo, AQUserInfo } from '@agenciiq/login';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { debug } from 'console';
import { ThemeService } from 'src/app/global-settings/theme.service';
import { AQSession } from 'src/app/global-settings/session-storage';

@Injectable({
  providedIn: 'root'
})
export class ChatbotResolverService  {
  email: any = "";
  senderemail = "";
  userId;
  constructor(
    private _chatbotService: AqchatboardService,
    private _formService: AQFormsService,
    private _agentInfo: AQAgentInfo,
    private _loader: LoaderService,
    private _userInfo: AQUserInfo,
    private _savePolicy: AQSavePolicyService,
    private _session: AQSession
  ) {

    this.email = this._agentInfo.Agent().email;
    this.senderemail = this.email.split("@")[0];
    this.userId = _userInfo.UserId();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  ;
    let isTrue = JSON.parse(sessionStorage.getItem('IsNavigationFrom'));
    let isTrueFQ = JSON.parse(sessionStorage.getItem('IsNavigationFromFQ'));
    let formtype = "QQ";
  ;
    if (isTrueFQ != null) {
      formtype = "FQ";
    }

    if (isTrue != null) {
      this._loader.show();
      return new Observable(observer => {
        this._chatbotService.getChatBoardWebLinkResponse(this.senderemail)
          .subscribe(resp => {
            this._chatbotService.getChatBoardResponse("reset", this.senderemail, true).subscribe(data => {

            });
            if (resp && resp[0].text) {
              if (isTrueFQ != null) {
                //console.log("4444444444444444444");
                try{
                 
                 // console.log("tast rest 1 "+ resp[0].text);
                 // console.log("tast rest 2 "+btoa(resp[0].text));
                }catch(err){

                }
                  ;
                this._formService.GenerateFullQuoteByChatbot(this._agentInfo.AgentId().toString(), formtype, btoa(unescape(encodeURIComponent(resp[0].text))))
                  .subscribe(respData => {
                    this._loader.hide();
                    if (respData.success && respData.data && respData.data.formDefinition) {
                      observer.next(respData.data);
                      observer.complete();
                     // this._session.removeSession('IsNavigationFromFQ');
                     // this._session.removeSession('IsNavigationFrom');
                    }

                  },

                    err => {
                      this._loader.hide();
                    },
                    () => {
                      this._loader.hide();
                    });

              } else {
                this._formService.QuoteDataFromChatbot(this._agentInfo.AgentId().toString(), formtype, btoa(unescape(encodeURIComponent(resp[0].text))))
                  .subscribe(respData => {
                    this._loader.hide();
                    if (respData.success && respData.data && respData.data.formData && respData.data.formDefinition) {

                      observer.next(respData.data);
                      observer.complete();
                    }

                  },

                    err => {
                      this._loader.hide();
                    },
                    () => {
                      this._loader.hide();
                    });
              }

            } else {
              this._loader.hide();
            }
          }, err => {
            this._loader.hide();

          },
            () => {
              this._loader.hide();
            }

          );
      });
    }

  }
}
