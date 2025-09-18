// import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
// import { AQAgentListService } from '@agenciiq/aqagent';
// import { Router } from '@angular/router';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { AQUserInfo, AQRoleInfo, AQAgencyInfo, AQAgentInfo } from '@agenciiq/login';
// import { AQAgencyService } from '@agenciiq/agency';
// import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
// import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
// import { AQSaveAdvanceFilterService } from '@agenciiq/quotes';
// import { AdvanceFilterType } from 'src/app/global-settings/advance-filter-type';
// import { SortingService } from 'src/app/shared/services/sorting-service/sorting.service';
// import { Subscription } from 'rxjs';
// import { DataViewComponent } from '@agenciiq/components';
// import { Roles } from 'src/app/global-settings/roles';
// import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';


// @Component({
//   selector: 'app-agentlist',
//   templateUrl: './agentlist.component.html',
//   styleUrls: ['./agentlist.component.sass'],
//   standalone: false
// })
// export class AgentlistComponent implements OnInit, OnDestroy {
//   FilterOpen: boolean = false;
//   dataSource = [];
//   NoRecordsMessage: string;
//   Pagination: any;
//   HideAdvanceFilterOption: boolean = true;
//   columns: string[];
//   advanceFilterAgent: FormGroup;
//   defaultSort = "ASC";
//   sortedColumnName: { columnName: any; isAsc: boolean; };
//   flag: boolean = false;
//   agencyNameList = [];
//   supervisorList = [];
//   managerList = [];
//   SavedAdvanceFilterList = [];
//   HideAdvFilterOption: boolean = false;
//   upload: boolean = false;
//   isUserMGAAdmin: boolean = false;
//   private agencyId: number;

//   private isSaveSubscription: Subscription;
//   private SaveAdvanceFilterSubscription: Subscription;
//   private GetAdvanceFilterParameterSubscription: Subscription;
//   private AgentListSubscription: Subscription;
//   private AgentListSubscription1: Subscription;
//   private AgentListSubscription2: Subscription;
//   private AgencyListSubscription: Subscription;

//   @ViewChild(DataViewComponent, { static: true }) libDataView: DataViewComponent;

//   constructor(
//     private agent: AQAgentListService,
//     private route: Router,
//     private fb: FormBuilder,
//     private _user: AQUserInfo,
//     public _role: AQRoleInfo,
//     private _agency: AQAgencyInfo,
//     private _agentInfo: AQAgentInfo,
//     private _agencyService: AQAgencyService,
//     private _loader: LoaderService,
//     public _chechRoleService: CheckRoleService,
//     private _advanceFilterService: AQSaveAdvanceFilterService,
//     private trimValueService: TrimValueService,
//     private _sortingService: SortingService
//   ) {
//     this.isUserMGAAdmin = this._chechRoleService.isRoleCodeAvailable('MGAAdmin', this._role.Roles());
//     this.agencyId = this._agency.Agency() && this._agency.Agency().agencyId ? this._agency.Agency().agencyId : 0;
//   }


//   ngOnInit() {
//     this.flag = true;
//     this.createAdavanceFilterForm();
//     this.getAgentListCall();
//     sessionStorage.removeItem('_agentId');
//     /* this.getAgencyNameList(); */
//     this.onFormValueChange();

//     // this.getAdvacneFilterList()
//   }

//   ngOnDestroy() {
//     if (this.AgentListSubscription) {
//       this.AgentListSubscription.unsubscribe();
//     }
//     if (this.AgencyListSubscription) {
//       this.AgencyListSubscription.unsubscribe();
//     }
//     if (this.GetAdvanceFilterParameterSubscription) {
//       this.GetAdvanceFilterParameterSubscription.unsubscribe();
//     }
//     if (this.isSaveSubscription) {
//       this.isSaveSubscription.unsubscribe();
//     }
//     if (this.SaveAdvanceFilterSubscription) {
//       this.SaveAdvanceFilterSubscription.unsubscribe();
//     }
//     if (this.AgentListSubscription1) {
//       this.AgentListSubscription1.unsubscribe();
//     }
//     if (this.AgentListSubscription2) {
//       this.AgentListSubscription2.unsubscribe();
//     }
//   }

//   onFormValueChange() {
//     this.isSaveSubscription = this.isSave.valueChanges.subscribe(value => {
//       if (value) {
//         this.filterName.setValidators([Validators.required]);
//       } else {
//         this.filterName.setValidators(null);
//       }
//       this.filterName.updateValueAndValidity({ emitEvent: false });
//     })
//   }

//   // saveAdvanceFilterList() {

