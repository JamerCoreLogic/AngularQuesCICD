// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { AQAgencyService } from '@agenciiq/agency';
// import { Router } from '@angular/router';
// import { AQUserInfo, AQAgencyInfo, AQRoleInfo, AQAgentInfo } from '@agenciiq/login';
// import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
// import { Subscription } from 'rxjs';
// import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
// import { Roles } from 'src/app/global-settings/roles';
// import { AQSession } from 'src/app/global-settings/session-storage';

// @Component({
//   selector: 'app-agencylist',
//   templateUrl: './agencylist.component.html',
//   styleUrls: ['./agencylist.component.css'],
//   standalone: false
// })
// export class AgencylistComponent implements OnInit, OnDestroy {

//   dataSource: any[] = [];
//   NoRecordsMessage: string | null = null;
//   upload: boolean = false;
//   Pagination: any;
//   ColumnList: string[] = [];
//   sortedColumnName: { columnName: string; isAsc: boolean } | null = null;
//   flag: boolean = true;
//   viewMode: 'list' | 'add' | 'edit' | 'branch' = 'list';
//   agencyType: 'register' | 'unRegister' = 'register';
//   isAddAgency: boolean = false;

//   private agencyId: number;
//   private agentId: Number;
//   private agencyListSubscription?: Subscription;

//   registerType: string = 'Yes';
//   agencyData: any;

//   constructor(
//     private _agencyService: AQAgencyService,
//     private _agencyInfo: AQAgencyInfo,
//     private _agentInfo: AQAgentInfo,
//     private _router: Router,
//     private _user: AQUserInfo,
//     private _loader: LoaderService,
//     private _roleInfo: AQRoleInfo,
//     private _checkRoleService: CheckRoleService,
//     private _session: AQSession
//   ) {
//     this.initializePermissions();
//     this.agencyId = this._agencyInfo.Agency()?.agencyId || 0;
//     this.agentId = this._agentInfo.AgentId() || 0;
//   }

//   ngOnInit(): void {
//     this.clearSessionData();
//     this.agencyData = this._session.getData('_agencyData');
//     this._session.removeSession('_agencyData');

//     const type = this.agencyData?.agencyType === 'unRegister' ? 'No' : 'Yes';
//     this.getAgencyList(type);
//   }

//   ngOnDestroy(): void {
//     this.agencyListSubscription?.unsubscribe();
//   }

//   private initializePermissions(): void {
//     this.isAddAgency = this._checkRoleService.isRoleCodeAvailable(
//       Roles.MGAAdmin.roleCode,
//       this._roleInfo.Roles()
//     );
//   }

//   private clearSessionData(): void {
//     sessionStorage.removeItem('_agencyId');
//     sessionStorage.removeItem('_newBranchList');
//     sessionStorage.removeItem('_tempId');
//   }

//   getAgencyList(registerType: 'Yes' | 'No'): void {
//     this.agencyType = registerType === 'Yes' ? 'register' : 'unRegister';
//     this.registerType = registerType;

//     const sessionData = { agencyType: this.agencyType, registerType };
//     this._session.setData('_agencyData', sessionData);

//     this._loader.show();

//     this.agencyListSubscription = this._agencyService.NewAgencyList(
//       this._user.UserId(),
//       this.agencyId, this.agentId).subscribe({
//         next: (response) => {
//           this._loader.hide();
//           const list = response?.data?.agencyList;
//           if (Array.isArray(list) && list.length > 0) {
//             this.ColumnList = Object.keys(list[0]);
//             this.dataSource = list.filter((item: any) => {
//               const status = (item.registered === true || item.registered === 'Yes') ? 'Yes' : 'No';
//               return status === registerType;
//             });
//             this.sortedColumnName = { columnName: 'agencyName', isAsc: this.flag };
//             this.NoRecordsMessage = '';
//           } else {
//             this.dataSource = [];
//             this.NoRecordsMessage = 'No Record Found.';
//           }
//         },
//         error: () => this._loader.hide(),
//         complete: () => this._loader.hide()
//       });
//   }

