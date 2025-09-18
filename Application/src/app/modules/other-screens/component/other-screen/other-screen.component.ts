import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { Subscription } from 'rxjs';
import { AQUserInfo } from '@agenciiq/login';
import { Router, ActivatedRoute } from '@angular/router';
import { AQFormsService, IFormsListRequest, IaqFormListReq } from '@agenciiq/aqforms';
import { AQSession } from 'src/app/global-settings/session-storage';
import { AQParameterService, AQTransactionType, AQStage, ProgramService, AQAlfredFlag, AQPeriod, AQProcessingType, AQCarrier, AQStates } from '@agenciiq/aqadmin';
import { selectAllForms, selectFormsLoaded } from 'store/selectors/other-screen.selector';
import { Store } from '@ngrx/store';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { loadFormsList } from 'store/actions/other-screen.action';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';


@Component({
  selector: 'app-other-screen',
  templateUrl: './other-screen.component.html',
  styleUrls: ['./other-screen.component.sass'],
  standalone: false
})
export class OtherScreenComponent implements OnInit {

  dataSource: any[] = [];
  formsListSubscription: Subscription;
  userId: any;
  clientId: any;
  dataSourceAccordian: any[] = [];
  LOBList: any[] = [];
  selectedLOB: any;
  selectedLOBName: any;
  selectedState: any;
  selectedStateCode: any;
  formTypeList: any;
  stateList: any;
  ColumnList = ['parameterName', 'shortName', 'parameterId'];
  listState: any;
  programData: any = [];
  formData: any;
  selectedScreen: any;
  NoRecordsMessage: any;

  constructor(private _loader: LoaderService, private _formsService: AQFormsService, private _userInfo: AQUserInfo, private _router: Router,
    private _aqSession: AQSession,
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private _programService: ProgramService,
    private store: Store,
    private checkRoleService: CheckRoleService,
  ) {
    this.userId = this._userInfo.UserId() ? this._userInfo.UserId() : 0;
  }

  ngOnInit() {
    this.formData = this._aqSession.getData('formData');
    this.removeSession();
    this.formTypeList = [{ 'formType': 'Program', 'formTypeDescription': 'Program' }, { 'formType': 'Account', 'formTypeDescription': 'Account' }]
    this.selectedScreen = this.formData ? this.formData : this.formTypeList[0];
    this.checkRoleService.addNewOtherScreenSubject.subscribe((data) => {
      if (data === 'AddOtherScreen') {
        const formsListRequest: IFormsListRequest = {
          UserId: this.userId,
          LOB: '',
          State: '',
          QuoteType: '',
          ClientID: 0
        };
        this.store.dispatch(loadFormsList({ request: formsListRequest, selectedScreen: this.selectedScreen }));
        this.checkRoleService.addNewOtherScreenSubject.next('');
      }
    });
    this.getAqFormList(this.selectedScreen.formType);
  }

  removeSession() {
    this._aqSession?.removeSession("formData");
  }

  // getAqFormList(selectedScreen: any) {
  //   const formsListRequest: IFormsListRequest = {
  //     "UserId": this.userId,
  //     "LOB": "",
  //     "State": "",
  //     "QuoteType": "",
  //     "ClientID": 0
  //   }
  //   this._loader.show();
  //   this.formsListSubscription = this._formsService.GetFormsList(formsListRequest).subscribe((formsList: any) => {
  //     this._loader.hide();
  //     if (formsList?.data?.aQFormResponses) {
  //       this.dataSource = formsList.data.aQFormResponses;
  //       this.dataSource = this.dataSource.filter(item => {
  //         if (item.formType === selectedScreen && item.lobCode == null && item.stateCode == null) {
  //           return item;
  //         }
  //       })
  //     }

  //     if (this.dataSource.length != 0) this.NoRecordsMessage = "";
  //     else this.NoRecordsMessage = "No Record Found.";
  //   }, (err) => {
  //     this._loader.hide();
  //     console.log("err", err);
  //   })
  // }

