import { Component, OnInit } from '@angular/core';
import { PopupService } from './popup.service';

@Component({
    selector: 'app-popup',
    template: `  
  <div class="popup-quickQuotesLayer" (click)="HideModal()"  *ngIf="overlayhidden">
  <div class="popup-pagemodal" >
    <div class="popup-select-quick-quote-header">
        <h2>{{heading}}</h2>
        <span (click)="HideModal()" class="close-dialog"><img src="assets/images/delete-popup.png"></span>
    </div>
    <div class="popup-pagemodal-content">
      <div class="popup-single-text">
        {{message}}
      </div>
    </div>
    <div class="popup-pagemodal-footer">
      <button [loginPopupFocus]="overlayhidden"  (click)="OKModal()" class="btn btn-theme-radius width-160" >OK</button>
    </div>
</div>
</div>
  `,
    styles: [`
  
  `],
    standalone: false
})
export class PopupComponent implements OnInit {


  overlayhidden: boolean = false;
  message;
  heading;

  programData;


  HideModal() {
    this.overlayhidden = false;
  }

  OKModal() {
    this.overlayhidden = false;
    this.popupService.response.next(true);
  }

  constructor(
    private popupService: PopupService,  
  ) {
    
   }

  ngOnInit() {

    //console.log(this.programData);

    this.popupService.popupMessage.subscribe(data => {
      this.overlayhidden = data.display;
      this.message = data.message;
      this.heading = data.heading;
    })
  }
}

