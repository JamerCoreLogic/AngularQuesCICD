import { Component, OnInit } from '@angular/core';
import { AQDialogService } from './aqdialog.service';

@Component({
    selector: 'app-aqdialog',
    template: `
  
<div *ngIf="isDialogOpen" class="quickQuotesLayer">
    <div class="pagemodal">
        <div class="select-quick-quote-header">
            <h2>New Quote</h2>
            <span (click)="closeDialog()" class="close-dialog"><img src="assets/images/delete-popup.png"></span>
        </div>
        <div class="pagemodal-content">
            <div class="modal_select_quote">
                <div class="col-md-12 pd_zero">
                    <div class="form-group">
                        <label class="textbox_borderlabel mb-10">Select Quote Type</label>
                        <div class="styled-radio">
                            <div class="radio">
                                <input type="radio" id="SQ_Quick" name="Sq_Type" checked>
                                <label for="SQ_Quick" class="alert_check">
                                    <div class="checker"></div>
                                    Quick Quote
                                </label>
                            </div>
                            <div class="radio">
                                <input type="radio" name="Sq_Type" id="SQ_Full">
                                <label for="SQ_Full" class="alert_check">
                                    <div class="checker"></div>
                                    Full Quote
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
            <div class="col-md-12">
                <div class="col-sm-6 col-md-6 col-lg-6">
                    <div class="form-group">
                        <label class="textbox_borderlabel">LOB</label>
                        <select class="form-control dropdown_border" style="background: transparent">
                            <option disabled selected>Select</option>
                            <option>WCP</option>
                        </select>
                    </div>
                </div>
            <div class="col-sm-6 col-md-6 col-lg-6">
                <div class="form-group">
                    <label class="textbox_borderlabel">Primary State</label>
                    <select class="form-control dropdown_border" style="background: transparent">
                        <option disabled selected>Select</option>
                        <option>New York</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
    <div class="pagemodal-footer">
    <button (click)="redirctToQuote()" class="btn btn-theme-radius width-160">OK</button>
    </div>
  </div>
</div>
    
  `,
    styles: [],
    standalone: false
})
export class AQDialogComponent implements OnInit {

    isDialogOpen: boolean = false;

    constructor(
        private dialogSerice: AQDialogService
    ) { }

    ngOnInit() {
        this.dialogSerice.DialogMessage
            .subscribe(data => {
                this.isDialogOpen = data;
            })
    }

    redirctToQuote() {
      

        this.isDialogOpen = false;
        this.dialogSerice.Response.next(true);
    }

    closeDialog() {
        this.isDialogOpen = false;
    }

}


