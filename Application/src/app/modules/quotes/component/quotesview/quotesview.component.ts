
import { Component, OnInit, ɵConsole, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AQUserInfo, AQAgentInfo, AQRoleInfo } from '@agenciiq/login';
import { AQSession } from 'src/app/global-settings/session-storage';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AQFormsService, AQSavePolicyService, AQConvertQuickQuoteService, IIssueQuoteRequest, IConvertQuickQuoteRequest, IProceedToBindReq, ISavePolicy, IIssueQuoteResp } from '@agenciiq/quotes';
import { Roles } from 'src/app/global-settings/roles';
import { AQQuotesListService, IQuotesFilterReq, AQSaveAdvanceFilterService, LOBService } from '@agenciiq/quotes';
import { CancelButtonService } from 'src/app/shared/services/cancelButtonSerrvice/cancelButton.service';
import { DatePipe } from '@angular/common';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';

@Component({
  selector: 'app-quotesview',
  templateUrl: './quotesview.component.html',
  styleUrls: ['./quotesview.component.sass'],
  providers: [DatePipe],
  standalone: false
})
export class QuotesviewComponent implements OnInit {
  pageTitle: any = "Quote View";
  dataSource: any;
  quoteviewform: FormGroup;
  RefNumber: any = "";
  Type: any = "";
  stage: any = "";
  EffectiveDate: any = "";
  ExpiryDate: any = "";
  CompanyName: any = "";
  PrimaryState: any = "";
  Website: any = "";
  AgentName: any = "";
  AgentAgency: any = "";
  AgentEmail: any = "";
  AgentPhone: any = "";
  UwName: any = "";
  UwID: any = "";
  LinckAcord: any = "";
  Submission: any = "";
  SelectUnderwriter: any = "";
  UwAssistent: any = "";
  DispositionDecline: any = "";
  DispositionAccept: any = "";
  DispositionPending: any = "";
  Quotedata: any[];
  comments: any = "";
  private _userId = 0;
  private _agencyId = 0;
  private _agentId = 0;
  CilentID: number = 0;
  private _quoteId = 0;
  NoRecordsMessage: any;
  public underwriterlist = [];
  public underwriterAssistentlist = [];
  flag = false;
  colorA = 'red';
  colorB = '#ced4da';
  dispA = 'inline-block';
  dispB = 'none';

  // Check Box
  IsDecline: boolean = true;
  IsAccept: boolean = true;
  butDisabled: boolean = false;
  butDisabledUW: string = "disabled";
  constructor(
    private _aqformsService: AQFormsService,
    private _savePolicy: AQSavePolicyService,
    private _userInfo: AQUserInfo,
    private _agentInfo: AQAgentInfo,
    private _sessionService: AQSession,
    private _popup: PopupService,
    private _datePipe: DatePipe,
    private _router: Router,
    private loaderService: LoaderService,
    private session: AQSession,
    private _route: ActivatedRoute,
    private _covertQQtoFQ: AQConvertQuickQuoteService,
    private _roles: AQRoleInfo,
    private frmbuilder: FormBuilder,
    private _quotesService: AQQuotesListService,
    private cancelButtonService: CancelButtonService,
    private _checkRoleService: CheckRoleService
  ) {
    // this._userId = 119;//this._userInfo.UserId() ? this._userInfo.UserId() : 0;
    // this._quoteId=1130;
    // this._agencyId = this.agencyInfo.Agency() && this.agencyInfo.Agency().agencyId ? this.agencyInfo.Agency().agencyId : 0;
    this._agentId = this._agentInfo.Agent() && this._agentInfo.Agent().agentId ? this._agentInfo.Agent().agentId : 0;

    this.createquoteviewform();
  }

  ngOnInit() {
    this.pageTitle = "Quote view";
    this._sessionService.removeSession("quoteView");
    let viewPolicyParams: any = this.session.getData("viewPolicyParams");
    this._quoteId = viewPolicyParams.QuoteId;
    this._userId = viewPolicyParams.UserId;
    this._agentId = viewPolicyParams.AgentId;
    this.getQuoteView();
    this.getQuoteViewUwList();
  }

