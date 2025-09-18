import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DialogConfig } from '../aq-dialog/dialog-config';
import { DialogRef } from '../aq-dialog/dialog-ref';

@Component({
  selector: 'app-new-popup',
  template: `    
  <div class="popup-pagemodal" >
    <div class="popup-select-quick-quote-header">
        <h2>{{programData.title}}</h2>
        <!--   <span (click)="HideModal()" class="close-dialog"><img src="assets/images/delete-popup.png"></span> -->
    </div>
    <div class="popup-pagemodal-content">
      <div class="popup-single-text">
        {{programData.message}}
      </div>
    </div>
    <div class="popup-pagemodal-footer">
      <button [loginPopupFocus]="overlayhidden"  (click)="OKModal()" class="btn btn-theme-radius width-160" >OK</button>
    </div>
</div>

  `,
  styles: [`
  
  `],
  standalone: false
})
export class NewPopupComponent {

  overlayhidden: boolean = true;
  programData;

  constructor(
    private config: DialogConfig,
    private dialog: DialogRef,
  ) {
    this.programData = this.config.data;
  }

  OKModal() {
    let host = window.location.host;
    if (host.includes("convelo") || host.includes("demo") || host.includes("aqnext")) {
      let action = sessionStorage.getItem("saveclose") == 'true' ? true : false;
      if (this.programData?.message?.toLowerCase()?.includes('premium')) action = false;
      this.dialog.close(action);
    }
    else {
      this.dialog.close(true);
    }
  }

  HideModal() {
    this.dialog.close(false);
  }

}

