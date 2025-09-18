import { Injectable } from '@angular/core';
import { IWebHookChatResponse } from './interface/base-webhook-resp';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatbotApi } from './class/chatbot-api';
import { map } from 'rxjs/operators';
import { uploadresp } from './interface/Upload';
@Injectable({
  providedIn: 'root'
})


export class AqchatboardService {
  conversation: any = "";
  sendemail: any = "";
  constructor(
    private _http: HttpClient,
    private api: ChatbotApi
  ) {

    // this.conversation = new ReplaySubject<Message[]>();
  }

  reset() {
    this.conversation = new ReplaySubject<Message[]>();
  }

  update(msg: Message) {
    // console.log('test 2222222222222222222222222222');

    this.conversation.next([msg]);

  }
  apiurl = 'http://18.217.165.126//webhooks/rest/webhook';
  resetcount = 0;
  getChatBoardResponse(message: any, email: any, FQQuote: boolean): Observable<IWebHookChatResponse> {
    
    let botMessage: any;
    if (message == 'reset') {

      try {

        let buttoncount = document.getElementsByClassName('chatbot-block')[0].getElementsByTagName('button').length;
        for (let i = 0; i < buttoncount; i++) {
          document.getElementsByClassName('chatbot-block')[0].getElementsByTagName('button')[i].disabled = true;
          document.getElementsByClassName('chatbot-block')[0].getElementsByTagName('button')[i].style.color = "#666";
          document.getElementsByClassName('chatbot-block')[0].getElementsByTagName('button')[i].style.backgroundColor = "white";
        }
      } catch (error) {
        console.log(error)
      }
    }


    if (message != '' && message != undefined && message != 'reset') {
      let messageflag = message;
      if (document.getElementsByClassName('cbtext-main icontext')[document.getElementsByClassName('cbtext-main icontext').length - 1].textContent.trim() == 'What is the total estimated annual payroll for this business?') {
        try {

          var flag = message.split(',');
          let a1 = '';
          //var message = x5;
          for (let x = 0; x < flag.length; x++) {
            a1 = a1 + flag[x]
          }
          message = a1.replace('$', ' ');
          messageflag = message;

          // str.replace('Z','T');
          if (!isNaN(message)) {
            let a = parseFloat(message);
            if (Number.isInteger(a)) {
              message = '$ ' + a.toLocaleString() + ".00";
            } else {
              message = '$ ' + a.toLocaleString();
            }

            console.log('message >>> ' + message);
          } else {
            // message ='$ '+a.toLocaleString('en-IN');
            console.log('message >>> ' + message);
          }
          botMessage = new Message(message, 'user');
          this.update(botMessage);
          message = messageflag;
        } catch (err) {
          console.log('message >>> ' + message);
        }
      } else if (document.getElementsByClassName('cbtext-main icontext')[document.getElementsByClassName('cbtext-main icontext').length - 1].textContent.trim() == 'Ok, Please enter Phone number' ||
        document.getElementsByClassName('cbtext-main icontext')[document.getElementsByClassName('cbtext-main icontext').length - 1].textContent.trim() == 'Please enter Phone Number') {
        messageflag = message.replace(/[^a-zA-Z0-9]/g, '')
        message = this.PhoneFormate(messageflag);
        botMessage = new Message(message, 'user');
        this.update(botMessage);
        message = messageflag;
      } else if (document.getElementsByClassName('cbtext-main icontext')[document.getElementsByClassName('cbtext-main icontext').length - 1].textContent.trim() == 'How many employees (Full time) does your business have?') {
        messageflag = message.replace(/[^a-zA-Z0-9]/g, '')
        let a = parseInt(messageflag);
        console.log('employees >>> ' + a);
        // str.replace('Z','T');
        if (!isNaN(a)) {

          message = a.toLocaleString();
          console.log('employees num >>> ' + message);
        }
        botMessage = new Message(message, 'user');
        this.update(botMessage);
        message = messageflag;

      } else {
        botMessage = new Message(message, 'user');
        this.update(botMessage);
      }

      // botMessage = new Message(message, 'user');
      // this.update(botMessage);
      // message = messageflag ;
    }


    if (message.toLowerCase() == 'hi') {

      //this.reset();
    }

    return this._http.post<IWebHookChatResponse>(this.api.WebhookApi, {
      "sender": email + _Session,
      "message": message,

    }).pipe(
      map((resp: IWebHookChatResponse) => {
        if (resp) {

          const arrData: any = resp;
          

          for (let i = 0; i < arrData.length; i++) {
            let botMessage: any;
            if (arrData[i].text != null) {
              if (arrData[i].text == 'Do you want to create a Submission for this quick quote?') {
                if (FQQuote) {
                  console.log("FQQuotePortal" +arrData[i] )
                  botMessage = new Message(arrData[i], 'bot');
                  botMessage.Type = 0;
                  setTimeout(() => {
                    this.update(botMessage);
                  }, 3000 * i)
                } else {
                  console.log("FQQuoteMobile" +arrData[i] )
                  // botMessage = new Message('', 'bot');
                  // botMessage.Type = 0;
                }
              } else {
                botMessage = new Message(arrData[i], 'bot');
                botMessage.Type = 0;
                setTimeout(() => {
                  this.update(botMessage);
                }, 300 * i)
              }

            }
            if (arrData[i].buttons != undefined) {
              document.getElementsByClassName('cb-footer-input')[0].getElementsByTagName('input')[0].value = "";
              document.getElementsByClassName('cb-footer-input')[0].getElementsByTagName('input')[0].readOnly = true;

            }
            else {
              document.getElementsByClassName('cb-footer-input')[0].getElementsByTagName('input')[0].readOnly = false;
            }

          }
          return resp;
        }
      })
    )
  }

