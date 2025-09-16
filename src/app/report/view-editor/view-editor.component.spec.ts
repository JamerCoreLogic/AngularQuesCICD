import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ViewEditorComponent } from './view-editor.component';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { ReportsService } from 'src/app/services/reports.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ChangeDetectorRef, Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { FiledsListModel } from 'src/app/models/user-models';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';

// Create a mock component for FiltersComponent
@Component({
  selector: 'app-filters',
  template: '<div>Mock Filters Component</div>'
})
class MockFiltersComponent {
  @Input() filteredData$: any;
  @Input() filterFieldsData: any;
  @Input() hideActionButtons: boolean = false;
  @Input() isViewOnlyMode: boolean = false;
  @Input() savedFilterObject: any;

  triggerApplyFilters() {}
}

describe('ViewEditorComponent', () => {
  let component: ViewEditorComponent;
  let fixture: ComponentFixture<ViewEditorComponent>;
  let reportsService: jasmine.SpyObj<ReportsService>;
  let spinnerService: jasmine.SpyObj<NgxSpinnerService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;
  let cdRef: jasmine.SpyObj<ChangeDetectorRef>;
  let debugElement: DebugElement;
  let localStorageSpy: jasmine.Spy;
  
  // Mock data
  const mockFiledsList: FiledsListModel[] = [
    { keyName: 'name', keyValue: 'Name', isDefault: true, type: 'string' },
    { keyName: 'emailAddress', keyValue: 'Email Address', isDefault: true, type: 'string' },
    { keyName: 'state', keyValue: 'State', isDefault: false, type: 'string' },
    { keyName: 'city', keyValue: 'City', isDefault: false, type: 'string' },
    { keyName: 'status', keyValue: 'Status', isDefault: false, type: 'string' }
  ];
  
  const mockAvailableColumns: FiledsListModel[] = [
    { keyName: 'state', keyValue: 'State', isDefault: false, type: 'string' },
    { keyName: 'city', keyValue: 'City', isDefault: false, type: 'string' },
    { keyName: 'status', keyValue: 'Status', isDefault: false, type: 'string' },
    { keyName: 'emailAddress', keyValue: 'Email Address', isDefault: false, type: 'string' }
  ];
  
  const mockFilterObject: CompositeFilterDescriptor = {
    logic: 'and',
    filters: [
      {
        field: 'state',
        operator: 'eq',
        value: 'Florida'
      }
    ]
  };
  
  const mockCustomView = {
    customViewId: 123,
    name: 'Test View',
    filter: JSON.stringify({
      filterObject: mockFilterObject,
      sqlQuery: 'SELECT * FROM Users WHERE state = "Florida"',
      companyName: 'Test Company',
      surveyName: 'Test Survey',
      surveyTitle: 'Test Title',
      dateFilter: null,
      operator: 'AND',
      pageNumber: 1,
      numberOfRecords: 10,
      searchKey: '',
      searchValue: '',
      sortField: '',
      sortOrder: ''
    }),
    kendoFilter: JSON.stringify(mockFilterObject),
    isAdmin: false,
    isInternal: true,
    createdBy: 1,
    modifiedBy: 1,
    columns: [
      { id: 1, keyValue: 'Name', keyName: 'name', type: 'string' },
      { id: 2, keyValue: 'Email Address', keyName: 'emailAddress', type: 'string' }
    ]
  };

  // Mock Sweet Alert
  const mockSwal = {
    fire: jasmine.createSpy('fire').and.returnValue(Promise.resolve({ isConfirmed: true }))
  };
  
  beforeEach(async () => {
    // Create spy objects for services
    const reportsServiceSpy = jasmine.createSpyObj('ReportsService', [
      'GetActiveModuleColumns',
      'GetCustomView',
      'AddUpdateCustomView'
    ]);
    
    const spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isUserAllowed', 'getClients']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const cdRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    
    // Create mock activatedRoute
    activatedRoute = {
      queryParamMap: new BehaviorSubject(convertToParamMap({}))
    };
    
    await TestBed.configureTestingModule({
      declarations: [
        ViewEditorComponent,
        MockFiltersComponent
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
        SharedMaterialModule,
        BrowserAnimationsModule,
        NgxSpinnerModule,
        DragDropModule
      ],
      providers: [
        FormBuilder,
        { provide: ReportsService, useValue: reportsServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ChangeDetectorRef, useValue: cdRefSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Add this to prevent unknown property errors
    }).compileComponents();
    
    reportsService = TestBed.inject(ReportsService) as jasmine.SpyObj<ReportsService>;
    spinnerService = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    cdRef = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
    
    // Setup default spy returns
    reportsService.GetActiveModuleColumns.and.returnValue(of({ 
      success: true, 
      data: mockFiledsList 
    }));
    
    authService.isUserAllowed.and.returnValue({ isAllow: true, allowedPath: '/main/dashboard' });
    
    // Spy on Swal.fire
    spyOn(Swal, 'fire').and.callFake(mockSwal.fire);
    
    // Use a single spy for localStorage to avoid conflicts
    localStorageSpy = spyOn(localStorage, 'getItem').and.callFake((key) => {
      if (key === 'LoggedUserRole') return '1';
      if (key === 'LoggedUserType') return '1';
      if (key === 'LoggeduserId') return JSON.stringify(1);
      if (key === 'filterStateReports') return null;
      return null;
    });
    
    spyOn(localStorage, 'removeItem').and.callFake(() => {});
    spyOn(localStorage, 'setItem').and.callFake(() => {});
    
    fixture = TestBed.createComponent(ViewEditorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    
    // Initialize availableColumns manually
    component.availableColumns = [...mockAvailableColumns];
  });
  
  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  
  describe('Initialization', () => {
    it('should initialize in create mode by default', () => {
      fixture.detectChanges();
      expect(component.isCreateView).toBeTrue();
      expect(component.customViewId).toBe(0);
      expect(component.viewName).toBe('Untitled view');
    });
    
    it('should fetch field list on initialization', () => {
      fixture.detectChanges();
      expect(reportsService.GetActiveModuleColumns).toHaveBeenCalled();
      expect(component.FiledsList).toEqual(mockFiledsList);
    });
    
    it('should set view-only mode if user role is 3', () => {
      localStorageSpy.and.callFake((key) => {
        if (key === 'LoggedUserRole') return '3';
        if (key === 'LoggedUserType') return '1';
        if (key === 'LoggeduserId') return JSON.stringify(1);
        if (key === 'filterStateReports') return null;
        return null;
      });
      
      fixture = TestBed.createComponent(ViewEditorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.isViewOnlyMode).toBeTrue();
    });
    
    it('should navigate away if user type is not allowed', () => {
      localStorageSpy.and.callFake((key) => {
        if (key === 'LoggedUserRole') return '1';
        if (key === 'LoggedUserType') return '2';
        if (key === 'LoggeduserId') return JSON.stringify(1);
        if (key === 'filterStateReports') return null;
        return null;
      });
      
      fixture = TestBed.createComponent(ViewEditorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(['/main/dashboard']);
    });
    
    it('should handle edit mode when query parameter has ID', fakeAsync(() => {
      // Setup mock view data
      reportsService.GetCustomView.and.returnValue(of(mockCustomView));
      
      // Simulate navigation with ID parameter
      activatedRoute.queryParamMap.next(
        convertToParamMap({ id: '123' })
      );
      
      fixture.detectChanges();
      tick();
      
      expect(component.isCreateView).toBeFalse();
      expect(component.customViewId).toBe(123);
      expect(component.viewName).toBe('Test View');
      expect(reportsService.GetCustomView).toHaveBeenCalledWith(123);
      expect(component.savedFilterObject).toEqual(mockFilterObject);
      expect(spinnerService.show).toHaveBeenCalled();
      expect(spinnerService.hide).toHaveBeenCalled();
    }));
    
    it('should handle error when loading view fails', fakeAsync(() => {
      reportsService.GetCustomView.and.returnValue(throwError(() => new Error('Failed to load view')));
      
      activatedRoute.queryParamMap.next(
        convertToParamMap({ id: '123' })
      );
      
      fixture.detectChanges();
      tick();
      
      expect(Swal.fire).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/main/report/custom-view']);
    }));
  });
  
  describe('Column management', () => {
    beforeEach(() => {
      fixture.detectChanges();
      // Make sure availableColumns has values for these tests
      component.availableColumns = [...mockAvailableColumns];
    });
    
    it('should add a column to selected columns', () => {
      const columnToAdd = { ...component.availableColumns[0] }; // Create a copy to avoid reference issues
      const initialAvailableCount = component.availableColumns.length;
      const initialSelectedCount = component.selectedColumns.length;
      
      component.addColumn(columnToAdd);
      
      expect(component.availableColumns.length).toBe(initialAvailableCount - 1);
      expect(component.selectedColumns.length).toBe(initialSelectedCount + 1);
      expect(component.selectedColumns).toContain(jasmine.objectContaining({
        keyValue: columnToAdd.keyValue
      }));
      expect(columnToAdd.isDefault).toBeTrue();
    });
    
    it('should remove a column from selected columns', () => {
      // First add a column
      const columnToAdd = { ...component.availableColumns[0] }; // Create a copy
      component.addColumn(columnToAdd);
      
      const initialAvailableCount = component.availableColumns.length;
      const initialSelectedCount = component.selectedColumns.length;
      
      // Then remove it
      component.removeColumn(columnToAdd);
      
      expect(component.availableColumns.length).toBe(initialAvailableCount + 1);
      expect(component.selectedColumns.length).toBe(initialSelectedCount - 1);
      expect(component.selectedColumns).not.toContain(jasmine.objectContaining({
        keyValue: columnToAdd.keyValue
      }));
      expect(columnToAdd.isDefault).toBeFalse();
    });
    
    it('should filter available columns based on search term', () => {
      component.availableColumns = [...mockAvailableColumns];
      component.availableSearchTerm = 'email';
      
      const filteredColumns = component.filteredAvailableColumns;
      expect(filteredColumns.length).toBeLessThan(component.availableColumns.length);
      expect(filteredColumns[0].keyValue.toLowerCase()).toContain('email');
    });
    
    it('should filter selected columns based on search term', () => {
      // Add a column to selected
      const columnToAdd = { ...component.availableColumns[0] }; // Create a copy
      component.addColumn(columnToAdd);
      
      component.selectedSearchTerm = columnToAdd.keyValue.substring(0, 3).toLowerCase();
      
      expect(component.filteredSelectedColumns.length).toBeGreaterThan(0);
      expect(component.filteredSelectedColumns[0].keyValue.toLowerCase())
        .toContain(component.selectedSearchTerm.toLowerCase());
    });
    
    it('should handle column drag and drop reordering', () => {
      // Add two columns to selected
      const column1 = { ...component.availableColumns[0] }; // Create copies
      const column2 = { ...component.availableColumns[1] };
      component.addColumn(column1);
      component.addColumn(column2);
      
      const firstItem = component.selectedColumns[0];
      const secondItem = component.selectedColumns[1];
      
      // Fixed: Using proper CdkDragDrop type with missing properties
      const dropEvent: CdkDragDrop<FiledsListModel[]> = {
        previousIndex: 0,
        currentIndex: 1,
        item: {} as any,
        container: {} as any,
        previousContainer: {} as any,
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new MouseEvent('drop')
      };
      
      component.onColumnDrop(dropEvent);
      
      expect(component.selectedColumns[0]).toEqual(secondItem);
      expect(component.selectedColumns[1]).toEqual(firstItem);
    });
  });
  
  describe('Filter interactions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    
    it('should update filter data when received from filters component', () => {
      const testSqlQuery = 'SELECT * FROM Users WHERE state = "Texas"';
      component.updateFilterData(testSqlQuery);
      expect(component.sqlQuery).toBe(testSqlQuery);
      expect(component.filterData).toBe(testSqlQuery);
    });
    
    it('should update operator when received', () => {
      component.getOperator('OR');
      expect(component.operator).toBe('OR');
    });
    
    it('should update company name when received', () => {
      component.getCompanyName('Test Company');
      expect(component.companyName).toBe('Test Company');
    });
    
    it('should update survey name when received', () => {
      component.getSurveyName('Test Survey');
      expect(component.surveyName).toBe('Test Survey');
    });
    
    it('should update survey title when received', () => {
      component.getSurveyTitle('Test Title');
      expect(component.surveyTitle).toBe('Test Title');
    });
    
    it('should update date filter when received', () => {
      const dateRange = { start: new Date(), end: new Date() };
      component.getDateforFilter(dateRange);
      expect(component.dateFilter).toEqual(dateRange);
    });
    
    it('should update filter object when received', () => {
      component.getFilterObject(mockFilterObject);
      expect(component.filterObject).toEqual(mockFilterObject);
    });
    
    it('should reset search values when requested', () => {
      // Set values first
      component.filterData = 'test';
      component.sqlQuery = 'test';
      component.companyName = 'test';
      component.surveyName = 'test';
      component.surveyTitle = 'test';
      component.dateFilter = { start: new Date(), end: new Date() };
      component.filterObject = mockFilterObject;
      
      // Now reset
      component.resetSearchvalueinReports(true);
      
      expect(component.filterData).toBeNull();
      expect(component.sqlQuery).toBe('');
      expect(component.companyName).toBe('');
      expect(component.surveyName).toBe('');
      expect(component.surveyTitle).toBe('');
      expect(component.dateFilter).toBeNull();
      expect(component.filterObject).toBeNull();
    });
  });
  
  describe('View name editing', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    
    it('should toggle edit mode for view name', () => {
      expect(component.isEditingViewName).toBeFalse();
      component.toggleEditViewName();
      expect(component.isEditingViewName).toBeTrue();
      expect(component.originalViewName).toBe('Untitled view');
      
      // Toggle back
      component.toggleEditViewName();
      expect(component.isEditingViewName).toBeFalse();
    });
    
    it('should reset to "Untitled view" if empty name provided', () => {
      component.toggleEditViewName();
      component.viewName = '';
      component.toggleEditViewName();
      expect(component.viewName).toBe('Untitled view');
    });
    
    it('should truncate view name if too long', () => {
      component.toggleEditViewName();
      component.viewName = 'A'.repeat(120);
      component.toggleEditViewName();
      expect(component.viewName.length).toBe(100);
    });
    
    it('should cancel editing and restore original name', () => {
      const originalName = component.viewName;
      component.toggleEditViewName();
      component.viewName = 'Changed name';
      component.cancelEditViewName();
      expect(component.viewName).toBe(originalName);
      expect(component.isEditingViewName).toBeFalse();
    });
    
    it('should return truncated view name if exceeds limit', () => {
      component.viewName = 'This is a very long view name that should definitely be truncated because it exceeds the limit';
      const truncated = component.getTruncatedViewName();
      expect(truncated.length).toBeLessThan(component.viewName.length);
      expect(truncated).toContain('...');
    });
  });
  
  describe('View saving functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
      // Use the MockFiltersComponent instance instead of trying to create a FiltersComponent
      const mockFiltersElement = fixture.debugElement.query(By.directive(MockFiltersComponent));
      component.filtersComponent = mockFiltersElement ? mockFiltersElement.componentInstance : new MockFiltersComponent();
      spyOn(component.filtersComponent, 'triggerApplyFilters');
      
      // Make sure availableColumns has values for these tests
      component.availableColumns = [...mockAvailableColumns];
    });
    
    it('should trigger filters before saving', () => {
      component.saveView();
      expect(component.filtersComponent.triggerApplyFilters).toHaveBeenCalled();
    });
    
    it('should show warning if view name is empty', () => {
      component.viewName = '';
      component.saveView();
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'View Name Required'
      }));
    });
    
    it('should show warning if no SQL query is provided', () => {
      component.viewName = 'Valid Name';
      component.sqlQuery = '';
      component.saveView();
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'No Filter Criteria'
      }));
    });
    
    it('should show warning if filter object is invalid', () => {
      component.viewName = 'Valid Name';
      component.sqlQuery = 'SELECT * FROM Users';
      component.filterObject = null;
      component.saveView();
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Invalid Filter Configuration'
      }));
    });
    
    it('should show warning if no columns are selected', () => {
      component.viewName = 'Valid Name';
      component.sqlQuery = 'SELECT * FROM Users';
      component.filterObject = mockFilterObject;
      component.selectedColumns = [];
      component.saveView();
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'No Columns Selected'
      }));
    });
    
  
    
    it('should handle API error when saving view', () => {
      // Setup valid data
      component.viewName = 'Valid Name';
      component.sqlQuery = 'SELECT * FROM Users';
      component.filterObject = mockFilterObject;
      
      // Add a column copy to avoid reference issues
      const columnToAdd = { ...component.availableColumns[0] };
      component.addColumn(columnToAdd);
      
      reportsService.AddUpdateCustomView.and.returnValue(throwError(() => new Error('Server error')));
      
      component.saveView();
      
      expect(spinnerService.show).toHaveBeenCalled();
      expect(reportsService.AddUpdateCustomView).toHaveBeenCalled();
      expect(spinnerService.hide).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Error'
      }));
    });
    
    it('should handle API success with error message', () => {
      // Setup valid data
      component.viewName = 'Valid Name';
      component.sqlQuery = 'SELECT * FROM Users';
      component.filterObject = mockFilterObject;
      
      // Add a column copy to avoid reference issues
      const columnToAdd = { ...component.availableColumns[0] };
      component.addColumn(columnToAdd);
      
      reportsService.AddUpdateCustomView.and.returnValue(of({ 
        success: false, 
        message: 'View name already exists' 
      }));
      
      component.saveView();
      
      expect(spinnerService.show).toHaveBeenCalled();
      expect(reportsService.AddUpdateCustomView).toHaveBeenCalled();
      expect(spinnerService.hide).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Error',
        text: 'View name already exists'
      }));
    });
  });
  
  describe('Navigation functions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    
    it('should navigate back to custom view page', () => {
      component.goBack();
      expect(router.navigate).toHaveBeenCalledWith(['/main/report/custom-view']);
    });
    
    it('should return correct page title based on mode', () => {
      // Create mode
      component.isCreateView = true;
      expect(component.getPageTitle()).toBe('Create Custom View');
      
      // Edit mode
      component.isCreateView = false;
      expect(component.getPageTitle()).toBe('Edit Custom View');
    });
  });
  
  describe('Utility functions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    
    it('should get current user ID from localStorage', () => {
      const userId = component.getCurrentUserId();
      expect(userId).toBe(1);
    });
    
    it('should handle error when getting user ID', () => {
      localStorageSpy.and.throwError('Storage error');
      const userId = component.getCurrentUserId();
      expect(userId).toBe(0);
    });
    
    it('should check for saved filter state', () => {
      // First no saved state
      component.isFilterSaved();
      expect(component.filterObject).toBeNull();
      
      // Then with saved state
      localStorageSpy.and.callFake((key) => {
        if (key === 'filterStateReports') return JSON.stringify(mockFilterObject);
        return null;
      });
      
      component.isFilterSaved();
      expect(component.filterObject).toEqual(mockFilterObject);
    });
  });
  
  describe('Component UI rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    
    it('should render page title correctly', () => {
      component.isCreateView = true;
      fixture.detectChanges();
      const title = debugElement.query(By.css('.view-name-input .truncate-text'));
      expect(title?.nativeElement.textContent.trim()).toBe('Untitled view');
    });
    
    it('should hide save button in view-only mode', () => {
      component.isViewOnlyMode = true;
      fixture.detectChanges();
      const saveButton = debugElement.query(By.css('.bg-greendark'));
      expect(saveButton).toBeNull();
    });
    
    it('should show the proper button text based on create/edit mode', () => {
      // Create mode
      component.isCreateView = true;
      fixture.detectChanges();
      let saveButton = debugElement.query(By.css('.bg-greendark'));
      expect(saveButton?.nativeElement.textContent.trim()).toBe('Create View');
      
      // Edit mode
      component.isCreateView = false;
      fixture.detectChanges();
      saveButton = debugElement.query(By.css('.bg-greendark'));
      expect(saveButton?.nativeElement.textContent.trim()).toBe('Update View');
    });
  });
});