//   //   if (this.isSave.value && this.filterName.value) {
//   //     this.SaveAdvanceFilterSubscription = this._advanceFilterService.SaveAdvanceFilter(AdvanceFilterType.agentFilter, this.filterName.value, btoa(JSON.stringify(this.advanceFilterAgent.value)), this.isDefault.value, this._user.UserId(), this._agentInfo.Agent().agentId, this.filterId.value)
//   //       .subscribe(data => {

//   //         if (data && data.success) {
//   //           this.getAdvacneFilterList();
//   //         }
//   //       });
//   //   }
//   // }

//   getAdvacneFilterList() {
//     this.GetAdvanceFilterParameterSubscription = this._advanceFilterService.GetAdvanceFilterParameter(AdvanceFilterType.agentFilter, this._user.UserId().toString(), this._agentInfo.Agent().agentId)
//       .subscribe(savedList => {

//         if (savedList && savedList.data && savedList.data.advancedFilterList) {
//           this.SavedAdvanceFilterList = savedList.data.advancedFilterList;
//           let selectedFilter = this.SavedAdvanceFilterList.filter(filter => filter.isActive);
//           if (selectedFilter.length) {
//             let filterObj = JSON.parse(atob(selectedFilter[0]['parameters']));
//             this.assignValue(filterObj, selectedFilter[0].advancedFilterId);
//           }
//         }
//       })
//   }

//   filterSelect(filterId) {
//     let selectedFilter = this.SavedAdvanceFilterList.filter(filter => filter.advancedFilterId == filterId);
//     if (selectedFilter.length) {
//       let filterObj = JSON.parse(atob(selectedFilter[0]['parameters']));
//       this.assignValue(filterObj, selectedFilter[0].advancedFilterId);
//     }
//   }

//   assignValue(filterObj, filterId) {
//     this.Agency.setValue(filterObj['AgencyName']);
//     this.Manager.setValue(filterObj['ManagerName']);
//     this.Supervisor.setValue(filterObj['SupervisorName']);
//     this.isSave.setValue(filterObj['isSave']);
//     this.isDefault.setValue(filterObj['isDefault']);
//     this.filterName.setValue(filterObj['filterName']);
//     this.filterId.setValue(filterId);
//   }

//   getAgentListCall() {

//     if (this._chechRoleService.isRoleCodeAvailable(Roles.MGAAdmin.roleCode, this._role.Roles())) {
//       this.Agentlist(this._user.UserId(), 0);
//       // this.getSupervisorAndManagerNameList(this._user.UserId(), 0);
//     } else if (this._chechRoleService.isRoleCodeAvailable(Roles.AgencyAdmin.roleCode, this._role.Roles())) {
//       this.Agentlist(this._user.UserId(), this._agency.Agency().agencyId);
//       // this.getSupervisorAndManagerNameList(this._user.UserId(), this._agency.Agency().agencyId);
//     } else if (this._chechRoleService.isRoleCodeAvailable(Roles.SystemAdmin.roleCode, this._role.Roles())) {
//       this.Agentlist(this._user.UserId(), 0);
//     }
//   }

//   clearAll() {
//     this.HideAdvFilterOption = true;
//     this.resetControl();
//     this.getAgentListCall();
//   }

//   clearAllFilter() {
//     this.clearAll();
//   }


//   resetControl() {
//     this.Agency.setValue('');
//     this.Manager.setValue('');
//     this.Supervisor.setValue('');

//     this.isSave.setValue(false);
//     this.isDefault.setValue(false);
//     this.filterName.setValue('');
//     this.filterId.setValue(0);
//   }


//   Agentlist(userId: any, agencyId: any) {

//     this._loader.show();
//     this.AgentListSubscription = this.agent.AgentList(userId, agencyId)
//       .subscribe(AgentList => {

//         this._loader.hide();
//         if (AgentList && AgentList.data && AgentList.data.agentList) {
//           this.columns = Object.keys(AgentList.data.agentList[0].agent);
//           if (this.agencyId > 0) {
//             this.dataSource = AgentList.data.agentList.map((item) => item.agent).filter(agent => (agent.userId !== this._user.UserId()) && (agent.agencyId == this.agencyId));
//           } else {
//             this.dataSource = AgentList.data.agentList.map((item) => item.agent).filter(agent => agent.userId !== this._user.UserId());
//           }
//           this.sortedColumnName = { 'columnName': 'firstName', isAsc: this.flag };
//           this.NoRecordsMessage = "";
//         } else {
//           this.NoRecordsMessage = "No Record Found.";
//         }
//       }, (err) => {
//         this._loader.hide();
//       }, () => {
//         this._loader.hide();
//       });
//   }