  getChatBoardButtonResponse(message: any, Buttontaxt: any, email: any): Observable<IWebHookChatResponse> {
    
    let botMessage: any;

    if (message != '' && message != undefined) {

      botMessage = new Message(Buttontaxt, 'user');
      this.update(botMessage);
    }


    return this._http.post<IWebHookChatResponse>(this.api.WebhookApi, {
      "sender": email + _Session,
      "message": message,

    }).pipe(
      map((resp: IWebHookChatResponse) => {
        if (resp) {

          const arrData: any = resp;
          
          if (true) {


            for (let i = 0; i < arrData.length; i++) {
              let botMessage: any;
              if (arrData[i].text != null) {

                if (message == 'accordformyes') {
                  let msg = arrData[i].text.split(':');
                  console.log("id" + msg[0]);
                  this.quoteid = msg[0];
                  arrData[i].text = msg[1];
                  botMessage = new Message(arrData[i], 'upload');
                  botMessage.Type = 0;
                } else {
                  botMessage = new Message(arrData[i], 'bot');
                  botMessage.Type = 0;
                }

              }

              if (arrData[i].buttons != undefined) {
                document.getElementsByClassName('cb-footer-input')[0].getElementsByTagName('input')[0].value = "";

                document.getElementsByClassName('cb-footer-input')[0].getElementsByTagName('input')[0].readOnly = true;


              }
              else {
                document.getElementsByClassName('cb-footer-input')[0].getElementsByTagName('input')[0].readOnly = false;
                if (message == 'accordformyes') {
                  document.getElementsByClassName('cb-footer-input')[0].getElementsByTagName('input')[0].value = "";

                  document.getElementsByClassName('cb-footer-input')[0].getElementsByTagName('input')[0].readOnly = true;

                }
              }
              setTimeout(() => {
                this.update(botMessage);
              }, 300 * i)
            }
          } else {
            const arrData: any = resp;
            

            let botMessage;
            botMessage = new Message('', 'bot');
            botMessage.Type = 3;
            setTimeout(() => {
              this.update(botMessage);
            }, 3000 * 1)


          }
          return resp;
        }
      })
    )
  }
  getChatBoardWebLinkResponse(email: any): Observable<IWebHookChatResponse> {
    //console.log(email +">>>>>>>>>>>this.sendemail >"+this.sendemail);
    let data = {
      "sender": email + _Session,
      "message": "getaqxml"
    }
    return this._http.post<IWebHookChatResponse>(this.api.WebhookApi, data).pipe(
      map((resp: IWebHookChatResponse) => {
        if (resp) {
          return resp;
        }
      })
    )
  }


