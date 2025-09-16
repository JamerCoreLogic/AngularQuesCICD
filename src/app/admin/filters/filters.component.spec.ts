// filters.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FiltersComponent } from './filters.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FileTracService } from 'src/app/services/file-trac.service';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

// Import Kendo UI Modules
import { FilterModule } from '@progress/kendo-angular-filter';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  let fileTracServiceSpy: jasmine.SpyObj<FileTracService>;
  let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;

  // Mock data
  const mockCompanyNames = ['Company1', 'Company2'];
  const mockActiveCompanies = ['Active1', 'Active2'];
  const mockSurveyData = {
    titles: ['Title1', 'Title2'],
    surveyName: ['Survey1', 'Survey2']
  };

  beforeEach(async () => {
    // Create spy object with all required methods
    fileTracServiceSpy = jasmine.createSpyObj('FileTracService', [
      'GetListOfCompanyName',
      'GetFileTracActiveCompanies',
      'GetSurveyTitleList'
    ]);

    // Setup default spy return values
    fileTracServiceSpy.GetListOfCompanyName.and.returnValue(of({ data: mockCompanyNames }));
    fileTracServiceSpy.GetFileTracActiveCompanies.and.returnValue(of({ data: mockActiveCompanies }));
    fileTracServiceSpy.GetSurveyTitleList.and.returnValue(of({ data: mockSurveyData }));

    cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      declarations: [FiltersComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        FilterModule,
        InputsModule,
        DropDownsModule,
        DateInputsModule
      ],
      providers: [
        { provide: FileTracService, useValue: fileTracServiceSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    
    // Spy on component methods that might cause issues
    spyOn(component, 'applySavedFilter').and.callThrough();
    spyOn(component, 'initializeFieldDataMap' as any).and.callThrough();
    spyOn(component, 'sortFilterlist').and.callThrough();
    
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.value.logic).toBe('and');
      expect(component.value.filters).toEqual([]);
      expect(component.range.start).toBeNull();
      expect(component.range.end).toBeNull();
    });

    it('should load company names on init', () => {
      expect(fileTracServiceSpy.GetListOfCompanyName).toHaveBeenCalled();
      expect(component.companyNames).toEqual(['Company1', 'Company2']);
    });

 
  });

  describe('Filter Operations', () => {
    it('should convert filter to SQL correctly', () => {
      const filterDescriptor = {
        logic: 'and',
        filters: [
          { field: 'companyName', operator: 'contains', value: 'Test' },
          { field: 'status', operator: 'eq', value: 'Active' }
        ]
      };

      const result = component.convertFilterToSQL(filterDescriptor);
      expect(result).toContain("companyName LIKE '%Test%'");
      expect(result).toContain("status = 'Active'");
    });

    it('should handle empty filters', () => {
      const result = component.convertFilterToSQL({ logic: 'and', filters: [] });
      expect(result).toBe('');
    });

    it('should convert operators to SQL correctly', () => {
      expect(component.convertOperatorToSQL('eq')).toBe('=');
      expect(component.convertOperatorToSQL('contains')).toBe('LIKE');
      expect(component.convertOperatorToSQL('unknown')).toBe('');
    });
  });

  describe('Value Handling', () => {
    it('should handle SQL values correctly', () => {
      expect(component.handleValueForSQL('test', 'eq')).toBe("'test'");
      expect(component.handleValueForSQL(123, 'eq')).toBe(123);
      expect(component.handleValueForSQL('test', 'contains')).toBe("'%test%'");
    });

    it('should handle multiselect values', () => {
      const item = { value: 'test,value', field: 'testField' };
      const result = component.getMultiselectValue(item);
      expect(result).toEqual(['test,value']);
    });

    it('should handle date values', () => {
      const date = new Date('2023-01-01');
      const item = { value: date };
      const result = component.getDateValue(item);
      expect(result).toEqual(date);
    });
  });

  describe('Filter Application', () => {
    it('should apply filters correctly', fakeAsync(() => {
      const filterDescriptor = {
        logic: 'and',
        filters: [
          { field: 'status', operator: 'eq', value: 'Active' }
        ]
      };

      spyOn(component.data, 'emit');
      component.applyFilters(filterDescriptor as CompositeFilterDescriptor);
      tick();

      expect(component.data.emit).toHaveBeenCalled();
      expect(localStorage.getItem('filterState')).toBeTruthy();
    }));

    it('should handle manual filter application with missing values', fakeAsync(() => {
      const filterDescriptor = {
        logic: 'and',
        filters: [
          { field: 'status', operator: 'eq', value: '' }
        ]
      };

      component.dataForFilter = filterDescriptor;
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));

      component.applyfiltersManual();
      tick();

      expect(Swal.fire).toHaveBeenCalled();
    }));
  });

  describe('Reset Operations', () => {
    it('should initialize values correctly', () => {
      spyOn(component.resetSearchvalue, 'emit');
      spyOn(component.companyNamevalue, 'emit');
      spyOn(component.dateForFilter, 'emit');

      component.initializeValue();

      expect(component.value.filters).toEqual([]);
      expect(component.range.start).toBeNull();
      expect(component.range.end).toBeNull();
      expect(component.resetSearchvalue.emit).toHaveBeenCalled();
      expect(component.companyNamevalue.emit).toHaveBeenCalled();
      expect(component.dateForFilter.emit).toHaveBeenCalled();
    });
  });

  describe('Data Handling', () => {
    it('should handle filter changes correctly', () => {
      component.handleFilterChange('test', 'companyName');
      expect(component.fieldDataMap['companyName']).toBeDefined();
    });

    it('should update data for field correctly', () => {
      const newData = ['Test1', 'Test2'];
      component.updateDataForField('companyName', newData);
      expect(component.fieldDataMap['companyName']).toEqual(newData);
    });
  });

  describe('Date Handling', () => {
    it('should format dates correctly', () => {
      const date = new Date('2023-01-01');
      const result = component.dateToUS(date);
      expect(result).toBe('01-01-2023');
    });

    it('should handle null dates', () => {
      expect(component.dateToUS(null)).toBe('');
    });
  });



  describe('Utility Methods', () => {
    beforeEach(() => {
      // Ensure component is initialized without calling actual service methods
      spyOn(component, 'getListOfCompanyName');
      spyOn(component, 'getFileTracActiveCompanies');
      spyOn(component, 'getGetSurveyTitleList');
      component.ngOnInit();
    });

    it('should convert operator to SQL correctly', () => {
      expect(component.convertOperatorToSQL('eq')).toBe('=');
      expect(component.convertOperatorToSQL('contains')).toBe('LIKE');
      expect(component.convertOperatorToSQL('unknown')).toBe('');
    });

    it('should handle values for SQL correctly', () => {
      expect(component.handleValueForSQL('test', 'eq')).toBe("'test'");
      expect(component.handleValueForSQL(123, 'eq')).toBe(123);
      expect(component.handleValueForSQL('test', 'contains')).toBe("'%test%'");
    });

    it('should retrieve options for a given field', () => {
      const options = component.getOptionsForField('status');
      expect(options).toContain('Active');
      expect(options).toContain('Inactive');
    });

    it('should correctly determine if operator is "isnull" or "isnotnull"', () => {
      expect(component.isOperatorEmptyOrNotEmpty({ operator: 'isnull' } as any)).toBeTrue();
      expect(component.isOperatorEmptyOrNotEmpty({ operator: 'isnotnull' } as any)).toBeTrue();
      expect(component.isOperatorEmptyOrNotEmpty({ operator: 'eq' } as any)).toBeFalse();
    });
  });
});