  getQuoteView() {
    this.loaderService.show();
    this._quotesService.QuotesViewFilter(this._quoteId, this._userId).subscribe(data => {
      this.dataSource = data.data.quotes;
      this.setQuoteViewValue(this.dataSource);
    },
      err => {
        this.loaderService.hide();
      },
      () => {
        this.loaderService.hide();
      });
  }
  createquoteviewform() {
    this.quoteviewform = this.frmbuilder.group({
      RefNumber: [''],
      Type: [''],
      stage: [''],
      EffectiveDate: [''],
      ExpiryDate: [''],
      CompanyName: [''],
      PrimaryState: [''],
      Website: [''],
      AgentName: [''],
      AgentAgency: [''],
      AgentEmail: [''],
      AgentPhone: [''],
      UwName: [''],
      UwID: [''],
      UwaName: [''],
      UwaID: [''],
      //LinckAcord:new FormControl(),
      //Submission:new FormControl(),
      SelectUnderwriter: [{ value: 'null', disabled: this.butDisabled }],
      UwAssistent: [{ value: 'null', disabled: this.butDisabled }],
      DispositionDecline: [''],
      DispositionAccept: [''],
      DispositionPending: [true],
      comments: ['']
    });


  }
  checkRole() {
    if (this._checkRoleService.isRoleCodeAvailable(Roles.Underwriter.roleCode, this._roles.Roles())
      || this._checkRoleService.isRoleCodeAvailable(Roles.UWManager.roleCode, this._roles.Roles())
      || this._checkRoleService.isRoleCodeAvailable(Roles.UWSupervisior.roleCode, this._roles.Roles())) {
      this.butDisabled = false;
    }
  }

  getQuoteViewUwList() {
    this._quotesService.QuotesViewUwList(this._userId, this._agentId, this.CilentID).subscribe(data => {
      this.underwriterlist = data.data.underwriterList.filter(underwriterList => {
        return underwriterList.userType == "Underwriter" && underwriterList.id != this._userId;
      });;
    },
      err => {
        console.log("err", err);
      },
      () => {
        /* this.loaderService.hide(); */
      });
  }

  getPolicyDoc() {
    this.loaderService.show();
    this._quotesService.DownloadAcordForm(this._quoteId, 12)    //(this._userId, this._agentId, this.CilentID)
      .subscribe(data => {

        /*  var binaryImg = atob(data.data.proposalDocumentData);
         var binaryImgLength = binaryImg.length;
         var arrayBuffer = new ArrayBuffer(binaryImgLength);
         var uInt8Array = new Uint8Array(arrayBuffer);
 
         for (var i = 0; i < binaryImgLength; i++) {
           uInt8Array[i] = binaryImg.charCodeAt(i);
         } */
        var outputBlob = new Blob([data], { type: 'application/pdf' });
        var pdfUrl = window.URL.createObjectURL(outputBlob);
        window.open(pdfUrl);
      },
        err => {
          this.loaderService.hide();
          console.log("err", err);
        },
        () => {
          this.loaderService.hide();
        });
  }

  setQuoteViewValue(quotedata: any) {
    this.quoteviewform.patchValue({
      "RefNumber": quotedata.ref,
      "Type": quotedata.transactionCode,
      "stage": quotedata.stageId,
      "EffectiveDate": this._datePipe.transform(quotedata.effective_Date, 'MM/dd/yyyy'),
      "ExpiryDate": this._datePipe.transform(quotedata.expiry_Date, 'MM/dd/yyyy'),
      "CompanyName": quotedata.insuredName,
      "PrimaryState": quotedata.state,
      "Website": quotedata.website,
      "AgentName": quotedata.agentName,
      "AgentPhone": quotedata.phone ? quotedata.phone.replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '',
      "AgentAgency": quotedata.agencyName,
      "AgentEmail": quotedata.email,
      "UwName": quotedata.underwriter,
      "UwID": quotedata.underwriterID,
      "UwaName": quotedata.underwriterAssistant,
      "UwaID": quotedata.underwriterAssistantID,
      "comments": quotedata.comments,
      "DispositionDecline": false,
      "DispositionAccept": false,
      "DispositionPending": true
    });
    this.underwriterAssistentlist = quotedata.underwriterAssistants;
    const ele = document.getElementById('Pending') as HTMLInputElement;
    ele.checked = true;
    //document.getElementById("keepOpenredio").click();
    let flagvariable: any;
    if (this.underwriterAssistentlist.length > 0) {
      flagvariable = quotedata.underwriterAssistantID;
    } else {
      flagvariable = "null";
    }
    if (this.butDisabled) {
      this.quoteviewform.patchValue({
        DispositionDecline: false,
        "SelectUnderwriter": quotedata.underwriterID,
        "UwAssistent": flagvariable
      });
      this.quoteviewform.get('SelectUnderwriter').disable();
      this.quoteviewform.get('UwAssistent').disable();
    }
  }

