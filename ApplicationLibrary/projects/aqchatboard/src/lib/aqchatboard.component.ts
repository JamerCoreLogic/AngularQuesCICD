
import { ScrollToBottomDirective } from './scroll-to-bottom.directive';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Observable, from, ReplaySubject } from 'rxjs';
import { scan } from 'rxjs/operators';
import { Message, AqchatboardService } from './aqchatboard.service';
import { Router } from '@angular/router';
import { AutoFocusDirective } from './auto-focus.directive';
import { EmailValidator } from '@angular/forms';
import { uploadresp } from './interface/Upload';
@Component({
    selector: 'lib-aqchatboard',
    template: `
  <div class="floating-icon" (click)="OpenChatBot()">
  <!-- <span>2</span> -->
  <img src="assets/images/chat_new.png">
</div>
<div class="chatbot-block"  *ngIf="ChatbotsActive">
<div class="cb-header">
    <div class="cb-header-icon">
        <img src="assets/images/user-icon.png">
    </div>
    <div  *ngIf="status==''" class="cb-header-name" style="padding-top: 10px;width: 140px;">
    <p>Alice</p>      
    </div>
    <div  *ngIf="status!=''" class="cb-header-name" style="width: 140px;" >
    <p>Alice</p>
    <p>{{status}}</p>
    </div>
	 <div class="cb-header-close tooltip"  *ngIf="portallink">
        <img (click)="WebLinkChatBot()" style="margin-top: 11px; "src="assets/images/portal-link-2.png">
        <span class="tooltiptext" style="bottom: 31px;">Take me to the portal</span>
    </div>
	 <div class="cb-header-close tooltip" id="resetimg" >
        <img (click)="ResetChatBot()" style="width: 18px;" src="assets/images/Reset.png">
        <span class="tooltiptext" style="bottom: 31px;">Reset</span>
    </div>
    <div class="cb-header-close">
        <img (click)="CloseChatBot()" style="width: 22px;margin-left: 0px;" src="assets/images/closeicon.png">
    </div>
</div>
<div class="cb-content" style="width:302px" id="myDiv">
    <div class="cb-autoreply" *ngFor="let message of messages | async">
      <div *ngIf="message.sentBy === 'bot'">
      <span *ngIf="message.Type == 0">
          <div class="cb-autoreply-icon" style="margin-top: 8px;float: inherit;">
              <img src="assets/images/chat_new.png">
          </div>
          <div class="cb-autoreply-text">

              <p class="cbtext-main icontext" style='word-wrap: break-word;'> {{ message.content.text }} </p>
          </div>
        </span>
          
        <span *ngIf="message.Type == 0">
         
          <div class="cb-request" style="margin-top: 5px;">
              <p *ngFor="let reply of message.content.buttons"> <button  (click)="request(reply.payload,reply.title)">{{ reply.title }}</button> </p>
          </div>
          </span>
      </div>

      <ng-container *ngIf="message.sentBy === 'upload'">     
          <div class="cb-autoreply-icon" style="margin-top: 8px;float: inherit;">
              <img src="assets/images/chat_new.png">
          </div>
          <div class="cb-autoreply-text">
              <p class="cbtext-main" style='word-wrap: break-word;'> {{ message.content.text }} </p>
          </div>
          <div class="cb-request" style="margin-top: 18px;height: 50px;">            
            <p> <button  class="sendbtn" (click)="UploadFile()" style='color: #666; background-color:white ' [disabled]="sendbutton" >Send</button> </p> 
            <p><label for="accordfile" title="{{fileName}}" style="border: 1px solid #ccc;display: inline-block;padding: 3px 12px;cursor: pointer;border-radius: 10px;color: #666;
                font-size: 14px;">
              {{fileNameSub}} Choose File
              </label>
			        <input type='file' id='accordfile' accept="application/pdf" (change)="uploadPdf($event)" style='width:40px;display:none;' name='accordfile' >      
            </p>     
          </div>         
      </ng-container>

       
      <div *ngIf="message.sentBy === 'user'">
          
          <div class="cb-autoreply-text fl_user_chat">
              <p class="cbtext-main" style='word-wrap: break-word;'> {{ message.content }}</p>
          </div>
          
          <div class="cb-autoreply-icon fl_user_icon">
              <img src="assets/images/user-icon.png">
          </div>
      </div>
       
       
    </div>     
   
</div>
<div class="cb-footer">
    <div class="cb-footer-input"  >
        <input class='msginput' type="text" #autoFocusDirective [(ngModel)]="formValue" (keyup.enter)="sendMessage()" (focus)="focusEvent()" (click)="focusEvent()" class="cb-footer-iptext" placeholder="Enter your message..."  datoAutoFocus>
    </div>
    <div class="cb-footer-send">
        <!---<img src="assets/images/send.png" (click)="sendMessage()">--->
    </div>
</div>
</div>  
  `,
    styles: [],
    standalone: false
})
export class AqchatboardComponent implements OnInit {

