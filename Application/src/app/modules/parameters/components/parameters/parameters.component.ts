import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParameterKeysListService, AQParameterService } from '@agenciiq/aqadmin';
import { AQUserInfo } from '@agenciiq/login';
import { DomSanitizer } from '@angular/platform-browser';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { DialogService } from 'src/app/shared/utility/aq-dialog/dialog.service';
import { ParameterDialogComponent } from 'src/app/shared/components/parameter-dialog/parameter-dialog.component';
import { AddParameterDialogComponent } from 'src/app/shared/components/add-parameter-dialog/add-parameter-dialog.component';
import { UploadXMLDialogComponent } from 'src/app/shared/components/upload-xmldialog/upload-xmldialog.component';
import { DialogSaveParameterService } from '@agenciiq/aqadmin';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { selectFilteredParameterList, selectIsParameterAddDisabled, selectParameterList } from 'store/selectors/master-table.selectors';
import { loadParameterKeys, loadParametersByKey } from 'store/actions/master-table.action';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { Actions, ofType } from '@ngrx/effects';
import * as ParameterActions from '../../../../../../store/actions/master-table.action';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.sass'],
  standalone: false
})
export class ParametersComponent implements OnInit {

  parameterOptions: any[] = [];
  dataSource: any[] = [];
  NoRecordsMessage: string = "";
  sortedColumnName: any;
  isParameterAddDisabled: boolean;
  ColumnList = ['parameterName', 'ShortName', 'effectiveFrom', 'effectiveTo', 'isActive'];
  flag: boolean = false;

  uploadedFile;
  isFileExists;
  isvalidExtension;
  excelData;
  base64EncodedExcel;
  selectedKeys: any;
  userid: any;
  shortParamFlag: boolean = true;
  parameterMaster: any[] = [];
  paramSearchText: any;
  elements: any;
  disableTextbox = false;
  arrowkeyLocation = 0;

  constructor(
    private router: Router,
    private keysService: ParameterKeysListService,
    private parameterService: AQParameterService,
    private _userInfo: AQUserInfo,
    private sanitizer: DomSanitizer,
    private _popup: PopupService,
    private dialogService: DialogService,
    private DialogSaveParameterService: DialogSaveParameterService,
    private store: Store,
    private _checkRoleService: CheckRoleService,
    private actions$: Actions
  ) {
    this.userid = this._userInfo.UserId();
  }

  ngOnInit() {
    this._checkRoleService.addNewMasterSubject.subscribe((data) => {
      if (data === 'AddNewMaster') {
        //this.getAgentListCall(data);
        this.store.dispatch(loadParametersByKey({
          parameterAlias: this.selectedKeys.parameterAlias,
          userId: this.userid
        }));
        this._checkRoleService.addNewMasterSubject.next('');
      }
    });
    this._checkRoleService.addNewMasterKeySubject.subscribe((data) => {
      if (data === 'AddNewMasterKey') {
        //this.getAgentListCall(data);
        this.store.dispatch(loadParameterKeys({ userId: this.userid }));
        this.actions$.pipe(
          ofType(ParameterActions.loadParameterKeysSuccess)
        ).subscribe(() => {
          this.ParameterKeys();  // call after store updates successfully
          this._checkRoleService.addNewMasterKeySubject.next('');
        });
      }
    });
    this.ParameterKeys();
  }

  keyDown(e, option, i) {
    let parameterOptions = this.parameterOptions;
    let selectedKeys;
    switch (e.keyCode) {
      case 38: // this is the ascii of arrow up
        this.arrowkeyLocation--;
        this.arrowkeyLocation = this.arrowkeyLocation == -1 ? 0 : this.arrowkeyLocation;

        if (e.srcElement.previousElementSibling) {
          e.srcElement.previousElementSibling.focus();
        }
        parameterOptions.filter(function (el, index) {
          if (i == 0 && index == 0) {
            selectedKeys = el;
          }
          else {
            if ((i - 1) == index) {
              selectedKeys = el;
            }
          }
        })
        break;
      case 40: // this is the ascii of arrow down
        this.arrowkeyLocation++;
        if (e.srcElement.nextElementSibling) {
          e.srcElement.nextElementSibling.focus();
        }
        parameterOptions.filter(function (el, index) {
          if (i == parameterOptions.length - 1 && index == parameterOptions.length - 1) {
            selectedKeys = el;
          }
          else {
            if ((i + 1) == index)
              selectedKeys = el;
          }
        })
        break;
      default:
        selectedKeys = option;
    }
    this.selectedKeys = selectedKeys;
    this.OnParameterOptionChange(this.selectedKeys);
  }