//   sortAgents(columnName: string): void {
//     this.flag = !this.flag;
//     this.sortedColumnName = { columnName, isAsc: this.flag };
//   }

//   EditAgency(agencyId: string): void {
//     const sessionData = { agencyType: this.agencyType, registerType: this.registerType };
//     this._session.setData('_agencyData', sessionData);
//     sessionStorage.setItem('_agencyId', agencyId);
//     this._router.navigateByUrl('agenciiq/agencies/addagency');
//   }

//   AddAgency(): void {
//     this._router.navigateByUrl('agenciiq/agencies/addagency');
//   }

//   Events(event: 'list' | 'add' | 'edit' | 'branch'): void {
//     this.viewMode = event;
//   }
// }

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AQAgencyService } from '@agenciiq/agency';
import { Router } from '@angular/router';
import { AQUserInfo, AQAgencyInfo, AQRoleInfo, AQAgentInfo } from '@agenciiq/login';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { Observable, Subscription } from 'rxjs';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { Roles } from 'src/app/global-settings/roles';
import { AQSession } from 'src/app/global-settings/session-storage';
import { Store } from '@ngrx/store';
import { loadAgencyList } from 'store/actions/agency.actions';
import { selectFilteredAgencies, selectNoRecordMessage } from 'store/selectors/agency.selectors';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-agencylist',
  templateUrl: './agencylist.component.html',
  styleUrls: ['./agencylist.component.css'],
  standalone: false,
})
export class AgencylistComponent implements OnInit, OnDestroy {
  dataSource: any[] = [];
  NoRecordsMessage: string | null = null;
  upload: boolean = false;
  Pagination: any;
  ColumnList: string[] = [];
  sortedColumnName: { columnName: string; isAsc: boolean } | null = null;
  flag: boolean = true;
  viewMode: 'list' | 'add' | 'edit' | 'branch' = 'list';
  agencyType: 'register' | 'unRegister' = 'register';
  isAddAgency: boolean = false;
  dataSource$: Observable<any[]>;
  noRecordsMessage$: Observable<string>;
  private agencyId: number;
  private agentId: Number;
  private agencyListSubscription?: Subscription;
  private addAgencyNotifierSub: Subscription;
  registerType: string = 'Yes';
  agencyData: any;
  filtered: any;
  // columnDefs: any[] = [];

  // rowData: any[];

  // defaultColDef: any;

  constructor(
    private store: Store,
    private _agencyService: AQAgencyService,
    private _agencyInfo: AQAgencyInfo,
    private _agentInfo: AQAgentInfo,
    private _router: Router,
    private _user: AQUserInfo,
    private _loader: LoaderService,
    private _roleInfo: AQRoleInfo,
    private _checkRoleService: CheckRoleService,
    private _session: AQSession,
  ) {
    this.initializePermissions();
    this.agencyId = this._agencyInfo.Agency()?.agencyId || 0;
    this.agentId = this._agentInfo.AgentId() || 0;
  }

