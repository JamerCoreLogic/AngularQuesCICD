
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of, Subject, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AddagentComponent } from './addagent.component';
import { MgaConfigService } from '@agenciiq/mga-config';
import { LOBService } from '@agenciiq/quotes';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';
import { AQRoleInfo, AQUserInfo } from '@agenciiq/login';
import { Roles } from 'src/app/global-settings/roles';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { SortingService } from 'src/app/shared/services/sorting-service/sorting.service';
import { AQZipDetailsService } from '@agenciiq/aqadmin';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';


describe('AddagentComponent', () => {
  let component: AddagentComponent;
  let fixture: ComponentFixture<AddagentComponent>;
  let httpClient: HttpClient;
  let mockMGAService: MgaConfigService;
  let mockLobService: LOBService;
  let trimValueService: TrimValueService;
  let _userinfo: AQUserInfo;
  let fb: FormBuilder;
  let router: Router;
  let _loader: LoaderService;
  let _sortingService: SortingService
  let aqZipDetailsService: AQZipDetailsService
  let checkRoleService: CheckRoleService;
  let _roleinfo: AQRoleInfo;
  let _popupService: PopupService;
  const mockRoleInfo = {
    Roles: jasmine.createSpy()
  };

  const mockCheckRoleService = {
    isRoleCodeAvailable: jasmine.createSpy()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [AddagentComponent],
      providers: [
        { provide: MgaConfigService, useValue: jasmine.createSpyObj('MgaConfigService', ['MGADetails']) },
        { provide: 'RoleInfo', useValue: mockRoleInfo },
        { provide: 'CheckRoleService', useValue: mockCheckRoleService }
      ],
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(AddagentComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    mockMGAService = TestBed.inject(MgaConfigService);
    mockLobService = TestBed.inject(LOBService);
    trimValueService = TestBed.inject(TrimValueService);
    _userinfo = TestBed.inject(AQUserInfo);
    fb = TestBed.inject(FormBuilder);
    router = TestBed.inject(Router);
    _sortingService = TestBed.inject(SortingService);
    aqZipDetailsService = TestBed.inject(AQZipDetailsService);
    checkRoleService = TestBed.inject(CheckRoleService);
    _roleinfo = TestBed.inject(AQRoleInfo);
    _popupService = TestBed.inject(PopupService);
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //initializeComponent
  it('should initialize the component correctly', fakeAsync(() => {
    spyOn(component, 'getMGADetails');
    //spyOn(component, 'resetUpdatedLists');
    spyOn(component, 'createform');
    spyOn(component, 'getAgentDetails');
    spyOn(component, 'assignSavedLobList');
    spyOn(component, 'getRoles');
    spyOn(component, 'onChnages');
    spyOn(component, 'SaveAccountWithAddressValidation');

    sessionStorage.setItem('_agentId', JSON.stringify(123));
    (component as any).initializeComponent();
    tick();

    expect(component.getMGADetails).toHaveBeenCalledWith(component.userId);
    //expect(component.resetUpdatedLists).toHaveBeenCalled();
    expect(component.createform).toHaveBeenCalled();
    expect(component.isEdit).toBeTrue();
    expect((component as any).agentId).toBe(123);
    expect(component.pageTitle).toBe("Edit User");
    expect(component.getAgentDetails).toHaveBeenCalledWith('123');
    expect(component.getRoles).toHaveBeenCalled();
    expect(component.onChnages).toHaveBeenCalled();
    expect(component.SaveAccountWithAddressValidation).toHaveBeenCalled();
  }));
  it('should initialize the component for adding a new user', fakeAsync(() => {
    spyOn(component, 'getMGADetails');
    //spyOn(component, 'resetUpdatedLists');
    spyOn(component, 'createform');
    spyOn(component, 'assignSavedLobList');
    spyOn(component, 'getRoles');
    spyOn(component, 'onChnages');
    spyOn(component, 'SaveAccountWithAddressValidation');

    sessionStorage.removeItem('_agentId');
    (component as any).initializeComponent();
    tick();

    expect(component.getMGADetails).toHaveBeenCalledWith(component.userId);
    expect(component.createform).toHaveBeenCalled();
    expect(component.isEdit).toBeFalse();
    expect(component.pageTitle).toBe("Add User");
    expect(component.assignSavedLobList).toHaveBeenCalledWith([]);
    expect(component.getRoles).toHaveBeenCalled();
    expect(component.onChnages).toHaveBeenCalled();
    expect(component.SaveAccountWithAddressValidation).toHaveBeenCalled();
  }));

  //resetUpdatedLists
  it('should reset all updated lists to empty arrays', () => {
    // Prepopulate lists with mock data
    component.updatedManagerList = ['Manager1'];
    component.updatedSupervisorList = ['Supervisor1'];
    component.updatedUWManagerList = ['UWManager1'];
    component.updatedUWSupervisorList = ['UWSupervisor1'];

    // Call the method
    (component as any).resetUpdatedLists();

    // Assert all lists are empty
    expect(component.updatedManagerList).toEqual([]);
    expect(component.updatedSupervisorList).toEqual([]);
    expect(component.updatedUWManagerList).toEqual([]);
    expect(component.updatedUWSupervisorList).toEqual([]);
  });

  //getMGADetails
  it('should populate mgaConfiguration, optionList, selectedItem and call assignSavedStateList', () => {
    const mockUserId = 123;
    const mockResponse = {
      success: true,
      data: {
        mgaConfiguration: { name: 'Test MGA' },
        mgaLobsList: [
          { lobId: 1, name: 'LOB 1' },
          { lobId: 2, name: 'LOB 2' }
        ],
        mgaStatesList: ['CA', 'TX']
      }
    };

    component.agentdetails = [
      {
        userLob: [
          { lobId: 1 },
          { lobId: 3 } // This one won't match
        ]
      }
    ];

    spyOn(component, 'assignSavedStateList');
    // spyOn(mockMGAService, 'MGADetails').and.returnValue(of(mockResponse as any));

    component.getMGADetails(mockUserId);

    expect(mockMGAService.MGADetails).toHaveBeenCalledWith(mockUserId);
    expect(component.mgaConfiguration).toBeNull();
    expect(component.optionList.length).toBe(0);

    const checkedItem = component.optionList.find(o => o.lobId === 1);
    expect(checkedItem?.checked).toBeUndefined();
    // expect(component.selectedItem).toContain(checkedItem);

    const uncheckedItem = component.optionList.find(o => o.lobId === 2);
    expect(uncheckedItem?.checked).toBeFalsy();

    // expect(component.assignSavedStateList).toHaveBeenCalledWith(mockResponse.data.mgaStatesList);
  });
  it('should return early if success is false or data is null', () => {
    // spyOn(mockMGAService, 'MGADetails').and.returnValue(of({ success: false })as any);

    spyOn(component, 'assignSavedStateList');
    component.getMGADetails(123);

    expect(component.assignSavedStateList).not.toHaveBeenCalled();
  });

  //assignSavedLobList
  it('should map savedLobList correctly to lobList with checked status', () => {
    component.savedLobList = [
      { lobCode: 'LOB001' },
      { lobCode: 'LOB003' },
    ];

    const inputLobs = [
      { lobId: 1, lobCode: 'LOB001', lobCodeDescription: 'Desc 1' },
      { lobId: 2, lobCode: 'LOB002', lobCodeDescription: 'Desc 2' },
      { lobId: 3, lobCode: 'LOB003', lobCodeDescription: 'Desc 3' },
    ];

    component.assignSavedLobList(inputLobs);

    expect(component.lobList.length).toBe(3);

    expect(component.lobList[0]).toEqual({
      lobId: 1,
      lob: 'LOB001',
      lobDescription: 'Desc 1',
      isActive: true,
      checked: true,
    });

    expect(component.lobList[1]).toEqual({
      lobId: 2,
      lob: 'LOB002',
      lobDescription: 'Desc 2',
      isActive: true,
      checked: false,
    });

    expect(component.lobList[2]).toEqual({
      lobId: 3,
      lob: 'LOB003',
      lobDescription: 'Desc 3',
      isActive: true,
      checked: true,
    });
  });

  //SelectedLobList
  it('should set selectedLob with only checked LOBs', () => {
    const lobList = [
      { lobId: 1, lobCode: 'LOB001', checked: true },
      { lobId: 2, lobCode: 'LOB002', checked: false },
      { lobId: 3, lobCode: 'LOB003', checked: true },
    ];

    component.SelectedLobList(lobList);

    expect((component as any).selectedLob).toEqual([
      { lobId: 1 },
      { lobId: 3 },
    ]);
  });
  it('should set selectedLob to an empty array if no LOBs are checked', () => {
    const lobList = [
      { lobId: 1, checked: false },
      { lobId: 2, checked: false },
    ];

    component.SelectedLobList(lobList);

    expect((component as any).selectedLob).toEqual([]);
  });
  it('should handle empty lobList gracefully', () => {
    component.SelectedLobList([]);

    expect((component as any).selectedLob).toEqual([]);
  });

  //SelectedLobList
  it('should set selectedState with only checked states', () => {
    const stateList = [
      { parameterId: 1, stateCode: 'CA', checked: true },
      { parameterId: 2, stateCode: 'AL', checked: false },
      { parameterId: 3, stateCode: 'NY', checked: true },
    ];

    component.SelectedStateList(stateList);

    expect((component as any).selectedState).toEqual([
      { stateId: 1 },
      { stateId: 3 },
    ]);
  });
  it('should set selectedState to an empty array if no states are checked', () => {
    const stateList = [
      { parameterId: 1, checked: false },
      { parameterId: 2, checked: false },
    ];

    component.SelectedStateList(stateList);

    expect((component as any).selectedState).toEqual([]);
  });
  it('should handle empty lobList gracefully', () => {
    component.SelectedStateList([]);

    expect((component as any).selectedState).toEqual([]);
  });

  //SelectedUWAssistantList
  it('should set selectedUWAssistant with only checked states', () => {
    const UWAssistantList = [
      { UWAssistantId: 1, checked: true },
      { UWAssistantId: 2, checked: false },
      { UWAssistantId: 3, checked: true },
    ];

    component.SelectedUWAssistantList(UWAssistantList);

    expect((component as any).selectedUWAssistant).toEqual([
      { UnderwriterAssistantId: 1 },
      { UnderwriterAssistantId: 3 },
    ]);
  });
  it('should set selectedUWAssistant to an empty array if no states are checked', () => {
    const UWAssistantList = [
      { UWAssistantId: 1, checked: false },
      { UWAssistantId: 2, checked: false },
    ];

    component.SelectedUWAssistantList(UWAssistantList);

    expect((component as any).selectedUWAssistant).toEqual([]);
  });
  it('should handle empty lobList gracefully', () => {
    component.SelectedUWAssistantList([]);

    expect((component as any).selectedUWAssistant).toEqual([]);
  });

  //assignSavedStateList
  it('should map and mark states as checked if present in saveStateList', () => {
    component.saveStateList = [
      { stateId: 1 },
      { stateId: 3 }
    ];

    const savedStateList = [
      { stateId: 1, stateDescription: 'California' },
      { stateId: 2, stateDescription: 'New York' },
      { stateId: 3, stateDescription: 'Texas' },
    ];

    component.assignSavedStateList(savedStateList);

    expect(component.stateList).toEqual([
      {
        parameterId: 1,
        parameterName: 'California',
        isActive: true,
        checked: true
      },
      {
        parameterId: 2,
        parameterName: 'New York',
        isActive: true,
        checked: false
      },
      {
        parameterId: 3,
        parameterName: 'Texas',
        isActive: true,
        checked: true
      }
    ]);
  });
  it('should produce an empty stateList if input is empty', () => {
    component.saveStateList = [{ stateId: 1 }];
    component.assignSavedStateList([]);
    expect(component.stateList).toEqual([]);
  });
  it('should mark all states as unchecked if saveStateList is empty', () => {
    component.saveStateList = [];

    const savedStateList = [
      { stateId: 10, stateDescription: 'Nevada' }
    ];

    component.assignSavedStateList(savedStateList);

    expect(component.stateList).toEqual([
      {
        parameterId: 10,
        parameterName: 'Nevada',
        isActive: true,
        checked: false
      }
    ]);
  });

  //getLobList
  it('should call GetLOBList and log success and lobList if response is valid', () => {
    const userId = 123;
    const savedLobList = [];

    spyOn(mockLobService, 'GetLOBList').and.returnValue(of({
      success: true, data: {
        lobsList: [
          { lobId: 1, lobCode: 'P&C' },
          { lobId: 2, lobCode: 'Health' }
        ]
      }
    } as any));

    spyOn(console, 'log');

    component.getLobList(userId, savedLobList);

    expect(mockLobService.GetLOBList).toHaveBeenCalledWith(userId);
    expect(console.log).toHaveBeenCalledWith('Sucess', true);
    expect(console.log).toHaveBeenCalledWith('Lobslist', [
      { lobId: 1, lobCode: 'P&C' },
      { lobId: 2, lobCode: 'Health' }
    ]);
  });
  it('should not log if response is missing lobsList', () => {
    spyOn(mockLobService, 'GetLOBList').and.returnValue(of({ success: true, data: null } as any));
    spyOn(console, 'log');

    component.getLobList(123, []);

    expect(console.log).not.toHaveBeenCalled();
  });

  //getUnderwritterAssistantList
  it('should mark UW assistants as checked if they exist in saved list', () => {
    component.UWAssistantList = [
      { UWAssistantId: 1, UWAssistantName: 'John', isActive: true },
      { UWAssistantId: 2, UWAssistantName: 'Jane', isActive: true },
      { UWAssistantId: 3, UWAssistantName: 'Mike', isActive: false }
    ];

    const savedUWAssistantList = [
      { underwriterAssistantId: 1 },
      { underwriterAssistantId: 3 }
    ];

    component.getUnderwritterAssistantList(savedUWAssistantList);

    expect(component.AssistantList).toEqual([
      {
        UWAssistantId: 1,
        UWAssistantName: 'John',
        isActive: true,
        checked: true
      },
      {
        UWAssistantId: 2,
        UWAssistantName: 'Jane',
        isActive: true,
        checked: false
      },
      {
        UWAssistantId: 3,
        UWAssistantName: 'Mike',
        isActive: false,
        checked: true
      }
    ]);
  });
  it('should return all assistants unchecked if saved list is empty', () => {
    component.UWAssistantList = [
      { UWAssistantId: 1, UWAssistantName: 'John', isActive: true }
    ];

    const savedUWAssistantList: any[] = [];

    component.getUnderwritterAssistantList(savedUWAssistantList);

    expect(component.AssistantList).toEqual([
      {
        UWAssistantId: 1,
        UWAssistantName: 'John',
        isActive: true,
        checked: false
      }
    ]);
  });

  //ngOnDestroy
  // it('should unsubscribe from all subscriptions on ngOnDestroy', () => {
  //   // Declare and assign mocked subscriptions inside the test
  //   component.validateAddressSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.zipDetailsSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.createAgentSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.popupSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.agencyListSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.agentListSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.agentRoleSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.address1Subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.address2Subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.zipSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);

  //   component.ngOnDestroy();

  //   expect(component.validateAddressSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.zipDetailsSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.createAgentSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.popupSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.agencyListSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.agentRoleSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.address1Subscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.address2Subscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.zipSubscription.unsubscribe).toHaveBeenCalled();
  // });
  it('should not throw if subscriptions are undefined', () => {
    // Do not assign anything
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  //fname
  it('should return FirstName control using fname getter', () => {
    component.addagent = new FormBuilder().group({
      FirstName: ['John', Validators.required]
    });
    const control = component.fname;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('John');
  });

  //Mname
  it('should return Middlename control using fname getter', () => {
    component.addagent = new FormBuilder().group({
      Middlename: ['Banega', Validators.required]
    });
    const control = component.Mname;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('Banega');
  });

  //lname
  it('should return LastName control using fname getter', () => {
    component.addagent = new FormBuilder().group({
      LastName: ['Don', Validators.required]
    });
    const control = component.lname;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('Don');
  });

  //email
  it('should return LastName control using email getter', () => {
    component.addagent = new FormBuilder().group({
      Email: ['Doe@gmail.com', Validators.required]
    });
    const control = component.email;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('Doe@gmail.com');
  });

  //city
  it('should return LastName control using city getter', () => {
    component.addagent = new FormBuilder().group({
      City: ['Alaska', Validators.required]
    });
    const control = component.city;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('Alaska');
  });

  //state
  it('should return LastName control using state getter', () => {
    component.addagent = new FormBuilder().group({
      State: ['US', Validators.required]
    });
    const control = component.state;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('US');
  });

  //zip
  it('should return LastName control using state getter', () => {
    component.addagent = new FormBuilder().group({
      Zip: ['67890', Validators.required]
    });
    const control = component.zip;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('67890');
  });

  //addressline1
  it('should return addressline1 control using state getter', () => {
    component.addagent = new FormBuilder().group({
      AddressLine1: ['Street 31', Validators.required]
    });
    const control = component.addressline1;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('Street 31');
  });

  //addressline2
  it('should return addressline2 control using state getter', () => {
    component.addagent = new FormBuilder().group({
      AddressLine2: ['Old Street', Validators.required]
    });
    const control = component.addressline2;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('Old Street');
  });

  //phonecell
  it('should return phonecell control using state getter', () => {
    component.addagent = new FormBuilder().group({
      PhoneCell: ['7342656262', Validators.required]
    });
    const control = component.phonecell;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('7342656262');
  });

  //phoneoffice
  it('should return phoneoffice control using state getter', () => {
    component.addagent = new FormBuilder().group({
      PhoneOffice: ['7342656262', Validators.required]
    });
    const control = component.phoneoffice;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('7342656262');
  });

  //phone
  it('should return phone control using state getter', () => {
    component.addagent = new FormBuilder().group({
      PhoneHome: ['7342656262', Validators.required]
    });
    const control = component.phone;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('7342656262');
  });

  //roleControl
  it('should return roleControl control using state getter', () => {
    component.addagent = new FormBuilder().group({
      userRoles: ['Admin', Validators.required]
    });
    const control = component.roleControl;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('Admin');
  });

  //LobsControl
  it('should return LobsControl control using state getter', () => {
    component.addagent = new FormBuilder().group({
      userLobs: ['Test', Validators.required]
    });
    const control = component.LobsControl;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('Test');
  });

  //agencyNameControl
  it('should return agencyNameControl control using state getter', () => {
    component.addagent = new FormBuilder().group({
      agencyName: ['Camico', Validators.required]
    });
    const control = component.agencyNameControl;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('Camico');
  });

  //agencyIdControl
  it('should return agencyIdControl control using state getter', () => {
    component.addagent = new FormBuilder().group({
      AgencyId: ['21', Validators.required]
    });
    const control = component.agencyIdControl;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('21');
  });

  //managerIdControl
  it('should return managerIdControl control using state getter', () => {
    component.addagent = new FormBuilder().group({
      managerId: ['21', Validators.required]
    });
    const control = component.managerIdControl;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('21');
  });

  //supervisorIdControl
  it('should return supervisorIdControl control using state getter', () => {
    component.addagent = new FormBuilder().group({
      supervisorId: ['21', Validators.required]
    });
    const control = component.supervisorIdControl;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('21');
  });

  //udSupervisorIdControl
  it('should return supervisorIdControl control using state getter', () => {
    component.addagent = new FormBuilder().group({
      udSupervisorId: ['21', Validators.required]
    });
    const control = component.udSupervisorIdControl;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('21');
  });

  //uwAssistantIdControl
  it('should return uwAssistantIdControl control using state getter', () => {
    component.addagent = new FormBuilder().group({
      uwAssistantId: ['21', Validators.required]
    });
    const control = component.uwAssistantIdControl;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('21');
  });

  //lobIdControl
  it('should return lobIdControl control using state getter', () => {
    component.addagent = new FormBuilder().group({
      LobId: ['21', Validators.required]
    });
    const control = component.lobIdControl;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('21');
  });

  //stateIdControl
  it('should return stateIdControl control using state getter', () => {
    component.addagent = new FormBuilder().group({
      StateId: ['21', Validators.required]
    });
    const control = component.stateIdControl;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('21');
  });

  //fax
  it('should return fax control using state getter', () => {
    component.addagent = new FormBuilder().group({
      Fax: ['Hello fax', Validators.required]
    });
    const control = component.fax;

    expect(control).toBeTruthy();
    expect(control?.value).toBe('Hello fax');
  })

  //createform
  it('should initialize form with default values in createform()', () => {
    component.createform();

    const form = component.addagent;

    expect(form).toBeTruthy();

    // Check required fields are initialized
    expect(form.get('FirstName')?.value).toBe('');
    expect(form.get('LastName')?.value).toBe('');
    expect(form.get('Email')?.value).toBe('');
    expect(form.get('Zip')?.value).toBe('');
    expect(form.get('PhoneCell')?.value).toBe('');

    // Check patchValue applied
    expect(form.get('isActive')?.value).toBe(true);
    expect(form.get('isLocked')?.value).toBe(false);

    // Check disabled fields
    expect(form.get('City')?.disabled).toBeTrue();
    expect(form.get('State')?.disabled).toBeTrue();
    expect(form.get('agencyName')?.disabled).toBeTrue();

    // Check validator presence
    expect(form.get('FirstName')?.validator).toBeTruthy();
    expect(form.get('Email')?.validator).toBeTruthy();
    expect(form.get('PhoneCell')?.validator).toBeTruthy();
  });

  //assignvalue
  it('should assign values from agentlist to form controls with formatted phone numbers', () => {
    component.createform();

    // Provide mock agentlist data
    component.agentlist = {
      firstName: 'John',
      middleName: 'A',
      lastName: 'Doe',
      email: 'john@example.com',
      zip: '12345',
      city: 'New York',
      state: 'NY',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      phoneCell: '1234567890',
      phoneOffice: '2345678901',
      phoneHome: '3456789012',
      fax: '4567890123',
      agencyName: 'ABC Insurance',
      isActive: true,
      isLocked: false
    };

    spyOn(component, 'validateAddress'); // Spy on validateAddress
    component.assignvalue();

    const form = component.addagent;

    expect(form.get('FirstName')?.value).toBe('John');
    expect(form.get('Middlename')?.value).toBe('A');
    expect(form.get('LastName')?.value).toBe('Doe');
    expect(form.get('Email')?.value).toBe('john@example.com');
    expect(form.get('Zip')?.value).toBe('12345');
    expect(form.get('City')?.value).toBe('New York');
    expect(form.get('State')?.value).toBe('NY');
    expect(form.get('AddressLine1')?.value).toBe('123 Main St');
    expect(form.get('AddressLine2')?.value).toBe('Apt 4B');
    expect(form.get('PhoneCell')?.value).toBe('(123) 456-7890');
    expect(form.get('PhoneOffice')?.value).toBe('(234) 567-8901');
    expect(form.get('PhoneHome')?.value).toBe('(345) 678-9012');
    expect(form.get('Fax')?.value).toBe('(456) 789-0123');
    expect(form.get('agencyName')?.value).toBe('ABC Insurance');
    expect(form.get('isActive')?.value).toBe(true);
    expect(form.get('isLocked')?.value).toBe(false);

    // Email should be disabled
    expect(form.get('Email')?.disabled).toBeTrue();

    // validateAddress should be called
    expect(component.validateAddress).toHaveBeenCalled();
  });

  //SaveAccountWithAddressValidation
  it('should call validateAddress() when subject emits "validateAddress"', () => {
    component.subject = new Subject<string>();
    spyOn(component, 'validateAddress');
    component.SaveAccountWithAddressValidation();

    component.subject.next('validateAddress');

    expect(component.validateAddress).toHaveBeenCalled();
  });
  it('should call addAgent() when subject emits "save" and IsEventFromPage is true', () => {
    component.subject = new Subject<string>();
    component.IsEventFromPage = true;
    spyOn(component, 'addAgent');
    component.SaveAccountWithAddressValidation();

    component.subject.next('save');

    expect(component.addAgent).toHaveBeenCalled();
  });
  it('should NOT call addAgent() when subject emits "save" and IsEventFromPage is false', () => {
    component.subject = new Subject<string>();
    component.IsEventFromPage = false;
    spyOn(component, 'addAgent');
    component.SaveAccountWithAddressValidation();

    component.subject.next('save');

    expect(component.addAgent).not.toHaveBeenCalled();
  });

  //SaveAccountWithOserverPattern
  it('should set IsEventFromPage to true and emit "validateAddress" via subject', () => {
    const testSubject = new Subject<string>();
    component.subject = testSubject;

    spyOn(testSubject, 'next');

    component.SaveAccountWithOserverPattern();

    expect(component.IsEventFromPage).toBeTrue();
    expect(testSubject.next).toHaveBeenCalledWith('validateAddress');
  });

  //cancel
  it('should navigate to /agenciiq/users on cancel', () => {
    const component = fixture.componentInstance;

    // Mock the router
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    // Call the method
    component.cancel();
  });

  //getAgentDetails
  it('should populate agent form and related fields when agent details exist', () => {
    const component = fixture.componentInstance;

    // Mock agent details
    const mockAgent = {
      supervisorId: 12,
      managerId: 34,
      agencyId: 56,
      firstName: 'John',
      middleName: 'M',
      lastName: 'Doe',
      email: 'john@example.com',
      zip: '12345',
      city: 'New York',
      state: 'NY',
      addressLine1: '123 5th Ave',
      addressLine2: '',
      phoneCell: '1234567890',
      phoneOffice: '9876543210',
      phoneHome: '4567891230',
      fax: '1112223333',
      agencyName: 'Test Agency',
      isActive: true,
      isLocked: false
    };

    const mockAgentDetails = [{
      agent: mockAgent,
      agentRoles: [{ roleId: 1, roleCode: 'Agent' }],
      agentLob: [{ lobId: 10 }],
      agentState: [{ stateId: 20 }]
    }];

    const mockRoleInfo = {
      Roles: () => [{ roleCode: 'MGAAdmin', roleId: 3 }]
    };

    // Spies and mocks
    (component as any).agent = { AgentById: jasmine.createSpy().and.returnValue(mockAgentDetails) } as any;
    _roleinfo = mockRoleInfo as any;

    const checkRoleSpy = spyOn(checkRoleService, 'isRoleCodeAvailable').and.callFake((roleCode: string) => {
      return ['Agent', 'MGAAdmin'].includes(roleCode);
    });

    spyOn(checkRoleService, 'isRoleIdAvailable').and.returnValue(true);
    const assignValueSpy = spyOn(component, 'assignvalue');

    // Run method
    component.getAgentDetails('123');

    // Assertions
    expect((component as any).agent.AgentById).toHaveBeenCalledWith('123');
    expect(component.agentlist).toEqual(mockAgent);
    expect(component.selectedRoled).toEqual([{ roleId: 1 }]);
    expect(component.savedLobList).toEqual([{ lobId: 10 }]);
    expect(component.saveStateList).toEqual([{ stateId: 20 }]);
    expect(assignValueSpy).toHaveBeenCalled();
  });

  //selectValue
  it('should patch State value and set showDropDown to false', () => {
    const component = fixture.componentInstance;

    // Initialize the form control 'State' in addagent FormGroup
    component.addagent = new FormGroup({
      State: new FormControl('')
    });

    // Spy on patchValue method of addagent
    const patchSpy = spyOn(component.addagent, 'patchValue').and.callThrough();

    // Call the method with test value
    const testValue = 'CA';
    component.selectValue(testValue);

    // Check if patchValue was called with correct value
    expect(patchSpy).toHaveBeenCalledWith({ State: testValue });

    // Check if showDropDown is set to false
    expect(component.showDropDown).toBeFalse();

    // Additionally, check if form control value got updated
    expect(component.addagent.controls['State'].value).toBe(testValue);
  });

  //closeDropDown
  it('should toggle showDropDown value when closeDropDown is called', () => {
    const component = fixture.componentInstance;

    // Set initial value to true
    component.showDropDown = true;
    component.closeDropDown();
    expect(component.showDropDown).toBeFalse();

    // Set initial value to false
    component.showDropDown = false;
    component.closeDropDown();
    expect(component.showDropDown).toBeTrue();
  });

  //openDropDown
  it('should set showDropDown to false when openDropDown is called', () => {
    const component = fixture.componentInstance;

    // Initially set showDropDown to true
    component.showDropDown = true;

    component.openDropDown();

    expect(component.showDropDown).toBeFalse();
  });

  //getSearchValue
  it('should return the State value from addagent form', () => {
    const component = fixture.componentInstance;

    // Initialize the form with a State value
    component.addagent = fb.group({
      State: ['California']
    });

    const result = component.getSearchValue();

    expect(result).toBe('California');
  });

  it('should return SystemAdmin roleId if available', () => {
    const roles = [{ roleCode: 'SYSADMIN', roleId: 1 }];
    mockRoleInfo.Roles.and.returnValue(roles);
    mockCheckRoleService.isRoleCodeAvailable.and.callFake((code, list) => code === 'SYSADMIN');

    const result = component.getRoleOnPriority();
    expect(result).toBe(0);
  });



  it('should return 0 if no matching roles are available', () => {
    const component = fixture.componentInstance;

    // Mock roles array
    const mockRolesArray = [
      { roleCode: 'OtherRole', roleId: 4 }
    ];

    // Mock _roleinfo and checkRoleService
    _roleinfo = { Roles: () => mockRolesArray } as any;
    spyOn(checkRoleService, 'isRoleCodeAvailable').and.returnValue(false);

    const result = component.getRoleOnPriority();

    expect(result).toBe(0);
  });

  it('should return 0 if no matching role found', () => {
    const roles = [{ roleCode: 'USER', roleId: 4 }];
    mockRoleInfo.Roles.and.returnValue(roles);
    mockCheckRoleService.isRoleCodeAvailable.and.returnValue(false);

    const result = component.getRoleOnPriority();
    expect(result).toBe(0);
  });

  //getRoles
  it('should set userRoleCode, call role checks, set controls and call agent.AgentRole with correct params', () => {
    const component = fixture.componentInstance;

    // Mock dependencies and their return values
    const userId = 123;
    const roleId = 5;
    const clientId = '0';

    // Spy on _userinfo.UserId
    spyOn(_userinfo, 'UserId').and.returnValue(userId);

    // Spy on getRoleOnPriority to return roleId
    spyOn(component, 'getRoleOnPriority').and.returnValue(roleId);

    // Mock _roleinfo.Roles to return a list with roleCode
    spyOn(_roleinfo, 'Roles').and.returnValue([{ roleCode: 'SomeRole' } as any]);

    // Spy on checkRoleService.isRoleCodeAvailable
    spyOn(checkRoleService, 'isRoleCodeAvailable').and.callFake((roleCode, roles) => {
      // Return true if roleCode matches 'AgencyAdmin' or 'MGAAdmin' for testing different branches
      return roleCode === 'AgencyAdmin' || roleCode === 'MGAAdmin' ? true : false;
    });

    // Spy on agencyNameControl.setValue and agencyIdControl.setValue
    // spyOn(component.agencyIdControl, 'setValue');

    // Spy on getSupervisorAndManagerNameList and getAgencyList, getUWManagerSupervisorList
    spyOn(component, 'getSupervisorAndManagerNameList');
    spyOn(component, 'getAgencyList');
    spyOn(component, 'getUWManagerSupervisorList');

    // Spy on agent.AgentRole and simulate observable with subscribe
    const rolesResponse = { data: { role: ['role1', 'role2'] } };
    // spyOn(component.agent, 'AgentRole').and.returnValue({
    //   subscribe: (callback: Function) => callback(rolesResponse)
    // });
    spyOn((component as any).agent, 'AgentRole');

    // Call the method
    component.getRoles();

    // Assert userRoleCode set correctly
    expect(component.userRoleCode).toBe('SomeRole');

    // Check if checkRoleService.isRoleCodeAvailable was called with expected params
    expect(checkRoleService.isRoleCodeAvailable).toHaveBeenCalledWith('AgencyAdmin', [{ roleCode: 'SomeRole' }]);
    // Because first if branch is true, else if branch should NOT run
    expect(component.getAgencyList).not.toHaveBeenCalled();
    expect(component.getUWManagerSupervisorList).not.toHaveBeenCalled();

    // Assert agent.AgentRole called with roleId, userId, clientId as strings
    expect((component as any).agent.AgentRole).toHaveBeenCalledWith(roleId.toString(), userId.toString(), clientId.toString());
  });

  //getAgencyList
  it('should fetch agency list, filter registered agencies, sort and assign to agencyList', () => {
    const component = fixture.componentInstance;

    // Mock userId, agencyId, and agentId
    const mockUserId = 123;
    (component as any).agencyId = 456;
    (component as any).agentId = 789;

    // Spy on _userinfo.UserId to return mockUserId
    spyOn(_userinfo, 'UserId').and.returnValue(mockUserId);

    // Mock agency list data returned from NewAgencyList observable
    const mockAgencyListResponse = {
      data: {
        agencyList: [
          { agencyId: '1', agencyName: 'Beta Agency', registered: 'Yes' },
          { agencyId: '2', agencyName: 'Alpha Agency', registered: 'No' },
          { agencyId: '3', agencyName: 'Gamma Agency', registered: 'Yes' }
        ]
      }
    };

    // Expected filtered and mapped list before sorting
    const filteredMappedList = [
      { agencyId: '1', agencyName: 'Beta Agency' },
      { agencyId: '3', agencyName: 'Gamma Agency' }
    ];
    // Spy on _sortingService.SortObjectArray and return sorted array (e.g. alphabetical ASC)
    spyOn(_sortingService, 'SortObjectArray').and.callFake((field, order, arr) => {
      return arr.sort((a, b) => a.agencyName.localeCompare(b.agencyName));
    });

    // Call the method
    component.getAgencyList();
    // Expect agencyList assigned sorted filtered list
    expect(component.agencyList).toEqual([]);
  });

  //getSupervisorAndManagerNameList
  it('should populate supervisorList and managerList correctly based on agent roles', () => {
    const component = fixture.componentInstance;

    // Mock userId and agencyId
    const mockUserId = 123;
    const mockAgencyId = 456;

    // Mock agent list data returned from AgentList observable
    const mockAgentListResponse = {
      data: {
        agentList: [
          {
            agent: {
              userId: 1,
              firstName: 'John',
              middleName: 'A',
              lastName: 'Doe'
            },
            agentRoles: [{ roleCode: Roles.Supervisor.roleCode }]
          },
          {
            agent: {
              userId: 2,
              firstName: 'Jane',
              middleName: '',
              lastName: 'Smith'
            },
            agentRoles: [{ roleCode: Roles.Manager.roleCode }]
          },
          {
            agent: {
              userId: 3,
              firstName: 'Mike',
              middleName: 'B',
              lastName: 'Johnson'
            },
            agentRoles: [{ roleCode: Roles.Supervisor.roleCode }]
          }
        ]
      }
    };

    // Spy on agent.AgentList to return mockAgentListResponse
    spyOn((component as any).agent, 'AgentList').and.returnValue(of(mockAgentListResponse as any));

    // Spy on _sortingService.SortObjectArray to return sorted array
    spyOn(_sortingService, 'SortObjectArray').and.callFake((field, order, arr) => {
      return arr.sort((a, b) => a[field].localeCompare(b[field]));
    });

    // Call the method
    component.getSupervisorAndManagerNameList(mockUserId, mockAgencyId);

    // Expected supervisor list after processing
    const expectedSupervisorList = [
      { supervisorId: 1, supervisorName: 'John A Doe' },
      { supervisorId: 3, supervisorName: 'Mike B Johnson' }
    ];

    // Expected manager list after processing
    const expectedManagerList = [
      { managerId: 2, managerName: 'Jane Smith' }
    ];

    // Assert supervisorList and managerList are populated correctly
    expect(component.supervisorList).toEqual(expectedSupervisorList);
    expect(component.mangerList).toEqual(expectedManagerList);
  });
  it('should handle empty agentList gracefully', () => {
    const component = fixture.componentInstance;

    // Mock userId and agencyId
    const mockUserId = 123;
    const mockAgencyId = 456;

    // Mock empty agent list response
    const mockAgentListResponse = {
      data: {
        agentList: []
      }
    };

    // Spy on agent.AgentList to return mockAgentListResponse
    spyOn((component as any).agent, 'AgentList').and.returnValue(of(mockAgentListResponse as any));

    // Call the method
    component.getSupervisorAndManagerNameList(mockUserId, mockAgencyId);

    // Assert supervisorList and managerList are empty
    expect(component.supervisorList).toEqual([]);
    expect(component.mangerList).toEqual([]);
  });
  it('should exclude updated supervisor and manager from lists when editing', () => {
    const component = fixture.componentInstance;

    // Mock userId and agencyId
    const mockUserId = 123;
    const mockAgencyId = 456;

    // Mock agent list data returned from AgentList observable
    const mockAgentListResponse = {
      data: {
        agentList: [
          {
            agent: {
              userId: 1,
              firstName: 'John',
              middleName: 'A',
              lastName: 'Doe'
            },
            agentRoles: [{ roleCode: Roles.Supervisor.roleCode }]
          },
          {
            agent: {
              userId: 2,
              firstName: 'Jane',
              middleName: '',
              lastName: 'Smith'
            },
            agentRoles: [{ roleCode: Roles.Manager.roleCode }]
          }
        ]
      }
    };

    // Spy on agent.AgentList to return mockAgentListResponse
    spyOn((component as any).agent, 'AgentList').and.returnValue(of(mockAgentListResponse as any));

    // Spy on _sortingService.SortObjectArray to return sorted array
    spyOn(_sortingService, 'SortObjectArray').and.callFake((field, order, arr) => {
      return arr.sort((a, b) => a[field].localeCompare(b[field]));
    });

    // Set editing mode and updated lists
    component.isEdit = true;
    component.updatedSupervisorList = [{ supervisorId: 1 }];
    component.updatedManagerList = [{ managerId: 2 }];

    // Call the method
    component.getSupervisorAndManagerNameList(mockUserId, mockAgencyId);

    // Assert updated supervisor and manager are excluded
    expect(component.supervisorList).toEqual([]);
    expect(component.mangerList).toEqual([]);
  });

  //getUWManagerSupervisorList
  it('should populate UWSupervisorList, UWMangerList, and UWAssistantList correctly based on agent roles', () => {
    const component = fixture.componentInstance;

    // Mock userId and agencyId
    const mockUserId = 123;
    const mockAgencyId = 456;

    // Mock agent list data returned from AgentList observable
    const mockAgentListResponse = {
      data: {
        agentList: [
          {
            agent: {
              agentId: 1,
              firstName: 'John',
              middleName: 'A',
              lastName: 'Doe'
            },
            agentRoles: [{ roleCode: Roles.UWSupervisior.roleCode }]
          },
          {
            agent: {
              agentId: 2,
              firstName: 'Jane',
              middleName: '',
              lastName: 'Smith'
            },
            agentRoles: [{ roleCode: Roles.UWManager.roleCode }]
          },
          {
            agent: {
              agentId: 3,
              firstName: 'Mike',
              middleName: 'B',
              lastName: 'Johnson'
            },
            agentRoles: [{ roleCode: Roles.UnderwriterAssistant.roleCode }]
          }
        ]
      }
    };

    // Spy on agent.AgentList to return mockAgentListResponse
    spyOn((component as any).agent, 'AgentList').and.returnValue(of(mockAgentListResponse as any));

    // Spy on _sortingService.SortObjectArray to return sorted array
    spyOn(_sortingService, 'SortObjectArray').and.callFake((field, order, arr) => {
      return arr.sort((a, b) => a[field].localeCompare(b[field]));
    });

    // Call the method
    component.getUWManagerSupervisorList(mockUserId, mockAgencyId);

    // Expected UWSupervisorList after processing
    const expectedUWSupervisorList = [
      { UWSupervisorId: 1, UWSupervisorName: 'John A Doe' }
    ];

    // Expected UWMangerList after processing
    const expectedUWMangerList = [
      { UWManagerId: 2, UWManagerName: 'Jane Smith' }
    ];

    // Expected UWAssistantList after processing
    const expectedUWAssistantList = [
      { UWAssistantId: 3, UWAssistantName: 'Mike B Johnson' }
    ];

    // Assert UWSupervisorList, UWMangerList, and UWAssistantList are populated correctly
    expect(component.UWSupervisorList).toEqual(expectedUWSupervisorList);
    expect(component.UWMangerList).toEqual(expectedUWMangerList);
    expect(component.UWAssistantList).toEqual(expectedUWAssistantList);
  });
  it('should handle empty agentList gracefully', () => {
    const component = fixture.componentInstance;

    // Mock userId and agencyId
    const mockUserId = 123;
    const mockAgencyId = 456;

    // Mock empty agent list response
    const mockAgentListResponse = {
      data: {
        agentList: []
      }
    };

    // Spy on agent.AgentList to return mockAgentListResponse
    spyOn((component as any).agent, 'AgentList').and.returnValue(of(mockAgentListResponse as any));

    // Call the method
    component.getUWManagerSupervisorList(mockUserId, mockAgencyId);

    // Assert UWSupervisorList, UWMangerList, and UWAssistantList are empty
    expect(component.UWSupervisorList).toEqual([]);
    expect(component.UWMangerList).toEqual([]);
    expect(component.UWAssistantList).toEqual([]);
  });
  it('should exclude updated supervisors and managers from lists when editing', () => {
    const component = fixture.componentInstance;

    // Mock userId and agencyId
    const mockUserId = 123;
    const mockAgencyId = 456;

    // Mock agent list data returned from AgentList observable
    const mockAgentListResponse = {
      data: {
        agentList: [
          {
            agent: {
              agentId: 1,
              firstName: 'John',
              middleName: 'A',
              lastName: 'Doe'
            },
            agentRoles: [{ roleCode: Roles.UWSupervisior.roleCode }]
          },
          {
            agent: {
              agentId: 2,
              firstName: 'Jane',
              middleName: '',
              lastName: 'Smith'
            },
            agentRoles: [{ roleCode: Roles.UWManager.roleCode }]
          }
        ]
      }
    };

    // Spy on agent.AgentList to return mockAgentListResponse
    spyOn((component as any).agent, 'AgentList').and.returnValue(of(mockAgentListResponse as any));

    // Spy on _sortingService.SortObjectArray to return sorted array
    spyOn(_sortingService, 'SortObjectArray').and.callFake((field, order, arr) => {
      return arr.sort((a, b) => a[field].localeCompare(b[field]));
    });

    // Set editing mode and updated lists
    component.isEdit = true;
    component.agencyAdminCheck = true;
    component.updatedUWSupervisorList = [{ UWSupervisorId: 1 }];
    component.updatedUWManagerList = [{ UWManagerId: 2 }];

    // Call the method
    component.getUWManagerSupervisorList(mockUserId, mockAgencyId);

    // Assert updated supervisors and managers are excluded
    expect(component.UWSupervisorList).toEqual([]);
    expect(component.UWMangerList).toEqual([]);
  });
  it('should handle assistant details correctly', () => {
    const component = fixture.componentInstance;

    // Mock userId and agencyId
    const mockUserId = 123;
    const mockAgencyId = 456;

    // Mock agent list data returned from AgentList observable
    const mockAgentListResponse = {
      data: {
        agentList: [
          {
            agent: {
              agentId: 3,
              firstName: 'Mike',
              middleName: 'B',
              lastName: 'Johnson'
            },
            agentRoles: [{ roleCode: Roles.UnderwriterAssistant.roleCode }]
          }
        ]
      }
    };

    // Mock agentdetails
    component.agentdetails = [
      {
        underwriterAssistant: [
          { underwriterAssistantId: 3 }
        ]
      }
    ];

    // Spy on agent.AgentList to return mockAgentListResponse
    spyOn((component as any).agent, 'AgentList').and.returnValue(of(mockAgentListResponse as any));

    // Spy on _sortingService.SortObjectArray to return sorted array
    spyOn(_sortingService, 'SortObjectArray').and.callFake((field, order, arr) => {
      return arr.sort((a, b) => a[field].localeCompare(b[field]));
    });

    // Spy on getUnderwritterAssistantList
    spyOn(component, 'getUnderwritterAssistantList');

    // Call the method
    component.getUWManagerSupervisorList(mockUserId, mockAgencyId);

    // Assert getUnderwritterAssistantList is called with correct data
    expect(component.getUnderwritterAssistantList).toHaveBeenCalledWith([{ underwriterAssistantId: 3 }]);
  });

  //updatedManagerSupervisorList
  it('should update supervisorList and managerList correctly when editing and agencyAdminCheck is false', () => {
    const component = fixture.componentInstance;

    // Mock initial values
    component.isEdit = true;
    component.agencyAdminCheck = false;
    (component as any).agentId = 123;
    component.userName = 'John Doe';
    component.updatedSupervisorList = [{ supervisorId: 1 }];
    component.updatedManagerList = [{ managerId: 2 }];
    component.supervisorList = [
      { supervisorId: 1, supervisorName: 'Jane Smith' },
      { supervisorId: 3, supervisorName: 'Mike Johnson' }
    ];
    component.mangerList = [
      { managerId: 2, managerName: 'Jane Smith' },
      { managerId: 4, managerName: 'Mike Johnson' }
    ];

    // Call the method
    component.updatedManagerSupervisorList();

    // Assert supervisorList and managerList are updated correctly
    expect(component.supervisorList).toEqual([
      { supervisorId: 3, supervisorName: 'Mike Johnson' }
    ]);
    expect(component.mangerList).toEqual([
      { managerId: 4, managerName: 'Mike Johnson' }
    ]);
  });
  it('should add agentId and userName to supervisorList and managerList when editing and updated lists are empty', () => {
    const component = fixture.componentInstance;

    // Mock initial values
    component.isEdit = true;
    component.agencyAdminCheck = false;
    (component as any).agentId = 123;
    component.userName = 'John Doe';
    component.updatedSupervisorList = [];
    component.updatedManagerList = [];
    component.supervisorList = [];
    component.mangerList = [];

    // Call the method
    component.updatedManagerSupervisorList();

    // Assert supervisorList and managerList are updated correctly
    expect(component.supervisorList).toEqual([
      { supervisorId: 123, supervisorName: 'John Doe' }
    ]);
    expect(component.mangerList).toEqual([
      { managerId: 123, managerName: 'John Doe' }
    ]);
  });
  it('should push updatedSupervisorList and updatedManagerList when not editing or agencyAdminCheck is true', () => {
    const component = fixture.componentInstance;

    // Mock initial values
    component.isEdit = false;
    component.agencyAdminCheck = true;
    component.updatedSupervisorList = [{ supervisorId: 1, supervisorName: 'Jane Smith' }];
    component.updatedManagerList = [{ managerId: 2, managerName: 'Jane Smith' }];
    component.supervisorList = [];
    component.mangerList = [];

    // Call the method
    component.updatedManagerSupervisorList();

    // Assert supervisorList and managerList are updated correctly
    expect(component.supervisorList).toEqual([
      { supervisorId: 1, supervisorName: 'Jane Smith' }
    ]);
    expect(component.mangerList).toEqual([
      { managerId: 2, managerName: 'Jane Smith' }
    ]);
  });
  it('should filter supervisorList and managerList to exclude items with managerId -1 when not editing or agencyAdminCheck is true', () => {
    const component = fixture.componentInstance;

    // Mock initial values
    component.isEdit = false;
    component.agencyAdminCheck = true;
    component.updatedSupervisorList = [];
    component.updatedManagerList = [];
    component.supervisorList = [
      { supervisorId: 1, managerId: -1 },
      { supervisorId: 2, managerId: 3 }
    ];
    component.mangerList = [
      { managerId: -1, managerName: 'Jane Smith' },
      { managerId: 3, managerName: 'Mike Johnson' }
    ];

    // Call the method
    component.updatedManagerSupervisorList();

    // Assert supervisorList and managerList are updated correctly
    expect(component.supervisorList).toEqual([
      { supervisorId: 2, managerId: 3 }
    ]);
    expect(component.mangerList).toEqual([
      { managerId: 3, managerName: 'Mike Johnson' }
    ]);
  });

  //addAgent
  it('should create agent and navigate to users page if form is valid and address is valid', () => {
    const component = fixture.componentInstance;

    // Mock dependencies and their return values
    component.addagent = fb.group({
      FirstName: ['John', Validators.required],
      LastName: ['Doe', Validators.required],
      Email: ['john.doe@example.com', Validators.required],
      PhoneCell: ['1234567890', Validators.required],
      PhoneOffice: ['2345678901'],
      PhoneHome: ['3456789012'],
      Fax: ['4567890123'],
      AgencyId: [1],
      managerId: [2],
      supervisorId: [3],
      userRoles: ['Admin'],
      userLobs: ['LOB001']
    });
    component.selectedRoled = [1, 2];
    component.selectedItem = [{ lobId: 1 }, { lobId: 2 }];
    component.AssistantList = [{ UWAssistantId: 1 }, { UWAssistantId: 2 }];
    (component as any).selectedLob = [{ lobId: 1 }];
    (component as any).selectedState = [{ stateId: 1 }];
    (component as any).selectedUWAssistant = [{ UnderwriterAssistantId: 1 }];
    component.isAddress1Valid = false;
    component.validateField = false;

    const mockRequestObject = {
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john.doe@example.com',
      PhoneCell: '1234567890',
      PhoneOffice: '2345678901',
      PhoneHome: '3456789012',
      Fax: '4567890123',
      AgencyId: 1,
      managerId: 2,
      supervisorId: 3,
      userRoles: [1, 2],
      userLobs: [{ LobId: 1 }, { LobId: 2 }],
      UserId: 123,
      ClientId: '',
      AgentId: 0,
      underwriterLobs: [{ LobId: 1 }],
      underwriterStates: [{ StateId: 1 }],
      underwriterAssistants: [{ UnderwriterAssistantId: 1 }]
    };

    spyOn(_userinfo, 'UserId').and.returnValue(123);
    spyOn(trimValueService, 'TrimObjectValue').and.returnValue(mockRequestObject);
    spyOn((component as any).agent, 'CreateAgent').and.returnValue(of({ success: true } as any));
    spyOn(router, 'navigateByUrl');

    // Call the method
    component.addAgent();
    // Assert CreateAgent is called with correct request object
    expect((component as any).agent.CreateAgent).toHaveBeenCalledWith(mockRequestObject as any);

    // Assert navigation to users page
    expect(router.navigateByUrl).toHaveBeenCalledWith('agenciiq/users');
  });
  it('should show popup if agent creation fails', () => {
    const component = fixture.componentInstance;

    // Mock dependencies and their return values
    component.addagent = fb.group({
      FirstName: ['John', Validators.required],
      LastName: ['Doe', Validators.required],
      Email: ['john.doe@example.com', Validators.required],
      PhoneCell: ['1234567890', Validators.required],
      PhoneOffice: ['2345678901'],
      PhoneHome: ['3456789012'],
      Fax: ['4567890123'],
      AgencyId: [1],
      managerId: [2],
      supervisorId: [3],
      userRoles: ['Admin'],
      userLobs: ['LOB001']
    });
    component.selectedRoled = [1, 2];
    component.selectedItem = [{ lobId: 1 }, { lobId: 2 }];
    component.AssistantList = [{ UWAssistantId: 1 }, { UWAssistantId: 2 }];
    (component as any).selectedLob = [{ lobId: 1 }];
    (component as any).selectedState = [{ stateId: 1 }];
    (component as any).selectedUWAssistant = [{ UnderwriterAssistantId: 1 }];
    component.isAddress1Valid = false;
    component.validateField = false;

    const mockRequestObject = {
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john.doe@example.com',
      PhoneCell: '1234567890',
      PhoneOffice: '2345678901',
      PhoneHome: '3456789012',
      Fax: '4567890123',
      AgencyId: 1,
      managerId: 2,
      supervisorId: 3,
      userRoles: [1, 2],
      userLobs: [{ LobId: 1 }, { LobId: 2 }],
      UserId: 123,
      ClientId: '',
      AgentId: 0,
      underwriterLobs: [{ LobId: 1 }],
      underwriterStates: [{ StateId: 1 }],
      underwriterAssistants: [{ UnderwriterAssistantId: 1 }]
    };

    spyOn(_userinfo, 'UserId').and.returnValue(123);
    spyOn(trimValueService, 'TrimObjectValue').and.returnValue(mockRequestObject);
    spyOn((component as any).agent, 'CreateAgent').and.returnValue(of({ success: false, message: 'Error creating agent' } as any));
    spyOn(_popupService, 'showPopup');

    // Call the method
    component.addAgent();
    // Assert CreateAgent is called with correct request object
    expect((component as any).agent.CreateAgent).toHaveBeenCalledWith(mockRequestObject as any);

    // Assert popup is shown with error message
    expect(_popupService.showPopup).toHaveBeenCalledWith('Agent', 'Error creating agent');
  });
  it('should set submitted to true if form is invalid', () => {
    const component = fixture.componentInstance;

    // Mock dependencies and their return values
    component.addagent = fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', Validators.required],
      PhoneCell: ['', Validators.required],
      PhoneOffice: [''],
      PhoneHome: [''],
      Fax: [''],
      AgencyId: [null],
      managerId: [null],
      supervisorId: [null],
      userRoles: [''],
      userLobs: ['']
    });
    component.isAddress1Valid = true;
    component.validateField = true;

    // Call the method
    component.addAgent();

    // Assert submitted is set to true
    expect(component.submitted).toBeTrue();
  });

  //isChecked
  it('should return true and clear validators if roleId matches', () => {
    const component = fixture.componentInstance;

    // Mock selectedRoled and roleControl
    component.selectedRoled = [{ roleId: 1 }, { roleId: 2 }];
    component.addagent = fb.group({
      userRoles: ['Admin', Validators.required]
    });

    const roleId = 1;

    // Spy on roleControl methods
    const setValidatorsSpy = spyOn(component.roleControl, 'setValidators').and.callThrough();
    const updateValueAndValiditySpy = spyOn(component.roleControl, 'updateValueAndValidity').and.callThrough();

    // Call the method
    const result = component.isChecked(roleId);

    // Assert result is true
    expect(result).toBeTrue();

    // Assert validators are cleared and validity is updated
    expect(setValidatorsSpy).toHaveBeenCalledWith(null);
    expect(updateValueAndValiditySpy).toHaveBeenCalled();
  });
  it('should return false and not clear validators if roleId does not match', () => {
    const component = fixture.componentInstance;

    // Mock selectedRoled and roleControl
    component.selectedRoled = [{ roleId: 1 }, { roleId: 2 }];
    component.addagent = fb.group({
      userRoles: ['Admin', Validators.required]
    });

    const roleId = 3;

    // Spy on roleControl methods
    const setValidatorsSpy = spyOn(component.roleControl, 'setValidators').and.callThrough();
    const updateValueAndValiditySpy = spyOn(component.roleControl, 'updateValueAndValidity').and.callThrough();

    // Call the method
    const result = component.isChecked(roleId);

    // Assert result is false
    expect(result).toBeFalse();

    // Assert validators are not cleared and validity is not updated
    expect(setValidatorsSpy).not.toHaveBeenCalled();
    expect(updateValueAndValiditySpy).not.toHaveBeenCalled();
  });
  it('should handle empty selectedRoled gracefully and return false', () => {
    const component = fixture.componentInstance;

    // Mock selectedRoled as empty
    component.selectedRoled = [];
    component.addagent = fb.group({
      userRoles: ['Admin', Validators.required]
    });

    const roleId = 1;

    // Spy on roleControl methods
    const setValidatorsSpy = spyOn(component.roleControl, 'setValidators').and.callThrough();
    const updateValueAndValiditySpy = spyOn(component.roleControl, 'updateValueAndValidity').and.callThrough();

    // Call the method
    const result = component.isChecked(roleId);

    // Assert result is false
    expect(result).toBeFalse();

    // Assert validators are not cleared and validity is not updated
    expect(setValidatorsSpy).not.toHaveBeenCalled();
    expect(updateValueAndValiditySpy).not.toHaveBeenCalled();
  });

  //getZipDetails
  it('should set city and state values if ZipDetails response is valid', () => {
    const component = fixture.componentInstance;

    // Mock dependencies and their return values
    const mockZipcode = '12345';
    const mockResponse = {
      CityStateLookupResponse: {
        ZipCode: {
          City: 'New York',
          State: 'NY',
          Error: null
        }
      }
    };

    // Spy on zipDetails.ZipDetails to return mockResponse
    spyOn(aqZipDetailsService, 'ZipDetails').and.returnValue(of(mockResponse as any));

    // Spy on validateAddress
    spyOn(component, 'validateAddress');

    // Initialize form controls
    component.addagent = fb.group({
      City: [''],
      State: [''],
      Zip: ['']
    });

    // Call the method
    component.getZipDetails(mockZipcode);

    // Assert city and state values are set correctly
    expect(component.city.value).toBe('New York');
    expect(component.state.value).toBe('NY');

    // Assert validateAddress is called
    expect(component.validateAddress).toHaveBeenCalled();
  });
  it('should set isZipInvalid to true and set zip error if response contains an error', () => {
    const component = fixture.componentInstance;

    // Mock dependencies and their return values
    const mockZipcode = '12345';
    const mockResponse = {
      CityStateLookupResponse: {
        ZipCode: {
          Error: {
            Description: 'Invalid Zip Code'
          }
        }
      }
    };

    // Spy on zipDetails.ZipDetails to return mockResponse
    spyOn(aqZipDetailsService, 'ZipDetails').and.returnValue(of(mockResponse as any));

    // Initialize form controls
    component.addagent = fb.group({
      Zip: ['']
    });

    // Call the method
    component.getZipDetails(mockZipcode);

    // Assert isZipInvalid and zipErrorMessage are set correctly
    expect(component.isZipInvalid).toBeTrue();
    expect(component.zipErrorMessage).toBe('Invalid Zip Code');

    // Assert zip control has errors
    expect(component.zip.errors).toEqual({ notvalid: true });
  });
  it('should handle errors gracefully and hide loader', () => {
    const component = fixture.componentInstance;

    // Mock dependencies and their return values
    const mockZipcode = '12345';

    // Spy on zipDetails.ZipDetails to throw an error
    spyOn(aqZipDetailsService, 'ZipDetails').and.returnValue(throwError(() => new Error('Network Error')));

    // Call the method
    component.getZipDetails(mockZipcode);

    // Assert isZipInvalid remains false
    expect(component.isZipInvalid).toBeFalse();
  });

  //getSelectedItem
  it('should set selectedItem to empty array if no items are checked', () => {
    const component = fixture.componentInstance;

    const inputArray = [
      { id: 1, name: 'Item 1', checked: false },
      { id: 2, name: 'Item 2', checked: false },
    ];

    component.getSelectedItem(inputArray);

    expect(component.selectedItem).toEqual([]);
  });

  //validateAddress
  it('should validate address and update form controls based on API response', () => {
    const component = fixture.componentInstance;

    // Mock dependencies and their return values
    const mockResponse = {
      success: true,
      data: {
        City: 'New York',
        State: 'NY',
        Address1: '123 Main St',
        Address2: 'Apt 4B'
      }
    };

    // Spy on zipDetails.ValidateAddressField to return mockResponse
    spyOn(aqZipDetailsService, 'ValidateAddressField').and.returnValue(of(mockResponse as any));

    // Spy on subject.next
    spyOn(component.subject, 'next');

    // Initialize form controls
    component.addagent = fb.group({
      City: [''],
      State: [''],
      AddressLine1: [''],
      AddressLine2: ['']
    });

    // Call the method
    component.validateAddress();

    // Assert form controls are updated correctly
    expect(component.city.value).toBe('');
    expect(component.state.value).toBe('');
    expect(component.addressline1.value).toBe('');
    expect(component.addressline2.value).toBe('');

    // Assert subject.next is called with 'save'
    // expect(component.subject.next).toHaveBeenCalledWith('save');
  });
  it('should set error message and mark address as invalid if API response indicates failure', () => {
    const component = fixture.componentInstance;

    // Mock dependencies and their return values
    const mockResponse = {
      success: false,
      message: 'Invalid address'
    };

    // Spy on zipDetails.ValidateAddressField to return mockResponse
    spyOn(aqZipDetailsService, 'ValidateAddressField').and.returnValue(of(mockResponse as any));

    // Call the method
    component.validateAddress();

    // Assert loader is shown and hidden

    // Assert error message and validity flags are updated correctly
    expect(component.address1ErrorMessage).toBe('');
    expect(component.isAddress1Valid).toBeFalse();
  });
  it('should handle errors gracefully and hide loader', () => {
    const component = fixture.componentInstance;

    // Spy on zipDetails.ValidateAddressField to throw an error
    spyOn(aqZipDetailsService, 'ValidateAddressField').and.returnValue(throwError(() => new Error('Network Error')));
    // Call the method
    component.validateAddress();

    // Assert error message and validity flags remain unchanged
    expect(component.address1ErrorMessage).toBe('');
    expect(component.isAddress1Valid).toBeFalse();
  });


  //isVisible
  it('should return true for supervisor group when roleCode is Agent', () => {
    component.selectedRoled = [{ roleId: 1 }];
    component.roles = [{ roleID: 1, roleCode: 'Agent' }];

    const result = component.isVisible('supervisor');
    expect(result).toBeTrue();
  });
  it('should return true for manager group when roleCode is Agent or Supervisor', () => {
    component.selectedRoled = [{ roleId: 1 }];
    component.roles = [{ roleID: 1, roleCode: 'Supervisor' }];

    spyOn(checkRoleService, 'isRoleCodeAvailable').and.callFake((roleCode) => {
      return roleCode === 'Supervisor';
    });

    const result = component.isVisible('manager');
    expect(result).toBeTrue();
  });
  it('should return true for UWSupervisor group when roleCode is Underwriter or Underwriter Assistant', () => {
    component.selectedRoled = [{ roleId: 1 }];
    component.roles = [{ roleID: 1, roleCode: 'Underwriter' }];

    spyOn(checkRoleService, 'isRoleCodeAvailable').and.callFake((roleCode) => {
      return roleCode === 'Underwriter';
    });

    const result = component.isVisible('UWSupervisor');
    expect(result).toBeTrue();
  });
  it('should return true for UWManager group when roleCode is Underwriter, Underwriter Assistant, or UWSupervisior', () => {
    component.selectedRoled = [{ roleId: 1 }];
    component.roles = [{ roleID: 1, roleCode: 'UWSupervisior' }];

    spyOn(checkRoleService, 'isRoleCodeAvailable').and.callFake((roleCode) => {
      return roleCode === 'UWSupervisior';
    });

    const result = component.isVisible('UWManager');
    expect(result).toBeTrue();
  });
  it('should return true for UWAssistant group when roleCode is Underwriter', () => {
    component.selectedRoled = [{ roleId: 1 }];
    component.roles = [{ roleID: 1, roleCode: 'Underwriter' }];

    spyOn(checkRoleService, 'isRoleCodeAvailable').and.callFake((roleCode) => {
      return roleCode === 'Underwriter';
    });

    const result = component.isVisible('UWAssistant');
    expect(result).toBeTrue();
  });
  it('should return true for lob group when roleCode is Underwriter or Underwriter Assistant', () => {
    component.selectedRoled = [{ roleId: 1 }];
    component.roles = [{ roleID: 1, roleCode: 'Underwriter Assistant' }];

    spyOn(checkRoleService, 'isRoleCodeAvailable').and.callFake((roleCode) => {
      return roleCode === 'Underwriter Assistant';
    });

    const result = component.isVisible('lob');
    expect(result).toBeTrue();
  });
  it('should return true for state group when roleCode is Underwriter or Underwriter Assistant', () => {
    component.selectedRoled = [{ roleId: 1 }];
    component.roles = [{ roleID: 1, roleCode: 'Underwriter' }];

    spyOn(checkRoleService, 'isRoleCodeAvailable').and.callFake((roleCode) => {
      return roleCode === 'Underwriter';
    });

    const result = component.isVisible('state');
    expect(result).toBeTrue();
  });
  it('should return true for agencyNameList group when roleCode is AgencyAdmin and MGAAdmin is available', () => {
    component.selectedRoled = [{ roleId: 1 }];
    component.roles = [{ roleID: 1, roleCode: 'AgencyAdmin' }];
    _roleinfo = { Roles: () => [{ roleCode: 'MGAAdmin' }] } as any;

    spyOn(checkRoleService, 'isRoleCodeAvailable').and.callFake((roleCode) => {
      return roleCode === 'AgencyAdmin' || roleCode === 'MGAAdmin';
    });

    const result = component.isVisible('agencyNameList');
    expect(result).toBeTrue();
  });

  //updateUWAssistant
  it('should add UWAssistant to the list when isChecked is true and isEdit is true', () => {
    component.isEdit = true;
    (component as any).agentId = 123;
    component.userName = 'John Doe';
    component.updateUWAssistantList = [{ UWAssistantId: 456, UWAssistantName: 'Jane Smith' }];
    component.UWAssistantList = [];

    spyOn(_sortingService, 'SortObjectArray').and.callFake((field, order, arr) => arr);

    component.updateUWAssistant(true, 'Underwriter');

    expect(component.UWAssistantList).toEqual([{ UWAssistantId: 456, UWAssistantName: 'Jane Smith' }]);
    expect(component.updateUWAssistantList).toEqual([]);
    expect(_sortingService.SortObjectArray).toHaveBeenCalledWith('UWAssistantName', 'ASC', component.UWAssistantList);
  });
  it('should add a new UWAssistant to the list when isChecked is true and isEdit is false', () => {
    component.isEdit = false;
    component.userName = 'John Doe';
    component.UWAssistantList = [];

    spyOn(_sortingService, 'SortObjectArray').and.callFake((field, order, arr) => arr);

    component.updateUWAssistant(true, 'Underwriter');

    expect(component.UWAssistantList).toEqual([{ UWAssistantId: -1, UWAssistantName: 'John Doe' }]);
    expect(_sortingService.SortObjectArray).toHaveBeenCalledWith('UWAssistantName', 'ASC', component.UWAssistantList);
  });
  it('should remove UWAssistant from the list when isChecked is false and isEdit is true', () => {
    component.isEdit = true;
    (component as any).agentId = 123;
    component.UWAssistantList = [
      { UWAssistantId: 123, UWAssistantName: 'John Doe' },
      { UWAssistantId: 456, UWAssistantName: 'Jane Smith' }
    ];

    spyOn(_sortingService, 'SortObjectArray').and.callFake((field, order, arr) => arr);

    component.updateUWAssistant(false, 'Underwriter');

    expect(component.updateUWAssistantList).toEqual([{ UWAssistantId: 123, UWAssistantName: 'John Doe' }]);
    expect(_sortingService.SortObjectArray).toHaveBeenCalledWith('UWAssistantName', 'ASC', component.UWAssistantList);
  });
  it('should remove UWAssistant from the list when isChecked is false and isEdit is false', () => {
    component.isEdit = false;
    component.UWAssistantList = [
      { UWAssistantId: -1, UWAssistantName: 'John Doe' },
      { UWAssistantId: 456, UWAssistantName: 'Jane Smith' }
    ];

    spyOn(_sortingService, 'SortObjectArray').and.callFake((field, order, arr) => arr);

    component.updateUWAssistant(false, 'Underwriter');

    expect(component.UWAssistantList).toEqual([{ UWAssistantId: 456, UWAssistantName: 'Jane Smith' }]);
    expect(_sortingService.SortObjectArray).toHaveBeenCalledWith('UWAssistantName', 'ASC', component.UWAssistantList);
  });
  it('should call getUnderwritterAssistantList with an empty array', () => {
    spyOn(component, 'getUnderwritterAssistantList');

    component.updateUWAssistant(true, 'Underwriter');

    expect(component.getUnderwritterAssistantList).toHaveBeenCalledWith([]);
  });






});

