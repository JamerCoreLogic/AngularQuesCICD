import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogRef } from '../../utility/aq-dialog/dialog-ref';
import { Validators, FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { DialogConfig } from '../../utility/aq-dialog/dialog-config';
import { AQSession } from 'src/app/global-settings/session-storage';
import { RemoveDuplicateService } from '../../services/remove-duplicate/remove-duplicate.service';
import { MgaConfigService } from '@agenciiq/mga-config';
import { AQUserInfo } from '@agenciiq/login';
import { AqchatboardService } from '@agenciiq/aqchatboard';
import { LoaderService } from '../../utility/loader/loader.service';
import { Subscription } from 'rxjs';
import { AQSavePolicyService } from '@agenciiq/quotes';
import { PopupService } from '../../utility/Popup/popup.service';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { selectMGAConfig, selectMGAConfigLoading } from 'store/selectors/agent-dashboard.selectors';
import { take } from 'rxjs/operators';
import { loadMGAConfig } from 'store/actions/agent-dashboard.action';

@Component({
  selector: 'app-quotes-dialog',
  templateUrl: './quotes-dialog.component.html',
  styleUrls: ['./quotes-dialog.component.sass'],
  standalone: false
})
export class QuotesDialogComponent implements OnInit, OnDestroy {

  QuotesForm: FormGroup;
  StateList: any[] = [];
  StateListMaster: any[] = [];
  LobList: any[] = [];
  mgaStateList: any[] = [];
  userId: number;
  formData: any;
  selectedlob: any
  chatbotSubscriber: Subscription;
  identifier: string = '';
  MGAConfigdata: any;
  environment = environment;

  constructor(
    private config: DialogConfig,
    private dialog: DialogRef,
    private fb: FormBuilder,
    private _session: AQSession,
    private RemoveDuplicateService: RemoveDuplicateService,
    private _mgaConfig: MgaConfigService,
    private _userInfo: AQUserInfo,
    private _chatbotservice: AqchatboardService,
    private _loader: LoaderService,
    private _savPolicy: AQSavePolicyService,
    private _popup: PopupService,
    private store: Store,
  ) {
    let programData: any[] = this.config?.data;
    this.StateListMaster = programData;
    this.LobList = programData.map((data: any) => data.mgaLobs).filter(
      data => { return data.lob != 'PP' }
    );
    this.userId = this._userInfo.UserId();
  }

  ngOnInit() {
    this.getMGADetails(this.userId);
    this.createDialogForm();
    this.onFormChagne();
    let host = window.location.host;
    if (host.includes('localhost')) {
      host = 'lambis.agenciiq.net';
    }
    this.identifier = host;
  }

  private createDialogForm() {
    this.QuotesForm = this.fb.group({
      //LOB: ['', Validators.required],
      State: [{ value: '', disabled: true }, Validators.required],
      QuoteType: ['QQ', Validators.required],
      LOB: new FormArray([], Validators.required),
      accordYN: [{ value: 'no', disabled: true }, Validators.required]
    })
  }

  get accordYN() {
    return this.QuotesForm.get("accordYN");
  }

  onCheckChange(event: any) {
    const formArray: FormArray = this.QuotesForm.get('LOB') as FormArray;

    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    }
    /* unselected */
    else {
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    } let a = this.QuotesForm.value;

  }

  onRadioCheckChange(event) {
    this.selectedlob = event.target.value;
    const formArray: FormArray = this.QuotesForm.get('LOB') as FormArray;
    let i: number = 0;
    formArray.controls.forEach((ctrl: FormControl) => {
      // Remove the unselected element from the arrayForm
      formArray.removeAt(i);
      i++;
    });
    formArray.push(new FormControl(event.target.value));
    this.StateList = this.mgaStateList;
    this.StateList = this.StateList?.map(state => {
      let HasState = this.MGAConfigdata?.lobStatesList?.some(x => {
        return state.stateId == x.stateId && this.selectedlob == x.lobCode
      })
      if (HasState == true) {
        return state;
      }
    }).filter(x => x != undefined)
    console.log('this.StateList', this.StateList)
    if (this.StateList.length == 0) {
      this.setStateList();
    }
  }

  onFormChagne() {
    this.QuotesForm.controls['LOB'].valueChanges.subscribe(lobId => {
      if (lobId.length > 0) {
        this.StateList = this.mgaStateList;
        this.QuotesForm.controls['State'].enable();
      }
    });

    this.QuotesForm.controls['State'].valueChanges.subscribe(lobId => {
      if (lobId && this.QuotesForm.get('QuoteType').value == 'FQ') {
        this.QuotesForm.controls['accordYN'].enable();
      }
    });

    this.QuotesForm.controls['QuoteType'].valueChanges.subscribe(lobId => {
      if (lobId == 'FQ') {
        this.QuotesForm.controls['accordYN'].enable();
      } else {
        this.QuotesForm.controls['accordYN'].setValue('no');
        this.QuotesForm.controls['accordYN'].disable();

      }
    });
  }

  getMGADetails(userId: number) {
    // this._mgaConfig.MGADetails(userId)?.subscribe(MGAConfig => {
    //   if (MGAConfig && MGAConfig && MGAConfig.data) {
    //     this.MGAConfigdata = MGAConfig.data;
    //     this.mgaStateList = MGAConfig.data.mgaStatesList;
    //     sessionStorage.setItem("mgaStateList", JSON.stringify(this.mgaStateList));
    //     sessionStorage.setItem("lobStateList", JSON.stringify(this.MGAConfigdata.lobStatesList));

    //     // if (MGAConfig.data.mgaConfiguration.name.toLowerCase() === 'convelo') {
    //     let data: any = null;
    //     data = MGAConfig.data
    //     this.LobList = data.userLobs != null && data.userLobs.length > 0 ?
    //       this.LobList.filter(x => data.userLobs.findIndex(y => y.lobId == x.lobId) > -1) : this.LobList
    //     // }
    //   }
    // }, (err) => {
    //   this._loader.hide();
    //   console.log("err", err);
    // }, () => {
    //   this._loader.hide();
    // });
    this.store.select(selectMGAConfig).pipe(take(1)).subscribe(data => {
      if (!data || data == null) {
        this.store.dispatch(loadMGAConfig({ userId }));
      }
    });

    // Subscribe reactively
    this.store.select(selectMGAConfig).subscribe(config => {
      this.MGAConfigdata = config;
      this.mgaStateList = config.mgaStatesList;

      sessionStorage.setItem("mgaStateList", JSON.stringify(this.mgaStateList || []));
      sessionStorage.setItem("lobStateList", JSON.stringify(config.lobStatesList || []));

      this.LobList = config.userLobs?.length > 0
        ? this.LobList.filter(x => config.userLobs.findIndex(y => y.lobId === x.lobId) > -1) : this.LobList;

    });

    this.store.select(selectMGAConfigLoading).subscribe(isLoading => {
      if (isLoading) {
        this._loader.show();
      } else {
        this._loader.hide();
      }
    });
  }



  cancel() {
    this.dialog.close(null);
  }

  onClose() {
    sessionStorage.setItem("edit", "false")
    sessionStorage.setItem("view", "false")
    this._session.removeSession('viewPolicyParams');
    if (this.QuotesForm.controls['QuoteType'].value == 'FQ' && this.QuotesForm.controls['accordYN'].value == 'yes') {
      this._loader.show();
      this.chatbotSubscriber = this._savPolicy.uploadAcord(
        this._userInfo.UserId(),
        this.QuotesForm.value['LOB'].toString(),
        this.QuotesForm.value['State'],
        this.QuotesForm.value['QuoteType'],
        this.formData ? this.formData?.split(',')[1] : null)?.subscribe(resp => {
          this.dialog.close(null);
          this._loader.hide();
          console.log(resp.message);
          if (resp && resp.message) {
            this._popup.showPopup('Acord', resp.message);
          }

        }, (err) => {
          this._loader.hide();
          console.log("err", err);
        }, () => {
          this._loader.hide();
        })

    } else {
      if (this.QuotesForm.valid) {
        this.dialog.close(this.QuotesForm.value);
      }

    }
  }

  ngOnDestroy() {
    if (this.chatbotSubscriber) {
      this.chatbotSubscriber.unsubscribe();
    }
  }

  printFile(event) {
    let selectedFile: any[] = event.target.files;
    if (selectedFile.length > 0) {
      let fileToUpload = selectedFile[0];
      var reader = new FileReader();
      let _self = this;
      reader.onload = function (evt) {
        _self.formData = evt['target']['result'];
      };
      reader.readAsDataURL(fileToUpload);
    }
  }

  setStateList() {
    if (this.selectedlob != 'DO') { this.selectedlob = 'DO' }
    let lobStatesList: any
    if (this.mgaStateList.length == 0) {
      this.mgaStateList = JSON.parse(sessionStorage.getItem("mgaStateList"));
      lobStatesList = JSON.parse(sessionStorage.getItem("lobStateList"));
    }
    this.StateList = this.mgaStateList;
    if (this.StateList != undefined && this.StateList != null && this.StateList.length > 0) {
      this.StateList = this.StateList?.map(state => {
        let HasState = lobStatesList?.some(x => {
          return state.stateId == x.stateId && this.selectedlob == x.lobCode
        })
        if (HasState == true) {
          return state;
        }
      }).filter(x => x != undefined)
    }
    else {
      this.setMGADetailsHandle(this.userId);
    }
  }

  setMGADetailsHandle(userId) {
    this._mgaConfig.MGADetails(userId)?.subscribe(MGAConfig => {
      if (MGAConfig && MGAConfig.success && MGAConfig.data) {
        this.MGAConfigdata = MGAConfig.data;
        this.mgaStateList = MGAConfig.data.mgaStatesList;
        sessionStorage.setItem("mgaStateList", JSON.stringify(this.mgaStateList));
        sessionStorage.setItem("lobStateList", JSON.stringify(this.MGAConfigdata.lobStatesList));

        //if (MGAConfig.data.mgaConfiguration.name.toLowerCase() === 'convelo') {
        let data: any = null;
        data = MGAConfig.data
        this.LobList = this.LobList.filter(x => data.userLobs.findIndex(y => y.lobId == x.lobId) > -1)
        // }
        this.setStateList();
      }
    })
  }

}