//   sortAgents(columnName: any, order: any) {
//     this.flag = !this.flag;
//     this.sortedColumnName = { 'columnName': columnName, isAsc: this.flag };
//   }

//   OpenFilter() {
//     if (this.FilterOpen == false) {
//       this.FilterOpen = true;
//     } else if (this.FilterOpen == true) {
//       this.FilterOpen = false;
//     }
//   }

//   getAdvanceFilter(value: boolean) {

//     this.FilterOpen = value;
//     this.HideAdvFilterOption = false;
//   }

//   Onclick() {
//     this.route.navigate(['agenciiq/users/adduser']);
//   }

//   EditAgent(agentId: string) {
//     this.route.navigateByUrl('agenciiq/users/adduser');
//     sessionStorage.setItem('_agentId', agentId);
//   }

//   createAdavanceFilterForm() {
//     this.advanceFilterAgent = this.fb.group({
//       filterId: [0],
//       ManagerName: '',
//       SupervisorName: '',
//       AgencyName: '',
//       //ManagerId: [0],
//       //SupervisorId: [0],
//       //AgencyId: [0],
//       isActive: [true],
//       isDefault: [false],
//       isSave: [false],
//       filterName: ['']
//     });
//   }

//   get filterId() {
//     return this.advanceFilterAgent.get('filterId');
//   }

//   get isDefault() {
//     return this.advanceFilterAgent.get('isDefault');
//   }

//   get isSave() {
//     return this.advanceFilterAgent?.get('isSave');
//   }

//   get filterName() {
//     return this.advanceFilterAgent?.get('filterName');
//   }

//   get Agency() {
//     return this.advanceFilterAgent.get('AgencyName');
//   }

//   get Manager() {
//     return this.advanceFilterAgent.get('ManagerName');
//   }

//   get Supervisor() {
//     return this.advanceFilterAgent.get('SupervisorName');
//   }

//   get isActive() {
//     return this.advanceFilterAgent.get('isActive');
//   }

//   getAgencyNameList() {
//     if (this._chechRoleService.isRoleCodeAvailable('MGAAdmin', this._role.Roles())) {
//       this._loader.show();
//       this.AgencyListSubscription = this._agencyService.AgencyList(this._user.UserId(), this.agencyId, "")
//         .subscribe(agencyList => {

//           this._loader.hide();
//           if (agencyList.success && agencyList.message == null && agencyList.data && agencyList.data.agencyList) {
//             this.agencyNameList = agencyList.data.agencyList.map(agency => {
//               return { agencyId: agency.agency.agencyId, agencyName: agency.agency.agencyName };
//             });
//             this.agencyNameList = this._sortingService.SortObjectArray('agencyName', 'ASC', this.agencyNameList);
//           }
//         }, (err) => {
//           this._loader.hide();
//         }, () => {
//           this._loader.hide();
//         });
//     } else if (this._chechRoleService.isRoleCodeAvailable('AgencyAdmin', this._role.Roles())) {
//       this.agencyNameList = [{
//         agencyId: this._agency.Agency().agencyId,
//         agencyName: this._agency.Agency().agencyName
//       }];
//     }
//   }

//   // getSupervisorAndManagerNameList(userId: number, agencyId: number) {

//   //   this.AgentListSubscription1 = this.agent.AgentList(userId, agencyId)
//   //     .subscribe(data => {
//   //       if (data && data.data && data.data.agentList) {
//   //         let _agencyList = data.data.agentList;
//   //         // Logic to find supervisor list

//   //         let _supervisorList = _agencyList.filter(agent => {
//   //           return agent.agentRoles.some(role => {
//   //             return role.roleCode == 'Supervisor'
//   //           })
//   //         }).map(supervisor => {
//   //           return {
//   //             supervisorId: supervisor.agent.userId,
//   //             supervisorName: supervisor.agent.firstName + " " + supervisor.agent.middleName + " " + supervisor.agent.lastName
//   //           }
//   //         });

//   //         this.supervisorList = this._sortingService.SortObjectArray('supervisorName', 'ASC', _supervisorList);



//   //         // Logic to find manager list

//   //         let _managerList = _agencyList.filter(agent => {
//   //           return agent.agentRoles.some(role => {
//   //             return role.roleCode == 'Manager'
//   //           })
//   //         }).map(manager => {
//   //           return {
//   //             managerId: manager.agent.userId,
//   //             managerName: manager.agent.firstName + " " + manager.agent.middleName + " " + manager.agent.lastName
//   //           }
//   //         });
//   //         this.managerList = this._sortingService.SortObjectArray('managerName', 'ASC', _managerList);
//   //       }
//   //     })
//   // }


