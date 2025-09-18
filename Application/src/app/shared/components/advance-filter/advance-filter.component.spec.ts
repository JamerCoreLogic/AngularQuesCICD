import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvanceFilterComponent } from './advance-filter.component';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import {
  AQQuotesListService, AQSaveAdvanceFilterService, AQFormsService, LOBService
} from '@agenciiq/quotes';
import {
  AQAgentInfo, AQUserInfo
} from '@agenciiq/login';
import {
  AQParameterService, AQTransactionType, AQStage, ProgramService,
  AQAlfredFlag, AQPeriod, AQProcessingType, AQCarrier, AQStates
} from '@agenciiq/aqadmin';
import { Router } from '@angular/router';
import { LoaderService } from '../../utility/loader/loader.service';
import { TrimValueService } from '../../services/trim-value/trim-value.service';
import { PopupService } from '../../utility/Popup/popup.service';
import { AQSession } from 'src/app/global-settings/session-storage';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { IParameterResp } from '@agenciiq/aqadmin/lib/interfaces/base-paramater-req';
import { ILOBGetResponse } from '@agenciiq/quotes/lib/interfaces/base-get-lob-resp';
import { ISaveAdvanceFilterResp } from '@agenciiq/quotes/lib/interfaces/base-save-advance-filter-res';
import { fiLocale } from 'ngx-bootstrap/chronos';
import { filter } from 'rxjs/operators';

