
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AgentlistComponent } from './agentlist.component';
import { FormControl, Validators } from '@angular/forms';
import { Roles } from 'src/app/global-settings/roles';
import { AQSaveAdvanceFilterService } from '@agenciiq/quotes';
import { AQAgencyInfo, AQAgentInfo, AQUserInfo } from '@agenciiq/login';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { SortingService } from 'src/app/shared/services/sorting-service/sorting.service';
import { AQAgencyService } from '@agenciiq/agency';
import { AQAgentListService } from '@agenciiq/aqagent';


describe('AgentlistComponent', () => {
  let component: AgentlistComponent;
  let fixture: ComponentFixture<AgentlistComponent>;
  let httpClient: HttpClient
  let aqsavedFilterService: AQSaveAdvanceFilterService;
  let agentInfo: AQAgentInfo;
  let userInfo: AQUserInfo;
  let agencyInfo: AQAgencyInfo;
  let loaderService: LoaderService;
  let sortingService: SortingService;
  let aqAgencyService: AQAgencyService;
  let agent: AQAgentListService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [AgentlistComponent],
      providers: [

      ],
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(AgentlistComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient)
    aqsavedFilterService = TestBed.inject(AQSaveAdvanceFilterService);
    agentInfo = TestBed.inject(AQAgentInfo);
    userInfo = TestBed.inject(AQUserInfo);
    agencyInfo = TestBed.inject(AQAgencyInfo);
    loaderService = TestBed.inject(LoaderService);
    sortingService = TestBed.inject(SortingService);
    aqAgencyService = TestBed.inject(AQAgencyService);
    agent = TestBed.inject(AQAgentListService);
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //ngOnInit
  it('should initialize flags, call necessary methods, and remove _agentId from sessionStorage', () => {
    const component = fixture.componentInstance;

    spyOn(component, 'createAdavanceFilterForm');
    spyOn(component, 'getAgentListCall');
    spyOn(component, 'onFormValueChange');
    spyOn(sessionStorage, 'removeItem');

    component.ngOnInit();

    expect(component.flag).toBeTrue();
    expect(component.createAdavanceFilterForm).toHaveBeenCalled();
    expect(component.getAgentListCall).toHaveBeenCalled();
    expect(component.onFormValueChange).toHaveBeenCalled();
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('_agentId');
  });

  //ngOnDestroy
  // it('should unsubscribe from all subscriptions in ngOnDestroy', () => {
  //   const component = fixture.componentInstance;    

  //   component.AgentListSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.AgencyListSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.GetAdvanceFilterParameterSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.isSaveSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.SaveAdvanceFilterSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.AgentListSubscription1 = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.AgentListSubscription2 = jasmine.createSpyObj('Subscription', ['unsubscribe']);

  //   component.ngOnDestroy();

  //   expect(component.AgentListSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.AgencyListSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.GetAdvanceFilterParameterSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.isSaveSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.SaveAdvanceFilterSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.AgentListSubscription1.unsubscribe).toHaveBeenCalled();
  //   expect(component.AgentListSubscription2.unsubscribe).toHaveBeenCalled();
  // });

  it('should unsubscribe from all subscriptions on destroy', () => {
    // Create dummy subscriptions with spies on unsubscribe
    const subscriptions = [
      'AgentListSubscription',
      'AgencyListSubscription',
      'GetAdvanceFilterParameterSubscription',
      'isSaveSubscription',
      'SaveAdvanceFilterSubscription',
      'AgentListSubscription1',
      'AgentListSubscription2'
    ];

    subscriptions.forEach(key => {
      const mockSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      (component as any)[key] = mockSubscription;
    });

    component.ngOnDestroy();

    subscriptions.forEach(key => {
      expect((component as any)[key].unsubscribe).toHaveBeenCalled();
    });
  });



  // onFormValueChange
  // it('should set or clear validators for filterName based on isSave value changes', () => {
  //   const component = fixture.componentInstance;

  //   // Mock form controls
  //   component.advanceFilterAgent = new FormControl({
  //   isSave: new FormControl(false),
  //   filterName: new FormControl('')
  //   }) as any;

  //   spyOn(component.filterName, 'setValidators').and.callThrough();
  //   spyOn(component.filterName, 'updateValueAndValidity');

  //   component.onFormValueChange();

  //   // Simulate value change to true
  //   component.isSave.setValue(true);
  //   expect(component.filterName.setValidators).toHaveBeenCalledWith([Validators.required]);
  //   expect(component.filterName.updateValueAndValidity).toHaveBeenCalledWith({ emitEvent: false });

  //   // Simulate value change to false
  //   component.isSave.setValue(false);
  //   expect(component.filterName.setValidators).toHaveBeenCalledWith(null);
  //   expect(component.filterName.updateValueAndValidity).toHaveBeenCalledWith({ emitEvent: false });
  // });

  //getAdvacneFilterList
  it('should populate SavedAdvanceFilterList and call assignValue if active filter exists', () => {
    const component = fixture.componentInstance;

    const mockResponse = {
      data: {
        advancedFilterList: [
          {
            isActive: true,
            parameters: btoa(JSON.stringify({ key: 'value' })),
            advancedFilterId: 101
          }
        ]
      }
    };

    // Mock dependencies
    const userId = 123;
    const agentId = 456;
    spyOn(userInfo, 'UserId').and.returnValue(userId);
    spyOn(agentInfo, 'Agent').and.returnValue({ agentId: agentId } as any);

    // Spy on service and assignValue
    spyOn(aqsavedFilterService, 'GetAdvanceFilterParameter').and.returnValue(of(mockResponse) as any);
    spyOn(component, 'assignValue');

    component.getAdvacneFilterList();

    expect(aqsavedFilterService.GetAdvanceFilterParameter).toHaveBeenCalledWith(
      'AgentFilter', userId.toString(), agentId
    );

    expect(component.SavedAdvanceFilterList).toEqual(mockResponse.data.advancedFilterList);
    expect(component.assignValue).toHaveBeenCalledWith({ key: 'value' }, 101);
  });
  it('should not call assignValue if no matching filterId is found', () => {
    const component = fixture.componentInstance;

    component.SavedAdvanceFilterList = [
      {
        advancedFilterId: 1,
        parameters: btoa(JSON.stringify({ key: 'value' }))
      }
    ];

    spyOn(component, 'assignValue');

    component.filterSelect(99); // Non-existent filterId

    expect(component.assignValue).not.toHaveBeenCalled();
  });

  //filterSelect
  it('should call assignValue with decoded parameters when valid filterId is passed', () => {
    const component = fixture.componentInstance;

    const filterData = {
      key: 'value'
    };

    const encodedParams = btoa(JSON.stringify(filterData));

    const mockSavedFilterList = [
      {
        advancedFilterId: 1,
        parameters: encodedParams
      },
      {
        advancedFilterId: 2,
        parameters: btoa(JSON.stringify({ anotherKey: 'anotherValue' }))
      }
    ];

    component.SavedAdvanceFilterList = mockSavedFilterList;

    spyOn(component, 'assignValue');

    component.filterSelect(1);

    expect(component.assignValue).toHaveBeenCalledWith(filterData, 1);
  });
  it('should not call assignValue if no matching filterId is found', () => {
    const component = fixture.componentInstance;

    component.SavedAdvanceFilterList = [
      {
        advancedFilterId: 1,
        parameters: btoa(JSON.stringify({ key: 'value' }))
      }
    ];

    spyOn(component, 'assignValue');

    component.filterSelect(99); // Non-existent filterId

    expect(component.assignValue).not.toHaveBeenCalled();
  });

  //assignValue
  it('should patch form controls with values from filterObj and filterId', () => {
    const component = fixture.componentInstance;

    // Create mock form controls
    Object.defineProperty(component, 'Agency', { value: new FormControl(), writable: false });
    Object.defineProperty(component, 'Manager', { value: new FormControl(), writable: false });
    Object.defineProperty(component, 'Supervisor', { value: new FormControl(), writable: false });
    Object.defineProperty(component, 'isSave', { value: new FormControl(), writable: false });
    Object.defineProperty(component, 'isDefault', { value: new FormControl(), writable: false });
    Object.defineProperty(component, 'filterName', { value: new FormControl(), writable: false });
    Object.defineProperty(component, 'filterId', { value: new FormControl(), writable: false });

    const mockFilterObj = {
      AgencyName: 'Agency XYZ',
      ManagerName: 'Manager ABC',
      SupervisorName: 'Supervisor DEF',
      isSave: true,
      isDefault: false,
      filterName: 'My Filter'
    };

    const mockFilterId = 123;

    // Call method
    component.assignValue(mockFilterObj, mockFilterId);

    // Expectations
    expect(component.Agency.value).toBe('Agency XYZ');
    expect(component.Manager.value).toBe('Manager ABC');
    expect(component.Supervisor.value).toBe('Supervisor DEF');
    expect(component.isSave.value).toBe(true);
    expect(component.isDefault.value).toBe(false);
    expect(component.filterName.value).toBe('My Filter');
    expect(component.filterId.value).toBe(123);
  });

  // getAgentListCall
  it('should call Agentlist with correct parameters for MGAAdmin role', () => {
    const component = fixture.componentInstance;

    spyOn(component._chechRoleService, 'isRoleCodeAvailable').and.callFake((roleCode) => {
      return roleCode === Roles.MGAAdmin.roleCode;
    });
    spyOn(userInfo, 'UserId').and.returnValue(123);
    spyOn(component, 'Agentlist');

    component.getAgentListCall();

    expect(component._chechRoleService.isRoleCodeAvailable).toHaveBeenCalledWith(Roles.MGAAdmin.roleCode, component._role.Roles());
    expect(component.Agentlist).toHaveBeenCalledWith(123, 0);
  });
  it('should call Agentlist with correct parameters for AgencyAdmin role', () => {
    const component = fixture.componentInstance;

    spyOn(component._chechRoleService, 'isRoleCodeAvailable').and.callFake((roleCode) => {
      return roleCode === Roles.AgencyAdmin.roleCode;
    });
    spyOn(userInfo, 'UserId').and.returnValue(123);
    spyOn(agencyInfo, 'Agency').and.returnValue({ agencyId: 456 } as any);
    spyOn(component, 'Agentlist');

    component.getAgentListCall();

    expect(component._chechRoleService.isRoleCodeAvailable).toHaveBeenCalledWith(Roles.AgencyAdmin.roleCode, component._role.Roles());
    expect(component.Agentlist).toHaveBeenCalledWith(123, 456);
  });
  it('should call Agentlist with correct parameters for SystemAdmin role', () => {
    const component = fixture.componentInstance;

    spyOn(component._chechRoleService, 'isRoleCodeAvailable').and.callFake((roleCode) => {
      return roleCode === Roles.SystemAdmin.roleCode;
    });
    spyOn(userInfo, 'UserId').and.returnValue(123);
    spyOn(component, 'Agentlist');

    component.getAgentListCall();

    expect(component._chechRoleService.isRoleCodeAvailable).toHaveBeenCalledWith(Roles.SystemAdmin.roleCode, component._role.Roles());
    expect(component.Agentlist).toHaveBeenCalledWith(123, 0);
  });
  it('should not call Agentlist if no matching role is found', () => {
    const component = fixture.componentInstance;

    spyOn(component._chechRoleService, 'isRoleCodeAvailable').and.returnValue(false);
    spyOn(component, 'Agentlist');

    component.getAgentListCall();

    expect(component.Agentlist).not.toHaveBeenCalled();
  });

  //clearAll
  it('should set HideAdvFilterOption to true, call resetControl and getAgentListCall', () => {
    const component = fixture.componentInstance;

    // Arrange: Create spies for the methods being called inside clearAll
    const resetControlSpy = spyOn(component, 'resetControl');
    const getAgentListCallSpy = spyOn(component, 'getAgentListCall');

    // Act
    component.clearAll();

    // Assert
    expect(component.HideAdvFilterOption).toBeTrue();
    expect(resetControlSpy).toHaveBeenCalled();
    expect(getAgentListCallSpy).toHaveBeenCalled();
  });

  //clearAllFilter
  it('should call clearAll when clearAllFilter is invoked', () => {
    const component = fixture.componentInstance;

    // Arrange
    const clearAllSpy = spyOn(component, 'clearAll');

    // Act
    component.clearAllFilter();

    // Assert
    expect(clearAllSpy).toHaveBeenCalled();
  });

  // resetControl
  it('should reset all form controls to their default values', () => {
    const component = fixture.componentInstance;

    // Arrange: Create mock form controls
    Object.defineProperty(component, 'Agency', { value: new FormControl('Agency XYZ'), writable: false });
    Object.defineProperty(component, 'Manager', { value: new FormControl('Manager ABC'), writable: false });
    Object.defineProperty(component, 'Supervisor', { value: new FormControl('Supervisor DEF'), writable: false });
    Object.defineProperty(component, 'isSave', { value: new FormControl(true), writable: false });
    Object.defineProperty(component, 'isDefault', { value: new FormControl(true), writable: false });
    Object.defineProperty(component, 'filterName', { value: new FormControl('My Filter'), writable: false });
    Object.defineProperty(component, 'filterId', { value: new FormControl(123), writable: false });

    // Act
    component.resetControl();

    // Assert: Verify that all form controls are reset to their default values
    expect(component.Agency.value).toBe('');
    expect(component.Manager.value).toBe('');
    expect(component.Supervisor.value).toBe('');
    expect(component.isSave.value).toBe(false);
    expect(component.isDefault.value).toBe(false);
    expect(component.filterName.value).toBe('');
    expect(component.filterId.value).toBe(0);
  });

  //Agentlist
  it('should fetch agent list, filter data based on agencyId and userId, and set component values', fakeAsync(() => {
    const mockUserId = 101;
    const mockAgencyId = 202;
    const mockAgentList = {
      data: {
        agentList: [
          {
            agent: { userId: 102, agencyId: mockAgencyId, firstName: 'John' }
          },
          {
            agent: { userId: 103, agencyId: mockAgencyId, firstName: 'Jane' }
          },
          {
            agent: { userId: mockUserId, agencyId: mockAgencyId, firstName: 'SkipMe' }
          }
        ]
      }
    };

    // Set up spies
    //spyOn(component['loaderService'], 'show');
    // spyOn(component['loaderService'], 'hide');
    spyOn(component['_user'], 'UserId').and.returnValue(mockUserId);
    spyOn(component['agent'], 'AgentList').and.returnValue(of(mockAgentList) as any);

    (component as any).agencyId = mockAgencyId;
    component.flag = true;

    // Act
    component.Agentlist(mockUserId, mockAgencyId);
    tick();
    expect(component.columns).toEqual(['userId', 'agencyId', 'firstName']);
    expect(component.dataSource.length).toBe(2); // Should filter out mockUserId
    expect(component.dataSource).toEqual([
      { userId: 102, agencyId: mockAgencyId, firstName: 'John' },
      { userId: 103, agencyId: mockAgencyId, firstName: 'Jane' }
    ]);
    expect(component.sortedColumnName).toEqual({ columnName: 'firstName', isAsc: true });
    expect(component.NoRecordsMessage).toBe('');
  }));

  //sortAgents
  it('should toggle flag and update sortedColumnName with column name and sort order', () => {
    // Arrange
    component.flag = true; // initial value
    const columnName = 'firstName';
    const order = 'asc'; // not used inside method

    // Act
    component.sortAgents(columnName, order);

    // Assert
    expect(component.flag).toBeFalse(); // flag toggled from true to false
    expect(component.sortedColumnName).toEqual({
      columnName: 'firstName',
      isAsc: false
    });

    // Act again to toggle back
    component.sortAgents(columnName, order);
    expect(component.flag).toBeTrue();
    expect(component.sortedColumnName).toEqual({
      columnName: 'firstName',
      isAsc: true
    });
  });

  //OpenFilter
  it('should toggle FilterOpen value', () => {
    component.FilterOpen = false;
    component.OpenFilter();
    expect(component.FilterOpen).toBeTrue();

    component.OpenFilter();
    expect(component.FilterOpen).toBeFalse();
  });

  //getAdvanceFilter
  it('should set FilterOpen to the given value and HideAdvFilterOption to false', () => {
    component.FilterOpen = false;
    component.HideAdvFilterOption = true;

    component.getAdvanceFilter(true);

    expect(component.FilterOpen).toBeTrue();
    expect(component.HideAdvFilterOption).toBeFalse();
  });

  //Onclick
  it('should navigate to agenciiq/users/adduser on Onclick', () => {
    const routerSpy = spyOn(component['route'], 'navigate');

    component.Onclick();

    expect(routerSpy).toHaveBeenCalledWith(['agenciiq/users/adduser']);
  });

  //EditAgent
  it('should navigate to agenciiq/users/adduser and set _agentId in sessionStorage', () => {
    const agentId = '12345';
    const navigateByUrlSpy = spyOn(component['route'], 'navigateByUrl');
    const sessionSetItemSpy = spyOn(sessionStorage, 'setItem');

    component.EditAgent(agentId);

    expect(navigateByUrlSpy).toHaveBeenCalledWith('agenciiq/users/adduser');
    expect(sessionSetItemSpy).toHaveBeenCalledWith('_agentId', agentId);
  });

  //createAdavanceFilterForm
  it('should create advanceFilterAgent form with default values', () => {
    component.createAdavanceFilterForm();

    expect(component.advanceFilterAgent).toBeDefined();
    expect(component.advanceFilterAgent.get('filterId')?.value).toBe(0);
    expect(component.advanceFilterAgent.get('ManagerName')?.value).toBe('');
    expect(component.advanceFilterAgent.get('SupervisorName')?.value).toBe('');
    expect(component.advanceFilterAgent.get('AgencyName')?.value).toBe('');
    expect(component.advanceFilterAgent.get('isActive')?.value).toBeTrue();
    expect(component.advanceFilterAgent.get('isDefault')?.value).toBeFalse();
    expect(component.advanceFilterAgent.get('isSave')?.value).toBeFalse();
    expect(component.advanceFilterAgent.get('filterName')?.value).toBe('');
  });

  //createAdavanceFilterForm
  it('should return filterId form control via getter', () => {
    component.createAdavanceFilterForm();  // initialize form first

    const filterIdControl = component.filterId;

    expect(filterIdControl).toBe(component.advanceFilterAgent.get('filterId'));
  });

  //isDefault
  it('should return isDefault form control via getter', () => {
    component.createAdavanceFilterForm();  // initialize form first

    const isDefaultControl = component.isDefault;

    expect(isDefaultControl).toBe(component.advanceFilterAgent.get('isDefault'));
  });

  //isSave
  it('should return isSave form control via getter', () => {
    component.createAdavanceFilterForm(); // initialize form first

    const isSaveControl = component.isSave;

    expect(isSaveControl).toBe(component.advanceFilterAgent.get('isSave'));
  });

  //filterName
  it('should return filterName form control via getter', () => {
    component.createAdavanceFilterForm(); // initialize the form first

    const filterNameControl = component.filterName;

    expect(filterNameControl).toBe(component.advanceFilterAgent.get('filterName'));
  });

  //Agency
  it('should return AgencyName form control via Agency getter', () => {
    component.createAdavanceFilterForm(); // initialize form first

    const agencyControl = component.Agency;

    expect(agencyControl).toBe(component.advanceFilterAgent.get('AgencyName'));
  });

  //Manager
  it('should return ManagerName form control via Manager getter', () => {
    component.createAdavanceFilterForm(); // initialize form first

    const managerControl = component.Manager;

    expect(managerControl).toBe(component.advanceFilterAgent.get('ManagerName'));
  });

  //Supervisor
  it('should return SupervisorName form control via Supervisor getter', () => {
    component.createAdavanceFilterForm(); // initialize form first

    const supervisorControl = component.Supervisor;

    expect(supervisorControl).toBe(component.advanceFilterAgent.get('SupervisorName'));
  });

  //isActive
  it('should return isActive form control via isActive getter', () => {
    component.createAdavanceFilterForm(); // initialize the form first

    const isActiveControl = component.isActive;

    expect(isActiveControl).toBe(component.advanceFilterAgent.get('isActive'));
  });

  //getAgencyNameList
  it('should fetch agency list and set agencyNameList for MGAAdmin role', () => {
    const mockUserId = 123;
    const mockAgencyId = 0;
    const mockAgenciesResponse = {
      success: true,
      message: null,
      data: {
        agencyList: [
          { agency: { agencyId: 1, agencyName: 'Agency A' } },
          { agency: { agencyId: 2, agencyName: 'Agency B' } },
        ]
      }
    };
    // Mock role service to return MGAAdmin role available
    spyOn(component._chechRoleService, 'isRoleCodeAvailable').and.callFake((role) => role === 'MGAAdmin');
    spyOn(component._role, 'Roles').and.returnValue([]);
    spyOn(userInfo, 'UserId').and.returnValue(mockUserId as any);
    (component as any).agencyId = mockAgencyId;
    spyOn(loaderService, 'show');
    spyOn(loaderService, 'hide');

    // Mock agency service to return agency list observable
    spyOn(aqAgencyService, 'AgencyList').and.returnValue({
      subscribe: (successCallback: any, errorCallback: any, completeCallback: any) => {
        successCallback(mockAgenciesResponse);
        completeCallback();
      }
    } as any);

    // Spy sorting service
    spyOn(sortingService, 'SortObjectArray').and.callFake((prop, order, arr) => arr);

    component.getAgencyNameList();

    expect(loaderService.show).toHaveBeenCalled();
    expect(aqAgencyService.AgencyList).toHaveBeenCalledWith(mockUserId, mockAgencyId, '');
    expect(component.agencyNameList.length).toBe(2);
    expect(sortingService.SortObjectArray).toHaveBeenCalledWith('agencyName', 'ASC', jasmine.any(Array));
    expect(loaderService.hide).toHaveBeenCalledTimes(2);
  });
  it('should set agencyNameList for AgencyAdmin role', () => {
    const mockAgency = { agencyId: 10, agencyName: 'My Agency' };

    spyOn(component._chechRoleService, 'isRoleCodeAvailable').and.callFake((role) => role === 'AgencyAdmin');
    spyOn(component._role, 'Roles').and.returnValue([]);
    spyOn(agencyInfo, 'Agency').and.returnValue(mockAgency as any);

    component.getAgencyNameList();

    expect(component.agencyNameList).toEqual([{ agencyId: mockAgency.agencyId, agencyName: mockAgency.agencyName }]);
  });

  //DeleteAgent
  it('should call agent.DeleteAgent with correct parameters', () => {
    const mockUserId = '123';
    const agentId = '456';

    // Spy on _user.UserId and return mockUserId
    spyOn(userInfo, 'UserId').and.returnValue(mockUserId as any);

    // Spy on agent.DeleteAgent and return a mock observable
    const deleteSpy = spyOn(agent, 'DeleteAgent').and.returnValue(of({ success: true } as any));

    component.DeleteAgent(agentId);

    expect(userInfo.UserId).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith(mockUserId, '0', agentId, '0', '0');
  });

  //cancelAdvanceFilter
  it('should set HideAdvFilterOption to true when cancelAdvanceFilter is called', () => {
    component.HideAdvFilterOption = false; // Initially false

    component.cancelAdvanceFilter();

    expect(component.HideAdvFilterOption).toBeTrue();
  });



});

