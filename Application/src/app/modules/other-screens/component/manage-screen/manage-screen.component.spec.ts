import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageScreenComponent } from './manage-screen.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { AQFormsService } from '@agenciiq/aqforms';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { SetDateService } from 'src/app/shared/services/setDate/set-date.service';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';
import { Router } from '@angular/router';

describe('ManageScreenComponent', () => {
  let component: ManageScreenComponent;
  let fixture: ComponentFixture<ManageScreenComponent>;
  let aqFormsServiceSpy: jasmine.SpyObj<AQFormsService>;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;
  let setDateServiceSpy: jasmine.SpyObj<SetDateService>;
  let trimValueServiceSpy: jasmine.SpyObj<TrimValueService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let popupSpy: any;
  let aqSessionSpy: any;

  beforeEach(waitForAsync(() => {
    const spy = jasmine.createSpyObj('AQFormsService', ['DowloadFormExcel', 'SaveAQFormWithExcel']);
    const loaderServiceMock = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    const setDateServiceMock = jasmine.createSpyObj('SetDateService', ['setDate']);
    const trimValueServiceMock = jasmine.createSpyObj('TrimValueService', ['TrimObjectValue']);
    const routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);
    popupSpy = jasmine.createSpyObj('_popup', ['showPopup']);
    aqSessionSpy = jasmine.createSpyObj('aqSession', ['removeSession']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [ManageScreenComponent],
      providers: [FormBuilder,
        { provide: AQFormsService, useValue: spy },
        { provide: LoaderService, useValue: loaderServiceMock },
        { provide: SetDateService, useValue: setDateServiceMock },
        { provide: TrimValueService, useValue: trimValueServiceMock },
        // { provide: Router, useValue: routerMock },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageScreenComponent);
    component = fixture.componentInstance;
    spyOn(component, 'getFormById');
    aqFormsServiceSpy = TestBed.inject(AQFormsService) as jasmine.SpyObj<AQFormsService>;
    component.downloadExcelName = 'test.xlsx';

    // Spy on s2ab method if it's part of the component (assuming it is)
    if (!component.s2ab) {
      component.s2ab = (s: string) => new Uint8Array(s.split('').map(c => c.charCodeAt(0)));
    }

    fixture.detectChanges();
  });

  function createMockFile(name: string, type: string): File {
    return new File([''], name, { type });
  }

  it('should download excel file when Download is called', () => {
    // Prepare fake base64 Excel string
    const fakeBase64 = btoa('fake excel content');

    // Spy on document.createElement to monitor anchor creation
    const createElementSpy = spyOn(document, 'createElement').and.callThrough();

    // Spy on appendChild and removeChild
    const appendChildSpy = spyOn(document.body, 'appendChild').and.callThrough();
    const removeChildSpy = spyOn(document.body, 'removeChild').and.callThrough();

    // Spy on URL.createObjectURL
    const createObjectURLSpy = spyOn(window.URL, 'createObjectURL').and.returnValue('blob:http://localhost/fakeurl');

    // Spy on click method of the created anchor
    let anchorElement: HTMLAnchorElement | null = null;
    createElementSpy.and.callFake((tag: string) => {
      if (tag === 'a') {
        anchorElement = document.createElement('a');
        spyOn(anchorElement, 'click').and.callFake(() => { });
        return anchorElement;
      }
      return document.createElement(tag);
    });

    // Call Download
    component.Download();

    // Assertions
    expect(aqFormsServiceSpy.DowloadFormExcel).toHaveBeenCalledWith({
      UserId: component.userId,
      FormId: component.formData?.formId,
      ClientID: 0
    });
  });

  it('should not create download link if formExcel is falsy', () => {
    const createElementSpy = spyOn(document, 'createElement');
    component.Download();
    expect(createElementSpy).not.toHaveBeenCalled();
  });

  it('should set valid flags and call readAQFormExcel for valid .xlsx file', () => {
    const mockFile = createMockFile('test.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    };

    spyOn(component, 'readAQFormExcel');

    component.uploadExcel(mockEvent);

    expect(component.disableDownExcel).toBeTrue();
    expect(component.fileName).toBe('test.xlsx');
    expect(component.uploadedFile).toBe(mockFile);
    expect(component.isFileExists).toBeTrue();
    expect(component.isvalidExtension).toBeTrue();
    expect(component.readAQFormExcel).toHaveBeenCalled();
  });

  it('should set isvalidExtension to false for invalid file type', () => {
    const mockFile = createMockFile('invalid.pdf', 'application/pdf');
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    };

    spyOn(component, 'readAQFormExcel');

    component.uploadExcel(mockEvent);

    expect(component.isvalidExtension).toBeFalse();
    expect(component.readAQFormExcel).not.toHaveBeenCalled();
  });

  it('should set isFileExists to false if no file is uploaded', () => {
    const mockEvent = {
      target: {
        files: []
      }
    };

    component.uploadExcel(mockEvent);

    expect(component.isFileExists).toBeFalse();
  });

  it('should read uploaded Excel file and convert to base64 string', (done) => {
    // Create a dummy Excel-like ArrayBuffer
    const sampleText = 'ExcelContent';
    const buffer = new ArrayBuffer(sampleText.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < sampleText.length; i++) {
      view[i] = sampleText.charCodeAt(i);
    }

    // Create a dummy file and override FileReader
    const file = new Blob([buffer], { type: 'application/vnd.ms-excel' });
    component.uploadedFile = new File([file], 'sample.xlsx');

    // Spy on FileReader
    const mockFileReader = {
      result: buffer,
      readAsArrayBuffer: jasmine.createSpy('readAsArrayBuffer').and.callFake(function () {
        mockFileReader.onload(); // trigger the load
      }),
      onload: () => { }
    };

    spyOn(window as any, 'FileReader').and.returnValue(mockFileReader);

    // Run the method
    component.readAQFormExcel();

    setTimeout(() => {
      // Convert manually for test comparison
      const array = Array.from(new Uint8Array(buffer));
      const expectedBase64 = btoa(array.map(i => String.fromCharCode(i)).join(''));

      expect(component.excelData).toBe(buffer);
      expect(component.base64EncodedExcel).toBe(expectedBase64);
      done();
    });
  });

  it('should reset form and variables on resetControls()', () => {
    component.isSubmitted = true;
    component.base64EncodedJSON = 'someValue';
    component.aqFormsGroup.patchValue({ exampleField: 'test' });
    spyOn(component.aqFormsGroup, 'reset');
    component.resetControls();
    expect(component.isSubmitted).toBeFalse();
    expect(component.base64EncodedJSON).toBe('');
    expect(component.aqFormsGroup.reset).toHaveBeenCalled();
  });

  it('should initialize values and call methods in ngOnInit', () => {
    component.ngOnInit();
    expect(component.fileName).toBe('');
    expect(component.base64EncodedExcel).toBe('');
    expect(component.formId).toBe(0);
  });

  it('should create the form with default values and validators', () => {
    component.createForm();

    const form = component.aqFormsGroup;
    expect(form).toBeTruthy();

    expect(form.get('QuoteType')).toBeTruthy();
    expect(form.get('EffectiveFrom')).toBeTruthy();
    expect(form.get('EffectiveTo')).toBeTruthy();
    expect(form.get('IsActive')).toBeTruthy();

    expect(form.get('QuoteType')?.value).toBe('');
    expect(form.get('EffectiveFrom')?.value).toBe('');
    expect(form.get('EffectiveTo')?.value).toBe('');
    expect(form.get('IsActive')?.value).toBeTrue();

    expect(form.get('QuoteType')?.valid).toBeFalse(); // required
    expect(form.get('EffectiveFrom')?.valid).toBeFalse(); // required
  });

  it('should handle Edit Form when formData.formId is present', () => {
    component.formData = { formId: 123 };

    component.patchValue();

    expect(component.isFileExists).toBeTrue();
    expect(component.isvalidExtension).toBeTrue();
    expect(component.getFormById).toHaveBeenCalled();
    expect(component.FormName).toBe('Edit Form');
    expect(component.isEdit).toBeTrue();
  });

  it('should handle Add Form when formData.formId is not present', () => {
    component.formData = { formType: 'PDF' };
    component.patchValue();
    expect(component.FormName).toBe('Add Form');
    expect(component.isEdit).toBeFalse();
    expect(component.FormType.value).toBe('PDF');
    expect(component.FormType.disabled).toBeTrue();
  });

  it('should update minDate when EffectiveFrom value changes', () => {
    component.patchValue();
    const testDate = new Date();
    component.EffectiveFrom.setValue(testDate);
    expect(component.minDate).toEqual(testDate);
  });

  it('should return the Lob FormControl from BusinessLine getter', () => {
    const lobControl = component.aqFormsGroup.get('Lob');
    expect(component.BusinessLine).toBe(lobControl);
  });

  it('should return the Lob FormControl from QuoteType getter', () => {
    const quoteTypeControl = component.aqFormsGroup.get('QuoteType');
    expect(component.FormType).toBe(quoteTypeControl);
  });

  it('should return the Lob FormControl from EffectiveFrom getter', () => {
    const effectiveControl = component.aqFormsGroup.get('EffectiveFrom');
    expect(component.EffectiveFrom).toBe(effectiveControl);
  });

  it('should return the Lob FormControl from EffectiveTo getter', () => {
    const effectiveToControl = component.aqFormsGroup.get('EffectiveTo');
    expect(component.EffectiveTo).toBe(effectiveToControl);
  });

  it('should return the Lob FormControl from Status getter', () => {
    const isActiveControl = component.aqFormsGroup.get('IsActive');
    expect(component.Status).toBe(isActiveControl);
  });

  it('should unsubscribe all subscriptions on ngOnDestroy', () => {
    // Mock subscriptions
    const mockSubscriptions = ['parameterDataSubscription', 'formsDataSubscription', 'LOBDataSubscription', 'saveFormSubscription', 'uploadFormSubscription'];

    for (const key of mockSubscriptions) {
      const sub = new Subscription();
      spyOn(sub, 'unsubscribe');
      (component as any)[key] = sub;
    }
    component.ngOnDestroy();
    for (const key of mockSubscriptions) {
      expect((component as any)[key].unsubscribe).toHaveBeenCalled();
    }
  });

  it('should filter states by lob and add "Other State"', () => {
    component.programDataMaster = [
      {
        mgaLobs: { lob: 'Auto' },
        mgaStates: [
          { state: 'California', stateCode: 'CA', stateId: 1 },
          { state: 'Nevada', stateCode: 'NV', stateId: 2 }
        ]
      },
      {
        mgaLobs: { lob: 'Health' },
        mgaStates: [
          { state: 'Texas', stateCode: 'TX', stateId: 3 }
        ]
      }
    ];

    component.filteStateList('Auto');

    expect(component.statesList.length).toBe(3);
    expect(component.statesList[0].state).toBe('California');
    expect(component.statesList[1].state).toBe('Nevada');
    expect(component.statesList[2]).toEqual({
      state: 'Other State',
      stateCode: null,
      stateId: null
    });
  });

  it('should return only "Other State" if no match found', () => {
    component.programDataMaster = [
      {
        mgaLobs: { lob: 'Health' },
        mgaStates: [
          { state: 'Texas', stateCode: 'TX', stateId: 3 }
        ]
      }
    ];

    component.filteStateList('Auto');
  });
});
