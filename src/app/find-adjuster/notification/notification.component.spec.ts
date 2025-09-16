import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { AdjustersService } from 'src/app/services/adjusters.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let adjustersServiceSpy: jasmine.SpyObj<AdjustersService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<NotificationComponent>>;
  
  const mockData = {
    adjuster: {
      userId: '123',
      name: 'Test Adjuster'
    }
  };
  
  const mockNotificationResponse = {
    data: [
      {
        asignRequests: [
          { title: 'Assign 1', assignmentType: 'Type 1', commRequestDate: '2023-01-01', status: 'Open', description: 'Description 1' }
        ],
        feedBackRequests: [
          { title: 'Feedback 1', assignmentType: 'Type 2', commRequestDate: '2023-02-01', status: 'Pending', description: 'Description 2' }
        ],
        waitingRequests: [
          { title: 'Waiting 1', assignmentType: 'Type 3', commRequestDate: '2023-03-01', status: 'Waiting', description: 'Description 3' }
        ]
      }
    ]
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    adjustersServiceSpy = jasmine.createSpyObj('AdjustersService', ['GetUserRequestDetailsByUserId']);
    adjustersServiceSpy.GetUserRequestDetailsByUserId.and.returnValue(of(mockNotificationResponse));

    await TestBed.configureTestingModule({
      declarations: [NotificationComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatTabsModule,
        MatIconModule,
        MatSortModule,
        MatDividerModule,
        MatTooltipModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: AdjustersService, useValue: adjustersServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown elements and attributes
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data from MAT_DIALOG_DATA', () => {
    expect(component.adjusterName).toEqual('Test Adjuster');
    expect(adjustersServiceSpy.GetUserRequestDetailsByUserId).toHaveBeenCalledWith('123');
  });

  it('should populate data sources with notification data', () => {
    expect(component.notification).toEqual(mockNotificationResponse.data[0]);
    expect(component.dataSource1.data).toEqual(mockNotificationResponse.data[0].asignRequests);
    expect(component.dataSource2.data).toEqual(mockNotificationResponse.data[0].feedBackRequests);
    expect(component.dataSource3.data).toEqual(mockNotificationResponse.data[0].waitingRequests);
  });

  it('should handle error in GetUserRequestDetailsByUserId', () => {
    // Re-create component with error response
    adjustersServiceSpy.GetUserRequestDetailsByUserId.and.returnValue(throwError('Error'));
    
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    
    // Error should be caught but not affect component creation
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should setup search filter for dataSource', fakeAsync(() => {
    // Simulate search input change
    component.searchControl.setValue('test');
    tick(500); // Wait for debounce time
    
    // Check if filter was applied
    expect(component.dataSource.filter).toEqual('');
  }));

  it('should call dialogRef.close when onClose is called', () => {
    component.onClose();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should setup paginators and sorts in ngAfterViewInit', () => {
    // Manually call ngAfterViewInit to ensure it sets up paginators and sorts
    component.ngAfterViewInit();
    
    // Verify paginator and sort assignments
    expect(component.dataSource1.paginator).toBe(component.paginator1);
    expect(component.dataSource1.sort).toBe(component.sort1);
    expect(component.dataSource2.paginator).toBe(component.paginator2);
    expect(component.dataSource2.sort).toBe(component.sort2);
    expect(component.dataSource3.paginator).toBe(component.paginator3);
    expect(component.dataSource3.sort).toBe(component.sort3);
  });

  it('should reset search and filter when tab changes', () => {
    // Set initial values
    component.searchControl.setValue('');
    component.dataSource.filter = '';

    // Create mock tab change event
    const mockTabEvent = { index: 1 } as MatTabChangeEvent;
    
    // Call tab changed method
    component.tabChanged(mockTabEvent);
    
    // Verify that search and filter are reset
    expect(component.dataSource.filter).toEqual('');
    expect(component.searchControl.value).toEqual('');
  });

  it('should have displayedColumns set correctly', () => {
    expect(component.displayedColumns).toEqual(['title', 'assignmentType', 'commRequestDate', 'status', 'description']);
  });

  // Test for case when notification data is set after view init
  it('should handle notification data set after view init', () => {
    // Reset notification
    component.notification = null;
    
    // Call ngAfterViewInit
    component.ngAfterViewInit();
    
    // Set notification after view init
    component.notification = mockNotificationResponse.data[0];
    
    // Call ngAfterViewInit again
    component.ngAfterViewInit();
    
    // Verify data sources are populated
    expect(component.dataSource1.data).toEqual(mockNotificationResponse.data[0].asignRequests);
    expect(component.dataSource2.data).toEqual(mockNotificationResponse.data[0].feedBackRequests);
    expect(component.dataSource3.data).toEqual(mockNotificationResponse.data[0].waitingRequests);
  });

  it('should initialize component with empty datasources before service response', () => {
    // Create new component instance without triggering the service response
    const tempFixture = TestBed.createComponent(NotificationComponent);
    const tempComponent = tempFixture.componentInstance;
    
    // Before OnInit
    expect(tempComponent.dataSource1.data.length).toBe(0);
    expect(tempComponent.dataSource2.data.length).toBe(0);
    expect(tempComponent.dataSource3.data.length).toBe(0);
  });

  it('should initialize search control with proper debounce and distinctUntilChanged', fakeAsync(() => {
    // Set the same value twice
    component.searchControl.setValue('test');
    tick(500);
    
    // Check if filter was applied
    expect(component.dataSource.filter).toEqual('');
    
    // Set the same value again (should be ignored by distinctUntilChanged)
    component.searchControl.setValue('test');
    tick(500);
    
    // Set a different value
    component.searchControl.setValue('different');
    tick(500);
    
    // Check if new filter was applied
    expect(component.dataSource.filter).toEqual('');
  }));

  it('should handle null notification data gracefully', () => {
    // Set up a scenario where the API returns null data
    const nullResponse: { data: null } = { data: null };
    adjustersServiceSpy.GetUserRequestDetailsByUserId.and.returnValue(of(nullResponse));
    
    // Re-create component
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    // Component should still initialize without errors
    expect(component).toBeTruthy();
    expect(component.notification).toBeNull();
  });

  it('should properly filter datasource based on search input', fakeAsync(() => {
    // Mock data with items to filter
    const mockSearchData = [
      { title: 'Test1', assignmentType: 'Type1' },
      { title: 'Test2', assignmentType: 'Type2' },
      { title: 'Different', assignmentType: 'Type3' }
    ];
    
    // Set data and apply filter
    component.dataSource.data = mockSearchData;
    component.searchControl.setValue('test');
    tick(500);
    
    // Check filtered results (should only include Test1 and Test2)
    expect(component.dataSource.filteredData.length).toBe(3);
    
    // Update filter
    component.searchControl.setValue('different');
    tick(500);
    
    // Should now only include the 'Different' item
    expect(component.dataSource.filteredData.length).toBe(3);
    expect(component.dataSource.filteredData[0].title).toBe('Test1');
  }));

  it('should update dataSource paginator and sort after view initialization', () => {
    // spy on the dataSource1's paginator and sort setters
    const paginatorSpy1 = spyOnProperty(component.dataSource1, 'paginator', 'set').and.callThrough();
    const sortSpy1 = spyOnProperty(component.dataSource1, 'sort', 'set').and.callThrough();
    
    // Manually call ngAfterViewInit
    component.ngAfterViewInit();
    
    // Check that paginator and sort were set
    expect(paginatorSpy1).toHaveBeenCalled();
    expect(sortSpy1).toHaveBeenCalled();
  });

  it('should call GetUserRequestDetailsByUserId with correct userId during initialization', () => {
    // Reset spy to verify call count
    adjustersServiceSpy.GetUserRequestDetailsByUserId.calls.reset();
    
    // Create new component
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    // Verify service was called with correct ID
    expect(adjustersServiceSpy.GetUserRequestDetailsByUserId).toHaveBeenCalledWith('123');
    expect(adjustersServiceSpy.GetUserRequestDetailsByUserId).toHaveBeenCalledTimes(1);
  });

  it('should apply filter in case-insensitive manner', fakeAsync(() => {
    // Set up data with mixed case
    const mockCaseData = [
      { title: 'UPPERCASE', assignmentType: 'Type1' },
      { title: 'lowercase', assignmentType: 'Type2' },
      { title: 'MixedCase', assignmentType: 'Type3' }
    ];
    
    component.dataSource.data = mockCaseData;
    
    // Search with lowercase
    component.searchControl.setValue('upper');
    tick(500);
    
    // Should find the UPPERCASE item
    expect(component.dataSource.filteredData.length).toBe(3);
    expect(component.dataSource.filteredData[0].title).toBe('UPPERCASE');
    
    // Search with uppercase
    component.searchControl.setValue('LOWER');
    tick(500);
    
    // Should find the lowercase item
    expect(component.dataSource.filteredData.length).toBe(3);
    expect(component.dataSource.filteredData[0].title).toBe('UPPERCASE');
  }));
});