//   getSupervisorAndManagerNameList(userId: number, agencyId: number) {
//     if (this.AgentListSubscription1) {
//       this.AgentListSubscription1.unsubscribe();
//     }

//     this.AgentListSubscription1 = this.agent.AgentList(userId, agencyId)
//       .subscribe(data => {
//         const agentList = data?.data?.agentList;
//         if (!Array.isArray(agentList)) return;

//         const buildName = (agent) =>
//           [agent.firstName, agent.middleName, agent.lastName].filter(Boolean).join(' ');

//         const extractRoleList = (roleCode: string, idKey: string, nameKey: string) => {
//           return this._sortingService.SortObjectArray(nameKey, 'ASC',
//             agentList
//               .filter(agent => agent.agentRoles?.some(role => role.roleCode === roleCode))
//               .map(agent => ({
//                 [idKey]: agent.agent.userId,
//                 [nameKey]: buildName(agent.agent)
//               }))
//           );
//         };

//         this.supervisorList = extractRoleList('Supervisor', 'supervisorId', 'supervisorName');
//         this.managerList = extractRoleList('Manager', 'managerId', 'managerName');
//       });
//   }




//   FilterAgentList() {

//     // this._loader.show();
//     this.HideAdvFilterOption = true;

//     //this.Agency.setValue('');
//     //this.Supervisor.setValue('');



//     if (this.Agency.value == null || this.Agency.value == undefined || this.Agency.value.trim() == "")
//       this.Agency.setValue('');
//     if (this.Manager.value == null || this.Manager.value == undefined || this.Manager.value.trim() == "")
//       this.Manager.setValue('');
//     if (this.Supervisor.value == null || this.Supervisor.value == undefined || this.Supervisor.value.trim() == "")
//       this.Supervisor.setValue('');


//     this.AgentListSubscription2 = this.agent.AgentList(this._user.UserId(), 0, this.Agency.value.trim(), this.Manager.value.trim(), this.Supervisor.value.trim(), this.isActive.value)
//       .subscribe(AgentList => {
//         this._loader.hide();
//         if (AgentList && AgentList.data && AgentList.data.agentList) {
//           this.dataSource = AgentList.data.agentList.map((item) => item.agent).filter(agent => agent.userId !== this._user.UserId());
//           /*  this.saveAdvanceFilterList(); */
//           // this.HideAdvFilterOption = !this.HideAdvFilterOption;
//           this.resetControl();

//           this.NoRecordsMessage = "";
//         } else {
//           this.dataSource = null;
//           this.NoRecordsMessage = "No Record Found.";
//         }
//       }, (err) => {
//         this._loader.hide();
//       }, () => {
//         this._loader.hide();
//       });
//   }

//   DeleteAgent(agentId: string) {
//     this.agent.DeleteAgent(this._user.UserId().toString(), "0", agentId, "0", "0").subscribe(data => {

//     })
//   }



//   cancelAdvanceFilter() {
//     this.HideAdvFilterOption = true;
//   }

// }


import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AQAgentListService } from '@agenciiq/aqagent';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AQUserInfo, AQRoleInfo, AQAgencyInfo, AQAgentInfo } from '@agenciiq/login';
import { AQAgencyService } from '@agenciiq/agency';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQSaveAdvanceFilterService } from '@agenciiq/quotes';
import { AdvanceFilterType } from 'src/app/global-settings/advance-filter-type';
import { SortingService } from 'src/app/shared/services/sorting-service/sorting.service';
import { Observable, Subscription } from 'rxjs';
import { DataViewComponent } from '@agenciiq/components';
import { Roles } from 'src/app/global-settings/roles';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';
import { selectAgentNoRecordMessage, selectFilteredAgents } from 'store/selectors/agent.selectors';
import { loadAgentList } from 'store/actions/agent.actions';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-agentlist',
  templateUrl: './agentlist.component.html',
  styleUrls: ['./agentlist.component.sass'],
  standalone: false,
})
export class AgentlistComponent implements OnInit, OnDestroy {
  FilterOpen: boolean = false;
  dataSource = [];
  NoRecordsMessage: string;
  Pagination: any;
  HideAdvanceFilterOption: boolean = true;
  columns: string[];
  advanceFilterAgent: FormGroup;
  defaultSort = 'ASC';
  sortedColumnName: { columnName: any; isAsc: boolean };
  flag: boolean = false;
  agencyNameList = [];
  supervisorList = [];
  managerList = [];
  SavedAdvanceFilterList = [];
  HideAdvFilterOption: boolean = false;
  upload: boolean = false;
  isUserMGAAdmin: boolean = false;
  private agencyId: number;
  dataSource$: Observable<any[]>;
  noRecordsMessage$: Observable<string>;

