import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ChatbotApi {
  
    private _getWebhookApi = '';
    url: string = '';
   
    constructor(){
        
       let path = window.location.host;
        if(path == "insur.agenciiq.net" || path == 'united.agenciiq.net'){
        // this._getWebhookApi = "https://ec2-3-141-33-44.us-east-2.compute.amazonaws.com:5005/webhooks/rest/webhook";
         this._getWebhookApi = 'https://chatbot.agenciiq.net:5005/webhooks/rest/webhook';
         //'http://14.141.169.226:5005/webhooks/rest/webhook';
        }else{
        //    this._getWebhookApi = "https://ec2-3-141-33-44.us-east-2.compute.amazonaws.com:5005/webhooks/rest/webhook";
         this._getWebhookApi = 'https://chatbot.agenciiq.net:5005/webhooks/rest/webhook'
         //'http://14.141.169.226:5005/webhooks/rest/webhook';//
         //console.log('path 22  ' +path);
        }
    }
    
    get WebhookApi() {    
        return this._getWebhookApi;
    }
  
}