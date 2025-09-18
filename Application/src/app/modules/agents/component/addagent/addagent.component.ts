import { Component, OnInit, ɵConsole, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AQAgentListService } from '@agenciiq/aqagent';
import { AQUserInfo, AQRoleInfo, AQAgencyInfo } from '@agenciiq/login';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQParameterService, AQZipDetailsService } from '@agenciiq/aqadmin';
import { AQStates } from '@agenciiq/aqadmin';
import { Roles } from 'src/app/global-settings/roles';
import { AQAgencyService } from '@agenciiq/agency';
import { KeyboardValidation } from 'src/app/shared/services/aqValidators/keyboard-validation';
import { AgentListService } from '../../services/agent-list.service';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { SortingService } from 'src/app/shared/services/sorting-service/sorting.service';
import { Subject, Subscription } from 'rxjs';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';
import { AddAgentScreen } from 'src/app/global-settings/error-message/addAgentScreen';
import { MgaConfigService, ISaveMgaLobsList, ISaveMgaStatesList, IMgaConfiguration } from '@agenciiq/mga-config';
import { LOBService } from '@agenciiq/quotes';

@Component({
  selector: 'app-addagent',
  templateUrl: './addagent.component.html',
  styleUrls: ['./addagent.component.css'],
  standalone: false
})
export class AddagentComponent implements OnInit, OnDestroy {
  _AddAgentScreen: AddAgentScreen = null;
  f = true;
  agentdetails = [];
  agentlist: any;
  addagent: FormGroup;
  _agentIdTab = "agent";
  flag = false;
  isEdit: boolean = false;
  submitted: boolean = false;
  addressSubmitted: boolean = false;
  zipSubmitted: boolean = false;
  showDropDown: boolean = false;
  roles: any = [];
  roleinfo: any[];
  mgadmin: boolean = false;
  agancyadmin: boolean = false;
  agt: boolean = false;
  selectitem: any;
  stateName: any;
  isZipInvalid = false;
  zipErrorMessage;
  agencyN = [];
  isAddress1Valid: boolean = false;
  selectedRoled = [];
  selectedRoledForRequest = [];
  selectedRoleCode;
  userRoleCode;
  agencyList = [];
  supervisorList = [];
  UWSupervisorList = [];
  mangerList = [];
  UWMangerList = [];
  UWAssistantList = [];
  isUserMGAAdmin: boolean = false;
  address1ErrorMessage: string = '';
  pageTitle: string;
  _isChecked: boolean;
  roleCode: any;
  userName: any
  updatedManagerList: any[] = [];
  updatedSupervisorList: any[] = [];
  updatedUWSupervisorList: any[] = [];
  updatedUWManagerList: any[] = [];
  updateUWAssistantList: any[] = [];
  private agentId = 0;
  private agencyId: number;
  agencyAdminCheck: boolean = false;
  stateDropDown = 'statedd';
  stateList: any[] = [];
  stateCheckBoxName = 'parameterName';
  stateCheckBoxValue = 'parameterId';

  lobDropDown = 'lobdd';
  lobList: any;
  lobCheckBoxName = "lobDescription";
  lobCheckBoxValue = "lobId";

  UWassistantDropdown = 'UWAssistantdd';
  UWAssistantName = "UWAssistantName";
  uwAssistantCheckBoxValue = "UWAssistantId";
  AssistantList: any[] = [];
  userId: number;
  parameterStateKey = "STATE";

  savedLobList: any[] = [];
  saveStateList: any[] = [];

  private validateAddressSubscription: Subscription;
  private zipDetailsSubscription: Subscription;
  private createAgentSubscription: Subscription;
  private popupSubscription: Subscription;
  private agencyListSubscription: Subscription;
  private agentListSubscription: Subscription;
  private agentRoleSubscription: Subscription;
  private address1Subscription: Subscription;
  private address2Subscription: Subscription;
  private zipSubscription: Subscription;
  private selectedLob: ISaveMgaLobsList[] = [];
  private selectedState: ISaveMgaStatesList[] = [];
  private selectedUWAssistant: any[];
  validateField: boolean = false;
  checkSave: boolean = false;
  mgaConfiguration: IMgaConfiguration = null;
  selectedItem: any[] = [];
  optionList: any[] = [];
  subject = new Subject();
  IsEventFromPage: boolean = false;


  constructor(
    private fb: FormBuilder,
    private agent: AQAgentListService,
    private _router: Router,
    private _userinfo: AQUserInfo,
    private _roleinfo: AQRoleInfo,
    private _agencyinfo: AQAgencyInfo,
    private _popupService: PopupService,
    private _loader: LoaderService,
    private _agency: AQAgencyService,
    private zipDetails: AQZipDetailsService,
    public ValidateKey: KeyboardValidation,
    private checkRoleService: CheckRoleService,
    private _sortingService: SortingService,
    private trimValueService: TrimValueService,
    private _mgaConfig: MgaConfigService,
    private _lobService: LOBService,
    private _state: AQStates,
    private _checkRoleService: CheckRoleService,

    private _aqparameterService: AQParameterService,) {
    this.userId = this._userinfo.UserId();
    this._AddAgentScreen = new AddAgentScreen();
    this.isUserMGAAdmin = this.checkRoleService.isRoleCodeAvailable('MGAAdmin', this._roleinfo.Roles());
    this.agencyId = this._agencyinfo.Agency() && this._agencyinfo.Agency().agencyId ? this._agencyinfo.Agency().agencyId : 0;
  }

  // ngOnInit() {
  //   setTimeout(() => {
  //     this.getMGADetails(this.userId);
  //   }, 0);

  //   this.updatedManagerList = [];
  //   this.updatedSupervisorList = [];
  //   this.updatedUWManagerList = [];
  //   this.updatedUWSupervisorList = [];

  //   this.createform();
  //   if (sessionStorage.getItem('_agentId')) {
  //     this.isEdit = true;
  //     this.agentId = JSON.parse(sessionStorage.getItem('_agentId'));
  //     this.pageTitle = "Edit User";
  //     this.getAgentDetails(sessionStorage.getItem('_agentId'));

  //   } else {

  //     this.pageTitle = "Add User";
  //     this.assignSavedLobList([]);
  //     //this.assignSavedStateList([]);
  //   }

  //   this.getRoles();
  //   this.onChnages();
  //   this.SaveAccountWithAddressValidation();
  // }


  ngOnInit(): void {
    this.initializeComponent();
  }

  private initializeComponent(): void {
    // Start MGA details fetch as a microtask
    setTimeout(() => this.getMGADetails(this.userId), 0);

    // Initialize updated lists
    this.resetUpdatedLists();

    // Create form structure
    this.createform();

    // Check if editing or adding new user
    const agentIdFromStorage = sessionStorage.getItem('_agentId');
    if (agentIdFromStorage) {
      this.isEdit = true;
      this.agentId = JSON.parse(agentIdFromStorage);
      this.pageTitle = "Edit User";
      this.getAgentDetails(agentIdFromStorage);
    } else {
      this.pageTitle = "Add User";
      this.assignSavedLobList([]);
      // Optionally restore if needed: this.assignSavedStateList([]);
    }

    // Fetch roles and bind form changes
    this.getRoles();
    this.onChnages();

    // Address validation hook
    this.SaveAccountWithAddressValidation();
  }

  private resetUpdatedLists(): void {
    this.updatedManagerList = [];
    this.updatedSupervisorList = [];
    this.updatedUWManagerList = [];
    this.updatedUWSupervisorList = [];
  }


  // getMGADetails(userId: any) {
  //   this._mgaConfig.MGADetails(userId).subscribe(MGAConfig => {
  //     if (MGAConfig && MGAConfig.success && MGAConfig.data) {
  //       // if (MGAConfig.data.mgaConfiguration.name.toLowerCase() === 'convelo') {
  //       this.mgaConfiguration = MGAConfig.data.mgaConfiguration;
  //       this.optionList = MGAConfig.data.mgaLobsList;
  //       if (this.agentdetails && this.agentdetails.length > 0) {
  //         let lobs = this.agentdetails[0].userLob;
  //         this.optionList.filter(x => {
  //           if (lobs.findIndex(y => y.lobId == x.lobId) > -1) {
  //             let lob = x;
  //             lob['checked'] = true;
  //             this.selectedItem.push(lob)
  //           }
  //         })
  //       }

