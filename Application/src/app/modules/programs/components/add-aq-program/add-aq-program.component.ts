import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQUserInfo } from '@agenciiq/login';
import { MAnageProgramService } from '@agenciiq/aq-programs';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { Router } from '@angular/router';
import { AQSession } from 'src/app/global-settings/session-storage';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-aq-program',
  templateUrl: './add-aq-program.component.html',
  styleUrls: ['./add-aq-program.component.sass'],
  standalone: false
})
export class AddAqProgramComponent implements OnInit {

  userId: number;
  programFormDefinition: any;
  env = environment;
  baseURL: any;
  ClientID = '123';
  FormDefinition: any[] = [];
  FormDataID = 'AQ-DB';
  DevMode: boolean = false;
  QuoteStage = '';
  AQProgramData: any;
  AQFormData: any;
  programId: any;
  programName: string;
  formID: number;

  constructor(
    private _loader: LoaderService,
    private _userInfo: AQUserInfo,
    private _programService: MAnageProgramService,
    private _popupService: PopupService,
    private _sessionService: AQSession,
    private _router: Router,) {
    this.userId = _userInfo.UserId();
  }

  ngOnInit() {
    this.setBaseURL();
    this.AQProgramData = JSON.parse(this._sessionService.getData('AQProgramData'));
    if (this.AQProgramData) {
      this.programId = this.AQProgramData.programId;
      this.programName = this.AQProgramData.programName;
      this.formID = this.AQProgramData.formID;
      this.getFormById(this.programId, this.formID);
    }
    else this.addAqProgramForm();
  }

  setBaseURL() {
    if (this.env.multiClient && this.env.production) {
      this.baseURL = window.location.origin + "/";
    } else {
      this.baseURL = "http://125.63.66.115:9096/";
    }
  }

  AQCancelDataOut(event: any) {
    this._router.navigateByUrl('/agenciiq/programs/list');
  }

  addAqProgramForm() {
    this._loader.show();
    this._programService.AQProgram(this.userId).subscribe(dataResp => {
      this._loader.hide();
      if (dataResp?.success) {
        this.QuoteStage = 'QQ';
        this.programFormDefinition = JSON.parse(atob(dataResp?.data?.aQProgramsForms[0]?.programDefinition));
        this.formID = dataResp?.data?.aQProgramsForms[0]?.formId;
      } else {
        let ref = this._popupService.showPopup('Program', dataResp?.message);
        ref.afterClosed.subscribe(resp => {
          this._router.navigateByUrl('/agenciiq/programs/list');
        })
      }
    }, (err) => {
      this._loader.hide();
      console.log("err", err);
    }, () => {
      this._loader.hide();
    });
  }

  getFormDataMaster(event: any) {
    let formData = btoa(JSON.stringify(event['aqDataModel']));
    let data = {
      "UserID": this.userId,
      "ProgramID": this.programId ? this.programId : 0,
      "ProgramName": this.programName ? this.programName : "",
      "CarrierId": 0,
      "FormData": formData,
      FormID: this.formID,
      "IsActive": true
    }
    this._loader.show();
    this._programService.SaveAQProgram(data).subscribe(dataResp => {
      this._loader.hide();
      if (dataResp?.success) {
        this._router.navigateByUrl('agenciiq/programs/list');
        //    this.QuoteStage = 'QQ';
        //this.programFormDefinition = JSON.parse(atob(dataResp.data.aQProgramsForms[0].programDefinition));
      } else {
        this._popupService.showPopup('Program', dataResp.message);
      }
    }, (err) => {
      this._loader.hide();
      console.log("err", err);
    }, () => {
      this._loader.hide();
    });

  }

  getFormById(programId: any, formId: number) {
    let data = {
      UserID: this.userId,
      ProgramID: programId,
      FormID: formId
    }
    this._loader.show();
    this._programService.GetProgramByIDApi(data).subscribe(dataResp => {
      this._loader.hide();
      if (dataResp?.success) {
        this.QuoteStage = 'QQ';
        this.programFormDefinition = JSON.parse(atob(dataResp.data.programsDefinition.programDefinition));
        this.AQFormData = JSON.parse(atob(dataResp.data.program.formData));
      } else {
        this._popupService.showPopup('Program', dataResp?.message);
      }
    }, (err) => {
      this._loader.hide();
      console.log("err", err);
    }, () => {
      this._loader.hide();
    });

  }

}