  @ViewChild(ScrollToBottomDirective, { static: true })
  scroll: ScrollToBottomDirective;
  f = true;
  chatBotShow = false;
  fileName = "";
  fileNameSub = "";
  ChatbotsActive: boolean = false;
  sendbutton: boolean = true;
  @Input() identifier !: any;
  @Input() email !: any;
  @Input() userid: any;
  @Input() name !: any;
  @Input() portallink: boolean;
  @Input() isOpen: boolean;
  @Input() isFQOpen: boolean;
  @Output('NavigateToPortal') navigateToPortal = new EventEmitter();
  @Output('NavigateToPortalFQ') navigateToPortalFQ = new EventEmitter();
  senderemail: any = "";


  @ViewChild(AutoFocusDirective, { static: false }) directive: AutoFocusDirective;


  messages: Observable<Message[]>;
  formValue: string;
  status: string = "";
  dataname = {
    "name": this.name,
  }
  dataident = {
    "identifier": this.identifier,
  }
  dataemail = {
    "email": this.email,
  }
  constructor(public chat: AqchatboardService, private router: Router) {

  }

  ngOnInit() {

    this.senderemail = this.email.split("@")[0];

    this.getReset();
    if (this.isOpen) {
      this.OpenChatBot();
    }
  }

  TabscrollupMobile() {
    setTimeout(function () {
      var x = document.getElementsByClassName('cb-content')[0].scrollTop = 15000;
    }, 500);
  }

  scrollupMobile(x) {
    setTimeout(function () {
      console.log('scrollupMobile............... ');
      var x = document.getElementsByClassName('cb-content')[0].scrollTop = 15000;
    }, 900);
  }

  getReset() {
    this.chat.reset();
  }

  getConsole() {
    if (this.chat.conversation) {
      this.messages = this.chat.conversation
        .pipe(
          scan((acc, val: any) => {

            return acc.concat(val)
          })
        )

      this.messages.subscribe(resp => {

        this.scrollToBotttom()

      })


    }
  }

  // sendMessage() {  
  //     alert(" 1this.formValue"+this.formValue);    
  //     this.status = "Typing...";
  //     
  //     this.chat.getResponse(this.formValue,null).subscribe(data=>{

  //     }), 
  //     setTimeout(() => {
  //       this.status= "" ;
  //       },9000)

  //     this.formValue = '';
  // }
  resetcount = 1;
  ResetChatBot() {
    if (this.resetcount == 1) {
      return 0;
    }
    this.status = "";
    //console.log("rest......");
    document.getElementsByClassName('cb-footer-input')[0].getElementsByTagName('input')[0].value = '';
    this.chat.getChatBoardResponse("reset", this.senderemail, true).subscribe(data => {

      this.resetcount = 1;
    }),
      setTimeout(() => {
        this.status = "";
        this.getConsole();
      }, 2000)
  }
  WebLinkChatBot() {

    try {
      this.resetcount = 1;
      let buttoncount = document.getElementsByClassName('chatbot-block')[0].getElementsByTagName('button').length;
      for (let i = 0; i < buttoncount; i++) {
        document.getElementsByClassName('chatbot-block')[0].getElementsByTagName('button')[i].disabled = true;
        document.getElementsByClassName('chatbot-block')[0].getElementsByTagName('button')[i].style.color = "#666";
        document.getElementsByClassName('chatbot-block')[0].getElementsByTagName('button')[i].style.backgroundColor = "white";
      }
    } catch (error) {
      console.log(error)
    }
    this.navigateToPortal.emit(true);
    this.CloseChatBot();

  }
  WebLinkChatBotFQ() {
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
    this.navigateToPortalFQ.emit(true);
    this.CloseChatBot();

  }