  //       //}else{
  //       //  this.assignSavedLobList(MGAConfig.data.mgaLobsList);

  //       //}
  //       this.assignSavedStateList(MGAConfig.data.mgaStatesList);
  //     }
  //   })
  // }

  getMGADetails(userId: any): void {
    this._mgaConfig.MGADetails(userId)?.subscribe((MGAConfig) => {
      const { success, data } = MGAConfig || {};

      if (!success || !data) return;

      this.mgaConfiguration = data.mgaConfiguration;
      this.optionList = data.mgaLobsList || [];

      if (this.agentdetails?.length > 0) {
        const lobs = this.agentdetails[0].userLob || [];
        this.selectedItem = [];

        this.optionList.forEach((option: any) => {
          if (lobs.some((lob: any) => lob.lobId === option.lobId)) {
            option.checked = true;
            this.selectedItem.push(option);
          }
        });
      }

      this.assignSavedStateList(data.mgaStatesList || []);
    });
  }

  assignSavedLobList(savedLobList: any[]) {
    // this.getLobList(this.userId, savedLobList);
    this.lobList = savedLobList.map(lob => {
      let _tempLobStatus = this.savedLobList.some(savedlob => {
        return lob.lobCode == savedlob.lobCode
      });
      let _tempLobList = {
        lobId: lob.lobId,
        lob: lob.lobCode,
        lobDescription: lob.lobCodeDescription,
        isActive: true,
        checked: _tempLobStatus
      }
      return _tempLobList;
    })
  }

  SelectedLobList(lobList: any[]) {
    this.selectedLob = lobList.filter(lob => lob.checked).map(lob => { return { lobId: lob.lobId } });
  }

  SelectedStateList(stateList: any[]) {
    this.selectedState = stateList.filter(state => state.checked).map(state => { return { stateId: state.parameterId } });
  }

  SelectedUWAssistantList(UWAssistantList: any[]) {
    this.selectedUWAssistant = UWAssistantList.filter(uwa => uwa.checked).map(uwa => { return { UnderwriterAssistantId: uwa.UWAssistantId } });
  }

  assignSavedStateList(savedSatateList: any[]) {
    this.stateList = savedSatateList.map(state => {
      let isAdded = this.saveStateList.some(_state => _state.stateId == state.stateId)
      let _tempStateList = {
        parameterId: state.stateId,
        parameterName: state.stateDescription,
        isActive: true,
        checked: isAdded
      }
      return _tempStateList;
    });
  }

  getLobList(userId: any, savedLobList: any[]) {
    this._lobService.GetLOBList(userId).subscribe(lobList => {
      if (lobList?.success && lobList?.data?.lobsList) {
        console.log("Sucess", lobList.success);
        console.log("Lobslist", lobList.data.lobsList);
      }
    })
  }

  getUnderwritterAssistantList(savedUWAssistantList: any[]) {
    this.AssistantList = this.UWAssistantList.map(ual => {
      let _tempUALStatus = savedUWAssistantList.some(savedUal => {
        return savedUal.underwriterAssistantId == ual.UWAssistantId
      });
      let _tempUWAssistantList = {
        UWAssistantId: ual.UWAssistantId,
        UWAssistantName: ual.UWAssistantName,
        isActive: ual.isActive,
        checked: _tempUALStatus
      }
      return _tempUWAssistantList;
    })
  }

  ngOnDestroy() {
    if (this.validateAddressSubscription) {
      this.validateAddressSubscription.unsubscribe()
    }
    if (this.zipDetailsSubscription) {
      this.zipDetailsSubscription.unsubscribe();
    }
    if (this.createAgentSubscription) {
      this.createAgentSubscription.unsubscribe();
    }
    if (this.popupSubscription) {
      this.popupSubscription.unsubscribe();
    }
    if (this.agencyListSubscription) {
      this.agencyListSubscription.unsubscribe()
    }
    if (this.agentListSubscription) {
      this.agencyListSubscription.unsubscribe();
    }
    if (this.agentRoleSubscription) {
      this.agentRoleSubscription.unsubscribe();
    }
    if (this.address1Subscription) {
      this.address1Subscription.unsubscribe();
    }
    if (this.address2Subscription) {
      this.address2Subscription.unsubscribe();
    }
    if (this.zipSubscription) {
      this.zipSubscription.unsubscribe();
    }
  }

  get fname() {
    return this.addagent.get('FirstName');
  }

  get Mname() {
    return this.addagent.get('Middlename');

  }
  get lname() {
    return this.addagent.get('LastName');
  }
  get email() {
    return this.addagent.get('Email');
  }
  get city() {
    return this.addagent?.get('City');
  }
  get state() {
    return this.addagent?.get('State');
  }
  get zip() {
    return this.addagent?.get('Zip');
  }
  get addressline1() {
    return this.addagent?.get('AddressLine1');
  }

  get addressline2() {
    return this.addagent?.get('AddressLine2');
  }
  get phonecell() {
    return this.addagent.get('PhoneCell');
  }
  get phoneoffice() {
    return this.addagent.get('PhoneOffice');
  }

  get phone() {
    return this.addagent.get('PhoneHome');
  }

  get roleControl() {
    return this.addagent.get('userRoles');
  }
  get LobsControl() {
    return this.addagent.get('userLobs');
  }

  get agencyNameControl() {
    return this.addagent?.get('agencyName');
  }

  get agencyIdControl() {
    return this.addagent?.get('AgencyId');
  }

  get managerIdControl() {
    return this.addagent?.get('managerId');
  }

  get supervisorIdControl() {
    return this.addagent?.get('supervisorId');
  }

  get udSupervisorIdControl() {
    return this.addagent.get('udSupervisorId');
  }

  get uwAssistantIdControl() {
    return this.addagent.get('uwAssistantId');
  }

  get lobIdControl() {
    return this.addagent.get('LobId');
  }

  get stateIdControl() {
    return this.addagent.get('StateId');
  }

  get fax() {
    return this.addagent.get('Fax');
  }