  private isSaveSubscription: Subscription;
  private SaveAdvanceFilterSubscription: Subscription;
  private GetAdvanceFilterParameterSubscription: Subscription;
  private AgentListSubscription: Subscription;
  private AgentListSubscription1: Subscription;
  private AgentListSubscription2: Subscription;
  private AgencyListSubscription: Subscription;

  @ViewChild(DataViewComponent, { static: true }) libDataView: DataViewComponent;

  constructor(
    private agent: AQAgentListService,
    private route: Router,
    private fb: FormBuilder,
    private _user: AQUserInfo,
    public _role: AQRoleInfo,
    private _agency: AQAgencyInfo,
    private _agentInfo: AQAgentInfo,
    private _agencyService: AQAgencyService,
    private _loader: LoaderService,
    public _chechRoleService: CheckRoleService,
    private _advanceFilterService: AQSaveAdvanceFilterService,
    private trimValueService: TrimValueService,
    private _sortingService: SortingService,
    private store: Store,

  ) {
    this.isUserMGAAdmin = this._chechRoleService.isRoleCodeAvailable(
      'MGAAdmin',
      this._role.Roles()
    );
    this.agencyId =
      this._agency.Agency() && this._agency.Agency().agencyId ? this._agency.Agency().agencyId : 0;
  }

  ngOnInit() {
    this.flag = true;
    this.createAdavanceFilterForm();
    this._chechRoleService.addNewUserSubject.subscribe((data) => {
      if (data === 'AddNewUser') {
        //this.getAgentListCall(data);
        this.store.dispatch(loadAgentList({ userId: this._user.UserId(), agencyId: this.agencyId }));
        this._chechRoleService.addNewUserSubject.next('');
      }
    });
    this.getAgentListCall('');
    sessionStorage.removeItem('_agentId');
    /* this.getAgencyNameList(); */
    this.onFormValueChange();

    // this.getAdvacneFilterList()
  }

  ngOnDestroy() {
    if (this.AgentListSubscription) {
      this.AgentListSubscription.unsubscribe();
    }
    if (this.AgencyListSubscription) {
      this.AgencyListSubscription.unsubscribe();
    }
    if (this.GetAdvanceFilterParameterSubscription) {
      this.GetAdvanceFilterParameterSubscription.unsubscribe();
    }
    if (this.isSaveSubscription) {
      this.isSaveSubscription.unsubscribe();
    }
    if (this.SaveAdvanceFilterSubscription) {
      this.SaveAdvanceFilterSubscription.unsubscribe();
    }
    if (this.AgentListSubscription1) {
      this.AgentListSubscription1.unsubscribe();
    }
    if (this.AgentListSubscription2) {
      this.AgentListSubscription2.unsubscribe();
    }
  }

  onFormValueChange() {
    this.isSaveSubscription = this.isSave.valueChanges.subscribe((value) => {
      if (value) {
        this.filterName.setValidators([Validators.required]);
      } else {
        this.filterName.setValidators(null);
      }
      this.filterName.updateValueAndValidity({ emitEvent: false });
    });
  }

  // saveAdvanceFilterList() {

  //   if (this.isSave.value && this.filterName.value) {
  //     this.SaveAdvanceFilterSubscription = this._advanceFilterService.SaveAdvanceFilter(AdvanceFilterType.agentFilter, this.filterName.value, btoa(JSON.stringify(this.advanceFilterAgent.value)), this.isDefault.value, this._user.UserId(), this._agentInfo.Agent().agentId, this.filterId.value)
  //       .subscribe(data => {

  //         if (data && data.success) {
  //           this.getAdvacneFilterList();
  //         }
  //       });
  //   }
  // }

  getAdvacneFilterList() {
    this.GetAdvanceFilterParameterSubscription = this._advanceFilterService
      .GetAdvanceFilterParameter(
        AdvanceFilterType.agentFilter,
        this._user.UserId().toString(),
        this._agentInfo.Agent().agentId
      )
      .subscribe((savedList) => {
        if (savedList && savedList.data && savedList.data.advancedFilterList) {
          this.SavedAdvanceFilterList = savedList.data.advancedFilterList;
          let selectedFilter = this.SavedAdvanceFilterList.filter((filter) => filter.isActive);
          if (selectedFilter.length) {
            let filterObj = JSON.parse(atob(selectedFilter[0]['parameters']));
            this.assignValue(filterObj, selectedFilter[0].advancedFilterId);
          }
        }
      });
  }