  sortParameter() {
    this.parameterOptions = this.parameterOptions.sort((a, b) => {
      if (a.parameterAlias > b.parameterAlias) {
        return 1;
      } else if (a.parameterAlias < b.parameterAlias) {
        return -1;
      }
      return 0;
    })
    this.OnParameterOptionChange(this.parameterOptions[0]);
  }

  filterParameter(paramKey: string): void {
    if (paramKey?.trim()) {
      const lowerKey = paramKey.toLowerCase();
      this.parameterOptions = this.parameterMaster.filter(
        ele => ele?.parameterAlias?.toLowerCase().includes(lowerKey)
      );
    } else {
      this.ParameterKeys();
    }
  }

  addEditParamDialog(val: any, data: any) {
    const isAdd = val === 'add';
    let paramDialogData = {
      'UserId': this.userid,
      'ParameterId': isAdd ? 0 : data.parameterId,
      'ParameterKey': this.selectedKeys,
      'parameterName': isAdd ? 0 : data.parameterName,
      'ShortName': isAdd ? 0 : data.shortName,
      'Value': isAdd ? 0 : data.value,
      'effectiveFrom': isAdd ? 0 : data.effectiveFrom,
      'effectiveTo': isAdd ? 0 : data.effectiveTo,
      'IsActive': isAdd ? 0 : data.isActive,
      'isNotEditable': isAdd ? false : data.isNotEditable
    }
    const ref = this.dialogService.open(ParameterDialogComponent, {
      data: paramDialogData
    });
    ref?.afterClosed?.subscribe(data => {
      if (data && data.success) {
        this.OnParameterOptionChange(this.selectedKeys);
      } else {
        this._popup.show('Manage Parameter', data?.message);
      }

    })
    setTimeout(function () {
      document.getElementById('ParameterFullName').focus();
    }, 10);

  }

  parameterKeyDialog() {
    setTimeout(function () {
      document?.getElementById('ParameterCode')?.focus();
    }, 10);

    const ref = this.dialogService.open(AddParameterDialogComponent, {
    });

    ref.afterClosed?.subscribe(data => {
      if (data) {
        data.map((e: { UserId: any; }) => {
          e.UserId = this.userid
        })
        this.DialogSaveParameterService.SaveDialogParamKeyForm(data[0])?.subscribe(data => {
          if (data && data.success) {
            this._checkRoleService.addNewMasterKeySubject.next('AddNewMasterKey');
            this.ParameterKeys();
          }
          else {
            this._popup.show('Manage Parameter', data.message);
          }
        })
      }
    })
  }

  openUploadDialog() {
    let uploadXmlData = {
      'UserId': this.userid,
      'ParameterKey': this.selectedKeys,
    }
    const ref = this.dialogService.open(UploadXMLDialogComponent, {
      data: uploadXmlData
    });
    ref.afterClosed.subscribe(data => {
      if ((data && data.success) || data) {
        this.OnParameterOptionChange(this.selectedKeys);
      } else {
        this._popup.show('Manage Parameter', data?.message);
      }

    })
  }

  getValue(option: { parameterAlias: any; }) {
    return `${option.parameterAlias}`
  }

  // ParameterKeys() {
  //   this.keysService.ParameterKeysList(this.userid).subscribe(data => {
  //     if (data?.data?.parameterList) {
  //       this.parameterOptions = (data.data.parameterList.map(item => {
  //         return { parameterAlias: item.parameterAlias, parameterKey: item.parameterKey }
  //       }));
  //       this.sortParameter();
  //       this.parameterMaster = data.data.parameterList.map(item => {
  //         return { parameterAlias: item.parameterAlias, parameterKey: item.parameterKey }
  //       });
  //     }
  //   })
  // }