  createform() {
    this.addagent = this.fb.group({
      FirstName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^((?!\s{2,}).)*$/)]],
      Middlename: ['', Validators.pattern(/^((?!\s{2,}).)*$/)],
      LastName: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]],
      Email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      Zip: ['', [Validators.required, Validators.minLength(5)]],
      City: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(50)]],
      State: [{ value: '', disabled: true }, [Validators.required]],
      AddressLine1: ['', [Validators.required, Validators.maxLength(50)]],
      AddressLine2: [''],
      /*PhoneCell: ['', [Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/), Validators.required]],
      PhoneOffice: ['', [Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)]],
      PhoneHome: ['', [Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)]],
      Fax: ['', [Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)]],*/
      PhoneCell: ['', [Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/), Validators.required]],
      PhoneOffice: ['', [Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/)]],
      PhoneHome: ['', [Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/)]],
      Fax: ['', [Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/)]],

      AgencyId: [null],
      supervisorId: [0],
      managerId: [0],
      //udSupervisorId:[0],
      //uwAssistantId: [0],
      agencyName: [{ value: '', disabled: true }],
      isActive: [''],
      isLocked: [''],
      userRoles: ['', [Validators.required]],
      userLobs: []
      // LobId:[0],
      // StateId:[0]
    });

    this.addagent.patchValue({ isActive: true });
    this.addagent.patchValue({ isLocked: false });
  }


  assignvalue() {
    this.addagent.controls['FirstName'].setValue(this.agentlist.firstName);
    this.addagent.controls['Middlename'].setValue(this.agentlist.middleName);
    this.addagent.controls['LastName'].setValue(this.agentlist.lastName);
    this.addagent.controls['Email'].setValue(this.agentlist.email);
    this.addagent.controls['Zip'].setValue(this.agentlist.zip);
    this.addagent.controls['City'].setValue(this.agentlist.city);
    this.addagent.controls['State'].setValue(this.agentlist.state);
    this.addagent.controls['AddressLine1'].setValue(this.agentlist.addressLine1);
    this.addagent.controls['AddressLine2'].setValue(this.agentlist.addressLine2);
    this.addagent.controls['PhoneCell'].setValue(this.agentlist.phoneCell ? this.agentlist.phoneCell.replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '');
    this.addagent.controls['PhoneOffice'].setValue(this.agentlist.phoneOffice ? this.agentlist.phoneOffice.replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '');
    this.addagent.controls['PhoneHome'].setValue(this.agentlist.phoneHome ? this.agentlist.phoneHome.replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '');
    this.addagent.controls['Fax'].setValue(this.agentlist.fax ? this.agentlist.fax.replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '');
    this.addagent.controls['agencyName'].setValue(this.agentlist.agencyName);
    this.addagent.controls['isActive'].setValue(this.agentlist.isActive);
    this.addagent.controls['isLocked'].setValue(this.agentlist.isLocked);

    this.email.disable();
    this.validateAddress();
  }


  SaveAccountWithAddressValidation() {
    this.subject.subscribe(resp => {
      if (resp == 'validateAddress') {
        this.validateAddress();
      }
      if (resp == 'save' && this.IsEventFromPage) {
        this.addAgent();
      }
    })
  }

  SaveAccountWithOserverPattern() {
    this.IsEventFromPage = true;
    this.subject.next("validateAddress");
  }

  addAgent() {
    this.IsEventFromPage = false;
    let underwriterAssistants = [];
    let addUserRequestObj = this.addagent.getRawValue();
    if (this.selectedRoled.length) {
      addUserRequestObj["userRoles"] = this.selectedRoled.sort((a, b) => a - b);
      this.roleControl?.setValidators(null);
    } else {
      this.roleControl.setValidators([Validators.required]);
    }
    this.roleControl?.updateValueAndValidity();
    if (this.selectedItem.length && this.selectedItem.length > 0) {
      addUserRequestObj["userLobs"] = [];
      addUserRequestObj["userLobs"] = this.selectedItem.map(x => { const newobj = {}; newobj['LobId'] = x.lobId; return newobj })
      this.LobsControl?.setValidators(null);

    } else {
      this.LobsControl.setValidators([Validators.required]);
    }
    this.AssistantList.filter(el => {
      underwriterAssistants.push({ 'UnderwriterAssistantId': el.UWAssistantId })
    })

    this.LobsControl?.updateValueAndValidity();
    addUserRequestObj['managerId'] = addUserRequestObj['managerId'] != null ? addUserRequestObj['managerId'] : 0;
    addUserRequestObj['supervisorId'] = addUserRequestObj['supervisorId'] != null ? addUserRequestObj['supervisorId'] : 0;
    addUserRequestObj['AgencyId'] = addUserRequestObj['AgencyId'] != null ? addUserRequestObj['AgencyId'] : null;

    addUserRequestObj['PhoneOffice'] = String(addUserRequestObj['PhoneOffice']).split("").filter(d => !isNaN(Number(d)) && d.trim() !== "").join("");
    addUserRequestObj['PhoneCell'] = String(addUserRequestObj['PhoneCell']).split("").filter(d => !isNaN(Number(d)) && d.trim() !== "").join("");
    addUserRequestObj['PhoneHome'] = String(addUserRequestObj['PhoneHome']).split("").filter(d => !isNaN(Number(d)) && d.trim() !== "").join("");
    addUserRequestObj['Fax'] = String(addUserRequestObj['Fax']).split("").filter(d => !isNaN(Number(d)) && d.trim() !== "").join("");
    addUserRequestObj["UserId"] = this._userinfo.UserId();
    addUserRequestObj["ClientId"] = "";
    addUserRequestObj["AgentId"] = sessionStorage.getItem('_agentId') || 0;
    addUserRequestObj["underwriterLobs"] = this.selectedLob;
    addUserRequestObj["underwriterStates"] = this.selectedState
    addUserRequestObj["underwriterAssistants"] = this.selectedUWAssistant;

    if (this.addagent.valid && !this.isAddress1Valid && !this.validateField) {
      this._loader.show();
      let reqObject = this.trimValueService.TrimObjectValue(addUserRequestObj)
      this.agent.CreateAgent(reqObject).subscribe(data => {
        this._loader.hide();
        if (data?.success) {
          this._checkRoleService.addNewUserSubject.next('AddNewUser');
          this._router.navigateByUrl('agenciiq/users');
        } else {
          this._popupService.showPopup('Agent', data.message);
        }
      }, (err) => {
        this._loader.hide();
        console.log("err", err);
      }, () => {
        this._loader.hide();
      });
    } else {
      this.submitted = true;

    }
  }

  cancel() {
    this._router.navigateByUrl('/agenciiq/users')
  }

  getAgentDetails(agentId: string) {
    this.agentdetails = this.agent?.AgentById(agentId);
    if (this.agentdetails && this.agentdetails?.length > 0) {
      this.agentlist = this.agentdetails[0].agent;
      let _role: any[] = this.agentdetails[0].agentRoles;
      this.selectedRoled = _role.map(role => {
        return {
          "roleId": role.roleId
        }
      });


      this.savedLobList = this.agentdetails[0].agentLob;
      this.saveStateList = this.agentdetails[0].agentState;
      //agentStates

      if (this.checkRoleService.isRoleCodeAvailable(Roles.Agent.roleCode, _role)) {
        this.supervisorIdControl?.setValue(this.agentlist.supervisorId);
        this.managerIdControl?.setValue(this.agentlist.managerId);
      }
      if (this.checkRoleService.isRoleCodeAvailable(Roles.Supervisor.roleCode, _role)
        || this.checkRoleService.isRoleCodeAvailable(Roles.UWSupervisior.roleCode, _role)) {
        this.managerIdControl.setValue(this.agentlist.managerId);
      }
      if (this.checkRoleService.isRoleCodeAvailable(Roles.Underwriter.roleCode, _role) || this.checkRoleService.isRoleCodeAvailable(Roles.UnderwriterAssistant.roleCode, _role)) {
        //this.udSupervisorIdControl.setValue(this.agentlist.supervisorId);
        this.supervisorIdControl.setValue(this.agentlist.supervisorId);
        this.managerIdControl.setValue(this.agentlist.managerId);
        // this.lobIdControl.setValue(_lob[0].lobId);
        // this.stateIdControl.setValue(_state[0].stateId);
      }
      // if (this.checkRoleService.isRoleCodeAvailable(Roles.UnderwriterAssistant.roleCode, _role) || this.checkRoleService.isRoleCodeAvailable(Roles.UnderwriterAssistant.roleCode, _role)) {
      //   this.supervisorIdControl.setValue(this.agentlist.supervisorId);
      //   this.managerIdControl.setValue(this.agentlist.managerId);
      // }

      if (this.checkRoleService.isRoleCodeAvailable(Roles.AgencyAdmin.roleCode, _role)) {
        this.agencyIdControl.setValue(this.agentlist.agencyId)
        this.agencyIdControl.setValidators([Validators.required]);
        this.agencyIdControl.updateValueAndValidity();
      }

      this.assignvalue();

      if (this.checkRoleService.isRoleCodeAvailable(Roles.MGAAdmin.roleCode, this._roleinfo.Roles()) && this.checkRoleService.isRoleIdAvailable(3, this.selectedRoled)) {
        this.agencyIdControl?.setValue(this.agentlist.agencyId, { emitEvent: true });
      }
    }


  }

  // setAssistantList(assisList) {
  //    
  //   let uwaList = false;
  //   let UWAssistantList = this.UWAssistantList;
  //   this.AssistantList = this.UWAssistantList.filter(function (ual, index) {
  //     uwaList = false;
  //     assisList.filter(al => {
  //       if (ual.UWAssistantId == al.underwriterAssistantId)
  //         uwaList = true;
  //     })
  //     if (uwaList) {
  //       UWAssistantList.splice(index, 1);
  //       return ual;
  //     }
  //   })
  //   this.UWAssistantList = UWAssistantList;

  // }

  isChecked(_roleId) {
    return this.selectedRoled.some(role => {
      if (role.roleId == _roleId) {
        this.roleControl.setValidators(null);
        this.roleControl.updateValueAndValidity();
        return true;
      }
    });
  }

  selectValue(value: any) {
    this.addagent.patchValue({ "State": value });
    this.showDropDown = false;
  }

  closeDropDown() {
    this.showDropDown = !this.showDropDown;
  }

  openDropDown() {
    this.showDropDown = false;
  }

  getSearchValue() {
    return this.addagent.value.State;
  }

  getRoleOnPriority() {
    let _rolesArray = this._roleinfo.Roles();
    let _filterRole = [];
    let _roleId = 0;
    if (this.checkRoleService.isRoleCodeAvailable(Roles.SystemAdmin.roleCode, _rolesArray)) {
      _filterRole = _rolesArray?.filter(el => {
        return el.roleCode == Roles.SystemAdmin.roleCode
      })
      _roleId = _filterRole[0]?.roleId;
    }
    else if (this.checkRoleService.isRoleCodeAvailable(Roles.MGAAdmin.roleCode, _rolesArray)) {
      _filterRole = _rolesArray?.filter(el => {
        return el.roleCode == Roles.MGAAdmin.roleCode
      })
      _roleId = _filterRole[0]?.roleId;
    }
    else if (this.checkRoleService.isRoleCodeAvailable(Roles.AgencyAdmin.roleCode, _rolesArray)) {
      _filterRole = _rolesArray?.filter(el => {
        return el.roleCode == Roles.AgencyAdmin.roleCode
      })
      _roleId = _filterRole[0]?.roleId;
    }
    return _roleId;
  }

  getRoles() {
    let userId = this._userinfo.UserId();
    let roleId = this.getRoleOnPriority();
    let clientId = "0";
    this.userRoleCode = this._roleinfo?.Roles()[0]?.roleCode;
    if (this.checkRoleService.isRoleCodeAvailable('AgencyAdmin', this._roleinfo.Roles())) {
      this.agencyNameControl?.setValue(this._agencyinfo.Agency().agencyName);
      this.agencyIdControl?.setValue(this._agencyinfo.Agency().agencyId);
      this.getSupervisorAndManagerNameList(this._userinfo.UserId(), this._agencyinfo.Agency()?.agencyId);
    } else if (this.checkRoleService.isRoleCodeAvailable('MGAAdmin', this._roleinfo.Roles())) {
      this.getAgencyList();
      this.getUWManagerSupervisorList(this._userinfo.UserId(), 0)
    }
    this.agent.AgentRole(roleId.toString(), userId.toString(), clientId.toString())?.subscribe(data => {
      this.roles = data.data.role;
    });
  }
  agencycheck = this.checkRoleService.isRoleCodeAvailable('AgencyAdmin', this._roleinfo.Roles());
  systemcheck = this.checkRoleService.isRoleCodeAvailable('SystemAdmin', this._roleinfo.Roles());
  agentcheck = this.checkRoleService.isRoleCodeAvailable('Agent', this._roleinfo.Roles());

  getAgencyList() {
    this._agency.NewAgencyList(this._userinfo.UserId(), this.agencyId, this.agentId)
      .subscribe(agencyList => {
        if (agencyList && agencyList.data && agencyList.data.agencyList) {
          let a = agencyList.data.agencyList.filter(item => { return item.registered == 'Yes' });
          let x = a.map(agency => {
            return { agencyId: agency.agencyId, agencyName: agency.agencyName }
          })
          this.agencyList = this._sortingService.SortObjectArray('agencyName', 'ASC', x);
        }
      });
  }


  // getSupervisorAndManagerNameList(userId: any, agencyId: any) {
  //   this.agent.AgentList(userId, agencyId).subscribe(data => {
  //     if (data && data.data && data.data.agentList) {
  //       let _agencyList = data.data.agentList;
  //       // Logic to find supervisor list

  //       let _supervisorList = _agencyList.filter(agent => {
  //         //return true;
  //         return agent.agentRoles.some(role => {
  //           return role.roleCode == Roles.Supervisor.roleCode
  //         })
  //       }).map(supervisor => {
  //         return {
  //           supervisorId: supervisor.agent.userId,
  //           supervisorName: supervisor.agent.firstName + " " + supervisor.agent.middleName + " " + supervisor.agent.lastName
  //         }
  //       });

  //       this.supervisorList = this._sortingService.SortObjectArray('supervisorName', 'ASC', _supervisorList);


  //       // Managing dropdown list value of Supervisor List as per check and uncheck

  //       if (this.isEdit && !this.agencyAdminCheck) {
  //         if (this.updatedSupervisorList.length) {
  //           this.supervisorList = this.supervisorList.filter(item => item.supervisorId != this.updatedSupervisorList[0].supervisorId);
  //         } else {

  //         }
  //       } else {
  //         if (this.updatedSupervisorList.length) {
  //           this.supervisorList.push(this.updatedSupervisorList[0]);
  //         } else {
  //           this.supervisorList = this.supervisorList.filter(user => user.managerId != -1);
  //         }
  //       }

  //       // Logic to find manager list

  //       let _managerList = _agencyList.filter(agent => {
  //         // return true;
  //         return agent.agentRoles.some(role => {
  //           return role.roleCode == Roles.Manager.roleCode
  //         })
  //       }).map(manager => {
  //         return {
  //           managerId: manager.agent.userId,
  //           managerName: manager.agent.firstName + " " + manager.agent.middleName + " " + manager.agent.lastName
  //         }
  //       });

  //       this.mangerList = _managerList;
  //       this.mangerList = this._sortingService.SortObjectArray('managerName', 'ASC', _managerList);


  //       // Managing dropdown list value of Manager List as per check and uncheck

  //       if (this.isEdit && !this.agencyAdminCheck) {
  //         if (this.updatedManagerList.length) {
  //           this.mangerList = this.mangerList.filter(item => item.managerId != this.updatedManagerList[0].managerId);
  //         } else {

  //         }

  //       } else {
  //         if (this.updatedManagerList.length) {
  //           this.mangerList.push(this.updatedManagerList[0]);
  //         } else {
  //           this.mangerList = this.mangerList.filter(user => user.managerId != -1);
  //         }
  //       }

  //       // this.roles.filter(role=>{
  //       //   this
  //       // })

  //     }
  //   })
  // }

  getSupervisorAndManagerNameList(userId: any, agencyId: any): void {
    this.agent.AgentList(userId, agencyId).subscribe(data => {
      const agentList = data?.data?.agentList || [];
      if (!agentList.length) return;

      // Utility to build full name
      const getFullName = (agent: any): string =>
        [agent.firstName, agent.middleName, agent.lastName].filter(Boolean).join(' ');

      // Extract supervisor list
      const supervisorList = agentList
        .filter(agent => agent.agentRoles?.some(role => role.roleCode === Roles.Supervisor.roleCode))
        .map(supervisor => ({
          supervisorId: supervisor.agent.userId,
          supervisorName: getFullName(supervisor.agent)
        }));

      this.supervisorList = this._sortingService.SortObjectArray('supervisorName', 'ASC', supervisorList);

      // Update supervisor list if editing
      if (this.isEdit && !this.agencyAdminCheck) {
        if (this.updatedSupervisorList.length) {
          const excludeId = this.updatedSupervisorList[0].supervisorId;
          this.supervisorList = this.supervisorList.filter(item => item.supervisorId !== excludeId);
        }
      } else {
        if (this.updatedSupervisorList.length) {
          this.supervisorList.push(this.updatedSupervisorList[0]);
        } else {
          this.supervisorList = this.supervisorList.filter(user => user.supervisorId !== -1);
        }
      }

      // Extract manager list
      const managerList = agentList
        .filter(agent => agent.agentRoles?.some(role => role.roleCode === Roles.Manager.roleCode))
        .map(manager => ({
          managerId: manager.agent.userId,
          managerName: getFullName(manager.agent)
        }));

      this.mangerList = this._sortingService.SortObjectArray('managerName', 'ASC', managerList);

      // Update manager list if editing
      if (this.isEdit && !this.agencyAdminCheck) {
        if (this.updatedManagerList.length) {
          const excludeId = this.updatedManagerList[0].managerId;
          this.mangerList = this.mangerList.filter(item => item.managerId !== excludeId);
        }
      } else {
        if (this.updatedManagerList.length) {
          this.mangerList.push(this.updatedManagerList[0]);
        } else {
          this.mangerList = this.mangerList.filter(user => user.managerId !== -1);
        }
      }
    });
  }


  // getUWManagerSupervisorList(userId, agencyId) {

  //   this.agent.AgentList(userId, agencyId)
  //     .subscribe(data => {
  //       if (data && data.data && data.data.agentList) {
  //         let _agencyList = data.data.agentList;
  //         // Logic to find UWsupervisor list

  //         let _UWSupervisorList = _agencyList.filter(agent => {
  //           //return true;
  //           return agent.agentRoles.some(role => {
  //             return (role.roleCode == Roles.UWSupervisior.roleCode)
  //           })
  //         }).map(UWSupervisor => {
  //           return {
  //             UWSupervisorId: UWSupervisor.agent.agentId,
  //             UWSupervisorName: UWSupervisor.agent.firstName + " " + UWSupervisor.agent.middleName + " " + UWSupervisor.agent.lastName
  //           }
  //         });

  //         this.UWSupervisorList = this._sortingService.SortObjectArray('UWSupervisorName', 'ASC', _UWSupervisorList);


  //         // Managing dropdown list value of UWSupervisor List as per check and uncheck

  //         if (this.isEdit && this.agencyAdminCheck) {
  //           if (this.updatedUWSupervisorList.length) {
  //             this.UWSupervisorList = this.UWSupervisorList.filter(item => item.UWSupervisorId != this.updatedUWSupervisorList[0].UWSupervisorId);
  //           } else {

  //           }
  //         } else {
  //           if (this.updatedUWSupervisorList.length) {
  //             this.UWSupervisorList.push(this.updatedUWSupervisorList[0]);
  //           } else {
  //             this.UWSupervisorList = this.UWSupervisorList.filter(user => user.managerId != -1);
  //           }
  //         }

  //         // Logic to find UWManager list

  //         let _UWManagerList = _agencyList.filter(agent => {
  //           // return true;
  //           return agent.agentRoles.some(role => {
  //             return (role.roleCode == Roles.UWManager.roleCode)
  //           })
  //         }).map(UWManager => {
  //           return {
  //             UWManagerId: UWManager.agent.agentId,
  //             UWManagerName: UWManager.agent.firstName + " " + UWManager.agent.middleName + " " + UWManager.agent.lastName
  //           }
  //         });

  //         this.UWMangerList = _UWManagerList;
  //         this.UWMangerList = this._sortingService.SortObjectArray('managerName', 'ASC', _UWManagerList);


  //         // Managing dropdown list value of UWManager List as per check and uncheck

  //         if (this.isEdit && this.agencyAdminCheck) {
  //           if (this.updatedUWManagerList.length) {
  //             this.UWMangerList = this.UWMangerList.filter(item => item.UWManagerId != this.updatedUWManagerList[0].UWManagerId);
  //           } else {

  //           }

  //         } else {
  //           if (this.updatedUWManagerList.length) {
  //             this.UWMangerList.push(this.updatedUWManagerList[0]);
  //           } else {
  //             this.UWMangerList = this.UWMangerList.filter(user => user.UWManagerId != -1);
  //           }
  //         }

  //         // Logic to find UWAssistant list

  //         let _UWAssistantList = _agencyList.filter(agent => {
  //           //return true;
  //           return agent.agentRoles.some(role => {
  //             return role.roleCode == Roles.UnderwriterAssistant.roleCode
  //           })
  //         }).map(UWAssistant => {
  //           return {
  //             UWAssistantId: UWAssistant.agent.userId,
  //             UWAssistantName: UWAssistant.agent.firstName + " " + UWAssistant.agent.middleName + " " + UWAssistant.agent.lastName
  //           }
  //         });

  //         this.UWAssistantList = _UWAssistantList;
  //         this.UWAssistantList = this._sortingService.SortObjectArray('managerName', 'ASC', _UWAssistantList);

  //         // if(this.agentdetails.length) this.setAssistantList(this.agentdetails[0].underwriterAssistant);
  //         //if(this.agentdetails.length) 
  //         //if(this.agentdetails[0].length)
  //         let underwriterAssistant
  //         if (this.agentdetails.length != 0) {
  //           underwriterAssistant = this.agentdetails[0].underwriterAssistant;
  //         }
  //         else
  //           underwriterAssistant = [];
  //         this.getUnderwritterAssistantList(underwriterAssistant);
  //         //this.getLobList(this.userId,this.agentdetails[0].agentLob);
  //         //this.getStateList(this.parameterStateKey, this.agentdetails[0].agentState);
  //       }
  //     })
  // }


  getUWManagerSupervisorList(userId: any, agencyId: any): void {
    this.agent.AgentList(userId, agencyId).subscribe(data => {
      const agentList = data?.data?.agentList || [];
      if (!agentList.length) return;

      const getFullName = (agent: any): string =>
        [agent.firstName, agent.middleName, agent.lastName].filter(Boolean).join(' ');

      const getFilteredRoleList = (roleCode: string, idKey: string, nameKey: string) => {
        return agentList
          .filter(agent => agent.agentRoles?.some(role => role.roleCode === roleCode))
          .map(agent => ({
            [idKey]: agent.agent.agentId ?? agent.agent.userId, // fallback in case of id inconsistency
            [nameKey]: getFullName(agent.agent)
          }));
      };

      // Supervisors
      let supervisorList = getFilteredRoleList(Roles.UWSupervisior.roleCode, 'UWSupervisorId', 'UWSupervisorName');
      this.UWSupervisorList = this._sortingService.SortObjectArray('UWSupervisorName', 'ASC', supervisorList);

      if (this.isEdit && this.agencyAdminCheck) {
        if (this.updatedUWSupervisorList.length) {
          const excludeId = this.updatedUWSupervisorList[0].UWSupervisorId;
          this.UWSupervisorList = this.UWSupervisorList.filter(item => item.UWSupervisorId !== excludeId);
        }
      } else {
        if (this.updatedUWSupervisorList.length) {
          this.UWSupervisorList.push(this.updatedUWSupervisorList[0]);
        } else {
          this.UWSupervisorList = this.UWSupervisorList.filter(user => user.UWSupervisorId !== -1);
        }
      }

      // Managers
      let managerList = getFilteredRoleList(Roles.UWManager.roleCode, 'UWManagerId', 'UWManagerName');
      this.UWMangerList = this._sortingService.SortObjectArray('UWManagerName', 'ASC', managerList);

      if (this.isEdit && this.agencyAdminCheck) {
        if (this.updatedUWManagerList.length) {
          const excludeId = this.updatedUWManagerList[0].UWManagerId;
          this.UWMangerList = this.UWMangerList.filter(item => item.UWManagerId !== excludeId);
        }
      } else {
        if (this.updatedUWManagerList.length) {
          this.UWMangerList.push(this.updatedUWManagerList[0]);
        } else {
          this.UWMangerList = this.UWMangerList.filter(user => user.UWManagerId !== -1);
        }
      }

      // Assistants
      let assistantList = getFilteredRoleList(Roles.UnderwriterAssistant.roleCode, 'UWAssistantId', 'UWAssistantName');
      this.UWAssistantList = this._sortingService.SortObjectArray('UWAssistantName', 'ASC', assistantList);

      // Handle assistant details
      const underwriterAssistant = this.agentdetails?.[0]?.underwriterAssistant || [];
      this.getUnderwritterAssistantList(underwriterAssistant);
    });
  }


  updatedManagerSupervisorList() {
    if (this.isEdit && !this.agencyAdminCheck) {
      if (this.updatedSupervisorList.length) {
        this.supervisorList = this.supervisorList.filter((item: any) => item.supervisorId != this.updatedSupervisorList[0].supervisorId);
      } else {
        this.supervisorList.push({
          supervisorId: this.agentId,
          supervisorName: this.userName
        })
      }
    } else {
      if (this.updatedSupervisorList.length) {
        this.supervisorList.push(this.updatedSupervisorList[0]);
      } else {
        this.supervisorList = this.supervisorList.filter(user => user.managerId != -1);
      }
    }

    if (this.isEdit && !this.agencyAdminCheck) {
      if (this.updatedManagerList.length) {
        this.mangerList = this.mangerList.filter((item: any) => item.managerId != this.updatedManagerList[0].managerId);
      } else {
        this.mangerList.push({
          managerId: this.agentId,
          managerName: this.userName
        })
      }

    } else {
      if (this.updatedManagerList.length) {
        this.mangerList.push(this.updatedManagerList[0]);
      } else {
        this.mangerList = this.mangerList.filter(user => user.managerId != -1);
      }
    }

    //   this.roles.filter(role=>{
    //    this.selectedRoled.filter(selectedRole=>{
    //   let a =  this.selectedRoled.filter(selectedRole=>{
    //      if(selectedRole.roleId == role.ID){}
    //      else return role
    //    })
    //   })
    // })


  }



  getZipDetails(zipcode) {
    this.isZipInvalid = false;
    this._loader.show();
    this.zipDetails.ZipDetails(zipcode)
      .subscribe(data => {
        this._loader.hide();
        if (data && data['CityStateLookupResponse'] && data['CityStateLookupResponse']['ZipCode']) {
          let obj = data['CityStateLookupResponse']['ZipCode'];
          if (obj.Error) {
            this.isZipInvalid = true;
            this.zipErrorMessage = obj.Error.Description;
            this.zip.setErrors({ 'notvalid': true });
          } else {
            if (obj.City) {
              this.city.setValue(obj.City);
            }
            if (obj.State) {
              this.state.setValue(obj.State);
            }
          }
          this.validateAddress();
        }
      }, (err) => {
        this._loader.hide();
      }, () => {
        this._loader.hide();
      });
  }



  onChnages() {
    // alert()
    this.addressline1?.valueChanges.subscribe(x => {
      if (x.trim()) {
        this.addressline2.setValidators(null);
        this.addressline1.setValidators(null);
        this.addressline1.updateValueAndValidity({ emitEvent: false });
        this.addressline2.updateValueAndValidity({ emitEvent: false });
      } else {
        if (!this.addressline2.value) {
          this.addressline1.setValidators([Validators.required]);
          this.addressline1.updateValueAndValidity({ emitEvent: false });
        }
      }
    });

    this.addressline2.valueChanges.subscribe(x => {
      if (x.trim()) {
        this.addressline2.setValidators(null);
        this.addressline1.setValidators(null);
        this.addressline1.updateValueAndValidity({ emitEvent: false });
        this.addressline2.updateValueAndValidity({ emitEvent: false });
      } else {
        if (!this.addressline1.value) {
          this.addressline1.setValidators([Validators.required]);
          this.addressline1.updateValueAndValidity({ emitEvent: false });
        }
      }
    });

    this.zip.valueChanges.subscribe(zipcode => {
      this.isZipInvalid = false;
      if (String(zipcode).length == 5) {
        this.getZipDetails(zipcode);
      } else {
        this.city.setValue(null);
        this.state.setValue(null);
      }
    });
    //this.uwAssistantIdControl.valueChanges

  }



  updateRoles(roleId: any, roleCode: string, isChecked: boolean) {
    let getList: boolean = false;
    this._isChecked = isChecked;
    this.roleCode = roleCode;
    this.userName = this.addagent.get('FirstName').value + " " + this.addagent.get('Middlename').value + " " + this.addagent.get('LastName').value
    if (this._agencyinfo.Agency() && this._agencyinfo.Agency().agencyId && this._userinfo && this._userinfo.UserId()) {
      // this.getSupervisorAndManagerNameList(this._userinfo.UserId(), this._agencyinfo.Agency().agencyId);
    }


    if (isChecked) {
      this.selectedRoled.push({ "roleId": roleId });
      // this.selectedRoledForRequest.push({ "roleId": roleId });
      this.roleControl.setValidators(null);
      this.roleControl.updateValueAndValidity();

      if (roleCode == Roles.AgencyAdmin.roleCode) {

        this.agencyAdminCheck = true;
        this.agencyIdControl.setValidators([Validators.required]);
        this.agencyIdControl.updateValueAndValidity();

      } else if (roleCode == Roles.Manager.roleCode) {
        this.agencyAdminCheck = false;
        // Managing dropdown list value of Manager List as per check and uncheck
        if (this.isEdit) {
          if (this.updatedManagerList.length) {
            this.mangerList.push(this.updatedManagerList[0]);
            this.updatedManagerList = [];
          }
          else {
            this.mangerList.push({
              managerId: this.agentId,
              managerName: this.userName
            })
          }
        } else {
          this.mangerList.push({
            managerId: -1,
            managerName: this.userName
          })
        }


      } else if (roleCode == Roles.Supervisor.roleCode) {
        this.agencyAdminCheck = false;
        // Managing dropd own list value of Supervisor List as per check and uncheck
        if (this.isEdit) {
          if (this.updatedSupervisorList.length) {
            this.supervisorList.push(this.updatedSupervisorList[0]);
            this.updatedSupervisorList = [];
          } else {
            this.supervisorList.push({
              supervisorId: this.agentId,
              supervisorName: this.userName
            })
          }

        } else {
          this.supervisorList.push({
            supervisorId: -1,
            supervisorName: this.userName
          });
        }

        //this.mangerList
        this.mangerList = this._sortingService.SortObjectArray('managerName', 'ASC', this.mangerList);
        this.supervisorList = this._sortingService.SortObjectArray('supervisorName', 'ASC', this.supervisorList);


      } else if (roleCode == Roles.UWSupervisior.roleCode) {
        this.updateUWSupervisorList(isChecked, roleCode);


      } else if (roleCode == Roles.UWManager.roleCode) {
        this.updateUWManagerList(isChecked, roleCode);

      } else if (roleCode == Roles.Underwriter.roleCode) {
        this.getUnderwritterAssistantList([]);

      } else if (roleCode == Roles.UnderwriterAssistant.roleCode) {
        this.updateUWAssistant(isChecked, roleCode)

      }




    } else {

      this.selectedRoled = this.selectedRoled.filter(role => {
        if (role.roleId !== roleId) {
          return true;
        } else {
          // To Do 
          // Condition should be based on rolecode not on roleid
          if (roleCode == Roles.AgencyAdmin.roleCode) {
            this.agencyAdminCheck = true;
            this.agencyIdControl.setValidators(null);
            this.agencyIdControl.updateValueAndValidity();
            if (this.checkRoleService.isRoleCodeAvailable(Roles.AgencyAdmin.roleCode, this._roleinfo.Roles())) {

            } else {
              this.agencyIdControl.setValue(null);
            }


          } else if (roleCode == Roles.Manager.roleCode) {
            this.agencyAdminCheck = false;
            // Managing dropdown list value of Manager List as per check and uncheck
            if (this.isEdit) {
              this.managerIdControl.setValue(0);
              this.updatedManagerList = this.mangerList.filter(item => item.managerId == this.agentId);
              this.mangerList = this.mangerList.filter(item => item.managerId != this.agentId);
            } else {
              // this.updatedManagerList = [];
              this.mangerList = this.mangerList.filter(item => item.managerId != -1);
            }

          } else if (roleCode == Roles.Supervisor.roleCode) {
            this.agencyAdminCheck = false;
            // Managing dropdown list value of supervisor list as perr check and uncheck
            if (this.isEdit) {
              this.supervisorIdControl.setValue(0);
              this.updatedSupervisorList = this.supervisorList.filter(item => item.supervisorId == this.agentId);
              this.supervisorList = this.supervisorList.filter(item => item.supervisorId != this.agentId);
            } else {
              //this.updatedSupervisorList = [];
              this.supervisorList = this.supervisorList.filter(item => item.supervisorId != -1);
            }
          } else if (roleCode == Roles.Underwriter.roleCode) {
            this.selectedUWAssistant = []

          } else if (roleCode == Roles.UWSupervisior.roleCode) {
            // Managing dropdown list value of supervisor list as perr check and uncheck
            this.updateUWSupervisorList(isChecked, roleCode)


          } else if (roleCode == Roles.UWManager.roleCode) {
            // Managing dropdown list value of supervisor list as perr check and uncheck
            this.updateUWManagerList(isChecked, roleCode)


          } else if (roleCode == Roles.UnderwriterAssistant.roleCode) {
            this.updateUWAssistant(isChecked, roleCode)

          }
        }
      });
    }

    this.mangerList = this._sortingService.SortObjectArray('managerName', 'ASC', this.mangerList);


  }

  // updateUWSupervisorList(isChecked: boolean, roleCode: string) {

  //   if (isChecked) {
  //     //if (roleCode == Roles.Underwriter.roleCode || roleCode == Roles.UnderwriterAssistant.roleCode) {
  //     //this.agencyAdminCheck = false;
  //     // Managing dropd own list value of Supervisor List as per check and uncheck
  //     if (this.isEdit) {
  //       this.supervisorIdControl.setValue(0);
  //       if (this.updatedUWSupervisorList.length) {
  //         this.UWSupervisorList.push(this.updatedUWSupervisorList[0]);
  //         this.updatedSupervisorList = [];
  //       } else {
  //         this.UWSupervisorList.push({
  //           UWSupervisorId: this.agentId,
  //           UWSupervisorName: this.userName
  //         })
  //       }

  //     } else {
  //       this.UWSupervisorList.push({
  //         UWSupervisorId: -1,
  //         UWSupervisorName: this.userName
  //       });
  //     }
  //     // this.supervisorList = this._sortingService.SortObjectArray('UWSupervisorName', 'ASC', this.supervisorList);

  //     //}
  //   }

  //   else {
  //     //if (roleCode == Roles.Underwriter.roleCode || roleCode == Roles.UnderwriterAssistant.roleCode) {
  //     this.agencyAdminCheck = false;
  //     // Managing dropdown list value of UWSupervisor list as perr check and uncheck
  //     if (this.isEdit) {
  //       this.supervisorIdControl.setValue(0);
  //       this.updatedSupervisorList = this.supervisorList.filter(item => item.supervisorId == this.agentId);
  //       this.UWSupervisorList = this.UWSupervisorList.filter(item => item.UWSupervisorId != this.agentId);
  //     } else {
  //       //this.updatedSupervisorList = [];
  //       this.UWSupervisorList = this.UWSupervisorList.filter(item => item.UWSupervisorId != -1);
  //     }
  //     // }
  //   }
  //   this.UWSupervisorList = this._sortingService.SortObjectArray('UWSupervisorName', 'ASC', this.UWSupervisorList);

  // }

  updateUWSupervisorList(isChecked: boolean, roleCode: string): void {
    this.agencyAdminCheck = false;
    this.supervisorIdControl.setValue(0);

    if (isChecked) {
      const supervisor = this.isEdit
        ? (this.updatedUWSupervisorList.length
          ? this.updatedUWSupervisorList.shift()
          : { UWSupervisorId: this.agentId, UWSupervisorName: this.userName })
        : { UWSupervisorId: -1, UWSupervisorName: this.userName };

      this.UWSupervisorList.push(supervisor);
    } else {
      if (this.isEdit) {
        this.updatedSupervisorList = this.supervisorList.filter(item => item.supervisorId === this.agentId);
      }

      const idToRemove = this.isEdit ? this.agentId : -1;
      this.UWSupervisorList = this.UWSupervisorList.filter(item => item.UWSupervisorId !== idToRemove);
    }

    this.UWSupervisorList = this._sortingService.SortObjectArray('UWSupervisorName', 'ASC', this.UWSupervisorList);
  }


  updateUWManagerList(isChecked: boolean, roleCode: string) {

    if (isChecked) {
      //if (roleCode == Roles.Underwriter.roleCode || roleCode == Roles.UnderwriterAssistant.roleCode || roleCode == Roles.UWSupervisior.roleCode) {
      //this.agencyAdminCheck = false;
      // Managing dropd own list value of UWManager List as per check and uncheck
      if (this.isEdit) {
        if (this.updatedUWManagerList.length) {
          this.UWMangerList.push(this.updatedUWManagerList[0]);
          this.updatedUWManagerList = [];
        } else {
          this.UWMangerList.push({
            UWManagerId: this.agentId,
            UWManagerName: this.userName
          })
        }

      } else {
        this.UWMangerList.push({
          UWManagerId: -1,
          UWManagerName: this.userName
        });
      }
      // this.UWMangerList = this._sortingService.SortObjectArray('UWManagerName', 'ASC', this.UWMangerList);

      //}
    }

    else {
      //if (roleCode == Roles.Underwriter.roleCode || roleCode == Roles.UnderwriterAssistant.roleCode) {
      this.agencyAdminCheck = false;
      // Managing dropdown list value of UWManager list as perr check and uncheck
      if (this.isEdit) {
        this.managerIdControl.setValue(0);
        this.updatedUWManagerList = this.UWMangerList.filter(item => item.UWManagerId == this.agentId);
        this.UWMangerList = this.UWMangerList.filter(item => item.UWManagerId != this.agentId);
      } else {
        //this.updatedSupervisorList = [];
        this.UWMangerList = this.UWMangerList.filter(item => item.UWManagerId != -1);
      }
      //}
    }

    this.UWMangerList = this._sortingService.SortObjectArray('UWManagerName', 'ASC', this.UWMangerList);
  }

  updateUWAssistant(isChecked: boolean, roleCode: string) {


    if (isChecked) {
      //if (roleCode == Roles.Underwriter.roleCode || roleCode == Roles.UnderwriterAssistant.roleCode || roleCode == Roles.UWSupervisior.roleCode) {
      //this.agencyAdminCheck = false;
      // Managing dropd own list value of UWManager List as per check and uncheck
      if (this.isEdit) {
        if (this.updateUWAssistantList.length) {
          this.UWAssistantList.push(this.updateUWAssistantList[0]);
          this.updateUWAssistantList = [];
        } else {
          this.UWAssistantList.push({
            UWAssistantId: this.agentId,
            UWAssistantName: this.userName
          })
        }

      } else {
        this.UWAssistantList.push({
          UWAssistantId: -1,
          UWAssistantName: this.userName
        });
      }
      // this.UWMangerList = this._sortingService.SortObjectArray('UWManagerName', 'ASC', this.UWMangerList);

      //}
    }

    else {
      //if (roleCode == Roles.Underwriter.roleCode || roleCode == Roles.UnderwriterAssistant.roleCode) {
      this.agencyAdminCheck = false;
      // Managing dropdown list value of UWManager list as perr check and uncheck
      if (this.isEdit) {
        //this.managerIdControl.setValue(0);
        this.updateUWAssistantList = this.UWAssistantList.filter(item => item.UWAssistantId == this.agentId);
        this.UWAssistantList = this.UWMangerList.filter(item => item.UWAssistantId != this.agentId);
      } else {
        //this.updatedSupervisorList = [];
        this.UWAssistantList = this.UWAssistantList.filter(item => item.UWAssistantId != -1);
      }
      //}
    }

    this.UWAssistantList = this._sortingService.SortObjectArray('UWAssistantName', 'ASC', this.UWAssistantList);
    this.getUnderwritterAssistantList([]);
  }


  isVisible(groupName: string) {
    // 
    if (groupName == 'supervisor') {
      let isVisibleRole = this.selectedRoled.some(role => {
        let MachedRole = this.roles.filter(roles => {
          return roles.roleID == role.roleId ? true : false;
        });
        if (MachedRole && MachedRole.length) {
          return MachedRole[0].roleCode == 'Agent' ? true : false;
        }
      });
      return isVisibleRole;
    } else if (groupName == 'manager') {
      let isVisibleRole = this.selectedRoled.some(role => {
        let MachedRole = this.roles.filter(roles => {
          return roles.roleID == role.roleId ? true : false;
        });
        if (MachedRole && MachedRole.length) {
          return this.checkRoleService.isRoleCodeAvailable('Agent', MachedRole)/*  MachedRole[0].roleCode == 'Agent' */
            || this.checkRoleService.isRoleCodeAvailable('Supervisor', MachedRole) /* MachedRole[0].roleCode == 'Supervisor' */ ? true : false;
        }
      });
      return isVisibleRole;
    } else if (groupName == 'UWSupervisor') {
      let isVisibleRole = this.selectedRoled.some(role => {
        let MachedRole = this.roles.filter(roles => {
          return roles.roleID == role.roleId ? true : false;
        });
        if (MachedRole && MachedRole.length) {
          return this.checkRoleService.isRoleCodeAvailable('Underwriter', MachedRole)/*  MachedRole[0].roleCode == 'Underwriter' */
            || this.checkRoleService.isRoleCodeAvailable('Underwriter Assistant', MachedRole) /* MachedRole[0].roleCode == 'UWManager' */
            //||this.checkRoleService.isRoleCodeAvailable('UWSupervisior', MachedRole)/*  MachedRole[0].roleCode == 'UWSupervisior' */
            ? true : false;
        }
      });
      return isVisibleRole;
    } else if (groupName == 'UWManager') {
      let isVisibleRole = this.selectedRoled.some(role => {
        let MachedRole = this.roles.filter(roles => {
          return roles.roleID == role.roleId ? true : false;
        });
        if (MachedRole && MachedRole.length) {
          return this.checkRoleService.isRoleCodeAvailable('Underwriter', MachedRole)/*  MachedRole[0].roleCode == 'Underwriter' */
            || this.checkRoleService.isRoleCodeAvailable('Underwriter Assistant', MachedRole) /* MachedRole[0].roleCode == 'UWManager' */
            || this.checkRoleService.isRoleCodeAvailable('UWSupervisior', MachedRole)/*  MachedRole[0].roleCode == 'UWSupervisior' */
            ? true : false;
        }
      });
      return isVisibleRole;
    } else if (groupName == 'UWAssistant') {
      let isVisibleRole = this.selectedRoled.some(role => {
        let MachedRole = this.roles.filter(roles => {
          return roles.roleID == role.roleId ? true : false;
        });
        if (MachedRole && MachedRole.length) {
          return this.checkRoleService.isRoleCodeAvailable('Underwriter', MachedRole)/*  MachedRole[0].roleCode == 'Underwriter' */
            //|| this.checkRoleService.isRoleCodeAvailable('Underwriter Assistant', MachedRole) /* MachedRole[0].roleCode == 'UWManager' */ 
            //||this.checkRoleService.isRoleCodeAvailable('UWSupervisior', MachedRole)/*  MachedRole[0].roleCode == 'UWSupervisior' */
            ? true : false;
        }
      });
      return isVisibleRole;
    } else if (groupName == 'lob') {
      let isVisibleRole = this.selectedRoled.some(role => {
        let MachedRole = this.roles.filter(roles => {
          return roles.roleID == role.roleId ? true : false;
        });
        if (MachedRole && MachedRole.length) {
          return this.checkRoleService.isRoleCodeAvailable('Underwriter', MachedRole)/*  MachedRole[0].roleCode == 'Underwriter' */
            || this.checkRoleService.isRoleCodeAvailable('Underwriter Assistant', MachedRole) /* MachedRole[0].roleCode == 'UWManager' */
            //||this.checkRoleService.isRoleCodeAvailable('UWSupervisior', MachedRole)/*  MachedRole[0].roleCode == 'UWSupervisior' */
            ? true : false;
        }
      });
      return isVisibleRole;
    } else if (groupName == 'state') {
      let isVisibleRole = this.selectedRoled.some(role => {
        let MachedRole = this.roles.filter(roles => {
          return roles.roleID == role.roleId ? true : false;
        });
        if (MachedRole && MachedRole.length) {
          return this.checkRoleService.isRoleCodeAvailable('Underwriter', MachedRole)/*  MachedRole[0].roleCode == 'Underwriter' */
            || this.checkRoleService.isRoleCodeAvailable('Underwriter Assistant', MachedRole) /* MachedRole[0].roleCode == 'UWManager' */
            //||this.checkRoleService.isRoleCodeAvailable('UWSupervisior', MachedRole)/*  MachedRole[0].roleCode == 'UWSupervisior' */
            ? true : false;
        }
      });
      return isVisibleRole;
    } else if (groupName == 'agencyNameList') {
      let isVisibleRole = this.selectedRoled.some(role => {
        let MachedRole = this.roles.filter(roles => {
          return roles.roleID == role.roleId ? true : false;
        });
        if (MachedRole && MachedRole.length) {
          return this.checkRoleService.isRoleCodeAvailable('AgencyAdmin', MachedRole)/*  MachedRole[0].roleCode == 'AgencyAdmin' */ && this.checkRoleService.isRoleCodeAvailable('MGAAdmin', this._roleinfo.Roles()) /* this.userRoleCode == 'MGAAdmin' */ ? true : false;
        }
      });
      return isVisibleRole;
    }
  }

  // ValidateZip() {
  //   if (this.zip.valid) {
  //     this.getZipDetails(this.zip.value);
  //   }
  // }


  validateAddress() {

    this.address1ErrorMessage = "";
    this.isAddress1Valid = false;
    if (this.zip?.value && this.city?.value && this.state?.value && (this.addressline1?.value || this.addressline2?.value)) {
      this._loader.show();
      // this.validateAddressSubscription = this.zipDetails.ValidateAddress(this.zip.value, this.city.value, this.state.value, this.addressline1.value, this.addressline2.value)
      this.validateAddressSubscription = this.zipDetails.ValidateAddressField(this.zip.value, null, this.city.value, this.state.value, this.addressline1.value, this.addressline2.value)
        .subscribe(data => {
          this._loader.hide();
          if (data) {
            let obj = data['data'];
            if (data['success'] == false) {
              this.isAddress1Valid = true;
              this.address1ErrorMessage = data['message'];
              this.submitted = false;
            } else {
              this.subject.next('save');
              this.isAddress1Valid = false;
              if (obj['City']) {
                this.city.setValue(obj['City']);
              }
              if (obj['State']) {
                this.state.setValue(obj['State']);
              }
              if (obj['Address1']) {
                this.addressline1.setValue(obj['Address1']);
              }
              if (obj['Address2']) {
                this.addressline2.setValue(obj['Address2']);
              }
              /* if (obj.Zip5 || obj.Zip5) {
                this.Zip.setValue(obj.Zip5 + obj.Zip4, { emitEvent: false })
              } */
            }
            // this.subject.next(true);
          }
        }, (err) => {
          this._loader.hide();
        }, () => {
          this._loader.hide();
        });

    } else if (!this.zip?.value) {
      if (this.IsEventFromPage) {
        this.submitted = true;
      }

      //this.isZipInvalid = true;
      //this.zipErrorMessage = "Zip Required."
    } else {
      if (this.IsEventFromPage) {
        this.submitted = true;
      }
    }
  }

  // validateOtherCtrl() {
  //   if ((!this.fname.valid || !this.lname.valid || !this.email.valid || !this.phonecell.valid || !this.roleControl.valid) && this.checkSave) {
  //     this.validateField = true; this.checkSave = false;
  //   }
  //   else this.validateField = false;
  // }

  getSelectedItem(val: any) {

    this.selectedItem = val.filter((item: any) => item['checked'] && item['checked'] == true)
    //alert(JSON.stringify(this.selectedItem))
  }



}