  ngOnInit(): void {
    this.clearSessionData();
    this.agencyData = this._session.getData('_agencyData');
    this._session.removeSession('_agencyData');

    const type = this.agencyData?.agencyType === 'unRegister' ? 'No' : 'Yes';
    this._checkRoleService.addNewAgencySubject
      .pipe(take(1))
      .subscribe(value => {
        if (value === 'AddAgency') {
          const registerType: 'Yes' | 'No' = type;
          this.agencyType = registerType === 'Yes' ? 'register' : 'unRegister';
          this.registerType = registerType;
          this.store.dispatch(
            loadAgencyList({
              userId: this._user.UserId(),
              agencyId: this.agencyId,
              agentId: Number(this.agentId),
              registerType
            })
          );
          this._checkRoleService.addNewAgencySubject.next('');
        }
      });
    this.getAgencyList(type);

    console.log(this.rowData);
  }

  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };
  columnDefs = [
    { field: 'make', sortable: true, filter: true, resizable: true },
    { field: 'model', sortable: true, filter: true, resizable: true },
    { field: 'price', sortable: true, filter: true, resizable: true }
  ];
  rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxster', price: 72000 }
  ];

  ngOnDestroy(): void {
    this.agencyListSubscription?.unsubscribe();
    if (this.addAgencyNotifierSub) {
      this.addAgencyNotifierSub.unsubscribe();
    }
  }


  private initializePermissions(): void {
    this.isAddAgency = this._checkRoleService.isRoleCodeAvailable(
      Roles.MGAAdmin.roleCode,
      this._roleInfo.Roles()
    );
  }

  private clearSessionData(): void {
    sessionStorage.removeItem('_agencyId');
    sessionStorage.removeItem('_newBranchList');
    sessionStorage.removeItem('_tempId');
  }

  // getAgencyList(registerType: 'Yes' | 'No'): void {
  //   this.agencyType = registerType === 'Yes' ? 'register' : 'unRegister';
  //   this.registerType = registerType;

  //   const sessionData = { agencyType: this.agencyType, registerType };
  //   this._session.setData('_agencyData', sessionData);

  //   this._loader.show();

  //   this.agencyListSubscription = this._agencyService.NewAgencyList(
  //     this._user.UserId(),
  //     this.agencyId, this.agentId).subscribe({
  //       next: (response) => {
  //         this._loader.hide();
  //         const list = response?.data?.agencyList;
  //         if (Array.isArray(list) && list.length > 0) {
  //           this.ColumnList = Object.keys(list[0]);
  //           this.dataSource = list.filter(item => item.registered === registerType);
  //           debugger;
  //           this.sortedColumnName = { columnName: 'agencyName', isAsc: this.flag };
  //           this.NoRecordsMessage = '';
  //         } else {
  //           this.dataSource = [];
  //           this.NoRecordsMessage = 'No Record Found.';
  //         }
  //       },
  //       error: () => this._loader.hide(),
  //       complete: () => this._loader.hide()
  //     });
  // }
  ///////////////////
  getAgencyList(registerType: 'Yes' | 'No'): void {
    this.agencyType = registerType === 'Yes' ? 'register' : 'unRegister';
    this.registerType = registerType;

    const sessionData = { agencyType: this.agencyType, registerType };
    this._session.setData('_agencyData', sessionData);

    this.dataSource$ = this.store.select(selectFilteredAgencies, { registerType });
    this.noRecordsMessage$ = this.store.select(selectNoRecordMessage, { registerType });

    this.store.select(selectFilteredAgencies).pipe(take(1)).subscribe(data => {
      if (!data || data.success === false) {
        this.store.dispatch(loadAgencyList({
          userId: this._user.UserId(),
          agencyId: this.agencyId,
          agentId: Number(this.agentId),
          registerType,
        }));
      }
    });

    // Subscribe reactively
    this.store.select(selectFilteredAgencies).subscribe(data => {
      // this.filtered = data?.data?.agencyList;
      const filtered = data?.data?.agencyList?.filter((item: any) => {
        const normalized = item.registered === true || item.registered === 'Yes' ? 'Yes' : 'No';
        return normalized === registerType;
      })
      if (filtered?.length > 0) {
        this.ColumnList = Object.keys(filtered[0]);
        setTimeout(() => {
          this.dataSource = filtered;
        }, 100);
        this.sortedColumnName = { columnName: 'agencyName', isAsc: this.flag };
        this.NoRecordsMessage = '';
      } else {
        this.dataSource = [];
        this.NoRecordsMessage = 'No Record Found.';
      }
    });
  }
  //////////////////
  sortAgents(columnName: string): void {
    this.flag = !this.flag;
    this.sortedColumnName = { columnName, isAsc: this.flag };
  }

  EditAgency(agencyId: string): void {
    const sessionData = { agencyType: this.agencyType, registerType: this.registerType };
    this._session.setData('_agencyData', sessionData);
    sessionStorage.setItem('_agencyId', agencyId);
    this._router.navigateByUrl('agenciiq/agencies/addagency');
  }

  AddAgency(): void {
    this._router.navigateByUrl('agenciiq/agencies/addagency');
  }

  Events(event: 'list' | 'add' | 'edit' | 'branch'): void {
    this.viewMode = event;
  }
}
