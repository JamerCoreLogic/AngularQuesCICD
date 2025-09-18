import { Component, OnInit } from '@angular/core';
import { LOBService } from '@agenciiq/quotes';
import { AQUserInfo, AQRoleInfo } from '@agenciiq/login';
import { AQParameterService, AQZipDetailsService, GetConfigurationService } from '@agenciiq/aqadmin';
import { AQCarrierService } from '@agenciiq/aqcarrier';
import { MgaConfigService, ISaveMGAConfigReq, ISaveMgaCarriersList, ISaveMgaConfiguration, ISaveMgaLobsList, ISaveMgaStatesList } from '@agenciiq/mga-config';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { Router } from '@angular/router';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { Roles } from 'src/app/global-settings/roles';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';
import { MgaConfigScreen } from 'src/app/global-settings/error-message/mgaconfig-screen';
import { CancelButtonService } from 'src/app/shared/services/cancelButtonSerrvice/cancelButton.service'
import { KeyboardValidation } from 'src/app/shared/services/aqValidators/keyboard-validation';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { selectMGAConfig } from 'store/selectors/agent-dashboard.selectors';
import { take } from 'rxjs/operators';
import { loadMGAConfig } from 'store/actions/agent-dashboard.action';
import { selectCarrierList } from 'store/selectors/carrier-list.selectors';
import { loadCarrierList } from 'store/actions/carrier-list.actions';
import { selectedLobList } from 'store/selectors/lob-list.selectors';
import { loadLobList } from 'store/actions/lob-list.action';
import { selectStates } from 'store/selectors/parameterkey.selectors';
import { loadStates } from 'store/actions/parameterkey.action';

@Component({
  selector: 'app-mga-configuration',
  templateUrl: './mga-configuration.component.html',
  styleUrls: ['./mga-configuration.component.sass'],
  standalone: false
})

export class MgaConfigurationComponent implements OnInit {
  _MgaConfigScreen: MgaConfigScreen = null;
  MGAConfigForms: FormGroup;
  environment = environment;
  userId: number;
  parameterStateKey = "STATE";
  uploadedFile: File;
  lobDropDown = 'lobdd';
  lobList: any[] = [];
  lobCheckBoxName = "lobDescription";
  lobCheckBoxValue = "lobId";
  isFileExists: boolean = false;
  stateDropDown = 'statedd';
  stateList: any[] = [];
  stateCheckBoxName = 'parameterName';
  stateCheckBoxValue = 'parameterId';
  isvalidExtension: boolean = false;
  carrierDropdown = 'carrierdd';
  carrierList: any[] = [];
  carrierCheckBoxName = 'carrier';
  carrierCheckBoxValue = 'carrierId';
  excelData: any;
  isAddress1Valid: boolean = false;
  isZipInvalid: boolean = false;
  zipErrorMessage: string = '';
  address1ErrorMessage: string;
  fileName: any;
  fileData: any;
  isSubmited: boolean = false;
  mgaLogo: any;
  isEditable: boolean = true;
  base64EncodedExcel: any;
  selectedCarrier: ISaveMgaCarriersList[] = [];
  selectedLob: ISaveMgaLobsList[] = [];
  selectedState: ISaveMgaStatesList[] = [];
  private mgaConfig: ISaveMgaConfiguration = null;
  selectedLobitems: any[] = [];
  SavedStatelobList: any[] = [];
  lobStateMapping: any = [];
  selectedLoblist: any[];
  selectedStatelist: any[] = [];
  mgadata: any;
  identifier: string = '';
  subject = new Subject();
  IsEventFromPage: boolean = false;
  private address1Supscription: Subscription;
  private address2Supscription: Subscription;
  private validateAddressSubscription: Subscription;
  private zipDetailSubscription: Subscription;
  private zipSubscription: Subscription;

  constructor(
    private _lobService: LOBService,
    private cancelButtonService: CancelButtonService,
    private _userInfo: AQUserInfo,
    private _aqparameterService: AQParameterService,
    private _aqCarrierService: AQCarrierService,
    private _mgaConfig: MgaConfigService,
    private _fb: FormBuilder,
    private _loader: LoaderService,
    private _zipDetails: AQZipDetailsService,
    private _popService: PopupService,
    private _router: Router,
    private _roleCheckService: CheckRoleService,
    private trimValueService: TrimValueService,
    private _roleInfo: AQRoleInfo,
    private _mgaConfiguration: GetConfigurationService,
    public ValidateKey: KeyboardValidation,
    private store: Store
  ) {
    this._MgaConfigScreen = new MgaConfigScreen();
    this.userId = this._userInfo.UserId();
    this.isEditable = this._roleCheckService?.isRoleCodeAvailable(Roles.SystemAdmin?.roleCode, this._roleInfo?.Roles());
  }

