import { Component, OnInit, OnDestroy } from '@angular/core';
import { AQUserInfo, AQAgentInfo, AQRoleInfo } from '@agenciiq/login';
import { AQSession } from 'src/app/global-settings/session-storage';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AQFormsService, AQSavePolicyService, AQConvertQuickQuoteService, IIssueQuoteRequest, IConvertQuickQuoteRequest, IProceedToBindReq, ISavePolicy, IIssueQuoteResp } from '@agenciiq/quotes';
import { Roles } from 'src/app/global-settings/roles';
import { DialogService } from 'src/app/shared/utility/aq-dialog/dialog.service';
import { QuotesDialogComponent } from 'src/app/shared/components/quotes-dialog/quotes-dialog.component';
import { ProgramService } from '@agenciiq/aqadmin';
import { InsuredsProspectsService } from '@agenciiq/quotes'
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { DatePipe } from '@angular/common';
import { ApiUrlSettings } from 'src/app/global-settings/url-settings';
import { Store } from '@ngrx/store';
import { selectPrograms, selectProgramsLoading } from 'store/selectors/workboard.selectors';
import { take } from 'rxjs/operators';
import { loadMGAPrograms } from 'store/actions/workboard.action';



@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.sass'],
  providers: [DatePipe],
  standalone: false
})
export class QuotesComponent implements OnInit, OnDestroy {

  isOpenTask: boolean = false;
  //AQFormData: any[] = []; // Array of object same as Form BuildData
  AQFormData: any;
  ClientID = '123'; // Client Id
  FormDefinition;
  FormDataID = 'AQ-DB';
  DevMode: boolean = false;
  env = environment;
  baseURL: string;
  formId: number;

  policyDetails: string;
  formDefinition: string;
  data: any;
  lob: string[] = [];
  formType: string;
  state: string;
  formMode: any = "";
  quoteId = 0;
  isFullQuote: boolean = false;
  isPolicyBind: boolean = false;
  isIssueQuote: boolean = false;
  QuoteStage: boolean = true;
  FullQuotesFormData: any[] = [];
  navType: any;
  insuredView: any;
  quoteInsured: any;
  navtypeNew: any;
  programData: any = [];
  referenceNumber: any = "";
  variables = {
    agentname: "",
    quoterefrencenumber: "",
    AqQuoteID: "",
    agentemail: ""
  };
  actionName: string = "";
  private agentId: Number = 0;
  private userId = 0;
  private clientId: Number = 0;
  private mySubscription;
  insuredId: any;
  viewPolicyParams: any;
  lobMaster: string[];

  constructor(
    private _aqformsService: AQFormsService,
    private _savePolicy: AQSavePolicyService,
    private _userInfo: AQUserInfo,
    private _agentInfo: AQAgentInfo,
    private _sessionService: AQSession,
    private _popup: PopupService,
    private _loader: LoaderService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _covertQQtoFQ: AQConvertQuickQuoteService,
    private _roles: AQRoleInfo,
    private dialogService: DialogService,
    private _programService: ProgramService,
    private _insuredsProspects: InsuredsProspectsService,
    private _checkRoleService: CheckRoleService,
    private _role: AQRoleInfo,
    private _datePipe: DatePipe,
    private store: Store
  ) {

    let roles = this._role.Roles();
    this.viewPolicyParams = this._sessionService.getData("viewPolicyParams");
    if (this._checkRoleService.isRoleCodeAvailable(Roles.Underwriter.roleCode, roles)
      || this._checkRoleService.isRoleCodeAvailable(Roles.UnderwriterAssistant.roleCode, roles)
      || this._checkRoleService.isRoleCodeAvailable(Roles.UWManager.roleCode, roles)
      || this._checkRoleService.isRoleCodeAvailable(Roles.UWSupervisior.roleCode, roles)) {
      this.formMode = ""
    }
    else {
      if (this.viewPolicyParams) {
        if (this.viewPolicyParams.Action == "VIEW") this.formMode = "view"
        else this.formMode = ""
      }
    }

    if (this.viewPolicyParams) {
      this.variables.quoterefrencenumber = this.viewPolicyParams['referenceNumber'];
      this.variables.AqQuoteID = this.viewPolicyParams['aqquoteId'];
    }
    this.agentId = _agentInfo.AgentId();
    this.userId = _userInfo.UserId();
    // this.variables.currentdate = this._datePipe.transform(new Date(), 'MM/dd/yyyy');
    // this.variables.currentTime = this._datePipe.transform(new Date(), 'HH:MM');
    this.variables.agentname = _agentInfo.AgentFullName() as string;
    this.variables.agentemail = _userInfo.UserName();
  }

  ngOnInit() {
    this.navtypeNew = "";
    //this.formMode = "";
    this.navtypeNew = this._sessionService.getData("navTypeNew");
    // this.AQFormData = [];
    this.AQFormData = "";
    this.setBaseURL();
    this.getMGAPrograms();
    this.insuredView = this._sessionService.getData("insuredView");
    this.insuredId = null;
    this.getFBData();
    setTimeout(() => {
      //console.clear();
    }, 3000);
  }

