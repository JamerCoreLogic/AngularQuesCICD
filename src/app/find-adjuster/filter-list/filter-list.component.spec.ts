// filters.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FilterListComponent } from './filter-list.component';
import { SharedAdjusterService } from 'src/app/services/shared-adjuster.service';
import { FileTracService } from 'src/app/services/file-trac.service';
import { AuthService } from 'src/app/services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterModule } from '@progress/kendo-angular-filter';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import * as moment from 'moment';

describe('FilterListComponent', () => {
  let component: FilterListComponent;
  let fixture: ComponentFixture<FilterListComponent>;
  let sharedAdjusterService: jasmine.SpyObj<SharedAdjusterService>;
  let fileTracService: jasmine.SpyObj<FileTracService>;
  let authService: jasmine.SpyObj<AuthService>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  const mockFilteredData = [
    {
      companyName: 'Test Company',
      totalNumberOfClaims: 10,
      claims_Received: '2024-03-04',
      status: 'Active'
    }
  ];

  const mockCompanyNames = {
    data: ['Company1', 'Company2', 'Company3']
  };

  const mockActiveCompanies = {
    success: true,
    data: [
      { fName: 'Client1' },
      { fName: 'Client2' }
    ]
  };

  const mockSurveyTitles = {
    data: {
      titles: ['Survey1', 'Survey2'],
      surveyName: ['Name1', 'Name2']
    }
  };

  beforeEach(async () => {
    const sharedAdjusterServiceSpy = jasmine.createSpyObj('SharedAdjusterService', 
      [
        'setFilter', 
        'isFilterApplyed',
        'setOperator',
        'getOperator',
        'setcompanyNamevalue',
        'setSurveyTitle',
        'setSurveyName'
      ],
      { 
        radius$: of(1000),
        filterOperatorSubject$: of('and')
      }
    );
    // Make sure the spy returns properly
    sharedAdjusterServiceSpy.isFilterApplyed.and.callFake((value: boolean) => {
      // Function implementation not needed, just needs to exist
    });
    
    // Add implementation for setOperator
    sharedAdjusterServiceSpy.setOperator.and.callFake((value: string) => {
      // Empty implementation to satisfy the method call
    });
    const fileTracServiceSpy = jasmine.createSpyObj('FileTracService', 
      ['GetListOfCompanyName', 'GetSurveyTitleList']
    );
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getClients']);
    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges', 'markForCheck']);

    await TestBed.configureTestingModule({
      declarations: [ FilterListComponent ],
      imports: [
        BrowserAnimationsModule,
        FilterModule,
        MultiSelectModule,
        DropDownsModule,
        DatePickerModule,
        TextBoxModule,
        MatButtonModule,
        FormsModule
      ],
      providers: [
        { provide: SharedAdjusterService, useValue: sharedAdjusterServiceSpy },
        { provide: FileTracService, useValue: fileTracServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();

    sharedAdjusterService = TestBed.inject(SharedAdjusterService) as jasmine.SpyObj<SharedAdjusterService>;
    fileTracService = TestBed.inject(FileTracService) as jasmine.SpyObj<FileTracService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    cdr = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterListComponent);
    component = fixture.componentInstance;
    component.filteredData = mockFilteredData;
    
    // Clear any existing localStorage data
    localStorage.clear();

    // Reset spies before each test
    cdr.detectChanges.calls.reset();
    cdr.markForCheck.calls.reset();

    // Setup service responses
    fileTracService.GetListOfCompanyName.and.returnValue(of(mockCompanyNames));
    fileTracService.GetSurveyTitleList.and.returnValue(of(mockSurveyTitles));
    authService.getClients.and.returnValue(of(mockActiveCompanies));
    sharedAdjusterService.getOperator.and.returnValue('AND');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.filters.length).toBeGreaterThan(0);
    expect(component.value.logic).toBe('and');
    expect(component.value.filters.length).toBe(0);
    expect(component.originalUserData).toEqual(mockFilteredData);
  });

  it('should load company names on init', fakeAsync(() => {
    // Setup a spy on the component method
    spyOn(component, 'getListOfCompanyName').and.callThrough();
    
    // Call ngOnInit which should call getListOfCompanyName
    component.ngOnInit();
    tick();

    // Verify the method was called
    expect(component.getListOfCompanyName).toHaveBeenCalled();
    expect(fileTracService.GetListOfCompanyName).toHaveBeenCalled();
    expect(component.companyNames).toEqual(mockCompanyNames.data);
    expect(component.companyNamesLoaded).toBeTrue();
  }));

  it('should load active companies on init', fakeAsync(() => {
    // Setup a spy on the component method
    spyOn(component, 'getFileTracActiveCompanies').and.callThrough();
    
    // Call ngOnInit which should call getFileTracActiveCompanies
    component.ngOnInit();
    tick();

    // Verify the method was called
    expect(component.getFileTracActiveCompanies).toHaveBeenCalled();
    expect(authService.getClients).toHaveBeenCalled();
    expect(component.activeCompanies).toEqual(['Client1', 'Client2']);
    expect(component.activeCompaniesLoaded).toBeTrue();
  }));

  it('should load survey titles on init', fakeAsync(() => {
    // Setup a spy on the component method
    spyOn(component, 'getGetSurveyTitleList').and.callThrough();
    
    // Call ngOnInit which should call getGetSurveyTitleList
    component.ngOnInit();
    tick();

    // Verify the method was called
    expect(component.getGetSurveyTitleList).toHaveBeenCalled();
    expect(fileTracService.GetSurveyTitleList).toHaveBeenCalled();
    expect(component.surveyTitle).toEqual(mockSurveyTitles.data.titles);
    expect(component.surveyName).toEqual(mockSurveyTitles.data.surveyName);
    expect(component.surveyTitleLoaded).toBeTrue();
  }));

  it('should handle error when loading company names', fakeAsync(() => {
    // Change the return value for this specific test
    fileTracService.GetListOfCompanyName.and.returnValue(throwError(() => new Error('API Error')));
    
    // Call the method directly
    component.getListOfCompanyName();
    tick();

    // Check the component state after error
    expect(component.companyNames).toEqual([]);
    expect(component.companyNamesLoaded).toBeFalse();
  }));

  it('should sort filter list alphabetically', () => {
    component.sortFilterList();
    
    for (let i = 1; i < component.filters.length; i++) {
      expect(component.filters[i-1].title! <= component.filters[i].title!).toBeTrue();
    }
  });

  it('should check if array options are empty', () => {
    expect(component.isArrayOptionsEmpty('nonexistentField')).toBeTrue();
    expect(component.isArrayOptionsEmpty('status')).toBeFalse();
  });

  it('should handle empty or not empty operators', () => {
    const nullFilter: FilterDescriptor = { field: 'test', operator: 'isnull' };
    const notNullFilter: FilterDescriptor = { field: 'test', operator: 'isnotnull' };
    const otherFilter: FilterDescriptor = { field: 'test', operator: 'eq' };

    expect(component.isOperatorEmptyOrNotEmpty(nullFilter)).toBeTrue();
    expect(component.isOperatorEmptyOrNotEmpty(notNullFilter)).toBeTrue();
    expect(component.isOperatorEmptyOrNotEmpty(otherFilter)).toBeFalse();
  });

  it('should apply filters and emit data', () => {
    spyOn(component.data, 'emit');
    const testFilter: CompositeFilterDescriptor = {
      logic: 'and',
      filters: [
        { field: 'status', operator: 'eq', value: 'Active' }
      ]
    };

    component.applyFilters(testFilter);

    expect(localStorage.getItem('filterStateFind')).toBeTruthy();
    expect(sharedAdjusterService.setFilter).toHaveBeenCalled();
    expect(sharedAdjusterService.isFilterApplyed).toHaveBeenCalledWith(true);
    expect(component.data.emit).toHaveBeenCalled();
  });

  it('should format dates in filters', () => {
    const dateFilter: CompositeFilterDescriptor = {
      logic: 'and',
      filters: [
        { 
          field: 'lastLogin', 
          operator: 'eq', 
          value: new Date('2024-03-04') 
        }
      ]
    };

    component.applyFilters(dateFilter);
    
    const savedFilter = JSON.parse(localStorage.getItem('filterStateFind')!);
    expect(savedFilter.filters[0].value).toBe('03-04-2024');
  });

  it('should handle filter changes for multiselect', () => {
    const event = ['Value1', 'Value2'];
    const currentItem: FilterDescriptor = {
      field: 'status',
      operator: 'eq'
    };

    component.onChangeForMultiselect(event, currentItem);
    expect(currentItem.value).toEqual(event);
  });

  it('should convert filter to SQL', () => {
    const filter: CompositeFilterDescriptor = {
      logic: 'and',
      filters: [
        { field: 'status', operator: 'eq', value: 'Active' },
        { field: 'companyName', operator: 'contains', value: 'Test' }
      ]
    };

    sharedAdjusterService.setOperator.and.callThrough();
    sharedAdjusterService.getOperator.and.returnValue('AND');

    const sql = component.convertFilterToSQL(filter);
    expect(sql).toContain('status');
    expect(sql).toContain('companyName');
    expect(sql).toContain('AND');
    expect(sharedAdjusterService.setOperator).toHaveBeenCalledWith('and');
  });

  it('should handle operator changes in filter', () => {
    const filter: CompositeFilterDescriptor = {
      logic: 'or',
      filters: [
        { field: 'status', operator: 'eq', value: 'Active' },
        { field: 'companyName', operator: 'contains', value: 'Test' }
      ]
    };

    sharedAdjusterService.setOperator.and.callThrough();
    sharedAdjusterService.getOperator.and.returnValue('OR');

    component.applyFilters(filter);
    expect(sharedAdjusterService.setOperator).toHaveBeenCalledWith('or');
  });

 

  it('should handle ngOnChanges', () => {
    const changes = {
      filteredData: {
        currentValue: [{ id: 1, name: 'New Data' }],
        previousValue: mockFilteredData,
        firstChange: false,
        isFirstChange: () => false
      }
    };

    component.ngOnChanges(changes);
    expect(component.originalUserData).toEqual([{ id: 1, name: 'New Data' }]);
  });

  it('should apply saved filter from localStorage', () => {
    const savedFilter: CompositeFilterDescriptor = {
      logic: 'and',
      filters: [
        { field: 'status', operator: 'eq', value: 'Active' }
      ]
    };
    localStorage.setItem('filterStateFind', JSON.stringify(savedFilter));

    component.applySavedFilter();

    expect(component.value).toEqual(savedFilter);
    expect(sharedAdjusterService.isFilterApplyed).toHaveBeenCalledWith(true);
  });
});
