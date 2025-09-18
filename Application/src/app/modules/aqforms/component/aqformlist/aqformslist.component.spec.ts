import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AQFormsListComponent } from './aqformslist.component';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQUserInfo } from '@agenciiq/login';
import { AQFormsService, IFormsListRequest } from '@agenciiq/aqforms';
import { Router } from '@angular/router';
import { AQSession } from 'src/app/global-settings/session-storage';
import { DialogService } from 'src/app/shared/utility/aq-dialog/dialog.service';
import { LOBService } from '@agenciiq/quotes';
import { AQParameterService, AQStates } from '@agenciiq/aqadmin';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('AqformComponent', () => {
  let component: AQFormsListComponent;
  let fixture: ComponentFixture<AQFormsListComponent>;
  let loaderService: LoaderService;
  let aqUserInfo: AQUserInfo;
  let aqFormsService: AQFormsService;
  let router: Router;
  let aqSession: AQSession;
  let dialogService: DialogService;
  let lobService: LOBService;
  let aqStates: AQStates;
  let parameter: AQParameterService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule],
      declarations: [AQFormsListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        LoaderService,
        AQUserInfo,
        AQFormsService,
        Router,
        AQSession,
        DialogService,
        LOBService,
        AQStates,
        AQParameterService,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AQFormsListComponent);
    component = fixture.componentInstance;
    loaderService = TestBed.inject(LoaderService);
    aqUserInfo = TestBed.inject(AQUserInfo);
    aqFormsService = TestBed.inject(AQFormsService);
    router = TestBed.inject(Router);
    aqSession = TestBed.inject(AQSession);
    dialogService = TestBed.inject(DialogService);
    lobService = TestBed.inject(LOBService);
    aqStates = TestBed.inject(AQStates);
    parameter = TestBed.inject(AQParameterService);
    spyOn(aqSession, 'getData').and.returnValue({
      LOB: 'LOB123',
      State: 'NY',
      FormType: 'Type1',
      LOBCode: 'LOB123',
      stateCode: 'NY',
      FORMCode: 'Type1'
    });

    component.stateList = [
      { stateId: 90, state: "NJ", stateDescription: "New Jersey", shortName: "NJ", parameterName: "New Jersey" },
      { stateId: 97, state: "NY", stateDescription: "New York", shortName: "NY", parameterName: "New York" },
      { stateId: 102, state: "PA", stateDescription: "Pennsylvania", shortName: "PA", parameterName: "Pennsylvania" },
      { stateId: 101, state: "TX", stateDescription: "Texas", shortName: "TX", parameterName: "Texas" },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //ngOnInit method
  it('should initialize ngOnInit with dataSourceAccordian and call getAqFormList', () => {
    spyOn(aqUserInfo, 'UserId').and.returnValue(123);
    spyOn(component, 'getAqFormList');

    component.ngOnInit();

    expect(component.showError).toBe(false);
    expect(aqSession.getData).toHaveBeenCalledWith('dataSourceAccordian');
    expect(component.dataSourceAccordian).toEqual(jasmine.objectContaining({
      "LOB": "LOB123",
      "State": "NY",
      "FormType": "Type1",
      "LOBCode": "LOB123",
      "stateCode": "NY",
      "FORMCode": "Type1"
    }));
    expect(component.getAqFormList).toHaveBeenCalledWith({
      "LOB": "LOB123",
      "State": "NY",
      "FormType": "Type1",
      "LOBCode": "LOB123",
      "stateCode": "NY",
      "FORMCode": "Type1"
    });
  });


  //keyDown method
  it('should handle Arrow Up (keyCode 38)', () => {
    component.stateList = [
      { stateId: 90, state: "NJ", stateDescription: "New Jersey", shortName: "NJ", parameterName: "New Jersey" },
      { stateId: 97, state: "NY", stateDescription: "New York", shortName: "NY", parameterName: "New York" },
      { stateId: 102, state: "PA", stateDescription: "Pennsylvania", shortName: "PA", parameterName: "Pennsylvania" },
      { stateId: 101, state: "TX", stateDescription: "Texas", shortName: "TX", parameterName: "Texas" },
    ];

    const mockEvent = {
      keyCode: 38,
      srcElement: { previousElementSibling: { focus: jasmine.createSpy('focus') } },
    } as any;

    const option = component.stateList[3]; // TX
    const index = 3;

    component.arrowkeyLocation = 3; // simulate current location

    component.keyDown(mockEvent, option, index);

    expect(component.arrowkeyLocation).toBe(2); // should go up by 1
    expect(mockEvent.srcElement.previousElementSibling.focus).toHaveBeenCalled();
    expect(component.selectedStateCode).toBe('PA');
    expect(component.selectedState).toBe('Pennsylvania');
  });

  it('should handle Arrow Down (keyCode 40)', () => {
    const mockEvent = {
      keyCode: 40,
      srcElement: { nextElementSibling: { focus: jasmine.createSpy('focus') } },
    } as any;

    const option = component.stateList[2]; // PA
    const index = 2;

    component.arrowkeyLocation = index;

    component.keyDown(mockEvent, option, index);

    expect(component.arrowkeyLocation).toBe(3); // 2 + 1
    expect(mockEvent.srcElement.nextElementSibling.focus).toHaveBeenCalled();

    // The next state is Texas now (index 3)
    expect(component.selectedStateCode).toBe('TX');
    expect(component.selectedState).toBe('Texas');
  });

  it('should handle default key (e.g., Enter)', () => {
    const mockEvent = { keyCode: 13 } as any;
    const option = component.stateList[3]; // TX

    component.keyDown(mockEvent, option, 3);

    expect(component.selectedStateCode).toBe('TX');
    expect(component.selectedState).toBe('Texas');
  });


  //onFormEdit method
  it('should save formId and formData in session and navigate to manage page', () => {
    // Arrange
    const formId = 123;
    (component as any).dataSourceAccordian = {
      LOBCode: 'LOB123',
      State: 'NY',
      FormType: 'TypeA'
    };

    // Spy on session and router methods
    spyOn(aqSession, 'setData');
    spyOn(router, 'navigateByUrl');

    // Act
    component.onFormEdit(formId);

    // Assert
    expect(aqSession.setData).toHaveBeenCalledWith('formId', formId);
    expect(aqSession.setData).toHaveBeenCalledWith('formData', {
      LOB: 'LOB123',
      state: 'NY',
      formType: 'TypeA'
    });
    expect(router.navigateByUrl).toHaveBeenCalledWith('agenciiq/aqforms/manage');
  });



  //getAqFormList method
  it('should fetch forms, filter them, and update formList correctly', () => {
    // Arrange
    const data = {
      LOB: 'LOB123',
      State: 'NY',
      FormType: 'FormTypeA',
      LOBCode: 'LOB123',
      stateCode: 'NY',
      FORMCode: 'FormTypeA'
    };

    component.userId = 42;

    const mockResponse = {
      data: {
        aQFormResponses: [
          {
            lobCode: 'LOB123',
            stateCode: 'NY',
            formType: 'FormTypeA',
            multilineForms: [
              { lob: 'lob1' },
              { lob: 'lob2' }
            ]
          },
          {
            lobCode: 'LOB123',
            stateCode: null,
            formType: 'FormTypeA',
            multilineForms: []
          },
          {
            lobCode: 'OtherLOB',
            stateCode: 'NY',
            formType: 'FormTypeA',
            multilineForms: []
          }
        ]
      }
    };

    spyOn(loaderService, 'show');
    spyOn(loaderService, 'hide');
    spyOn(aqFormsService, 'GetFormsList').and.returnValue(of(mockResponse) as any);

    // Act
    component.getAqFormList(data);

    // Assert
    expect(loaderService.show).toHaveBeenCalled();
    expect(loaderService.hide).toHaveBeenCalled();

    // The formList should only contain filtered items matching the criteria
    expect(component.formList.length).toBe(1);
    expect(component.formList[0].selectedLob).toBe('lob1,lob2');
    //expect(component.formList[1].selectedLob).toBe(''); // no multilineForms

    expect(component.showError).toBe(false);
    expect(component.dataSource).toEqual(mockResponse.data.aQFormResponses);
  });

  it('should set showError true and hide loader on error', () => {
    const data = { LOB: 'LOB', State: 'ST', FormType: 'FT' };
    spyOn(loaderService, 'show');
    spyOn(loaderService, 'hide');
    spyOn(aqFormsService, 'GetFormsList').and.returnValue(throwError(() => new Error('Error')));

    component.getAqFormList(data);

    expect(loaderService.show).toHaveBeenCalled();
    expect(loaderService.hide).toHaveBeenCalled();
    expect(component.showError).toBe(true);
    expect(component.formList.length).toBe(0);
  });



  //addForm method
  it('should save formData in session and navigate to manage page', () => {
    // Arrange: Set mock dataSourceAccordian
    (component as any).dataSourceAccordian = {
      LOBCode: 'LOB123',
      stateCode: 'NY',
      FORMCode: 'TypeA'
    };

    // Spy on private _aqSession and _router methods
    spyOn(component['_aqSession'], 'setData');
    spyOn(component['_router'], 'navigateByUrl');

    // Act: Call addForm
    component.addForm();

    // Assert: Check setData called with correct formData
    expect(component['_aqSession'].setData).toHaveBeenCalledWith('formData', {
      LOB: 'LOB123',
      state: 'NY',
      formType: 'TypeA'
    });

    // Assert: Check navigation to expected URL
    expect(component['_router'].navigateByUrl).toHaveBeenCalledWith('agenciiq/aqforms/manage');
  });


  it('should navigate to the aqforms page on cancel', () => {
    // Arrange: Spy on router.navigateByUrl
    spyOn(component['_router'], 'navigateByUrl');

    // Act: Call the method
    component.onCancel();

    // Assert: Expect navigation with correct URL
    expect(component['_router'].navigateByUrl).toHaveBeenCalledWith('/agenciiq/aqforms');
  });
});
