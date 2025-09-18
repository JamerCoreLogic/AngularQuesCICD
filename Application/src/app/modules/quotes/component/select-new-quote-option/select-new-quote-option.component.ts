import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgramService } from '@agenciiq/aqadmin';
import { AQUserInfo } from '@agenciiq/login';

@Component({
  selector: 'app-select-new-quote-option',
  templateUrl: './select-new-quote-option.component.html',
  styleUrls: ['./select-new-quote-option.component.sass'],
  standalone: false
})
export class SelectNewQuoteOptionComponent implements OnInit {

  programData: any[] = [];
  newQuoteOptionForm: FormGroup;
  StateList: any[] = [];
  private userId = 0;
  private clientId = 0;

  constructor(
    private _bf: FormBuilder,
    private _router: Router,
    private _programService: ProgramService,
    private _user: AQUserInfo
  ) {
    this.userId = this._user.UserId();
  }

  ngOnInit() {
    this.createNewQuoteOptionForm();
    this.getMGAPrograms();
    this.onFormChagne();
  }

  private createNewQuoteOptionForm() {
    this.newQuoteOptionForm = this._bf.group({
      LOB: ['', Validators.required],
      State: [{ value: '', disabled: true }, Validators.required],
      QuoteType: ['QQ', Validators.required]
    })
  }

  private onFormChagne() {
    this.newQuoteOptionForm.controls['LOB'].valueChanges.subscribe(lob => {
      this.StateList = this.programData.filter(state => state.lob == lob).map(program => program.state);
      this.newQuoteOptionForm.controls['State'].enable();
    })
  }

  CreateQuote() {
    if (this.newQuoteOptionForm.valid) {
      console.log("newQuoteOptionForm", this.newQuoteOptionForm.valid)
    }
  }

  private getMGAPrograms() {
    this._programService.MGAPrograms(this.userId, this.clientId).subscribe(programs => {
      if (programs?.data?.mgaProgramList) {
        /* this.programData = programs.data.programLob.map(program => {
          return {
            state: program.state,
            lob: program.lob,
            lobName: program.lobName
          }
        }); */
      }
    })
  }

}