  saveData(quoteviewform: any) {
    let disposision = "Refer To";
    let UW: number;
    let UWA: number;
    let commentvalue = quoteviewform.value.comments;
    let UwID = quoteviewform.value.UwID;
    let UwaID = quoteviewform.value.UwaID;

    //alert("SelectUnderwriter > "+quoteviewform.value.SelectUnderwriter);
    //alert("UwAssistent > "+quoteviewform.value.UwAssistent);

    if (quoteviewform.value.DispositionAccept) {
      disposision = "Accept";
      UW = 0;
      UWA = 0;
    } else if (quoteviewform.value.DispositionDecline) {
      disposision = "Decline";
      UW = 0;
      UWA = 0;
      if (quoteviewform.value.comments == "" || quoteviewform.value.comments == null) {
        this.flag = true;
        return false;
      }
    } else {
      if (quoteviewform.value.SelectUnderwriter != "null" && quoteviewform.value.SelectUnderwriter != null) {
        UW = quoteviewform.value.SelectUnderwriter;
        UWA = 0;
      } else if (quoteviewform.value.UwAssistent != "null" && quoteviewform.value.UwAssistent != null) {
        UWA = quoteviewform.value.UwAssistent ? quoteviewform.value.UwAssistent : 0;
        UW = quoteviewform.value.UwID;
      } else {
        UW = UwID ? UwID : 0;
        UWA = UwaID ? UwaID : 0;
      }
    }

    this.loaderService.show();
    this._quotesService.QuoteViewSubmition(this._quoteId, this._userId, disposision, UW, UWA, commentvalue)
      .subscribe(data => {
        this.loaderService.hide();
        this.dataSource = data.success;

        if (data.success) {
          this.cancelButtonService.NavigateToHome();
        } else {
          this._popup.showPopup('QuoteView', data.message);
        }
        //this.setQuoteViewValue(this.dataSource);
      },
        err => {
          this.loaderService.hide();
          console.log("err", err);
        },
        () => {
          this.loaderService.hide();
        });
  }


  openLinckAcordform() {
    this.getPolicyDoc();
  }

  ReviewSubmission() {
    let viewPolicyParams: any = this.session.getData("viewPolicyParams");
    viewPolicyParams.Action = "EDIT";
    this.session.setData("viewPolicyParams", viewPolicyParams);
    this._sessionService.setData("navType", "quoteView");
    this._router.navigate(['agenciiq/workbook/quickquote'])
  }

  riskAnalysis() {
    let viewPolicyParams: any = this.session.getData("viewPolicyParams");
    viewPolicyParams.Action = "Risk";
    this.session.setData("viewPolicyParams", viewPolicyParams);
    this._sessionService.setData("navType", "quoteView");
    this._router.navigate(['agenciiq/workbook/quickquote'])
  }

  cancel() {
    this.cancelButtonService.NavigateToHome();
  }

  validateComm() {
    this.flag = false;
  }

  Decline() {
    this.flag = true;
    this.quoteviewform.patchValue({
      DispositionAccept: false,
      DispositionPending: false,
      SelectUnderwriter: 'null',
      UwAssistent: 'null'
    });
  }

  Accept() {
    // alert("test");
    this.flag = false;
    this.quoteviewform.patchValue({
      DispositionDecline: false,
      DispositionPending: false,
      SelectUnderwriter: 'null',
      UwAssistent: 'null'
    });
  }

  Pending() {
    this.flag = false;
    this.quoteviewform.patchValue({
      DispositionDecline: false,
      DispositionAccept: false,
      SelectUnderwriter: 'null',
      UwAssistent: 'null'
    });
  }

  UWASelect() {
    this.quoteviewform.patchValue({
      DispositionDecline: false,
      SelectUnderwriter: 'null',
      //  UwAssistent :'null',
      // DispositionPending: true,
      DispositionAccept: false
    });
  }

  UWSelect() {
    this.quoteviewform.patchValue({
      DispositionDecline: false,
      //  SelectUnderwriter:'null',
      UwAssistent: 'null',
      DispositionAccept: false,
      // DispositionPending: true
    });
  }

}