  filterSelect(filterId) {
    let selectedFilter = this.SavedAdvanceFilterList.filter(
      (filter) => filter.advancedFilterId == filterId
    );
    if (selectedFilter.length) {
      let filterObj = JSON.parse(atob(selectedFilter[0]['parameters']));
      this.assignValue(filterObj, selectedFilter[0].advancedFilterId);
    }
  }

  assignValue(filterObj, filterId) {
    this.Agency.setValue(filterObj['AgencyName']);
    this.Manager.setValue(filterObj['ManagerName']);
    this.Supervisor.setValue(filterObj['SupervisorName']);
    this.isSave.setValue(filterObj['isSave']);
    this.isDefault.setValue(filterObj['isDefault']);
    this.filterName.setValue(filterObj['filterName']);
    this.filterId.setValue(filterId);
  }

  getAgentListCall(callType: string) {
    if (this._chechRoleService.isRoleCodeAvailable(Roles.MGAAdmin.roleCode, this._role.Roles())) {
      this.Agentlist(this._user.UserId(), 0, callType);
      // this.getSupervisorAndManagerNameList(this._user.UserId(), 0);
    } else if (
      this._chechRoleService.isRoleCodeAvailable(Roles.AgencyAdmin.roleCode, this._role.Roles())
    ) {
      this.Agentlist(this._user.UserId(), this._agency.Agency().agencyId, callType);
      // this.getSupervisorAndManagerNameList(this._user.UserId(), this._agency.Agency().agencyId);
    } else if (
      this._chechRoleService.isRoleCodeAvailable(Roles.SystemAdmin.roleCode, this._role.Roles())
    ) {
      this.Agentlist(this._user.UserId(), 0, callType);
    }
  }

  clearAll() {
    this.HideAdvFilterOption = true;
    this.resetControl();
    this.getAgentListCall('');
  }

  clearAllFilter() {
    this.clearAll();
  }

  resetControl() {
    this.Agency.setValue('');
    this.Manager.setValue('');
    this.Supervisor.setValue('');

    this.isSave.setValue(false);
    this.isDefault.setValue(false);
    this.filterName.setValue('');
    this.filterId.setValue(0);
  }

  // Agentlist(userId: any, agencyId: any) {
  //   debugger

  //   this._loader.show();
  //   this.AgentListSubscription = this.agent.AgentList(userId, agencyId)
  //     .subscribe(AgentList => {

  //       this._loader.hide();
  //       if (AgentList && AgentList.data && AgentList.data.agentList) {
  //         this.columns = Object.keys(AgentList.data.agentList[0].agent);
  //         if (this.agencyId > 0) {
  //           this.dataSource = AgentList.data.agentList.map((item) => item.agent).filter(agent => (agent.userId !== this._user.UserId()) && (agent.agencyId == this.agencyId));
  //         } else {
  //           this.dataSource = AgentList.data.agentList.map((item) => item.agent).filter(agent => agent.userId !== this._user.UserId());
  //         }
  //         this.sortedColumnName = { 'columnName': 'firstName', isAsc: this.flag };
  //         this.NoRecordsMessage = "";
  //       } else {
  //         this.NoRecordsMessage = "No Record Found.";
  //       }
  //     }, (err) => {
  //       this._loader.hide();
  //     }, () => {
  //       this._loader.hide();
  //     });
  // }

  // Agentlist(userId: number, agencyId: number): void {
  //   debugger
  //   const currentUserId = this._user.UserId();

  //   // Store filtered agents by agencyId & current user
  //   this.dataSource$ = this.store.select(selectFilteredAgents, {
  //     agencyId,
  //     currentUserId
  //   });

  //   this.noRecordsMessage$ = this.store.select(selectAgentNoRecordMessage, {
  //     agencyId,
  //     currentUserId
  //   });

  //   console.log('Fetching agents for userId:', userId, 'agencyId:', agencyId);
  //   console.log('Current User ID:', currentUserId);
  //   console.log(' this.dataSource$  User ID:',  this.dataSource$ );

  //   // Unsubscribe previous if exists
  //   this.AgentListSubscription?.unsubscribe();

  //   // Subscribe to dataSource and conditionally dispatch API call
  //   this.AgentListSubscription = this.dataSource$.subscribe((data) => {
  //     console.log('Current dataSource:', data);
  //     if (!data || data.length === 0) {
  //       this.store.dispatch(
  //         loadAgentList({
  //           userId,
  //           agencyId
  //         })
  //       );
  //     }

