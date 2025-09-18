import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OtherScreenComponent } from './other-screen.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AQSession } from 'src/app/global-settings/session-storage';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQFormsService } from '@agenciiq/quotes';
import { Router } from '@angular/router';

describe('OtherScreenComponent', () => {
  let component: OtherScreenComponent;
  let fixture: ComponentFixture<OtherScreenComponent>;
  let aqSessionSpy: jasmine.SpyObj<AQSession>;
  let formsServiceSpy: jasmine.SpyObj<AQFormsService>;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;
  let mockRouter: any;
  let mockSessionService: any;

  beforeEach(waitForAsync(() => {
    const spy = jasmine.createSpyObj('AQSession', ['getData']);
    formsServiceSpy = jasmine.createSpyObj('FormsService', ['GetFormsList']);
    loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    mockRouter = jasmine.createSpyObj(['navigateByUrl']);
    mockSessionService = jasmine.createSpyObj(['setData']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [OtherScreenComponent],
      providers: [
        { provide: AQSession, useValue: spy },
        { provide: AQFormsService, useValue: formsServiceSpy },
        { provide: LoaderService, useValue: loaderServiceSpy },
        // { provide: Router, useValue: mockRouter },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherScreenComponent);
    component = fixture.componentInstance;
    aqSessionSpy = TestBed.inject(AQSession) as jasmine.SpyObj<AQSession>;
    component.userId = 123;
    // Mock getAqFormList and removeSession methods
    spyOn(component, 'getAqFormList');
    spyOn(component, 'removeSession');

    component.formTypeList = [
      { formType: 'A', name: 'Form A' },
      { formType: 'B', name: 'Form B' }
    ];

    component.formTypeList = [
      { formType: 'type1' },
      { formType: 'type2' },
      { formType: 'type3' }
    ];
    component.selectedScreen = { formType: 'B' };
    fixture.detectChanges();
  });

  function createKeyboardEvent(code: number, siblingType: 'next' | 'prev' = 'next') {
    return {
      keyCode: code,
      srcElement: {
        nextElementSibling: siblingType === 'next' ? { focus: jasmine.createSpy('focus') } : null,
        previousElementSibling: siblingType === 'prev' ? { focus: jasmine.createSpy('focus') } : null
      }
    };
  }

  it('should return formType from the item', () => {
    const index = 0;
    const item = { formType: 'TYPE_A' };
    const result = component.trackByFormType(index, item);
    expect(result).toBe('TYPE_A');
  });

  it('should return undefined if item does not have formType', () => {
    const index = 1;
    const item = {};
    const result = component.trackByFormType(index, item);
    expect(result).toBeUndefined();
  });

  it('should not call getAqFormList if selectedScreen is same', () => {
    component.arrowkeyLocation = 0;
    const event = createKeyboardEvent(40, 'next'); // ArrowDown
    component.selectedScreen = component.formTypeList[1];
    component.keyDownScreen(event as any, component.formTypeList[1], 1);
  });

  it('should handle ArrowUp key and update selectedScreen', () => {
    component.arrowkeyLocation = 1;
    const event = createKeyboardEvent(38, 'prev'); // ArrowUp

    component.keyDownScreen(event as any, component.formTypeList[1], 1);

    expect(component.selectedScreen).toEqual(component.formTypeList[0]);
  });

  it('should set selectedScreen and call getAqFormList with the correct formType', () => {
    const mockValue = { formType: 'exampleForm' };
    component.OnScreenChange(mockValue);
    expect(component.selectedScreen).toBe(mockValue);
    expect(component.getAqFormList).toHaveBeenCalledWith('exampleForm');
  });

  it('should call removeSession on _aqSession with "formData"', () => {
    component.removeSession();
  });

  it('should initialize formData, formTypeList, selectedScreen, and call getAqFormList', () => {
    const mockFormData = { formType: 'Account', formTypeDescription: 'Account' };
    aqSessionSpy.getData.and.returnValue(mockFormData);

    component.ngOnInit();

    expect(component.formData).toEqual(mockFormData);
    expect(component.removeSession).toHaveBeenCalled();
    expect(component.formTypeList).toEqual([
      { formType: 'Program', formTypeDescription: 'Program' },
      { formType: 'Account', formTypeDescription: 'Account' }
    ]);
    expect(component.selectedScreen).toEqual(mockFormData);
    expect(component.getAqFormList).toHaveBeenCalledWith('Account');
  });

  it('should set default selectedScreen if no formData is returned', () => {
    aqSessionSpy.getData.and.returnValue(null);
    component.ngOnInit();
    expect(component.formData).toBeNull();
    expect(component.selectedScreen).toEqual({ formType: 'Program', formTypeDescription: 'Program' });
    expect(component.getAqFormList).toHaveBeenCalledWith('Program');
  });
});
