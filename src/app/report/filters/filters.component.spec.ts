import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FiltersComponent } from './filters.component';
import { FileTracService } from 'src/app/services/file-trac.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { FilterModule } from '@progress/kendo-angular-filter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { of, throwError } from 'rxjs';
import { DropDownsModule, MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule, DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { FormsModule } from '@angular/forms';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  let fileTracService: jasmine.SpyObj<FileTracService>;
  let authService: jasmine.SpyObj<AuthService>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;
  let localStorageGetItemSpy: jasmine.Spy;

  const mockFilterFieldsData = [
    { keyName: 'name', keyValue: 'Name', isDefault: true, type: 'string' },
    { keyName: 'age', keyValue: 'Age', isDefault: true, type: 'number' },
    { keyName: 'isActive', keyValue: 'Active', isDefault: true, type: 'boolean' },
    { keyName: 'date', keyValue: 'Date', isDefault: true, type: 'date' }
  ];

  const mockCompanyNames = {
    data: ['Company1', 'Company2', 'Company3']
  };

  const mockActiveCompanies = {
    success: true,
    data: [
      { fName: 'ActiveCompany1' },
      { fName: 'ActiveCompany2' }
    ]
  };

  const mockSurveyTitles = {
    data: ['Survey1', 'Survey2']
  };

  beforeEach(async () => {
    fileTracService = jasmine.createSpyObj('FileTracService', [
      'GetListOfCompanyName',
      'GetSurveyTitleList'
    ]);
    authService = jasmine.createSpyObj('AuthService', ['getClients']);
    cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    // Setup default spy returns
    fileTracService.GetListOfCompanyName.and.returnValue(of(mockCompanyNames));
    fileTracService.GetSurveyTitleList.and.returnValue(of(mockSurveyTitles));
    authService.getClients.and.returnValue(of(mockActiveCompanies));

    await TestBed.configureTestingModule({
      declarations: [ FiltersComponent ],
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
        { provide: FileTracService, useValue: fileTracService },
        { provide: AuthService, useValue: authService },
        { provide: ChangeDetectorRef, useValue: cdr }
      ]
    }).compileComponents();

    // Mock localStorage
    localStorageGetItemSpy = spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    component.filterFieldsData = mockFilterFieldsData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.filters).toBeDefined();
    expect(component.value.logic).toBe('and');
    expect(component.value.filters).toEqual([]);
    expect(component.hideActionButtons).toBeFalse();
    expect(component.isViewOnlyMode).toBeFalse();
  });

  it('should handle filter field data initialization', () => {
    component.ngOnInit();
    expect(component.filters.length).toBe(mockFilterFieldsData.length);
    
    // Sort the filters array as the component does
    const sortedFilters = [...mockFilterFieldsData].sort((a, b) => a.keyValue < b.keyValue ? -1 : 1);
    
    // Check that each filter is properly created
    component.filters.forEach((filter, index) => {
      const mockData = sortedFilters[index];
      expect(filter.field).toBe(mockData.keyName);
      expect(filter.editor).toBe(mockData.type);
    });
  });

  it('should load company names on init', fakeAsync(() => {
    fileTracService.GetListOfCompanyName.and.returnValue(of(mockCompanyNames));
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(fileTracService.GetListOfCompanyName).toHaveBeenCalled();
    expect(component.companyNames).toEqual(mockCompanyNames.data);
    expect(component.companyNamesLoaded).toBeTrue();
  }));



  it('should load active companies on init', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(authService.getClients).toHaveBeenCalled();
    expect(component.activeCompanies).toEqual(['ActiveCompany1', 'ActiveCompany2']);
    expect(component.activeCompaniesLoaded).toBeTrue();
  }));

  it('should apply saved filter from localStorage', fakeAsync(() => {
    const mockSavedFilter: CompositeFilterDescriptor = {
      logic: 'and',
      filters: [
        { field: 'name', operator: 'contains', value: 'test' } as FilterDescriptor
      ]
    };
    localStorageGetItemSpy.and.callFake((key: string) => {
      if (key === 'filterStateReports') {
        return JSON.stringify(mockSavedFilter);
      }
      return null;
    });

    component.ngOnInit();
    tick();

    expect(component.value).toEqual(mockSavedFilter);
    expect(component.dataForFilter).toEqual(mockSavedFilter);
  }));

  it('should handle date range from localStorage', fakeAsync(() => {
    const mockDateRange = {
      start: new Date('2024-01-01'),
      end: new Date('2024-12-31')
    };
    localStorageGetItemSpy.and.callFake((key: string) => {
      if (key === 'savedRangeStringReports') {
        return JSON.stringify(mockDateRange);
      }
      return null;
    });

    component.ngOnInit();
    tick();

    expect(component.range.start?.toISOString()).toEqual(mockDateRange.start.toISOString());
    expect(component.range.end?.toISOString()).toEqual(mockDateRange.end.toISOString());
  }));

  it('should reset filters when initializeValue is called', () => {
    const emitSpy = spyOn(component.resetSearchvalue, 'emit');
    
    component.initializeValue();

    expect(component.value.filters).toEqual([]);
    expect(component.range.start).toBeNull();
    expect(component.range.end).toBeNull();
    expect(emitSpy).toHaveBeenCalled();
    expect(localStorage.removeItem).toHaveBeenCalledWith('filterStateReports');
    expect(localStorage.removeItem).toHaveBeenCalledWith('savedRangeStringReports');
  });

  it('should handle filter change events', fakeAsync(() => {
    const mockFilter: CompositeFilterDescriptor = {
      logic: 'and',
      filters: [
        { field: 'name', operator: 'contains', value: 'test' } as FilterDescriptor
      ]
    };
    
    component.filterFn(mockFilter);
    tick();
    fixture.detectChanges();

    component.applyFilters(mockFilter);
    tick();
    fixture.detectChanges();

    expect(component.dataForFilter).toEqual(mockFilter);
    expect(localStorage.setItem).toHaveBeenCalledWith('filterStateReports', JSON.stringify(mockFilter));
  }));

  it('should convert filter to SQL query', () => {
    const mockFilter: CompositeFilterDescriptor = {
      logic: 'and',
      filters: [
        { field: 'name', operator: 'contains', value: 'test' } as FilterDescriptor
      ]
    };

    const result = component.convertFilterToSQL(mockFilter);
    expect(result).toBe("name LIKE '%test%'");
  });

  it('should handle multiselect value changes', () => {
    const mockEvent = ['value1', 'value2'];
    const mockCurrentItem: FilterDescriptor = { field: 'name', operator: 'in', value: [] };
    
    component.onChangeForMultiselect(mockEvent, mockCurrentItem);
    
    expect(mockCurrentItem.value).toEqual(mockEvent);
  });

  it('should handle single value changes', () => {
    const mockEvent = 'value1';
    const mockCurrentItem: FilterDescriptor = { field: 'name', operator: 'eq', value: null };
    
    component.onChangeForSingleValue(mockEvent, mockCurrentItem);
    
    expect(mockCurrentItem.value).toBe(mockEvent);
  });



  it('should identify date editor fields correctly', () => {
    const dateFilter = component.filters.find(f => f.editor === 'date');
    if (dateFilter) {
      expect(component['isDateEditor'](dateFilter.field)).toBeTrue();
    }
    expect(component['isDateEditor']('name')).toBeFalse();
  });

  it('should apply filters manually', fakeAsync(() => {
    const mockFilter: CompositeFilterDescriptor = {
      logic: 'and',
      filters: [
        { field: 'name', operator: 'contains', value: 'test' } as FilterDescriptor
      ]
    };
    component.value = mockFilter;

    component.applyFilters(mockFilter);
    tick();
    fixture.detectChanges();

    expect(localStorage.setItem).toHaveBeenCalledWith('filterStateReports', JSON.stringify(mockFilter));
  }));

  it('should sort filter list alphabetically', () => {
    component.filters = [
      { field: 'zebra', title: 'Zebra' },
      { field: 'apple', title: 'Apple' }
    ] as any[];

    component.sortFilterlist();

    expect(component.filters[0].title).toBe('Apple');
    expect(component.filters[1].title).toBe('Zebra');
  });
});