  //     // Assign for local use
  //     this.dataSource = data;
  //     //this.columns = data?.length > 0 ? Object.keys(data[0]) : [];
  //     this.NoRecordsMessage = data?.length > 0 ? '' : 'No Record Found.';
  //   });
  // }

  Agentlist(userId: number, agencyId: number, callFrom: string): void {
    const currentUserId = this._user.UserId();

    // this.store.dispatch(loadAgentList({ userId: currentUserId, agencyId }));

    this.dataSource$ = this.store.select(selectFilteredAgents, {
      agencyId,
      currentUserId,
    });

    this.noRecordsMessage$ = this.store.select(selectAgentNoRecordMessage, {
      agencyId,
      currentUserId,
    });

    this.AgentListSubscription?.unsubscribe();

    this.AgentListSubscription = this.dataSource$.subscribe((data) => {
      console.log('Data from store:', data);
      if (!data || data.length === 0) {
        this.store.dispatch(loadAgentList({ userId: currentUserId, agencyId }));
      }
      this.dataSource = data;
      this.NoRecordsMessage = data?.length > 0 ? '' : 'No Record Found.';
    });

    //   this.AgentListSubscription = this.dataSource$
    //     .pipe(take(1))
    //     .subscribe((data) => {
    //       debugger
    //       console.log('Current dataSource:', data);

    //       if (!data || data.length === 0) {
    //         this.store.dispatch(
    //           loadAgentList({
    //             userId,
    //             agencyId
    //           })
    //         );
    //       }
    // this.dataSource = data;
    // console.log('DataSource after dispatch:', this.dataSource);
    //       this.NoRecordsMessage = data?.length > 0 ? '' : 'No Record Found.';
    //     });
  }

  sortAgents(columnName: any, order: any) {
    this.flag = !this.flag;
    this.sortedColumnName = { columnName: columnName, isAsc: this.flag };
  }

  OpenFilter() {
    if (this.FilterOpen == false) {
      this.FilterOpen = true;
    } else if (this.FilterOpen == true) {
      this.FilterOpen = false;
    }
  }

  getAdvanceFilter(value: boolean) {
    this.FilterOpen = value;
    this.HideAdvFilterOption = false;
  }

  Onclick() {
    this.route.navigate(['agenciiq/users/adduser']);
  }

  EditAgent(agentId: string) {
    this.route.navigateByUrl('agenciiq/users/adduser');
    sessionStorage.setItem('_agentId', agentId);
  }

  createAdavanceFilterForm() {
    this.advanceFilterAgent = this.fb.group({
      filterId: [0],
      ManagerName: '',
      SupervisorName: '',
      AgencyName: '',
      //ManagerId: [0],
      //SupervisorId: [0],
      //AgencyId: [0],
      isActive: [true],
      isDefault: [false],
      isSave: [false],
      filterName: [''],
    });
  }

  get filterId() {
    return this.advanceFilterAgent.get('filterId');
  }

  get isDefault() {
    return this.advanceFilterAgent.get('isDefault');
  }

  get isSave() {
    return this.advanceFilterAgent?.get('isSave');
  }

  get filterName() {
    return this.advanceFilterAgent?.get('filterName');
  }

  get Agency() {
    return this.advanceFilterAgent.get('AgencyName');
  }

  get Manager() {
    return this.advanceFilterAgent.get('ManagerName');
  }

  get Supervisor() {
    return this.advanceFilterAgent.get('SupervisorName');
  }

  get isActive() {
    return this.advanceFilterAgent.get('isActive');
  }

  getAgencyNameList() {
    if (this._chechRoleService.isRoleCodeAvailable('MGAAdmin', this._role.Roles())) {
      this._loader.show();
      this.AgencyListSubscription = this._agencyService
        .AgencyList(this._user.UserId(), this.agencyId, '')
        .subscribe(
          (agencyList) => {
            this._loader.hide();
            if (
              agencyList.success &&
              agencyList.message == null &&
              agencyList.data &&
              agencyList.data.agencyList
            ) {
              this.agencyNameList = agencyList.data.agencyList.map((agency) => {
                return { agencyId: agency.agency.agencyId, agencyName: agency.agency.agencyName };
              });
              this.agencyNameList = this._sortingService.SortObjectArray(
                'agencyName',
                'ASC',
                this.agencyNameList
              );
            }
          },
          (err) => {
            this._loader.hide();
          },
          () => {
            this._loader.hide();
          }
        );
    } else if (this._chechRoleService.isRoleCodeAvailable('AgencyAdmin', this._role.Roles())) {
      this.agencyNameList = [
        {
          agencyId: this._agency.Agency().agencyId,
          agencyName: this._agency.Agency().agencyName,
        },
      ];
    }
  }