  getFBData() {
    let proceedTofullquote = this._sessionService.getData('proceedTofullquote');
    if (proceedTofullquote) {
    }
    this._route.data.subscribe((response) => {
      if (response.policyViewResolver != null) {
        this.lob = [];
        if ((this.viewPolicyParams.Action == "Documents" || this.viewPolicyParams.Action == "Risk") && response.policyViewResolver.data.formDefinition && response.policyViewResolver.data.formData) {
          let formDefinition = JSON.parse(atob(response.policyViewResolver.data.formDefinition));
          let formData: any = JSON.parse(atob(response.policyViewResolver.data.formData));
          if (formDefinition != "" && formDefinition != "" && formData != null && formData != "") {
            this.setViewPolicyData(formDefinition, formData);
          }
        }
        else if (response.policyViewResolver.data.formDefinition.formDefinition != null && response.policyViewResolver.data.policyDetails.quoteJson != null) {
          let formDefinition = JSON?.parse(atob(response?.policyViewResolver?.data?.formDefinition?.formDefinition));
          let aqData: any = JSON.parse(atob(response.policyViewResolver.data.policyDetails.quoteJson));
          let formData = aqData;
          if (formDefinition != "" && formDefinition != "" && formData != null && formData != "") {
            this.setViewPolicyData(formDefinition, formData);
            this.formId = response.policyViewResolver.data.formDefinition.formId;
            let lob = response.policyViewResolver.data.formDefinition.lob
            if (typeof lob === 'string') {
              this.lob.push(response.policyViewResolver.data.formDefinition.lob);
            }
            else this.lob = lob;
            this.lobMaster = this.lob;
            this.state = response.policyViewResolver.data.formDefinition.state;
            this.formType = response.policyViewResolver.data.formDefinition.formType;
            if (response.policyViewResolver.data.policyDetails && response.policyViewResolver.data.policyDetails.quoteId) {
              this.quoteId = response.policyViewResolver.data.policyDetails.quoteId;
            }
            if (response.policyViewResolver.data.policies && response.policyViewResolver.data.policies.isOpenTask) {
              this.isOpenTask = response.policyViewResolver.data.policies.isOpenTask;
            }
          }
          else {
            this.setFormsData();
          }
        }
        else {
          this.setFormsData();
        }
      } else if (response.insuredViewResolver != null) {
        this.getInsuredView(response);
      } else if (response.chatbotresolver != null) {
        let isTrueFQ = JSON.parse(sessionStorage.getItem('IsNavigationFromFQ'));
        if (isTrueFQ != null) {
          this.formType = 'FQ';
          // this.AQFormData = JSON.parse(atob(response.chatbotresolver.formData));
          this.formId = response.chatbotresolver.formDefinition.formId;
          this.state = response.chatbotresolver.formDefinition.state ? response.chatbotresolver.formDefinition.state : 'NY';
          // this.lob.push(response.chatbotresolver.formDefinition.lob);
          let lob = response.chatbotresolver.formDefinition.lob;
          if (typeof lob === 'string') {
            this.lob.push(lob);
          }
          else
            this.lob = lob;
          this.lobMaster = this.lob;
          this.formType = response.chatbotresolver.formDefinition.formType;
          this.FormDefinition = JSON.parse(atob(response.chatbotresolver.formDefinition.formDefinition));
          this.AQFormData = JSON.parse(atob(response.chatbotresolver.policyDetails.quoteJson));
          console.log("this.AQFormData", JSON.stringify(this.AQFormData));
          this.quoteId = response.chatbotresolver.policyDetails.quoteId;
          let filterQuoteData = this.AQFormData.filter(quotedata => quotedata.componentID.toLowerCase() == 'quoterefrencenumber');
          let _aqQuoteID = this.AQFormData.filter(quotedata => quotedata.componentID.toLowerCase() == 'aqquoteid');
          if ((filterQuoteData && filterQuoteData.length > 0)) {
            this.variables.quoterefrencenumber = filterQuoteData[0].value;
          }
          if ((_aqQuoteID && _aqQuoteID.length > 0)) {
            this.variables.AqQuoteID = _aqQuoteID[0].value;
          }
        } else {
          this.formType = 'QQ';
          this.FormDefinition = JSON.parse(atob(response.chatbotresolver.formDefinition));
          this.AQFormData = JSON.parse(atob(response.chatbotresolver.formData));
          this.formId = response.chatbotresolver.formId;
          this.state = response.chatbotresolver.state ? response.chatbotresolver.state : 'NY';
          //this.lob = response.chatbotresolver.lob;
          let lob = response.chatbotresolver.lob;
          if (typeof lob === 'string') {
            this.lob.push(lob);
          }
          else
            this.lob = lob;
          this.lobMaster = this.lob;
          this.formType = response.chatbotresolver.quoteType;
          if (this.AQFormData.filter((FormData: any) => FormData.componentID == "aqquoteid").length > 0) {
            this.quoteId = this.AQFormData.filter((FormData: any) => FormData.componentID == "aqquoteid")[0].value ? this.AQFormData.filter(FormData => FormData.componentID == "aqquoteid")[0].value : 0;
          }
          let filterQuoteData = this.AQFormData.filter((quotedata: any) => quotedata.componentID.toLowerCase() == 'quoterefrencenumber');
          let _aqQuoteID = this.AQFormData.filter(quotedata => quotedata.componentID.toLowerCase() == 'aqquoteid');
          console.log("this.AQFormData2", JSON.stringify(this.AQFormData));
          if ((filterQuoteData && filterQuoteData.length > 0)) {
            this.variables.quoterefrencenumber = filterQuoteData[0].value;
          }
          if ((_aqQuoteID && _aqQuoteID.length > 0)) {
            this.variables.AqQuoteID = _aqQuoteID[0].value;
          }
        }
      }
      else {
        this.setFormsData();
      }
    });
  }


