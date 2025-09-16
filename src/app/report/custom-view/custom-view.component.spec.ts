import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CustomViewComponent } from './custom-view.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ReportsService } from 'src/app/services/reports.service';
import { DatePipe } from '@angular/common';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { BehaviorSubject, Observable, Subject, of, throwError } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FiledsListModel } from 'src/app/models/user-models';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CustomViewComponent', () => {
  let component: CustomViewComponent;
  let fixture: ComponentFixture<CustomViewComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockSpinnerService: jasmine.SpyObj<NgxSpinnerService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockReportsService: jasmine.SpyObj<ReportsService>;
  let mockDatePipe: jasmine.SpyObj<DatePipe>;

  const mockUserData = {
    data: {
      getUserListForReqDashboard: [
        {
          name: 'Test User',
          city: 'Test City',
          state: 'Test State',
          zip: '12345',
          emailAddress: 'test@test.com'
        }
      ],
      count: 1
    }
  };

  const mockFieldsList = {
    data: [
      { keyName: 'name', keyValue: 'Name', isDefault: true, type: 'string' },
      { keyName: 'city', keyValue: 'City', isDefault: true, type: 'string' },
      { keyName: 'state', keyValue: 'State', isDefault: true, type: 'string' }
    ] as FiledsListModel[]
  };

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isUserAllowed']);
    mockSpinnerService = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockReportsService = jasmine.createSpyObj('ReportsService', [
      'GetFiledsListForReports',
      'GetCustomViewList',
      'GetRequestedListForReportDashboard'
    ]);
    mockDatePipe = jasmine.createSpyObj('DatePipe', ['transform']);

    // Setup default mock returns
    mockAuthService.isUserAllowed.and.returnValue({ isAllow: true, allowedPath: '/dashboard' });
    mockReportsService.GetFiledsListForReports.and.returnValue(of(mockFieldsList));
    mockReportsService.GetCustomViewList.and.returnValue(of({ data: [] }));
    mockReportsService.GetRequestedListForReportDashboard.and.returnValue(of(mockUserData));

    await TestBed.configureTestingModule({
      declarations: [ CustomViewComponent],
      imports: [
        SharedMaterialModule,
        NgxSpinnerModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        
      ],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NgxSpinnerService, useValue: mockSpinnerService },
        { provide: Router, useValue: mockRouter },
        { provide: ReportsService, useValue: mockReportsService },
        { provide: DatePipe, useValue: mockDatePipe }
      ],
      schemas: [NO_ERRORS_SCHEMA] // To ignore child components we don't need to test
    }).compileComponents();

    // Mock localStorage
    jasmine.getEnv().allowRespy(true);
    spyOn(Storage.prototype, 'getItem').and.returnValue('1');
    spyOn(Storage.prototype, 'removeItem');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomViewComponent);
    component = fixture.componentInstance;
    
    // Setup ViewChild manually
    component.paginator = { pageSize: 10, pageIndex: 0 } as MatPaginator;
    component.sort = new MatSort();
    component.dataSource = new MatTableDataSource();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.pageSize).toBe(10);
    expect(component.filterBy).toBe('');
    expect(component.searchString).toBe('');
    expect(component.isFilterApplied).toBeFalse();
    expect(component.customViews).toEqual([]);
  });

  it('should remove editUser from localStorage on init', () => {
    expect(Storage.prototype.removeItem).toHaveBeenCalledWith('editUser');
  });

  it('should check user authorization on init', () => {
    expect(mockAuthService.isUserAllowed).toHaveBeenCalled();
  });

  it('should redirect unauthorized users', () => {
    // Setup unauthorized conditions
    spyOn(Storage.prototype, 'getItem').and.callFake((key: string) => {
      if (key === 'LoggedUserType') return '2'; // Non-admin user
      return null;
    });
    mockAuthService.isUserAllowed.and.returnValue({ isAllow: false, allowedPath: '/dashboard' });

    // Create component (which triggers constructor)
    fixture = TestBed.createComponent(CustomViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should load fields list on init', fakeAsync(() => {
    component.GetFiledsList();
    tick(); // wait for observable
    fixture.detectChanges();
    tick(); // final tick
  
    expect(mockSpinnerService.show).toHaveBeenCalled();
    expect(mockReportsService.GetFiledsListForReports).toHaveBeenCalled();
    expect(mockSpinnerService.hide).toHaveBeenCalled(); // ✅ this will now pass
  }));

  it('should handle error when loading fields list', fakeAsync(() => {
    mockReportsService.GetFiledsListForReports.and.returnValue(throwError(() => new Error('Test error')));
    
    component.GetFiledsList();
    tick();

    expect(mockSpinnerService.show).toHaveBeenCalled();
    expect(mockSpinnerService.hide).toHaveBeenCalled();
  }));

  it('should load custom views', fakeAsync(() => {
    const mockCustomViews = { data: [{ id: 1, name: 'Test View' }] };
    mockReportsService.GetCustomViewList.and.returnValue(of(mockCustomViews));

    component.getCustomViews();
    tick();

    expect(mockSpinnerService.show).toHaveBeenCalled();
    expect(component.customViews).toEqual(mockCustomViews.data);
    expect(component.selectedCustomView).toBeNull();
  }));

  it('should handle empty data response when loading custom views', fakeAsync(() => {
    mockReportsService.GetCustomViewList.and.returnValue(of({ data: null }));

    component.getCustomViews();
    tick();

    expect(component.customViews).toEqual([]);
  }));

  it('should format header display correctly', () => {
    component.FiledsList = mockFieldsList.data;
    
    expect(component.getHeaderDisplay('name')).toBe('Name');
    expect(component.getHeaderDisplay('nonexistent')).toBe('nonexistent');
  });

  it('should handle sort data correctly', () => {
    const mockSort: Sort = { active: 'name', direction: 'asc' };
    component.sortData(mockSort);
    
    expect(component.sortField).toBe('name');
    expect(component.sortOrder).toBe('asc');
  });

  it('should filter custom views based on search term', () => {
    component.customViews = [
      { name: 'Test View 1' },
      { name: 'Test View 2' },
      { name: 'Other View' }
    ];
    component.searchTerm = 'Test';

    const filteredViews = component.filterCustomViews();
    expect(filteredViews.length).toBe(2);
    expect(filteredViews.every(view => view.name.includes('Test'))).toBeTrue();
  });

  it('should select custom view correctly', () => {
    const mockView = { id: 1, name: 'Test View' };
    spyOn(component, 'applyView');

    component.selectCustomView(mockView);

    expect(component.selectedCustomView).toEqual(mockView);
    expect(component.applyView).toHaveBeenCalledWith(mockView);
  });

 

  // Test error scenarios
  it('should handle errors when loading default data', fakeAsync(() => {
    mockReportsService.GetRequestedListForReportDashboard.and.returnValue(throwError(() => new Error('Test error')));
    
    component.loadDefaultData();
    tick();

    expect(mockSpinnerService.show).toHaveBeenCalled();
    expect(mockSpinnerService.hide).toHaveBeenCalled();
  }));

  it('should setup paginator correctly', fakeAsync(() => {
    // Create a Subject for the page event
    const pageSubject = new Subject();
    
    // Setup paginator with the page observable
    component.paginator = {
      pageSize: 10,
      pageIndex: 0,
      page: pageSubject.asObservable()
    } as any;
    
    spyOn(component, 'fetchData');
    
    // Setup paginator
    component.setupPaginator();
    
    // First page event (will be skipped due to skip(1))
    pageSubject.next({});
    tick();
    expect(component.fetchData).not.toHaveBeenCalled();
    
    // Second page event (should trigger fetchData)
    pageSubject.next({});
    tick();
    expect(component.fetchData).toHaveBeenCalled();
  }));
});