  // getSupervisorAndManagerNameList(userId: number, agencyId: number) {

  //   this.AgentListSubscription1 = this.agent.AgentList(userId, agencyId)
  //     .subscribe(data => {
  //       if (data && data.data && data.data.agentList) {
  //         let _agencyList = data.data.agentList;
  //         // Logic to find supervisor list

  //         let _supervisorList = _agencyList.filter(agent => {
  //           return agent.agentRoles.some(role => {
  //             return role.roleCode == 'Supervisor'
  //           })
  //         }).map(supervisor => {
  //           return {
  //             supervisorId: supervisor.agent.userId,
  //             supervisorName: supervisor.agent.firstName + " " + supervisor.agent.middleName + " " + supervisor.agent.lastName
  //           }
  //         });

  //         this.supervisorList = this._sortingService.SortObjectArray('supervisorName', 'ASC', _supervisorList);

  //         // Logic to find manager list

  //         let _managerList = _agencyList.filter(agent => {
  //           return agent.agentRoles.some(role => {
  //             return role.roleCode == 'Manager'
  //           })
  //         }).map(manager => {
  //           return {
  //             managerId: manager.agent.userId,
  //             managerName: manager.agent.firstName + " " + manager.agent.middleName + " " + manager.agent.lastName
  //           }
  //         });
  //         this.managerList = this._sortingService.SortObjectArray('managerName', 'ASC', _managerList);
  //       }
  //     })
  // }

  getSupervisorAndManagerNameList(userId: number, agencyId: number) {
    if (this.AgentListSubscription1) {
      this.AgentListSubscription1.unsubscribe();
    }

    this.AgentListSubscription1 = this.agent.AgentList(userId, agencyId).subscribe((data) => {
      const agentList = data?.data?.agentList;
      if (!Array.isArray(agentList)) return;

      const buildName = (agent) =>
        [agent.firstName, agent.middleName, agent.lastName].filter(Boolean).join(' ');

      const extractRoleList = (roleCode: string, idKey: string, nameKey: string) => {
        return this._sortingService.SortObjectArray(
          nameKey,
          'ASC',
          agentList
            .filter((agent) => agent.agentRoles?.some((role) => role.roleCode === roleCode))
            .map((agent) => ({
              [idKey]: agent.agent.userId,
              [nameKey]: buildName(agent.agent),
            }))
        );
      };

      this.supervisorList = extractRoleList('Supervisor', 'supervisorId', 'supervisorName');
      this.managerList = extractRoleList('Manager', 'managerId', 'managerName');
    });
  }

  FilterAgentList() {
    // this._loader.show();
    this.HideAdvFilterOption = true;

    //this.Agency.setValue('');
    //this.Supervisor.setValue('');

    if (
      this.Agency.value == null ||
      this.Agency.value == undefined ||
      this.Agency.value.trim() == ''
    )
      this.Agency.setValue('');
    if (
      this.Manager.value == null ||
      this.Manager.value == undefined ||
      this.Manager.value.trim() == ''
    )
      this.Manager.setValue('');
    if (
      this.Supervisor.value == null ||
      this.Supervisor.value == undefined ||
      this.Supervisor.value.trim() == ''
    )
      this.Supervisor.setValue('');

    this.AgentListSubscription2 = this.agent
      .AgentList(
        this._user.UserId(),
        0,
        this.Agency.value.trim(),
        this.Manager.value.trim(),
        this.Supervisor.value.trim(),
        this.isActive.value
      )
      .subscribe(
        (AgentList) => {
          this._loader.hide();
          if (AgentList && AgentList.data && AgentList.data.agentList) {
            this.dataSource = AgentList.data.agentList
              .map((item) => item.agent)
              .filter((agent) => agent.userId !== this._user.UserId());
            /*  this.saveAdvanceFilterList(); */
            // this.HideAdvFilterOption = !this.HideAdvFilterOption;
            this.resetControl();

            this.NoRecordsMessage = '';
          } else {
            this.dataSource = null;
            this.NoRecordsMessage = 'No Record Found.';
          }
        },
        (err) => {
          this._loader.hide();
        },
        () => {
          this._loader.hide();
        }
      );
  }

  DeleteAgent(agentId: string) {
    this.agent
      .DeleteAgent(this._user.UserId().toString(), '0', agentId, '0', '0')
      .subscribe((data) => { });
  }

  cancelAdvanceFilter() {
    this.HideAdvFilterOption = true;
  }
}