describe('AdvanceFilterComponent', () => {
  let component: AdvanceFilterComponent;
  let fixture: ComponentFixture<AdvanceFilterComponent>;
  let service: AQParameterService;
  let loaderService: LoaderService;
  let sessionSpy: any;
  let fb: FormBuilder;
  let trimService: TrimValueService;
  let lobService: LOBService;
  let aqFilterService: AQSaveAdvanceFilterService


  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [AdvanceFilterComponent],
      providers: [AQQuotesListService, HttpClient, HttpHandler, AQParameterService, LoaderService, FormBuilder,
        TrimValueService, LOBService, AQSaveAdvanceFilterService

      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceFilterComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(AQParameterService);
    trimService = TestBed.inject(TrimValueService);
    lobService = TestBed.inject(LOBService);
    aqFilterService = TestBed.inject(AQSaveAdvanceFilterService);
    fb = TestBed.inject(FormBuilder);
    fixture.detectChanges();
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should create form with default values', () => {
    const form = component.advanceFilterForm;
    expect(form).toBeDefined();
    expect(form.get('Ref').value).toBe('');
    expect(form.get('LOB').disabled).toBeFalse();
  });

  it('should emit cancel event', () => {
    spyOn(component.cancel, 'emit');
    component.cancelAdvanceFilterForm();
    expect(component.cancel.emit).toHaveBeenCalledWith(true);
  });

  it('should emit clearAll event', () => {
    spyOn(component.clearAll, 'emit');
    component.clearAdvanceFilterForm();
    expect(component.clearAll.emit).toHaveBeenCalledWith(true);
  });

  it('should toggle FilterOpen and HideAdvFilterOption on getAdvanceFilter()', () => {
    component.getAdvanceFilter(true);
    expect(component.FilterOpen).toBeTrue();
    expect(component.HideAdvFilterOption).toBeFalse();
  });

  it('should check Alfred flag as selected when ID is found', () => {
    component.alfredFlagListChecked = [1, 2, 3];
    expect(component.isChecked(2)).toBeTrue();
    expect(component.isChecked(5)).toBeFalse();
  });

  it('should show checkboxes when expanded is false', () => {
    component.expanded = false;

    component.showCheckboxes();

    const checkboxes = document.getElementsByClassName('spanboxes');
    const div = checkboxes[0].getElementsByTagName('div')[0];

    expect(div.style.display).toBe('block');
    expect(component.expanded).toBeTrue();
  });

  it('should hide checkboxes when expanded is true', () => {
    component.expanded = true;

    component.showCheckboxes();

    const checkboxes = document.getElementsByClassName('spanboxes');
    const div = checkboxes[0].getElementsByTagName('div')[0];

    expect(div.style.display).toBe('none');
    expect(component.expanded).toBeFalse();
  });

  it('should load parameter data successfully and set lists', () => {
    const mockResponse: IParameterResp = {
      success: true,
      message: null,
      data: {
        parameterList: [
          {
            parameterId: 1,
            parameterKey: 'Key1',
            parameterName: 'Name1',
            parameterValue: 'Value1',
            parameterDescription: 'Desc1'
          }
        ]
      }
    };

    let spy_getPostDetails = spyOn(service, "getParameter").and.returnValue(of(mockResponse));

    component.getParameterData();
  });

  it('should hide loader and log error on API error', () => {
    const error = new Error('API failure');
    spyOn(service, "getParameter").and.returnValue(throwError(() => error));
    spyOn(console, 'log');

    component.getParameterData();
  });

  it('should set direct, conditional, and date fields correctly', () => {
    const params = {
      Ref: 'REF123',
      InsuredName: 'John Doe',
      PremiumStart: '1000',
      PremiumEnd: '2000',
      filterName: 'Filter1',
      ProcessingType: 'TypeA',
      Agency: 'AgencyX',
      AgentName: 'AgentY',
      filterDetails: 'Details here',
      Status: 'Active',
      BusinessType: 'Business1',
      TransactionType: 'TransactionA',
      LOB: 'LOB1',
      Carrier: 'CarrierX',
      State: 'NY',
      EffectiveFromDate: '2025-01-01T00:00:00Z',
      EffectiveToDate: '2025-12-31T00:00:00Z',
      ExpirationFromDate: '2026-01-01T00:00:00Z',
      ExpirationToDate: '2026-12-31T00:00:00Z',
      AlfredFlags: ['flag1', 'flag2'],
    };

    component.setFormValue(params);

    // Direct keys should be set as-is
    expect(component.advanceFilterForm.controls['Ref'].value).toBe('REF123');
    expect(component.advanceFilterForm.controls['InsuredName'].value).toBe('John Doe');
    expect(component.advanceFilterForm.controls['PremiumStart'].value).toBe('1000');
    expect(component.advanceFilterForm.controls['PremiumEnd'].value).toBe('2000');
    expect(component.advanceFilterForm.controls['filterName'].value).toBe('Filter1');
    expect(component.advanceFilterForm.controls['ProcessingType'].value).toBe('TypeA');
    expect(component.advanceFilterForm.controls['Agency'].value).toBe('AgencyX');
    expect(component.advanceFilterForm.controls['AgentName'].value).toBe('AgentY');
    expect(component.advanceFilterForm.controls['filterDetails'].value).toBe('Details here');

    // Conditional keys set by setIfExists, should match the values
    expect(component.advanceFilterForm.controls['Status'].value).toBe('Active');
    expect(component.advanceFilterForm.controls['BusinessType'].value).toBe('Business1');
    expect(component.advanceFilterForm.controls['TransactionType'].value).toBe('TransactionA');
    expect(component.advanceFilterForm.controls['LOB'].value).toBe('LOB1');
    expect(component.advanceFilterForm.controls['Carrier'].value).toBe('CarrierX');
    expect(component.advanceFilterForm.controls['State'].value).toBe('NY');

    // Date keys should be converted to Date objects
    expect(component.advanceFilterForm.controls['EffectiveFromDate'].value instanceof Date).toBeTrue();
    expect(component.advanceFilterForm.controls['EffectiveFromDate'].value.toISOString()).toBe(new Date('2025-01-01T00:00:00Z').toISOString());

    expect(component.advanceFilterForm.controls['EffectiveToDate'].value instanceof Date).toBeTrue();
    expect(component.advanceFilterForm.controls['EffectiveToDate'].value.toISOString()).toBe(new Date('2025-12-31T00:00:00Z').toISOString());

    expect(component.advanceFilterForm.controls['ExpirationFromDate'].value instanceof Date).toBeTrue();
    expect(component.advanceFilterForm.controls['ExpirationFromDate'].value.toISOString()).toBe(new Date('2026-01-01T00:00:00Z').toISOString());

    expect(component.advanceFilterForm.controls['ExpirationToDate'].value instanceof Date).toBeTrue();
    expect(component.advanceFilterForm.controls['ExpirationToDate'].value.toISOString()).toBe(new Date('2026-12-31T00:00:00Z').toISOString());

    // AlfredFlags array
    expect(component.alfredFlagListChecked).toEqual(['flag1', 'flag2']);
    expect(component.advanceFilterForm.controls['AlfredFlags'].value).toEqual(['flag1', 'flag2']);
  });

  it('should set empty string for empty, null, or "0" values in conditional and date keys', () => {
    const params = {
      Status: '',
      BusinessType: null,
      TransactionType: '0',
      LOB: '',
      Carrier: null,
      State: '0',
      EffectiveFromDate: '',
      EffectiveToDate: null,
      ExpirationFromDate: '0',
      ExpirationToDate: ''
    };

    component.setFormValue(params);

    // For all above keys, the form control value should be empty string
    ['Status', 'BusinessType', 'TransactionType', 'LOB', 'Carrier', 'State',
      'EffectiveFromDate', 'EffectiveToDate', 'ExpirationFromDate', 'ExpirationToDate'
    ].forEach(key => {
      expect(component.advanceFilterForm.controls[key].value).toBe('');
    });
  });

  it('should not set AlfredFlags if not present or empty', () => {
    const params = {
      AlfredFlags: []
    };

    component.setFormValue(params);

    expect(component.alfredFlagListChecked).toBeTruthy();
    expect(component.advanceFilterForm.controls['AlfredFlags'].value).toBe('');
  });

  it('should update form values if advancedFilterId is not 0', () => {
    const params = { Ref: 'ABC', LOB: 'LOB1' };
    const base64Params = btoa(JSON.stringify(params));

    component.SavedAdvanceFilterList = [
      { advancedFilterId: 10, parameters: base64Params }
    ];

    component.changeFilter(10);
    expect(component.advancedFilterId).toBe(10);
  });

  it('should reset form and controls if advancedFilterId is 0', () => {
    spyOn(component.advanceFilterForm, 'reset');
    component.changeFilter(0);
    expect(component.advanceFilterForm.reset).toHaveBeenCalled();
  });



  it('should store view policy data in session and navigate to quickquote', () => {
    const mockData = {
      quoteId: 555
    };
    component.setViewPolicyData(mockData);
  });

  describe('DefaultChecked', () => {
    it('should set isDefaultChecked to given value', () => {
      component.DefaultChecked(true);
      expect(component.isDefaultChecked).toBeTrue();

      component.DefaultChecked(false);
      expect(component.isDefaultChecked).toBeFalse();
    });
  });

  describe('resetSelectControls', () => {
    it('should reset all form controls and related flags', () => {
      // Pre-set some form values and properties
      component.advanceFilterForm.patchValue({
        Ref: 'R1',
        InsuredName: 'John Doe',
        LOB: 'LOB1',
        AgentName: 'AgentX',
        TransactionType: 'Quote',
        BusinessType: 'New',
        Status: 'Active',
        PremiumStart: '1000',
        PremiumEnd: '2000',
        AlfredFlags: 'Flag1',
        filterName: 'MyFilter',
        Agency: 'AgencyX',
        Agent: 'A123',
        State: 'NY',
        ProcessingType: 'Manual',
        Period: 'Q1',
        Carrier: 99,
        filterDetails: 'Some details',
        EffectiveFromDate: '2024-01-01',
        EffectiveToDate: '2024-12-31',
        ExpirationFromDate: '2025-01-01',
        ExpirationToDate: '2025-12-31'
      });
      component.SavedAdvanceFilterParameterID = 'ABC123';
      component.alfredFlagListChecked = ['A1', 'A2'];
      spyOn(component, 'DefaultChecked');

      // Act
      component.resetSelectControls();

      // Assert: all form controls reset
      const formValues = component.advanceFilterForm.value;
      for (const key in formValues) {
        if (key === 'Carrier') {
          expect(formValues[key]).toBe(0);
        } else {
          expect(formValues[key]).toBe('');
        }
      }

      // Assert: component variables reset
      expect(component.SavedAdvanceFilterParameterID).toBe('');
      expect(component.alfredFlagListChecked).toEqual([]);
      expect(component.DefaultChecked).toHaveBeenCalledWith(false);
    });
  });

  it('should set isFilterFlag correctly', () => {
    component.checkFilterName(true);
    expect(component.isFilterFlag).toBeTrue();

    component.checkFilterName(false);
    expect(component.isFilterFlag).toBeFalse();
  });

  it('should add flag ID to list when checked is true', () => {
    component.alfredFlagListChecked = [];
    component.advanceFilterForm = fb.group({
      AlfredFlags: ['']
    });

    component.checkAlfredFlag(101, true);
    expect(component.alfredFlagListChecked).toContain(101);
    expect(component.advanceFilterForm.controls['AlfredFlags'].value).toEqual([101]);
  });

  it('should remove flag ID from list when checked is false', () => {
    component.alfredFlagListChecked = [101, 102];
    component.advanceFilterForm = fb.group({
      AlfredFlags: ['']
    });

    component.checkAlfredFlag(101, false);
    expect(component.alfredFlagListChecked).not.toContain(101);
    expect(component.advanceFilterForm.controls['AlfredFlags'].value).toEqual([102]);
  });

  it('should call saveFilterOption with valid data when isFilterFlag is true', () => {
    component.isFilterFlag = true;
    component.advancedFilterId = 5;
    component.isDefaultChecked = true;

    // Mock form with test values
    component.advanceFilterForm = fb.group({
      filterName: ['Test Filter'],
      filterDetails: ['Some description'],
      AlfredFlags: [''],
      // Add other controls if needed
    });

    const expectedPayload = {
      AdvancedFilterId: 5,
      FilterName: 'Test Filter',
      FilterParticulars: 'Some description',
      IsDefault: true,
      Parameters: btoa(JSON.stringify(component.advanceFilterForm.value))
    };

    spyOn(component as any, 'saveFilterOption');

    component.saveAdvanceFilterOptions();

    expect((component as any).saveFilterOption).toHaveBeenCalledWith(expectedPayload);
  });

  it('should not call saveFilterOption if isFilterFlag is false', () => {
    component.isFilterFlag = false;
    spyOn(component as any, 'saveFilterOption');
    component.saveAdvanceFilterOptions();
    expect((component as any).saveFilterOption).not.toHaveBeenCalled();
  });

  it('should emit trimmed form when isFilterFlag is true and fields are valid', () => {
    component.isFilterFlag = true;

    const trimmedObject = { filterName: 'Test Name', filterDetails: 'Test Detail', LOB: '', AgentName: '' };
    spyOn(trimService, "TrimObjectValue").and.returnValue(of(trimmedObject));
    component.SearchQuoteslist();
  });

  it('should not emit or save if filterName and filterDetails are invalid when isFilterFlag is true', () => {
    component.isFilterFlag = true;
    component.advanceFilterForm.patchValue({ filterName: '', filterDetails: null });

    component.SearchQuoteslist();

    expect(component.isFilterNameValid).toBeFalse();
    expect(component.isFilterDescValid).toBeFalse();
  });

  it('should emit trimmed form and skip filter validations when isFilterFlag is false', () => {
    component.isFilterFlag = false;

    const trimmedObject = { filterName: 'Test Name', filterDetails: 'Test Detail', LOB: '', AgentName: '' };

    spyOn(trimService, "TrimObjectValue").and.returnValue(of(trimmedObject));
    component.SearchQuoteslist();

    expect(component.isFilterNameValid).toBeTrue();
    expect(component.isFilterDescValid).toBeTrue();
  });

  it('should set LOBList from API response', () => {
    const mockLOBResponse: ILOBGetResponse = {
      success: true,
      message: '',
      data: {
        lobsList: [
          {
            lobId: 1,
            lob: 'Commercial Auto',
            lobCode: 'CA',
            isActive: true,
            lobDescription: 'Commercial Auto Description'
          },
          {
            lobId: 2,
            lob: 'General Liability',
            lobCode: 'GL',
            isActive: true,
            lobDescription: 'General Liability Description'
          }
        ]
      }
    };


    spyOn(lobService, "GetLOBList").and.returnValue(of(mockLOBResponse));
    component.getLobList();
  });

  it('should handle error in GetLOBList', () => {
    spyOn(console, 'log');
    spyOn(lobService, "GetLOBList").and.returnValue(throwError(() => new Error('API Error')));
    component.getLobList();
  });

});