  getChatBoardUserResponse(message: any, email: any): Observable<IWebHookChatResponse> {
    
    // let botMessage: any;
    // if (message != '' && message != undefined && message !='reset' ) {

    //     botMessage = new Message(message, 'user');
    //     this.update(botMessage);
    //   }


    return this._http.post<IWebHookChatResponse>(this.api.WebhookApi, {
      "sender": email + _Session,
      "message": message,

    }).pipe(
      map((resp: IWebHookChatResponse) => {
        if (resp) {

          const arrData: any = resp;
          

          for (let i = 0; i < arrData.length; i++) {
            let botMessage: any;
            if (arrData[i].text != null) {

              botMessage = new Message(arrData[i], 'bot');
              botMessage.Type = 0;
            }
            if (arrData[i].buttons != undefined) {
              document.getElementsByClassName('cb-footer-input')[0].getElementsByTagName('input')[0].readOnly = true;


            }
            else {
              document.getElementsByClassName('cb-footer-input')[0].getElementsByTagName('input')[0].readOnly = false;

            }

            setTimeout(() => {
              this.update(botMessage);
            }, 3000 * i)
          }
          return resp;
        }
      })
    )
  }


  getChatBoardDefaultResponse(message: any, email: any): Observable<IWebHookChatResponse> {
    this.sendemail = email;
    let data = {
      "sender": email + _Session,
      "message": message
    }
    return this._http.post<IWebHookChatResponse>(this.api.WebhookApi, data).pipe(
      map((resp: IWebHookChatResponse) => {
        if (resp) {

          const arrData: any = resp;
          

          let botMessage;
          botMessage = new Message('', 'bot');
          botMessage.Type = 3;
          setTimeout(() => {
            this.update(botMessage);
          }, 3000 * 1)

          return resp;
        }
      })
    )
  }
  quoteid = "Q0001";
  PhoneFormate(phone) {
    let phoneTest = new RegExp(/^((\+1)|1)? ?\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})( ?(ext\.? ?|x)(\d*))?$/);

    phone = phone.trim();
    let results = phoneTest.exec(phone);
    if (results !== null && results.length > 8) {
      //alert("(" + results[3] + ") " + results[4] + "-" + results[5] + (typeof results[8] !== "undefined" ? " x" + results[8] : ""));
      return "(" + results[3] + ") " + "-" + results[4] + "-" + results[5] + (typeof results[8] !== "undefined" ? " x" + results[8] : "");

    }
    else {
      // alert(phone);
      return phone;
    }
  }
  public sendFormData(formData, email) {

    let origin = window.location.origin;

    if(origin.includes('localhost')) {
      origin = "https://convelo.agenciiq.net";
    }

    let url = `${origin}/fbapiprod/api/aqform/UploadAQDocuments/${email}/${this.quoteid}`;

    console.log("quoteidurl >>>>>>>>>>>>>>>>>>>>>>>" + url);

    console.log("quoteid ----- >>>>>>>>>>>>>>>>>>>>>>>" + this.quoteid);

    return this._http.post<uploadresp>(url, formData).pipe(
      map((resp: uploadresp) => {
        if (resp) {

          console.log("LLLLLLLLLLLLLLLLL  >>>>>>>> " + resp.status);
          return resp;
        }
      }

      ));

  }
}

// public getDefaultResponse(flagparam:any) {   
//   let data = flagparam ;
//   // {      
//   //   "Input": "hi",
//   //   "SessionId":_Session
//   //  } 

//   return this._http.post<IWebHookChatResponse>(this.api.WebhookApi, data)

//     .pipe(
//       map((res: IWebHookChatResponse) => {
//         


//         for (let i = 0; i < 3 ; i++) {

//           let flag ;
//           if(i == 0){
//             flag ={"name": "",

//           }

//         }

//        // const text: Message[] = [];
//         //text.push[res.data[0].text]
//         // const arrData: any = res.data;
//         // 
//         // for (let i = 0; i < arrData.length; i++) {
//         //   let botMessage: any;
//         //   if (arrData[i].text != null) {
//         //     botMessage = new Message(arrData[i].text, 'bot');
//         //     botMessage.Type = 0;
//         //   }
//         //   else if (arrData[i].quickReplies != null) {
//         //     botMessage = new Message(arrData[i], 'bot');
//         //     botMessage.Type = 2;
//         //   }
//         let botMessage: any;
//         botMessage.Type = 0;
//           setTimeout(() => {
//             this.update(botMessage);
//           }, 3000 * 1)
//         }
//         // for (let i = 0; i < text.length; i++) {
//         //   const botMessage = new Message(text[i], 'bot');
//         //   setTimeout(() => {
//         //     this.update(botMessage);
//         //      },3000 * i)
//         // }
//       })
//     )
// }



let sessionId = Math.floor(Math.random() * (9999999 - 1000000)) + 1000000;
let _Session = sessionId;
export class Message {
  timestamp: Date;
  constructor(public content: any, public sentBy: string, timestamp?: Date) {

  }





}
