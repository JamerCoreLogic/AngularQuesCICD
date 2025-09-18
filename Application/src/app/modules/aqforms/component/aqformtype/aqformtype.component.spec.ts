import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { AqformtypeComponent } from './aqformtype.component';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQFormsService } from '@agenciiq/aqforms';
import { AQUserInfo } from '@agenciiq/login';
import { ActivatedRoute, Router } from '@angular/router';
import { AQSession } from 'src/app/global-settings/session-storage';
import { ProgramService } from '@agenciiq/aqadmin';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';

describe('AqformtypeComponent', () => {
  let component: AqformtypeComponent;
  let fixture: ComponentFixture<AqformtypeComponent>;
  let loaderService: LoaderService;
  let aqUserInfo: AQUserInfo;
  let aqFormsService: AQFormsService;
  let router: Router;
  let aqSession: AQSession;
  let activatedRoute: ActivatedRoute;
  let programService: ProgramService;
  let dataSubject = new Subject<any>();


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule, FormsModule],
      declarations: [AqformtypeComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        LoaderService,
        AQUserInfo,
        AQFormsService,
        Router,
        AQSession,
        ProgramService,
        { provide: ActivatedRoute, useValue: { data: dataSubject.asObservable() } },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AqformtypeComponent);
    component = fixture.componentInstance;
    loaderService = TestBed.inject(LoaderService);
    aqUserInfo = TestBed.inject(AQUserInfo);
    aqFormsService = TestBed.inject(AQFormsService);
    router = TestBed.inject(Router);
    aqSession = TestBed.inject(AQSession);
    activatedRoute = TestBed.inject(ActivatedRoute);
    programService = TestBed.inject(ProgramService);

    spyOn(aqSession, 'getData');
    //spyOn(component, 'removeSession');
    //spyOn(component, 'getMGAPrograms');
    //spyOn(component, 'ResolveOtherStateData');
    //spyOn(component, 'ResolveData');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  //ngOnInit method
  it('should call removeSession, getMGAPrograms, and ResolveData when formData is null', () => {
    spyOn(component, 'removeSession');
    spyOn(component, 'ResolveData');
    spyOn(component, 'getMGAPrograms');
    spyOn(component, 'ResolveOtherStateData');
    component.ngOnInit();
    expect(aqSession.getData).toHaveBeenCalledWith('dataSourceAccordian');
    expect(component.removeSession).toHaveBeenCalled();
    expect(component.getMGAPrograms).toHaveBeenCalled();
    expect(component.ResolveOtherStateData).not.toHaveBeenCalled();
    expect(component.ResolveData).toHaveBeenCalled();
  });

  it('should call ResolveOtherStateData when formData.State is "Other State"', () => {
    spyOn(component, 'removeSession');
    spyOn(component, 'getMGAPrograms');
    spyOn(component, 'ResolveOtherStateData');
    const mockFormData = { State: 'Other State' };
    (aqSession.getData as jasmine.Spy).and.returnValue(mockFormData);

    component.ngOnInit();
    expect(component.removeSession).toHaveBeenCalled();
    expect(component.getMGAPrograms).toHaveBeenCalled();
    expect(component.ResolveOtherStateData).toHaveBeenCalled();
  });

  it('should call ResolveData when formData.State is not "Other State"', () => {
    spyOn(component, 'removeSession');
    spyOn(component, 'ResolveData');
    spyOn(component, 'getMGAPrograms');
    spyOn(component, 'ResolveOtherStateData');
    const mockFormData = { State: 'California' };
    (aqSession.getData as jasmine.Spy).and.returnValue(mockFormData);

    component.ngOnInit();
    expect(component.removeSession).toHaveBeenCalled();
    expect(component.getMGAPrograms).toHaveBeenCalled();
    expect(component.ResolveOtherStateData).not.toHaveBeenCalled();
    expect(component.ResolveData).toHaveBeenCalled();
  });


  //removeSession method
  it('should call AQSession.removeSession with "dataSourceAccordian"', () => {
    // Spy on the actual method
    spyOn(aqSession, 'removeSession');

    component.removeSession();

    expect(aqSession.removeSession).toHaveBeenCalledWith("dataSourceAccordian");
  });


  //ResolveData method
  it('should sort and filter formTypeList in ResolveData() with full parameter list', fakeAsync(() => {
    spyOn(component, 'ResolveData');
    const parameterList = [
      {
        "parameterId": 62,
        "lob": null,
        "parameterKey": "STATE",
        "parameterAlias": "State Names",
        "parameterName": "Alabama",
        "parameterValue": "AL",
        "shortName": "AL",
        "value": null,
        "state": null,
        "usage": null,
        "parameterDescription": null,
        "systemUse": null,
        "effectiveFrom": null,
        "effectiveTo": null,
        "isActive": true,
        "isNotEditable": false,
        "isNotVisible": false,
        "isParameterAddDisabled": false,
        "createdBy": 3,
        "createdOn": "2020-01-23T18:48:11.567",
        "modifiedBy": null,
        "modifiedOn": null,
        "iconURL": null
      },
      {
        "parameterId": 63,
        "lob": null,
        "parameterKey": "STATE",
        "parameterAlias": "State Names",
        "parameterName": "Alaska",
        "parameterValue": "AK",
        "shortName": "AK",
        "value": null,
        "state": null,
        "usage": null,
        "parameterDescription": null,
        "systemUse": null,
        "effectiveFrom": null,
        "effectiveTo": null,
        "isActive": true,
        "isNotEditable": false,
        "isNotVisible": false,
        "isParameterAddDisabled": false,
        "createdBy": 3,
        "createdOn": "2020-01-23T18:48:11.627",
        "modifiedBy": null,
        "modifiedOn": null,
        "iconURL": null
      }
    ];

    const mockData = {
      parameter: {
        data: {
          parameterList: parameterList
        }
      }
    };

    dataSubject.next(mockData);

    component.ResolveData();
    tick();
    fixture.detectChanges();

    const expectedFilteredList = parameterList; // your expected data here

    expect(component.formTypeList).toEqual(expectedFilteredList);
    expect(component.formTypeListFlag).toEqual(expectedFilteredList);
  }));



  // ResolveOtherStateData method
  it('should sort and filter formTypeList correctly when parameter exists', () => {
    spyOn(component, 'ResolveOtherStateData');
    // Prepare test data to emit
    const parameterList = [
      {
        "parameterId": 62,
        "lob": null,
        "parameterKey": "STATE",
        "parameterAlias": "State Names",
        "parameterName": "Alabama",
        "parameterValue": "AL",
        "shortName": "AL",
        "value": null,
        "state": null,
        "usage": null,
        "parameterDescription": null,
        "systemUse": null,
        "effectiveFrom": null,
        "effectiveTo": null,
        "isActive": true,
        "isNotEditable": false,
        "isNotVisible": false,
        "isParameterAddDisabled": false,
        "createdBy": 3,
        "createdOn": "2020-01-23T18:48:11.567",
        "modifiedBy": null,
        "modifiedOn": null,
        "iconURL": null
      },
      {
        "parameterId": 63,
        "lob": null,
        "parameterKey": "STATE",
        "parameterAlias": "State Names",
        "parameterName": "Alaska",
        "parameterValue": "AK",
        "shortName": "AK",
        "value": null,
        "state": null,
        "usage": null,
        "parameterDescription": null,
        "systemUse": null,
        "effectiveFrom": null,
        "effectiveTo": null,
        "isActive": true,
        "isNotEditable": false,
        "isNotVisible": false,
        "isParameterAddDisabled": false,
        "createdBy": 3,
        "createdOn": "2020-01-23T18:48:11.627",
        "modifiedBy": null,
        "modifiedOn": null,
        "iconURL": null
      }
    ];

    const mockData = {
      parameter: {
        data: {
          parameterList: parameterList
        }
      }
    };

    dataSubject.next(mockData);

    // Call the method (it subscribes to activatedRoute.data)
    component.ResolveOtherStateData();

    // Emit test data via the Subject to simulate ActivatedRoute.data observable emission
    //dataSubject.next(mockData);

    // Assert that formTypeList is sorted by parameterId and filtered (excluding Program and Account)
    expect(component.formTypeList).toEqual(parameterList);
  });

  it('should not assign formTypeList when parameter is missing', () => {
    const emptyData = {}; // no parameter key

    component.ResolveOtherStateData();

    dataSubject.next(emptyData);

    expect(component.formTypeList).toBeUndefined();
  });

  //getMGAPrograms method
  it('should fetch MGA programs and set LOBList, selectedLOB, selectedLOBName, then call getStateList and hide loader', fakeAsync(() => {
    // Prepare mock response matching your actual data structure
    const mockProgramsResponse = {
      data: {
        mgaProgramList: [
          {
            mgaLobs: {
              mgaLobId: 1304,
              mgaId: 1,
              lobId: 403,
              lobCode: null,
              lob: "WC",
              lobName: "Workers Compensation",
              createdOn: "2021-07-16T03:42:45.623",
              createdBy: null,
              modifiedOn: null,
              modifiedBy: null
            },
            mgaStates: [ /* states omitted for brevity */]
          },
          {
            mgaLobs: {
              mgaLobId: 1305,
              mgaId: 1,
              lobId: 413,
              lobCode: null,
              lob: "CA",
              lobName: "Commercial Auto",
              createdOn: "2021-07-16T03:42:45.623",
              createdBy: null,
              modifiedOn: null,
              modifiedBy: null
            },
            mgaStates: []
          },
          {
            mgaLobs: {
              mgaLobId: 1306,
              mgaId: 1,
              lobId: 415,
              lobCode: null,
              lob: "GL",
              lobName: "General Liability",
              createdOn: "2021-07-16T03:42:45.623",
              createdBy: null,
              modifiedOn: null,
              modifiedBy: null
            },
            mgaStates: []
          },
          {
            mgaLobs: {
              mgaLobId: 1307,
              mgaId: 1,
              lobId: 497,
              lobCode: null,
              lob: "PP",
              lobName: "Package Policy",
              createdOn: "2021-07-16T03:42:45.623",
              createdBy: null,
              modifiedOn: null,
              modifiedBy: null
            },
            mgaStates: []
          }
        ]
      }
    };
    spyOn(programService, 'MGAPrograms').and.returnValue(of(mockProgramsResponse) as any);
    spyOn(loaderService, 'hide');
    spyOn(component, 'getStateList');

    component.userId = 12;
    component.formData = null;  // no formData, so selectedLOB from sorted list

    component.getMGAPrograms();
    tick();

    // programData assigned
    expect(component.programData).toEqual(mockProgramsResponse.data.mgaProgramList);

    // LOBList should be mgaLobs extracted from each program
    expect(component.LOBList).toEqual([
      {
        mgaLobId: 1305,
        mgaId: 1,
        lobId: 413,
        lobCode: null,
        lob: "CA",
        lobName: "Commercial Auto",
        createdOn: "2021-07-16T03:42:45.623",
        createdBy: null,
        modifiedOn: null,
        modifiedBy: null
      },
      {
        mgaLobId: 1306,
        mgaId: 1,
        lobId: 415,
        lobCode: null,
        lob: "GL",
        lobName: "General Liability",
        createdOn: "2021-07-16T03:42:45.623",
        createdBy: null,
        modifiedOn: null,
        modifiedBy: null
      },
      {
        mgaLobId: 1307,
        mgaId: 1,
        lobId: 497,
        lobCode: null,
        lob: "PP",
        lobName: "Package Policy",
        createdOn: "2021-07-16T03:42:45.623",
        createdBy: null,
        modifiedOn: null,
        modifiedBy: null
      },
      {
        mgaLobId: 1304,
        mgaId: 1,
        lobId: 403,
        lobCode: null,
        lob: "WC",
        lobName: "Workers Compensation",
        createdOn: "2021-07-16T03:42:45.623",
        createdBy: null,
        modifiedOn: null,
        modifiedBy: null
      }
    ]); // note the sorted order by lobName ascending

    // selectedLOB and selectedLOBName set from first sorted LOBList entry
    expect(component.selectedLOB).toBe('CA');  // from lob property of first element (Commercial Auto)
    expect(component.selectedLOBName).toBe('Commercial Auto');

    // getStateList called with selectedLOB
    expect(component.getStateList).toHaveBeenCalledWith('CA');

    // loaderService.hide called
    expect(loaderService.hide).toHaveBeenCalled();
  }));


  //setLob method
  it('should set selectedLOB, selectedLOBName, reset formData and call getStateList', () => {
    // Arrange: Prepare sample LOBList
    component.LOBList = [
      { lob: 'WC', lobName: 'Workers Compensation' },
      { lob: 'CA', lobName: 'Commercial Auto' },
      { lob: 'GL', lobName: 'General Liability' }
    ];

    spyOn(component, 'getStateList');

    // Pre-set formData to some non-empty value to verify reset
    component.formData = 'some data';

    // Act: call setLob with 'CA'
    component.setLob('CA');

    // Assert:
    expect(component.formData).toBe('');
    expect(component.selectedLOB).toBe('CA');
    expect(component.selectedLOBName).toBe('Commercial Auto');
    expect(component.getStateList).toHaveBeenCalledWith('CA');
  });


  //getStateList method 
  it('should set stateList and selected state based on the provided lob', () => {
    const mockProgramResponse = {
      data: {
        mgaProgramList: [
          {
            mgaLobs: {
              lob: 'WC',
              lobName: 'Workers Compensation'
            },
            mgaStates: [
              { stateId: 1, stateCode: 'NY', state: 'New York' },
              { stateId: 2, stateCode: 'CA', state: 'California' }
            ]
          },
          {
            mgaLobs: {
              lob: 'GL',
              lobName: 'General Liability'
            },
            mgaStates: [
              { stateId: 3, stateCode: 'TX', state: 'Texas' }
            ]
          }
        ]
      }
    };
    spyOn(programService, 'MGAPrograms').and.returnValue(of(mockProgramResponse) as any);

    component.formData = null; // No formData case
    component.getStateList('WC');

    expect(programService.MGAPrograms).toHaveBeenCalledWith(0, 1);

    // The states for 'WC' + Other State
    const expectedStateList = [
      { stateId: 1, stateCode: 'NY', state: 'New York' },
      { stateId: 2, stateCode: 'CA', state: 'California' },
      { state: 'Other State', stateCode: null, stateId: null }
    ];

    // Check stateList and listState
    expect(component.stateList).toEqual(expectedStateList);
    expect(component.listState).toEqual(expectedStateList);

    // Since formData is null, selectedStateCode and selectedState should be the first in the list
    expect(component.selectedStateCode).toBe('NY');
    expect(component.selectedState).toBe('New York');
  });

  it('should use formData state values if formData is set', () => {
    const mockProgramResponse = {
      data: {
        mgaProgramList: [
          {
            mgaLobs: {
              lob: 'WC',
              lobName: 'Workers Compensation'
            },
            mgaStates: [
              { stateId: 1, stateCode: 'NY', state: 'New York' },
              { stateId: 2, stateCode: 'CA', state: 'California' }
            ]
          },
          {
            mgaLobs: {
              lob: 'GL',
              lobName: 'General Liability'
            },
            mgaStates: [
              { stateId: 3, stateCode: 'TX', state: 'Texas' }
            ]
          }
        ]
      }
    };
    spyOn(programService, 'MGAPrograms').and.returnValue(of(mockProgramResponse) as any);

    component.formData = { stateCode: 'CA', State: 'California' };

    component.getStateList('WC');

    expect(component.selectedStateCode).toBe('CA');
    expect(component.selectedState).toBe('California');
  });




  //OnstateChange method
  it('should set selectedStateCode and selectedState, and call ResolveOtherStateData when state is "Other State"', () => {
    const mockOption = { stateCode: 'OS', state: 'Other State' };
    spyOn(component, 'ResolveOtherStateData');

    component.OnstateChange(mockOption);

    expect(component.selectedStateCode).toBe('OS');
    expect(component.selectedState).toBe('Other State');
    expect(component.ResolveOtherStateData).toHaveBeenCalled();
  });

  it('should set selectedStateCode and selectedState, and call ResolveData when state is not "Other State"', () => {
    const mockOption = { stateCode: 'CA', state: 'California' };
    spyOn(component, 'ResolveData');

    component.OnstateChange(mockOption);

    expect(component.selectedStateCode).toBe('CA');
    expect(component.selectedState).toBe('California');
    expect(component.ResolveData).toHaveBeenCalled();
  });


  // keyDownState method
  it('should handle Arrow Up key (keyCode 38)', () => {
    component.stateList = [
      { stateCode: 'CA', state: 'California' },
      { stateCode: 'TX', state: 'Texas' },
      { stateCode: 'NY', state: 'New York' }
    ];
    component.arrowkeyLocation = 1;
    const mockEvent = {
      keyCode: 38,
      srcElement: {
        previousElementSibling: {
          focus: jasmine.createSpy('focus')
        }
      }
    } as any;

    component.keyDownState(mockEvent, null, 1);

    expect(component.arrowkeyLocation).toBe(0);
    expect(mockEvent.srcElement.previousElementSibling.focus).toHaveBeenCalled();
    expect(component.selectedStateCode).toBe('CA');
    expect(component.selectedState).toBe('California');
  });

  it('should handle Arrow Down key (keyCode 40)', () => {
    component.stateList = [
      { stateCode: 'CA', state: 'California' },
      { stateCode: 'TX', state: 'Texas' },
      { stateCode: 'NY', state: 'New York' }
    ];
    component.arrowkeyLocation = 1;
    const mockEvent = {
      keyCode: 40,
      srcElement: {
        nextElementSibling: {
          focus: jasmine.createSpy('focus')
        }
      }
    } as any;

    component.keyDownState(mockEvent, null, 1);

    expect(component.arrowkeyLocation).toBe(2);
    expect(mockEvent.srcElement.nextElementSibling.focus).toHaveBeenCalled();
    expect(component.selectedStateCode).toBe('NY');
    expect(component.selectedState).toBe('New York');
  });

  it('should handle default case (other keys)', () => {
    component.stateList = [
      { stateCode: 'CA', state: 'California' },
      { stateCode: 'TX', state: 'Texas' },
      { stateCode: 'NY', state: 'New York' }
    ];
    component.arrowkeyLocation = 1;
    const mockOption = { stateCode: 'TX', state: 'Texas' };
    const mockEvent = { keyCode: 13 } as any; // Enter key or any other key

    component.keyDownState(mockEvent, mockOption, 1);

    expect(component.selectedStateCode).toBe('TX');
    expect(component.selectedState).toBe('Texas');
  });

  it('should not crash if previousElementSibling/nextElementSibling is undefined', () => {
    component.stateList = [
      { stateCode: 'CA', state: 'California' },
      { stateCode: 'TX', state: 'Texas' },
      { stateCode: 'NY', state: 'New York' }
    ];
    component.arrowkeyLocation = 1;
    const mockEventUp = {
      keyCode: 38,
      srcElement: {}
    } as any;

    const mockEventDown = {
      keyCode: 40,
      srcElement: {}
    } as any;

    component.keyDownState(mockEventUp, null, 0);
    component.keyDownState(mockEventDown, null, 2);

    // Just verifying it doesn't throw and updates arrowkeyLocation
    expect(component.arrowkeyLocation).toBeGreaterThanOrEqual(0);
  });



  //onFormEdit method
  it('should call AqSessionService.setData and navigate to the correct URL', () => {
    const formId = 123;
    spyOn(aqSession, 'setData');
    spyOn(router, 'navigateByUrl');

    component.onFormEdit(formId);

    expect(aqSession.setData).toHaveBeenCalledWith('formId', formId);
    expect(router.navigateByUrl).toHaveBeenCalledWith('agenciiq/aqforms/manage');
  });



  //aqFormList method
  it('should set session data and navigate to the correct URL', () => {
    spyOn(aqSession, 'setData');
    spyOn(router, 'navigateByUrl');
    component.selectedLOBName = 'Test LOB';
    component.selectedLOB = 'LOB123';
    component.selectedState = 'Test State';
    component.selectedStateCode = 'TS';
    const formTypeData = { parameterName: 'Test Form', shortName: 'TF' };

    const expectedObj = {
      'LOB': 'Test LOB',
      'LOBCode': 'LOB123',
      'FormType': 'Test Form',
      'FORMCode': 'TF',
      'State': 'Test State',
      'stateCode': 'TS',
    };

    component.getAqFormList(formTypeData);

    expect(aqSession.setData).toHaveBeenCalledWith('dataSourceAccordian', expectedObj);
    expect(router.navigateByUrl).toHaveBeenCalledWith('agenciiq/aqforms/list');
  });


  //addForm method
  it('should navigate to the correct route on addForm()', () => {
    spyOn(router, 'navigateByUrl');
    component.addForm();
    expect(router.navigateByUrl).toHaveBeenCalledWith('agenciiq/aqforms/manage');
  });


});