  ngOnInit() {
    this._roleCheckService.updateMgaConfigSubject.subscribe((data) => {
      if (data === 'updateMgaConfig') {
        this.store.dispatch(loadMGAConfig({ userId: this.userId }));
        this._roleCheckService.updateMgaConfigSubject.next('');
      }
    });
    setTimeout(() => {
      this.getMGADetails(this.userId);
    }, 0);
    this.createMGAForm();
    this.getMGAConfiguration();
    this.SaveAccountWithAddressValidation();
    let host = window.location.host;
    if (host.includes('localhost')) {
      host = 'lambis.agenciiq.net';
    }
    this.identifier = host;
  }

  createMGAForm() {
    this.MGAConfigForms = this._fb.group({
      mgaId: [''],
      name: [{ value: '', disabled: !this.isEditable }, [Validators.required]],
      description: ['', [Validators.required]],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      city: [{ value: '', disabled: true }],
      state: [{ value: '', disabled: true }],
      zip: ['', [Validators.required, Validators.minLength(5)]],
      contactPerson: ['', [Validators.required]],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')
      ]],
      phoneHome: ['', [
        Validators.required,
        Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/)
      ]],
      fax: ['', [
        Validators.pattern(/^\((?!(0))\d{3}\)\s\d{3}-\d{4}$/)
      ]],
      website: [''],
      isActive: [true]
    })
  }

  // assignMGAForm(values) {
  //   values['fax'] = values['fax'] ? values['fax'].replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '';
  //   values['phoneHome'] = values['phoneHome'] ? values['phoneHome'].replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '';
  //   this.MGAConfigForms.patchValue(values)
  //   this.getControl('state').setValue(values['stateCode']);
  //   this.validateAddress();
  //   this.onControlValueChange();
  // }

  assignMGAForm(values: any) {
    // create a shallow copy so we can mutate
    const formValues = { ...values };

    formValues['fax'] = formValues['fax']
      ? formValues['fax'].replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
      : '';

    formValues['phoneHome'] = formValues['phoneHome']
      ? formValues['phoneHome'].replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
      : '';

    this.MGAConfigForms.patchValue(formValues);

    this.getControl('state').setValue(formValues['stateCode']);
    this.validateAddress();
    this.onControlValueChange();
  }


  // getMGADetails(userId: number) {
  //   this._loader.show();
  //   this._mgaConfig.MGADetails(userId)
  //     ?.subscribe(MGAConfig => {
  //       if (MGAConfig && MGAConfig && MGAConfig.data) {

  //         // MGA Basic Configuration
  //         /*   if (MGAConfig.data.mgaConfiguration) { */
  //         this.assignMGAForm(MGAConfig.data.mgaConfiguration);
  //         /*    }  */
  //         // Saved Lob List
  //         /*  if (MGAConfig.data.mgaLobsList.length) { */
  //         this.assignSavedLobList(MGAConfig.data.mgaLobsList);
  //         /*   } */

  //         //Saved MGA Carrier List
  //         /*     if (MGAConfig.data.mgaCarriersList.length) { */
  //         this.assignSavedCarrierList(MGAConfig.data.mgaCarriersList);
  //         /*    } */


  //         // Saved Satate list
  //         /*   if (MGAConfig.data.mgaStatesList.length) { */
  //         //this.assignSavedStateList(MGAConfig.data.mgaStatesList);
  //         this.assignSavedStateList(MGAConfig.data);
  //         /*    } */
  //         this.mgadata = MGAConfig.data
  //       }
  //     })
  // }

  getMGADetails(userId: number) {
    //this._loader.show();
    this.store.select(selectMGAConfig).pipe(take(1)).subscribe(data => {
      if (!data || data == null) {
        this.store.dispatch(loadMGAConfig({ userId }));
      }
    });
    // this._mgaConfig.MGADetails(userId) ?.subscribe(MGAConfig => {
    this.store.select(selectMGAConfig).subscribe(MGAConfig => {
      if (MGAConfig && MGAConfig) {

        // MGA Basic Configuration
        /*   if (MGAConfig.data.mgaConfiguration) { */
        this.assignMGAForm(MGAConfig.mgaConfiguration);
        /*    }  */
        // Saved Lob List
        /*  if (MGAConfig.data.mgaLobsList.length) { */
        this.assignSavedLobList(MGAConfig.mgaLobsList);
        /*   } */

        //Saved MGA Carrier List
        /*     if (MGAConfig.data.mgaCarriersList.length) { */
        this.assignSavedCarrierList(MGAConfig.mgaCarriersList);
        /*    } */


        // Saved Satate list
        /*   if (MGAConfig.data.mgaStatesList.length) { */
        //this.assignSavedStateList(MGAConfig.data.mgaStatesList);
        this.assignSavedStateList(MGAConfig);
        /*    } */
        this.mgadata = MGAConfig
      }
    })
  }



  assignSavedCarrierList(savedCarrierList: any[]) {
    this.getCarrierList(this.userId, savedCarrierList);
  }

  assignSavedLobList(savedLobList: any[]) {
    this.getLobList(this.userId, savedLobList);
  }

  assignSavedStateList(data: any) {
    this.getStateList(this.parameterStateKey, data);
  }

  // getLobList(userId: number, savedLobList: any[]) {
  //   this._lobService.GetLOBList(userId)
  //     .subscribe(lobList => {
  //       if (lobList && lobList.success && lobList.data && lobList.data.lobsList) {
  //         this.lobList = lobList.data.lobsList.map(lob => {

  //           let _tempLobStatus = savedLobList.some(savedlob => {
  //             return lob.lob == savedlob.lobCode
  //           });
  //           let _tempLobList = {
  //             lobId: lob.lobId,
  //             lobCode: lob.lobCode,
  //             lob: lob.lob,
  //             lobDescription: lob.lobDescription,
  //             isActive: lob.isActive,
  //             checked: _tempLobStatus,

  //           }
  //           return _tempLobList;
  //         })
  //         console.log('this.lobList', this.lobList)
  //       }
  //     })
  // }

  getLobList(userId: number, savedLobList: any[]) {
    this.store.select(selectedLobList).pipe(take(1)).subscribe(data => {
      if (!data || data.length == 0) {
        this.store.dispatch(loadLobList({ userId, savedLobList }));
      }
    });
    // this._lobService.GetLOBList(userId).subscribe(lobList => {
    this.store.select(selectedLobList).subscribe(lobList => {
      if (lobList.length > 0) {
        this.lobList = lobList.map(lob => {

          let _tempLobStatus = savedLobList.some(savedlob => {
            return lob.lob == savedlob.lobCode
          });
          let _tempLobList = {
            lobId: lob.lobId,
            lobCode: lob.lobCode,
            lob: lob.lob,
            lobDescription: lob.lobDescription,
            isActive: lob.isActive,
            checked: _tempLobStatus,

          }
          return _tempLobList;
        })
        console.log('this.lobList', this.lobList)
      }
    })
  }

  getlobstatelist() {
    let list = JSON.parse(JSON.stringify(this.stateList.filter(state => state.checked == true)));
  }

  // getStateList(parameterKey: string, data: any) {
  //   console.log('data', data)
  //   this._aqparameterService.getParameterByKey(parameterKey, this.userId)
  //     .subscribe(stateList => {
  //       if (stateList && stateList.success && stateList.data && stateList.data.parameterList) {
  //         this.stateList = stateList.data.parameterList.map(state => {
  //           let _tempStateStatus = data.mgaStatesList.some(savedState => {
  //             return state.parameterId == savedState.stateId;
  //           })


  //           let _tempStateList = {
  //             parameterId: state.parameterId,
  //             parameterName: state.parameterName,
  //             isActive: state.isActive,
  //             checked: _tempStateStatus
  //           }
  //           return _tempStateList;
  //         })
  //         const states = JSON.parse(JSON.stringify(this.stateList.filter(x => x.checked == true)));
  //         console.log('states list', states)
  //         this.lobList.forEach(x => {
  //           x['states'] = JSON.parse(JSON.stringify(states?.map(state => {
  //             let ischeked = data.lobStatesList?.some(savedmapping => {
  //               return (state.parameterId == savedmapping.stateId && x.lobId == savedmapping.lobId);
  //             })
  //             state.checked = ischeked;
  //             return state

  //           })))
  //         })
  //         console.log('this.lobList 2', this.lobList)
  //       }
  //     })
  // }

  // getCarrierList(userId: number, savedCarrierList: any[]) {
  //   this._aqCarrierService.CarrierList(userId)
  //     .subscribe(carrierList => {
  //       if (carrierList && carrierList.success && carrierList.data && carrierList.data.carrierList) {
  //         this.carrierList = carrierList.data.carrierList.map(carrier => {
  //           let _tempCarrerStatus = savedCarrierList.some(selectedCarrier => {
  //             return selectedCarrier.carrierId == carrier.carrierId;
  //           });
  //           let _tempCarrierList = {
  //             carrierId: carrier.carrierId,
  //             carrier: carrier.carrier,
  //             isActive: carrier.isActive,
  //             checked: _tempCarrerStatus
  //           }
  //           return _tempCarrierList;
  //         });
  //       }
  //     })
  // }

  getStateList(parameterKey: string, data: any) {
    console.log('data', data)
    this.store.select(selectStates).pipe(take(1)).subscribe(data => {
      if (!data || !data.success) {
        this.store.dispatch(loadStates({ parameterKey, userId: this.userId }));
      }
    });
    //this._aqparameterService.getParameterByKey(parameterKey, this.userId).subscribe(stateList => {
    this.store.select(selectStates).subscribe(stateList => {
      if (stateList && stateList.success && stateList.data && stateList.data.parameterList) {
        this.stateList = stateList.data.parameterList.map(state => {
          let _tempStateStatus = data.mgaStatesList.some(savedState => {
            return state.parameterId == savedState.stateId;
          })


          let _tempStateList = {
            parameterId: state.parameterId,
            parameterName: state.parameterName,
            isActive: state.isActive,
            checked: _tempStateStatus
          }
          return _tempStateList;
        })
        const states = JSON.parse(JSON.stringify(this.stateList.filter(x => x.checked == true)));
        console.log('states list', states)
        this.lobList.forEach(x => {
          x['states'] = JSON.parse(JSON.stringify(states?.map(state => {
            let ischeked = data.lobStatesList?.some(savedmapping => {
              return (state.parameterId == savedmapping.stateId && x.lobId == savedmapping.lobId);
            })
            state.checked = ischeked;
            return state

          })))
        })
        console.log('this.lobList 2', this.lobList)
      }
    })
  }

  getCarrierList(userId: number, savedCarrierList: any[]) {
    this.store.select(selectCarrierList).pipe(take(1)).subscribe(data => {
      if (!data || !data.success) {
        this.store.dispatch(loadCarrierList({ userId, savedCarrierList }));
      }
    });
    // this._aqCarrierService.CarrierList(userId).subscribe(carrierList => {
    this.store.select(selectCarrierList).subscribe(carrierList => {
      if (carrierList && carrierList.success && carrierList.data && carrierList.data.carrierList) {
        this.carrierList = carrierList.data.carrierList.map(carrier => {
          let _tempCarrerStatus = savedCarrierList.some(selectedCarrier => {
            return selectedCarrier.carrierId == carrier.carrierId;
          });
          let _tempCarrierList = {
            carrierId: carrier.carrierId,
            carrier: carrier.carrier,
            isActive: carrier.isActive,
            checked: _tempCarrerStatus
          }
          return _tempCarrierList;
        });
      }
    })
  }

  uploadExcel(event: any) {
    let allowedFiles = [".png", ".jpg", ".jpeg"];
    let regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + allowedFiles.join('|') + ")$");

    if (event.target.files.length > 0) {
      this.uploadedFile = event.target.files[0];
      this.isFileExists = true;
      if (!regex.test(this.uploadedFile.name.toLowerCase())) {
        this.isvalidExtension = false;
      }
      else {
        this.isvalidExtension = true;
        this.readmgaConfigExcel();
      }
    }
    else {
      this.isFileExists = false;
    }
  }
  readmgaConfigExcel() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.excelData = fileReader.result;
      var uInt8Data = new Uint8Array(this.excelData);
      var array = Array.prototype.slice.call(uInt8Data);
      var mappedArray = array.map(function (item) {
        return String.fromCharCode(item);
      });
      this.base64EncodedExcel = btoa(mappedArray.join(''));

    }

    fileReader.readAsArrayBuffer(this.uploadedFile);
  }


  SaveAccountWithAddressValidation() {
    this.subject.subscribe(resp => {
      if (resp == 'validateAddress') {
        this.validateAddress();
      }
      if (resp == 'save' && this.IsEventFromPage) {
        this.SaveMgaConfig();
      }
    })
  }

  SaveAccountWithOserverPattern() {
    this.IsEventFromPage = true;
    this.subject.next("validateAddress");
  }

  SaveMgaConfig() {
    this.IsEventFromPage = false;
    if (this.MGAConfigForms.invalid || this.isAddress1Valid || this.selectedCarrier.length == 0
      || this.selectedState.length == 0 || this.selectedLob.length == 0) {
      this.isSubmited = true;
      return;
    } else {
      this.isSubmited = false;
    }

    this.mgaConfig = this.MGAConfigForms.getRawValue();

    this.mgaConfig['phoneHome'] = String(this.mgaConfig['phoneHome']).split("").filter(d => !isNaN(Number(d)) && d.trim() !== "").join("");
    this.mgaConfig['fax'] = String(this.mgaConfig['fax']).split("").filter(d => !isNaN(Number(d)) && d.trim() !== "").join("")
    this.mgaConfig.fileName = this.uploadedFile ? this.uploadedFile.name : this.MGAConfigForms.get('name').value + "_logo.png";
    //this.MGAConfigForms.get('name').value + "_logo.png";
    this.mgaConfig.fileData = this.base64EncodedExcel;
    let lobStatesList = [];
    this.lobList?.forEach(x => {
      if (x.checked) {
        x?.states?.forEach((state: { checked: any; parameterId: any; }) => {
          if (state.checked) {
            let item = {
              lobId: x.lobId,
              stateId: state.parameterId
            }
            lobStatesList.push(item)
          }

        })
      }
    });
    const mgaConfigRequestObj: ISaveMGAConfigReq = {
      ClientId: 0,
      UserId: this.userId,
      mgaCarriersList: this.selectedCarrier,
      mgaConfiguration: this.mgaConfig,
      mgaLobsList: this.selectedLob,
      mgaStatesList: this.selectedState,
      //mgaStateLobList:this.mgaConfig.lobStatesList
    }
    mgaConfigRequestObj['lobStatesList'] = lobStatesList;

    let reqObject = this.trimValueService.TrimObjectValue(mgaConfigRequestObj.mgaConfiguration)

    mgaConfigRequestObj.mgaConfiguration = reqObject;
    this._mgaConfig.SaveMgaConfiguration(mgaConfigRequestObj)
      .subscribe(result => {
        if (result && !result.success) {
          this._popService.showPopup('MGA Configuration', result.message);
        } else {
          this._roleCheckService.updateMgaConfigSubject.next('updateMgaConfig');
          this.navigateBack();
        }
      })
  }

  SelectedCarrierList(carrierList: any[]) {
    this.selectedCarrier = carrierList.filter(carrier => carrier.checked).map(carrier => { return { carrierId: carrier.carrierId } });
  }

  SelectedLobList(lobList: any[]) {
    this.selectedLoblist = lobList.filter(lob => lob.checked).map(lob => { return lob });
    this.selectedLob = lobList.filter(lob => lob.checked).map(lob => { return { lobId: lob.lobId } });
  }

  SelectedStateList(stateList: any[]) {
    this.selectedStatelist = stateList.filter(state => state.checked).map(state => { return state });
    const states = JSON.parse(JSON.stringify(this.selectedStatelist));
    this.lobList?.forEach(x => {
      x['states'] = [];
      x['states'] = JSON.parse(JSON.stringify(states.map(state => {
        let ischeked = this.mgadata.lobStatesList?.some(savedmapping => {
          return (state.parameterId == savedmapping.stateId && x.lobId == savedmapping.lobId);
        })
        state.checked = ischeked;
        return state

      })))
    })

    this.selectedState = stateList.filter(state => state.checked).map(state => { return { stateId: state.parameterId } });
  }


  getZipDetails(zipcode) {
    this._loader.show();
    this.zipDetailSubscription = this._zipDetails.ZipDetails(zipcode).subscribe(data => {
      this._loader.hide();
      if (data['CityStateLookupResponse']['ZipCode']) {
        let obj = data['CityStateLookupResponse']['ZipCode'];
        if (obj.Error) {
          this.isZipInvalid = true;
          this.zipErrorMessage = obj.Error.Description;
          this.getControl('zip').setErrors({ 'notvalid': true });
          this.getControl('city').setValue('');
          this.getControl('state').setValue('');
        } else {
          this.isZipInvalid = false;
          if (obj.City) {
            this.getControl('city').setValue(obj.City);
          }
          if (obj.State) {
            this.getControl('state').setValue(obj.State);
          }
          this.validateAddress();
        }
      }
    }, (err) => {
      this._loader.hide();
      console.log("err", err);
    }, () => {
      this._loader.hide();
    });
  }

  validateAddress() {
    this.isAddress1Valid = false;
    this.address1ErrorMessage = "";
    if (this.getControl('zip').value && this.getControl('city').value && this.getControl('state').value && (this.getControl('addressLine1').value || this.getControl('addressLine2').value)) {
      this._loader.show();
      this.validateAddressSubscription = this._zipDetails.ValidateAddressField(this.getControl('zip').value, null, this.getControl('city').value, this.getControl('state').value, this.getControl('addressLine1').value, this.getControl('addressLine2').value)
        .subscribe(data => {
          this._loader.hide();
          if (data) {
            let obj = data['data'];
            if (data['success'] == false) {
              this.isAddress1Valid = true;
              this.address1ErrorMessage = data['message'];
              this.isSubmited = false;
            } else {
              this.isAddress1Valid = false;
              //this.subject.next('save');
              if (obj['city']) {
                this.getControl('city').setValue(obj['city']);
              }
              if (obj['state']) {
                this.getControl('state').setValue(obj['state']);
              }
              if (obj['address1']) {
                this.getControl('addressLine1').setValue(obj['address1']);
              }
              if (obj['address2']) {
                this.getControl('addressLine2').setValue(obj['address2']);
              }
              this.subject.next('save');              /* if (obj.Zip5 || obj.Zip5) {
                this.Zip.setValue(obj.Zip5 + obj.Zip4, { emitEvent: false })
              } */
            }
            // this.subject.next(true);
          }
        }, (err) => {
          this._loader.hide();
          console.log("err", err)
        }, () => {
          this._loader.hide();
        });
    } else if (!this.getControl('zip').value) {
      if (this.IsEventFromPage) {
        this.isSubmited = true;
      }
      //this.isZipInvalid = true;
      //this.zipErrorMessage = "Zip Required."
    } else {
      if (this.IsEventFromPage) {
        this.isSubmited = true;
      }
    }

  }

  getControl(controleName: string) {
    return this.MGAConfigForms.get(controleName);
  }

  onControlValueChange() {
    this.address1Supscription = this.getControl('addressLine1').valueChanges.subscribe(x => {
      if (x.trim()) {
        this.getControl('addressLine2').setValidators(null);
        this.getControl('addressLine1').setValidators(null);
        this.getControl('addressLine1').updateValueAndValidity({ emitEvent: false });
        this.getControl('addressLine2').updateValueAndValidity({ emitEvent: false });
      } else {
        if (!this.getControl('addressLine2').value) {
          this.getControl('addressLine1').setValidators([Validators.required]);
          this.getControl('addressLine1').updateValueAndValidity({ emitEvent: false });
        }
      }
    });

    this.address2Supscription = this.getControl('addressLine2').valueChanges.subscribe(x => {
      if (x.trim()) {
        this.getControl('addressLine2').setValidators(null);
        this.getControl('addressLine1').setValidators(null);
        this.getControl('addressLine1').updateValueAndValidity({ emitEvent: false });
        this.getControl('addressLine2').updateValueAndValidity({ emitEvent: false });
      } else {
        if (!this.getControl('addressLine1').value) {
          this.getControl('addressLine1').setValidators([Validators.required]);
          this.getControl('addressLine1').updateValueAndValidity({ emitEvent: false });
        }
      }
    });

    this.zipSubscription = this.getControl('zip').valueChanges.subscribe(zipcode => {
      if (String(zipcode).length == 5) {
        this.getZipDetails(zipcode);
      } else {
        this.isZipInvalid = false;
      }
    })
  }

  getMGAConfiguration() {
    this._loader.show();
    this._mgaConfiguration.GetConfiguration().subscribe(mgaConfig => {
      this._loader.hide();
      this.mgaLogo = mgaConfig.data.mgaConfiguration.logoURL
    })
  }

  navigateBack() {
    this.cancelButtonService.NavigateToHome();
  }

  ngOnDestroy() {
    this.address1Supscription?.unsubscribe();
    this.address2Supscription?.unsubscribe();
    this.validateAddressSubscription?.unsubscribe();
    this.zipDetailSubscription?.unsubscribe();
    this.zipSubscription?.unsubscribe();
    this.subject.unsubscribe();
  }

}