  getAqFormList(selectedScreen: any) {
    this.selectedScreen = selectedScreen;

    // Request for first time only
    this.store.select(selectFormsLoaded).pipe(
      take(1),
      tap(loaded => {
        if (!loaded) {
          const formsListRequest: IFormsListRequest = {
            UserId: this.userId,
            LOB: '',
            State: '',
            QuoteType: '',
            ClientID: 0
          };
          this.store.dispatch(loadFormsList({ request: formsListRequest, selectedScreen }));
        }
      }),
      switchMap(() => this.store.select(selectAllForms)),
      map(forms =>
        forms.filter(item =>
          item.formType === selectedScreen &&
          item.lobCode == null &&
          item.stateCode == null
        )
      )
    ).subscribe(filtered => {
      this.selectedScreen = selectedScreen;
      this.dataSource = filtered;
      this.NoRecordsMessage = filtered.length ? '' : 'No Record Found.';
    });
  }

  OnScreenChange(value: any) {
    this.selectedScreen = value;
    this.getAqFormList(this.selectedScreen.formType);
  }

  addEditScreenForm(type: any, data: null) {
    if (data == null) this.formTypeList.some((el: any) => {
      if (this.selectedScreen == el.formType)
        data = el;
    });
    this._aqSession?.setData('formData', data);
    this._router.navigateByUrl('agenciiq/other-screens/manage');
  }


  arrowkeyLocation = 0;
  keyDownScreen(e, option, i) {

    let formTypeList = this.formTypeList;
    let selectedScreen;
    let arrowkeyLocationRef = 0;

    switch (e.keyCode) {
      case 38: // this is the ascii of arrow up
        this.arrowkeyLocation--;
        // arrowkeyLocationRef = this.arrowkeyLocation == -1?-1:this.arrowkeyLocation;

        this.arrowkeyLocation = this.arrowkeyLocation == -1 ? 0 : this.arrowkeyLocation;

        if (e.srcElement.previousElementSibling) {
          e.srcElement.previousElementSibling.focus();
        }
        formTypeList.filter(function (el, index) {
          if (i == 0 && index == 0) {
            selectedScreen = el;

          }
          else {
            if ((i - 1) == index) {
              selectedScreen = el;
            }
          }
        })
        break;
      case 40: // this is the ascii of arrow down
        this.arrowkeyLocation++;
        if (this.arrowkeyLocation >= this.formTypeList.length) arrowkeyLocationRef = this.arrowkeyLocation;
        this.arrowkeyLocation = this.arrowkeyLocation == this.formTypeList.length ? (this.formTypeList.length) - 1 : this.arrowkeyLocation;
        if (e.srcElement.nextElementSibling) {
          e.srcElement.nextElementSibling.focus();
        }
        formTypeList.filter(function (el, index) {
          if (i == formTypeList.length - 1 && index == formTypeList.length - 1) {
            selectedScreen = el;
          }
          else {
            if ((i + 1) == index) { selectedScreen = el; }
          }
        })
        break;
      default:
        selectedScreen = option;
    }

    // alert(arrowkeyLocationRef);
    // alert(this.arrowkeyLocation);
    if (selectedScreen.formType == this.selectedScreen.formType) {

    }
    else {
      this.selectedScreen = selectedScreen;
      this.getAqFormList(this.selectedScreen.formType);
    }

    //this.selectedState = selectedState;
    // this.OnParameterOptionChange(this.selectedKeys);
  }

  onFormEdit(formId: any) {
    this._aqSession.setData('formId', formId);
    this._router.navigateByUrl('agenciiq/aqforms/manage');
  }

  addForm() {
    this._router.navigateByUrl('agenciiq/aqforms/manage');
  }

  trackByFormType(index: number, item: any): any {
    return item.formType;
  }

}