  conversation = new ReplaySubject<Message[]>();
  update(msg: Message) {
    // console.log('test 11111111111111');
    this.conversation.next([msg]);

  }

  resethi() {
    this.conversation = new ReplaySubject<Message[]>(0);
  }


  sendUserMessage(meg: any) {

    this.status = "Typing...";




    this.chat.getChatBoardUserResponse(meg, this.senderemail).subscribe(data => {

    }),
      setTimeout(() => {
        this.status = "";
      }, 1000)


  }

  sendMessage() {
    let payrollcount = 1;

    this.status = "Typing...";
    try {
      if (this.formValue.trim() == '') {
        this.status = " ";
        return false;
      }
    } catch (err) {
      this.status = " ";
    }

    var str = this.formValue;
    var res = str.charAt(0);
    if (res == '/' || res == '@') {
      // alert('test')
      str = str.substring(1);
    }


    //console.log("tttttttttttttt > "+this.formValue + this.formValue.trim() == '');


    this.chat.getChatBoardResponse(str, this.senderemail, this.isFQOpen).subscribe(data => {

      for (let i = 0; i < 15; i++) {
        document.getElementsByClassName('cb-content')[0].scrollTop = 5000;
      }
      //console.log("data >>>>>>> "+data[0].text)
      if (data[0].text.trim() == 'Getting the best possible rates for you. Please wait.') {
        console.log('calling default 1 payroll1');
        this.sendUserMessage('payroll1');
      }






    }),

      setTimeout(() => {
        this.status = "";
        if (document.getElementsByClassName('cbtext-main icontext')[document.getElementsByClassName('cbtext-main icontext').length - 1].textContent.trim() == 'Getting the best possible rates for you. Please wait.') {


        }

      }, 300)

    this.formValue = '';
  }
  countf = 0;

  sendDefaultMessage(flagparam: any) {

    this.status = "Typing...";





    this.chat.getChatBoardDefaultResponse(flagparam, this.senderemail).subscribe(data => {

      if (this.countf == 0) {
        this.countf = 1;

        this.sendDefaultMessage("identifier: " + this.identifier)
      } else if (this.countf == 1) {

        this.countf = 2;
        this.sendDefaultMessage("email: " + this.email)
      } else if (this.countf == 2) {

        this.countf = 3;
        this.sendDefaultMessage("userid: " + this.userid)
      } else if (this.countf == 3) {
        this.countf = 4;
        this.countdefault = 1;
        this.sendUserMessage("Hi")
      }

    }),
      setTimeout(() => {
        this.status = "";
      }, 9000)

    //this.formValue = '';
  }

  pdfdata: any;
  UploadFile() {
    this.sendbutton = true;
    this.chat.sendFormData(this.formData, this.email).subscribe((data: uploadresp) => {
      if (data.status == 'Success') {
        this.sendUserMessage("accordupload:success");
      } else {
        this.sendUserMessage("accordupload:failure");
      }
    },
      err => {

        this.sendUserMessage("accordupload:failure");
      });


    // this.sendUserMessage(this.pdfdata);
  }
  formData = new FormData();
  uploadPdf(event) {
    let PDFData: any;
    let uploadedFile = event.target.files[0];
    this.fileName = event.target.files[0].name;
    this.fileNameSub = this.fileName.substring(0, 9) + "..";;
    this.sendbutton = false;
    document.getElementsByClassName('sendbtn')[0].removeAttribute("style");
    this.formData.append('file', uploadedFile, this.fileName);
    uploadedFile.inProgress = true;
  }