  // getFBData() {
  //   const proceedTofullquote = this._sessionService.getData('proceedTofullquote');

  //   this._route.data.subscribe((response) => {
  //     if (response.policyViewResolver) {
  //       this.handlePolicyViewResolver(response.policyViewResolver);
  //     } else if (response.insuredViewResolver) {
  //       this.getInsuredView(response);
  //     } else if (response.chatbotresolver) {
  //       this.handleChatbotResolver(response.chatbotresolver);
  //     } else {
  //       this.setFormsData();
  //     }
  //   });
  // }

  // private handlePolicyViewResolver(data: any) {
  //   this.lob = [];

  //   const action = this.viewPolicyParams?.Action;
  //   const formDefRaw = data.data?.formDefinition;
  //   const formDataRaw = data.data?.formData;
  //   const quoteJsonRaw = data.data?.policyDetails?.quoteJson;

  //   if (["Documents", "Risk"].includes(action) && formDefRaw && formDataRaw) {
  //     const formDefinition = this.parseBase64Json(formDefRaw);
  //     const formData = this.parseBase64Json(formDataRaw);
  //     if (formDefinition && formData) {
  //       this.setViewPolicyData(formDefinition, formData);
  //       return;
  //     }
  //   }

  //   if (formDefRaw?.formDefinition && quoteJsonRaw) {
  //     const formDefinition = this.parseBase64Json(formDefRaw.formDefinition);
  //     const formData = this.parseBase64Json(quoteJsonRaw);
  //     if (formDefinition && formData) {
  //       this.setViewPolicyData(formDefinition, formData);
  //       this.setFormMeta(formDefRaw, data.data);
  //       return;
  //     }
  //   }

  //   this.setFormsData();
  // }

  // private handleChatbotResolver(data: any) {
  //   const isTrueFQ = JSON.parse(sessionStorage.getItem('IsNavigationFromFQ') || 'false');
  //   this.lob = [];

  //   if (isTrueFQ) {
  //     this.formType = 'FQ';
  //     this.formId = data.formDefinition?.formId;
  //     this.state = data.formDefinition?.state || 'NY';
  //     const lob = data.formDefinition?.lob;
  //     this.lob = Array.isArray(lob) ? lob : [lob];
  //     this.lobMaster = this.lob;
  //     this.formType = data.formDefinition?.formType;
  //     this.FormDefinition = this.parseBase64Json(data.formDefinition?.formDefinition);
  //     this.AQFormData = this.parseBase64Json(data.policyDetails?.quoteJson);
  //     this.quoteId = data.policyDetails?.quoteId;
  //   } else {
  //     this.formType = 'QQ';
  //     this.FormDefinition = this.parseBase64Json(data.formDefinition);
  //     this.AQFormData = this.parseBase64Json(data.formData);
  //     this.formId = data.formId;
  //     this.state = data.state || 'NY';
  //     const lob = data.lob;
  //     this.lob = Array.isArray(lob) ? lob : [lob];
  //     this.lobMaster = this.lob;
  //     this.formType = data.quoteType;
  //     const aqQuoteData = this.AQFormData?.find((item: any) => item.componentID?.toLowerCase() === 'aqquoteid');
  //     this.quoteId = aqQuoteData?.value || 0;
  //   }

  //   const quoteRefData = this.AQFormData?.find((item: any) => item.componentID?.toLowerCase() === 'quoterefrencenumber');
  //   const aqQuoteData = this.AQFormData?.find((item: any) => item.componentID?.toLowerCase() === 'aqquoteid');

  //   if (quoteRefData) {
  //     this.variables.quoterefrencenumber = quoteRefData.value;
  //   }
  //   if (aqQuoteData) {
  //     this.variables.AqQuoteID = aqQuoteData.value;
  //   }
  // }

  // private setFormMeta(formDef: any, fullData: any) {
  //   this.formId = formDef.formId;
  //   const lob = formDef.lob;
  //   this.lob = Array.isArray(lob) ? lob : [lob];
  //   this.lobMaster = this.lob;
  //   this.state = formDef.state;
  //   this.formType = formDef.formType;
  //   this.quoteId = fullData?.policyDetails?.quoteId ?? this.quoteId;
  //   this.isOpenTask = fullData?.policies?.isOpenTask ?? false;
  // }

  // private parseBase64Json(encoded: string): any {
  //   try {
  //     return JSON.parse(atob(encoded));
  //   } catch (e) {
  //     console.error('Error parsing base64 JSON:', e);
  //     return null;
  //   }
  // }


  getInsuredView(response: any) {
    // a- edit or empty quotes('') b- view  c- partialedit
    //changed suggested by gourav sir
    this.formMode = "partialedit";
    // this.formMode = "";


    if (response.insuredViewResolver.data.formDefinition != null) {
      let formDefinition = JSON.parse(atob(response.insuredViewResolver.data.formDefinition));
      let aqData = response.insuredViewResolver.data.formData;
      //let aqData: any = JSON.parse(atob(response.insuredViewResolver.data.formData));
      let formData = aqData ? JSON.parse(atob(response.insuredViewResolver.data.formData)) : "";

      if (formDefinition != "" && formDefinition != null) {
        this.QuoteStage = !this.QuoteStage;
        this.setViewPolicyData(formDefinition, formData);
        let insuredReqObj = this._sessionService.getData("insuredReqObj");
        this.insuredId = insuredReqObj.InsuredId;
      }
      else {
        this.setFormsData();
      }

    }
  }