  ParameterKeys() {
    // Step 1: Dispatch only if store is empty
    this.store.select(selectParameterList).pipe(take(1)).subscribe((list) => {
      if (!list || list.length === 0) {
        this.store.dispatch(loadParameterKeys({ userId: this.userid }));
      }
    });

    // Step 2: Listen for updates and run mapping + sorting only when data comes
    this.store.select(selectParameterList).pipe(
      filter(list => !!list && list.length > 0), // Only proceed when data is available
      take(1) // Run only once
    ).subscribe((list) => {
      this.parameterOptions = list.map(item => ({
        parameterAlias: item.parameterAlias,
        parameterKey: item.parameterKey
      }));

      this.parameterMaster = [...this.parameterOptions];
      this.sortParameter();
    });
  }
  // OnParameterOptionChange(option: any) {
  //   this.paramSearchText = "";
  //   this.selectedKeys = option;
  //   this.parameterService.getAllParameterByKey(this.selectedKeys.parameterAlias, this.userid)?.subscribe(data => {
  //     if (data?.data?.parameterList) {
  //       this.NoRecordsMessage = "";
  //       let paramList = data.data.parameterList;
  //       paramList.forEach(function (el, index, arr) {
  //         if (el.parameterName == null) {
  //           paramList.splice(index, 1);
  //         }
  //       })
  //       if (paramList.length != 0) {
  //         this.dataSource = paramList;
  //         let dataDisabled = this.dataSource[0];
  //         this.isParameterAddDisabled = dataDisabled.isParameterAddDisabled;
  //       }
  //       else
  //         this.dataSource = [];
  //     } else {
  //       this.dataSource = [];
  //       this.NoRecordsMessage = "No Record Found."
  //     }
  //   })
  // }

  OnParameterOptionChange(option: any) {
    //this.isLoading = true;
    this.paramSearchText = "";
    this.selectedKeys = option;
    this.dataSource = [];

    this.store.select(selectFilteredParameterList).pipe(take(1)).subscribe(paramList => {
      if (!paramList[this.selectedKeys.parameterAlias]) {
        // Only dispatch API call if not already fetched or different alias
        this.store.dispatch(loadParametersByKey({
          parameterAlias: this.selectedKeys.parameterAlias,
          userId: this.userid
        }));
      }
    });

    // Subscribe to filtered parameter list (reactive updates)
    this.store.select(selectFilteredParameterList).subscribe(paramList => {
      if (paramList[this.selectedKeys.parameterAlias]) {
        this.dataSource = paramList[this.selectedKeys.parameterAlias];
        this.NoRecordsMessage = '';
      } else {
        this.dataSource = [];
        this.NoRecordsMessage = "No Record Found.";
      }
      // setTimeout(()=>{
      //    this.isLoading = false;
      //  },1000)
    });

    // Subscribe to add button state
    this.store.select(selectIsParameterAddDisabled).subscribe(isDisabled => {
      this.isParameterAddDisabled = isDisabled;
    });
  }

  sortQuotes(columnName: string) {
    this.flag = !this.flag;
    this.sortedColumnName = { 'columnName': columnName, isAsc: this.flag };
  }

  Download() {
    const alias = this.selectedKeys?.parameterAlias;
    if (!alias) {
      console.error('No parameter alias selected.');
      return;
    }
    this.parameterService.DowloadParameter(this.selectedKeys.parameterAlias)?.subscribe(data => {
      if (data?.data?.parameterData) {
        let temp = atob(data.data.parameterData);
        const blob = new Blob([temp], { type: 'text/xml' });
        let ele = document.createElement('a');
        ele.href = window.URL.createObjectURL(blob);
        let fileName = this.selectedKeys ? this.selectedKeys.parameterAlias : 'parameter'
        ele.download = `${fileName}.xml`;
        ele.style.display = 'none';
        document.body.appendChild(ele);
        ele.click();
        document.body.removeChild(ele);
      }
    })
  }

  trackByAlias(index: number, item: any): string {
    return item.parameterAlias;
  }

}