  showResult(fr) {
    let markup, result, n, aByte, byteStr;

    markup = [];
    result = fr.result;
    for (n = 0; n < result.length; ++n) {
      aByte = result.charCodeAt(n);
      byteStr = aByte.toString(16);
      if (byteStr.length < 2) {
        byteStr = "0" + byteStr;
      }
      markup.push(byteStr);
    }

    this.pdfdata = markup.join(" ");;
    console.log("666666666666 >" + this.pdfdata);
  }
  request(req, Buttontaxt) {
    this.directive.focus();
    this.status = "Typing..";
    this.resetcount = 0;
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
    let path = window.location.host;
    //   if(path == "insur.agenciiq.net"){
    //     if(req == 'quickquoteyes'){
    if (req == 'accordformno') {

      if (this.isFQOpen) {
        this.resetcount = 1;
        this.WebLinkChatBotFQ();
      }
      return 0;
    }
    this.chat.getChatBoardButtonResponse(req, Buttontaxt, this.senderemail).subscribe(data => {
      if (req == 'no') {
        this.resetcount = 1;
      }
      if (req == 'AFTERSUBMISSIONFQ') {

        if (this.isFQOpen) {
          this.resetcount = 1;
          this.WebLinkChatBotFQ();
        }


      }
    }),


      setTimeout(() => {
        this.status = "";
        if (req == 'FQ-NO') {
          if (this.isFQOpen) {
            //this.ResetChatBot();
          }
        }



        // try{
        //   let path = window.location.host;
        //   if(path == "insur.agenciiq.net"){
        //     if(req == 'quickquoteyes'){
        //   // this._getWebhookApi = 'http://14.141.169.226:5005/webhooks/rest/webhook';
        //   let buttoncount = document.getElementsByClassName('chatbot-block')[0].getElementsByTagName('button').length ;
        //   console.log("----------"+buttoncount);
        //   for(let i=0 ;i < buttoncount ;i++){

        //     if(document.getElementsByClassName('chatbot-block')[0].getElementsByTagName('button')[i].textContent !="Workers Compensation"){
        //     document.getElementsByClassName('chatbot-block')[0].getElementsByTagName('button')[i].disabled = true;
        //     document.getElementsByClassName('chatbot-block')[0].getElementsByTagName('button')[i].style.color ="#666";
        //     document.getElementsByClassName('chatbot-block')[0].getElementsByTagName('button')[i].style.backgroundColor ="white" ;
        //   }
        //   }
        //     }
        //   }
        // }catch(err){

        // }


      }, 2000)
  }

  countdefault = 0;

  OpenChatBot() {


    this.ChatbotsActive = !this.ChatbotsActive;
    this.getConsole();

    if (this.countdefault != 1) {
      this.sendDefaultMessage("name:" + this.name);
    }

    this.getButtonDisable();
    // this.getDefaultResponse(this.messages);
  }

  getButtonDisable() {
    setTimeout(function () {

      try {
        let buttoncount = document.getElementsByClassName('chatbot-block')[0].getElementsByTagName('button').length;
        for (let i = 0; i < buttoncount - 2; i++) {
          document.getElementsByClassName('chatbot-block')[0].getElementsByTagName('button')[i].disabled = true;
          document.getElementsByClassName('chatbot-block')[0].getElementsByTagName('button')[i].style.color = "#666";
          document.getElementsByClassName('chatbot-block')[0].getElementsByTagName('button')[i].style.backgroundColor = "white";
        }
      } catch (error) {
        console.log(error)
      }


    }, 2000);
  }




  CloseChatBot() {
    this.ChatbotsActive = false;
  }

  openChatBot() {
    // alert('test');
    this.chatBotShow = !this.chatBotShow
  }




  scrollToBotttom() {
    setTimeout(() => {
      var objDiv = document.getElementById("myDiv");
      if (objDiv) {
        objDiv.scrollTop = objDiv.scrollHeight;
      }
    }, 0);
  }

  focusEvent() {
    setTimeout(() => {
      this.scrollToBotttom();
    }, 1000);

  }

  onResize(event) {
    setTimeout(() => {
      this.scrollToBotttom();
    }, 1000);
  }

}