  // getMGAPrograms() {
  //   debugger
  //   this._programService.MGAPrograms(this.userId, 1).subscribe(programs => {
  //     if (programs && programs.data && programs.data.mgaProgramList) {
  //       this.programData = programs.data.mgaProgramList;
  //     }
  //   })
  // }

  getMGAPrograms() {
    // First check store
    this.store.select(selectPrograms).pipe(take(1)).subscribe(data => {
      if (!data || data.length === 0) {
        this.store.dispatch(loadMGAPrograms({ userId: 123, agencyId: 1 }));
      }
    });

    // Subscribe reactively
    this.store.select(selectPrograms).subscribe(data => {
      this.programData = data;
    });

    this.store.select(selectProgramsLoading).subscribe(isLoading => {
      if (isLoading) {
        this._loader.show();
      } else {
        this._loader.hide();
      }
    });
    // this._loader.hide();
  }

  ngOnDestroy() {
    sessionStorage.removeItem('IsNavigationFrom');
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  AQCheckboxDataOut(event) {
    this.isOpenTask = event.value;
  }

  AQCancelDataOut(event: any) {
    this.navType = this._sessionService.getData("navType");
    this.quoteInsured = this._sessionService.getData("quoteInsured");

    if (this.quoteInsured == "quoteInsured") {
      this._route.data.subscribe((response) => {
        this._sessionService.removeSession("quoteInsured");
        this.getInsuredView(response);
      })
    } else if (this.navType == 'dashboard') {
      this._router.navigateByUrl('/agenciiq');
    }
    else if (this.navType == 'workbook') {
      this._router.navigateByUrl('/agenciiq/workbook');
    }
    else if (this.navType == 'insured') {
      this._router.navigateByUrl('/agenciiq/insureds-prospects');
    } else if (this.navType == 'quoteView') {
      this._router.navigateByUrl('/agenciiq/workbook/quoteView');
    }
    else if (this.navType == 'Business') {
      this._router.navigateByUrl('/agenciiq/businesstransfer');
    }
    else {
      this._router.navigateByUrl('/agenciiq/workbook');
    }

    /* 
    this.quoteInsured = this._sessionService.getData("quoteInsured");
    let quoteViewNav = this._sessionService.getData("quoteView");
    
    if (quoteViewNav == 'quoteView') {
      this._router.navigateByUrl('/agenciiq/workbook/quoteView');
      return false;
    }

    if (this.quoteInsured == "quoteInsured") {
      this._route.data.subscribe((response) => {
        this._sessionService.removeSession("quoteInsured");
        this.getInsuredView(response);
      })
    }
    else {
      if (this.navType == 'dashboard') {
        this._router.navigateByUrl('/agenciiq');
      }
      else if (this.navType == 'workbook') {
        this._router.navigateByUrl('/agenciiq/workbook');
      }
      else if (this.navType == 'insured') {
        this._router.navigateByUrl('/agenciiq/insureds-prospects');

      } else if (this.navtypeNew == 'quoteView') {
        this._router.navigateByUrl('/agenciiq/workbook/quoteView');
      }
      else {
        this._router.navigateByUrl('/agenciiq/workbook');
      }
    }
 */


  }

  redirectToHome() {
    let role = this._roles.Roles()[0]?.roleCode;
    if (role == Roles.MGAAdmin?.roleCode) {
      this._router.navigateByUrl('/agenciiq/agencies');
    } else if (role == Roles.AgencyAdmin?.roleCode) {
      this._router.navigateByUrl('/agenciiq/users');
    } else {
      this._router.navigateByUrl('/agenciiq');
    }
  }

  setBaseURL() {
    this.baseURL = new ApiUrlSettings().getUrlForFB();
  }

  setFormsData() {
    let aqforms = this._aqformsService.GetAQFormsFromStorage();
    if (aqforms && aqforms.data && aqforms.data && aqforms.data.aQFormResponses && aqforms.data.aQFormResponses[0] && aqforms.data.aQFormResponses[0].formDefinition) {
      this.AQFormData = null;
      if (aqforms.data.aQFormResponses[0].formDefinition) {
        let formDefinition = atob(aqforms.data.aQFormResponses[0].formDefinition);
        this.FormDefinition = JSON.parse(formDefinition);
      }

      this.formId = aqforms.data.aQFormResponses[0].formId;
      let quotesDialogData = JSON.parse(this._sessionService.getData('QuoteDialogData'));
      this.lob = quotesDialogData ? quotesDialogData.LOB : "";
      this.lobMaster = this.lob;
      this.state = quotesDialogData ? quotesDialogData.State : "";
      this.formType = quotesDialogData ? quotesDialogData.QuoteType : "";

      if (aqforms.data.aQFormResponses[0].formData) {
        this.AQFormData = JSON.parse(atob(aqforms.data.aQFormResponses[0].formData));
        this.AQFormData.map(s => { if (s.componentID.toLowerCase() == 'lob') { s.value = this.lob[0] } else if (s.componentID.toLowerCase().includes('state')) { s.value = this.state } })
      }
    } else {
      //this.DevMode = true;

    }
  }

  quikquotes() {
    let roles = this._role.Roles();
    if (this._checkRoleService.isRoleCodeAvailable(Roles.Agent.roleCode, roles)
      || this._checkRoleService.isRoleCodeAvailable(Roles.Supervisor.roleCode, roles)
      || this._checkRoleService.isRoleCodeAvailable(Roles.Manager.roleCode, roles)) {
      this.quoteInsured = this._sessionService.setData("quoteInsured", "quoteInsured");
      const ref = this.dialogService.open(QuotesDialogComponent, {
        data: this.programData
      });
      ref.afterClosed.subscribe(data => {
        if (data && data.LOB && data.State && data.QuoteType) {
          this._aqformsService.AQForms(this.userId, data.LOB.toString(), data.State, data.QuoteType, this.insuredId, 1)
            .subscribe(dataResp => {
              // this.loaderService.hide();
              this._sessionService.setData('QuoteDialogData', JSON.stringify(data));
              if (dataResp && dataResp.success) {
                this.QuoteStage = !this.QuoteStage;
                this.setFormsData();
              } else {
                this._popup.showPopup('Quote', dataResp.message);
              }
              //this._loader.hide();
            }, (err) => {
              console.log("err", err)
            },
              () => {
                // this.loaderService.hide();
              })
          //this._loader.hide();
        }
        // this._loader.hide();
      })
    }
  }

  addInsuredDetail(insuredId: number) {
    this._insuredsProspects.addInsuredsQuotes(insuredId).subscribe(resp => {
      this.QuoteStage = !this.QuoteStage;
      this.AQFormData = resp.data.insuredData;
    })
  }

  //FULLQUOTE//BIND//ISSUE//VIEW//COPY//REFERTOUNDERWRITER----
  // getFormDataMaster(event: any) {
  //   this.actionName = "";
  //   this.quoteInsured = this._sessionService.getData("quoteInsured");
  //   this.ManageFlag(event.action, this.formType);
  //   if (event.action.toLowerCase() == "proceedtoquote") {
  //     this.savePolicy(event, 'FULLQUOTE', '');
  //   } else if (event.action.toLowerCase() == 'proceedtobind') {
  //     this.savePolicy(event, 'BIND', '');
  //   } else if (event.action.toLowerCase() == 'proceedtoissue') {
  //     this.savePolicy(event, 'ISSUE', '');
  //   } else if (event.action.toLowerCase() == 'policyissue') {
  //     this.actionName = "policy issue";
  //     this.savePolicy(event, 'policy issue', '');
  //   } else if (event.action.toLowerCase() == 'addquote') {
  //     this.formMode = "";
  //     this.quikquotes();
  //   } else if (event.action.toLowerCase() == 'createbinder') {
  //     this.actionName = "Binder";
  //     this.savePolicy(event, 'Binder', '');
  //   } else if (event.action.toLowerCase() == 'createendorsement') {
  //     this.actionName = "createendorsement";
  //     this.savePolicy(event, 'createendorsement', '');
  //   } else if (event.action.toLowerCase() == 'createcancellation') {
  //     this.actionName = "createcancellation";
  //     this.savePolicy(event, 'createcancellation', '');
  //   }
  //   else if (this.insuredView == "insuredView" && this.quoteInsured == undefined) {
  //     //added by gourav
  //     this.savePolicy(event, 'UPDATE', '');
  //   }
  //   else if (this.viewPolicyParams != null && (this.viewPolicyParams.Action == "Risk")) {

  //   }
  //   else {
  //     let _actionName = event.action.toLowerCase().includes('submittoims') ? 'SUBMITTOIMS' : this.quoteId == 0 ? 'SAVE' : 'UPDATE';
  //     if (event.action.toLowerCase().includes('navbar')) {
  //       this.checkPolicy(event, _actionName, '');
  //     } else {
  //       this.savePolicy(event, _actionName, '');
  //     }
  //   }
  // }



  getFormDataMaster(event: any) {
    this.actionName = '';
    this.quoteInsured = this._sessionService.getData('quoteInsured');
    const action = event.action?.toLowerCase();

    this.ManageFlag(event.action, this.formType);

    const actionPolicyMap: { [key: string]: string } = {
      'proceedtoquote': 'FULLQUOTE',
      'proceedtobind': 'BIND',
      'proceedtoissue': 'ISSUE',
      'policyissue': 'policy issue',
      'createbinder': 'Binder',
      'createendorsement': 'createendorsement',
      'createcancellation': 'createcancellation'
    };

    if (action in actionPolicyMap) {
      if (action === 'policyissue') this.actionName = 'policy issue';
      if (action === 'createbinder') this.actionName = 'Binder';
      if (action === 'createendorsement') this.actionName = 'createendorsement';
      if (action === 'createcancellation') this.actionName = 'createcancellation';
      return this.savePolicy(event, actionPolicyMap[action], '');
    }

    if (action === 'addquote') {
      this.formMode = '';
      return this.quikquotes();
    }

    if (this.insuredView === 'insuredView' && this.quoteInsured === undefined) {
      return this.savePolicy(event, 'UPDATE', '');
    }

    if (this.viewPolicyParams?.Action === 'Risk') {
      return; // No action required as per original code
    }

    const _actionName = action.includes('submittoims')
      ? 'SUBMITTOIMS'
      : this.quoteId === 0
        ? 'SAVE'
        : 'UPDATE';

    if (action.includes('navbar')) {
      this.checkPolicy(event, _actionName, '');
    } else {
      this.savePolicy(event, _actionName, '');
    }
  }



  // ManageFlag(action: string, formType: any) {
  //   if (action.toUpperCase() == 'PROCEEDTOQUOTE') {
  //     this.isFullQuote = true;
  //     this.isPolicyBind = false;
  //     this.isIssueQuote = false;
  //   } else if (action.toUpperCase() == 'PROCEEDTOBIND') {
  //     this.isFullQuote = false;
  //     this.isPolicyBind = true;
  //     this.isIssueQuote = false;
  //   } else if (action.toUpperCase() == 'PROCEEDTOISSUE') {
  //     this.isFullQuote = false;
  //     this.isPolicyBind = false;
  //     this.isIssueQuote = true;
  //   } else {
  //     if (formType == 'QQ') {
  //       this.isFullQuote = false;
  //       this.isPolicyBind = false;
  //       this.isIssueQuote = false;
  //     } else if (formType == 'FQ') {
  //       this.isFullQuote = true;
  //       this.isPolicyBind = false;
  //       this.isIssueQuote = false;
  //     } else if (formType == 'PB') {
  //       this.isFullQuote = false;
  //       this.isPolicyBind = true;
  //       this.isIssueQuote = false;
  //     } else if (formType == 'IQ') {
  //       this.isFullQuote = false;
  //       this.isPolicyBind = false;
  //       this.isIssueQuote = true;
  //     }
  //   }
  // }


  ManageFlag(action: string, formType: any) {
    const normalizedAction = action?.toUpperCase();
    const normalizedFormType = formType?.toUpperCase();

    const flagMap: { [key: string]: [boolean, boolean, boolean] } = {
      'PROCEEDTOQUOTE': [true, false, false],
      'PROCEEDTOBIND': [false, true, false],
      'PROCEEDTOISSUE': [false, false, true],
      'QQ': [false, false, false],
      'FQ': [true, false, false],
      'PB': [false, true, false],
      'IQ': [false, false, true]
    };

    const flags = flagMap[normalizedAction] || flagMap[normalizedFormType];

    if (flags) {
      [this.isFullQuote, this.isPolicyBind, this.isIssueQuote] = flags;
    }
  }

  // savePolicy(event: any, actionName: any, businessName: any) {
  //   this._loader.show();
  //   let host = window.location.host;
  //   if (host.includes("convelo") || host.includes("demo")) {
  //     this.lob = this.lobMaster;
  //     if (this.formType == undefined) this.formType = 'FQ';
  //     if (this.lob == undefined) this.lob = event.aqDataModel.find(s => s.componentID.toLowerCase() == 'lob').value;
  //     if (event.aqDataModel) {
  //       let filterQuoteData = event.aqDataModel.filter(quotedata => quotedata.componentID.toLowerCase() == 'quoterefrencenumber');
  //       let _aqQuoteID = event.aqDataModel.filter(quotedata => quotedata.componentID.toLowerCase() == 'aqquoteid');
  //       if ((filterQuoteData && filterQuoteData.length > 0 && filterQuoteData[0].value == '')) {
  //         filterQuoteData[0].value = this.variables.quoterefrencenumber;
  //       } else {
  //         this.quoteId = +(filterQuoteData[0].value.replace("Q", ""));
  //       }
  //       if ((_aqQuoteID && _aqQuoteID.length > 0 && _aqQuoteID[0].value == '')) {
  //         _aqQuoteID[0].value = this.variables.AqQuoteID;
  //       }
  //     }
  //   }
  //   //this.lob = quotesDialogData && (this.lob.length==0||this.lob==undefined) ? quotesDialogData.LOB : this.lob;
  //   let QuoteDetails = btoa(JSON.stringify(event.aqDataModel));
  //   let savePolicyRequest: ISavePolicy = {
  //     AgentId: Number(this.agentId),
  //     UserId: Number(this.userId),
  //     LOB: this.lob.toString(),
  //     State: this.state,
  //     QuoteType: this.formType,
  //     QuoteDetails: QuoteDetails,
  //     XMLObject: "",
  //     ClientID: 1,
  //     QuoteId: this.quoteId,
  //     FormId: this.formId,
  //     IsOpenTask: this.isOpenTask,
  //     Action: actionName,
  //     BusinessName: businessName
  //   }

  //   this._savePolicy.SavePolicy(savePolicyRequest).subscribe(bindQuotes => {
  //     this._loader.hide();
  //     this.lob = [];
  //     if (bindQuotes && bindQuotes.data && bindQuotes['success'] && bindQuotes['message'].toLowerCase() == "success") {
  //       this.QuoteStage = !this.QuoteStage;
  //       this.FormDefinition = JSON.parse(atob(bindQuotes.data.formDefinition.formDefinition))
  //       if (bindQuotes.data.policyDetails.quoteJson) {
  //         this.AQFormData = JSON.parse(atob(bindQuotes.data.policyDetails.quoteJson));
  //         let quotejson: IQuoteJSON[] = this.AQFormData;
  //         let filterQuoteData = quotejson.filter(quotedata => quotedata.componentID.toLowerCase() == 'quoterefrencenumber');
  //         let _aqQuoteID = quotejson.filter(quotedata => quotedata.componentID.toLowerCase() == 'aqquoteid');
  //         if ((filterQuoteData && filterQuoteData.length > 0)) {
  //           this.variables.quoterefrencenumber = filterQuoteData[0].value;
  //         }

  //         if ((_aqQuoteID && _aqQuoteID.length > 0)) {
  //           this.variables.AqQuoteID = _aqQuoteID[0].value;
  //         }
  //       }
  //       this.formId = bindQuotes.data.formDefinition.formId
  //       this.quoteId = bindQuotes.data.policyDetails.quoteId;
  //       this.lob.push(bindQuotes.data.formDefinition.lob);
  //       this.state = bindQuotes.data.formDefinition.state;
  //       this.formType = bindQuotes.data.formDefinition.formType;
  //       this.isOpenTask = bindQuotes.data.policies.isOpenTask;
  //     } else if (bindQuotes['message']) {
  //       if (bindQuotes['data']) {
  //         this.quoteId = bindQuotes.data.policyDetails.quoteId;
  //         if (sessionStorage.getItem('saveclose') == 'false') {
  //           this.variables.quoterefrencenumber = bindQuotes.data.policies['quoteNumber'].toString();
  //           this.variables.AqQuoteID = bindQuotes.data.policyDetails.quoteId.toString();
  //           this.formId = bindQuotes.data.formDefinition.formId
  //           sessionStorage.setItem("AqQuoteID", bindQuotes.data.policyDetails.quoteId.toString());
  //           sessionStorage.setItem("AqQuoteRef", bindQuotes.data.policies['quoteNumber'].toString());
  //         }
  //       }
  //       if (bindQuotes['message'].toLowerCase() == 'success' && (this.actionName.toLowerCase() == "binder" || this.actionName == "policy issue" || this.actionName == "createendorsement" || this.actionName == "createcancellation")) {
  //         this.AQCancelDataOut(event);
  //         return;
  //       }
  //       let dialog = this._popup.showPopup('Quotes', bindQuotes['message']);
  //       dialog.afterClosed.subscribe(status => {
  //         if (status) {
  //           this.AQCancelDataOut(event);
  //         }
  //       });
  //     } else {
  //       this.AQCancelDataOut(event);
  //     }
  //   }, (err) => {
  //     this._loader.hide();
  //   }, () => {
  //     this._loader.hide();
  //   });
  // }


  savePolicy(event: any, actionName: any, businessName: any) {
    this._loader.show();
    const host = window.location.host;
    const aqDataModel = event?.aqDataModel || [];
    const getFieldValue = (id: string) => aqDataModel.find(item => item.componentID?.toLowerCase() === id)?.value;

    if (host.includes("convelo") || host.includes("demo") || host.includes("aqnext")) {
      this.lob = this.lobMaster || getFieldValue('lob');
      this.formType = this.formType || 'FQ';

      const quoteRefField = aqDataModel.find(item => item.componentID?.toLowerCase() === 'quoterefrencenumber');
      const aqQuoteIdField = aqDataModel.find(item => item.componentID?.toLowerCase() === 'aqquoteid');

      if (quoteRefField && !quoteRefField.value) {
        quoteRefField.value = this.variables.quoterefrencenumber;
      } else if (quoteRefField?.value) {
        this.quoteId = +quoteRefField.value.replace("Q", "");
      }

      if (aqQuoteIdField && !aqQuoteIdField.value) {
        aqQuoteIdField.value = this.variables.AqQuoteID;
      }
    }

    const savePolicyRequest: ISavePolicy = {
      AgentId: Number(this.agentId),
      UserId: Number(this.userId),
      LOB: this.lob?.toString(),
      State: this.state,
      QuoteType: this.formType,
      QuoteDetails: btoa(JSON.stringify(aqDataModel)),
      XMLObject: "",
      ClientID: 1,
      QuoteId: this.quoteId,
      FormId: this.formId,
      IsOpenTask: this.isOpenTask,
      Action: actionName,
      BusinessName: businessName
    };

    this._savePolicy.SavePolicy(savePolicyRequest).subscribe({
      next: bindQuotes => {
        this._loader.hide();
        this.lob = [];

        const success = bindQuotes?.success;
        const message = bindQuotes?.message?.toLowerCase();
        const data = bindQuotes?.data;

        if (success && message === "success") {
          this.QuoteStage = !this.QuoteStage;
          this.FormDefinition = JSON.parse(atob(data?.formDefinition?.formDefinition || ''));

          const quoteJsonStr = data?.policyDetails?.quoteJson;
          if (quoteJsonStr) {
            this.AQFormData = JSON.parse(atob(quoteJsonStr));
            this.variables.quoterefrencenumber = getFieldValueFromJson(this.AQFormData, 'quoterefrencenumber');
            this.variables.AqQuoteID = getFieldValueFromJson(this.AQFormData, 'aqquoteid');
          }

          this.formId = data?.formDefinition?.formId;
          this.quoteId = data?.policyDetails?.quoteId;
          this.lob.push(data?.formDefinition?.lob);
          this.state = data?.formDefinition?.state;
          this.formType = data?.formDefinition?.formType;
          this.isOpenTask = data?.policies?.isOpenTask;
          this._checkRoleService.addNewQuoteSubject.next('AddQuote');
          if (savePolicyRequest.IsOpenTask) {
            this._checkRoleService.addNewMyDiarySubject.next('AddMyDiary');
          }
          return;
        }

        if (message && data) {
          this._checkRoleService.addNewQuoteSubject.next('AddQuote');
          if (savePolicyRequest.IsOpenTask) {
            this._checkRoleService.addNewMyDiarySubject.next('AddMyDiary');
          }
          this.quoteId = data?.policyDetails?.quoteId;

          if (sessionStorage.getItem('saveclose') === 'false') {
            const quoteNumber = data?.policies?.quoteNumber?.toString();
            const policyQuoteId = data?.policyDetails?.quoteId?.toString();

            this.variables.quoterefrencenumber = quoteNumber;
            this.variables.AqQuoteID = policyQuoteId;
            this.formId = data?.formDefinition?.formId;

            sessionStorage.setItem("AqQuoteID", policyQuoteId);
            sessionStorage.setItem("AqQuoteRef", quoteNumber);
          }

          const action = this.actionName?.toLowerCase();
          if (message === 'success' && ['binder', 'policy issue', 'createendorsement', 'createcancellation'].includes(action)) {
            this.AQCancelDataOut(event);
            return;
          }

          const dialog = this._popup.showPopup('Quotes', bindQuotes.message);
          dialog.afterClosed.subscribe(status => {
            if (status) {
              this.AQCancelDataOut(event);
            }
          });
        } else {
          this.AQCancelDataOut(event);
        }
      },
      error: () => this._loader.hide(),
      complete: () => this._loader.hide()
    });

    function getFieldValueFromJson(jsonArray: any[], key: string) {
      return jsonArray.find(item => item.componentID?.toLowerCase() === key)?.value || '';
    }
  }


  setViewPolicyData(formDefinition: any, formData: any) {
    this.FormDefinition = formDefinition;
    this.AQFormData = formData;
  }

  checkPolicy(event, actionName, businessName) {
    this._loader.show();
    this.lob = this.lobMaster;
    if (this.formType == undefined) this.formType = 'FQ';
    if (this.lob == undefined) this.lob = event.aqDataModel?.find(s => s.componentID.toLowerCase() == 'lob').value;
    if (event.aqDataModel) {
      let filterQuoteData = event.aqDataModel.filter(quotedata => quotedata.componentID.toLowerCase() == 'quoterefrencenumber');
      let _aqQuoteID = event.aqDataModel.filter(quotedata => quotedata.componentID.toLowerCase() == 'aqquoteid');
      if ((filterQuoteData && filterQuoteData.length > 0 && filterQuoteData[0].value == '')) {
        filterQuoteData[0].value = this.variables.quoterefrencenumber;
      } else {
        this.quoteId = +(filterQuoteData[0].value.replace("Q", ""));
      }

      if ((_aqQuoteID && _aqQuoteID.length > 0 && _aqQuoteID[0].value == '')) {
        _aqQuoteID[0].value = this.variables.AqQuoteID;
      }

    }
    //this.lob = quotesDialogData && (this.lob.length==0||this.lob==undefined) ? quotesDialogData.LOB : this.lob;
    let QuoteDetails = btoa(JSON.stringify(event.aqDataModel));
    let savePolicyRequest: ISavePolicy = {
      AgentId: Number(this.agentId),
      UserId: Number(this.userId),
      LOB: this.lob?.toString(),
      State: this.state,
      QuoteType: this.formType,
      QuoteDetails: QuoteDetails,
      XMLObject: "",
      ClientID: 1,
      QuoteId: this.quoteId,
      FormId: this.formId,
      IsOpenTask: this.isOpenTask,
      Action: actionName,
      BusinessName: businessName
    }

    this._savePolicy.CheckAqXML(savePolicyRequest)
      .subscribe(bindQuotes => {
        this._loader.hide();
        this.lob = [];
        if (bindQuotes['message']) {
          if (bindQuotes['success'] == true) {
            let dialog = this._popup.showPopup('Quotes', bindQuotes['message']);
            dialog.afterClosed.subscribe(status => {
              if (status) {
                this.AQCancelDataOut(event);
              }
              sessionStorage.setItem('checkDataMatch', bindQuotes['message'])
            });
          }
        } else {
          sessionStorage.setItem('checkDataMatch', 'Navigate to next Page')
        }
      }, (err) => {
        this._loader.hide();
      }, () => {
        this._loader.hide();
      });

  }

}

export interface IQuoteJSONNode {
  componentID: string;
  componentName: string;
  componentType?: any;
  xmlMapping?: any;
  showPremium: boolean;
  decline: boolean;
  referToUnderwriter: boolean;
  loadPrequalifiers: boolean;
  loadUnderwritingQuestions: boolean;
  loadAdditionalForms: boolean;
  node: any[];
  value: boolean;
}

export interface IQuoteJSON {
  componentID: string;
  componentName: string;
  componentType: string;
  xmlMapping: string;
  showPremium: boolean;
  decline: boolean;
  referToUnderwriter: boolean;
  loadPrequalifiers: boolean;
  loadUnderwritingQuestions: boolean;
  loadAdditionalForms: boolean;
  node: Node[];
  value: any;
}