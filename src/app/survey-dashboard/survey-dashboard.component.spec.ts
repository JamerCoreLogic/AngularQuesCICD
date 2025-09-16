import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatSort } from '@angular/material/sort';

import { SurveyDashboardComponent } from './survey-dashboard.component';
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from '../services/auth.service';
import { AiApiService } from '../services/ai-api.service';
import { SurveySentListComponent } from './survey-sent-list/survey-sent-list.component';
import { environment } from 'src/environments/environment';

describe('SurveyDashboardComponent', () => {
  let component: SurveyDashboardComponent;
  let fixture: ComponentFixture<SurveyDashboardComponent>;
  let mockDashboardService: jasmine.SpyObj<DashboardService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSpinner: jasmine.SpyObj<NgxSpinnerService>;
  let mockAiApiService: jasmine.SpyObj<AiApiService>;

  const mockSurveyDashboardResponse = {
    success: true,
    data: {
      activeSurveyPercentage: 70,
      closedSurveyPercentage: 30,
      activeSurveyList: [
        {
          portalId: 1,
          title: 'Test Survey 1',
          surveyName: 'Insurance Claim Survey',
          createOn: '2023-05-15',
          totelSent: 10,
          submitted: 5,
          notResponded: 5
        }
      ],
      closedSurveyList: [
        {
          portalId: 2,
          title: 'Test Survey 2',
          surveyName: 'Customer Feedback',
          createOn: '2023-04-01',
          totelSent: 15,
          submitted: 15,
          notResponded: 0
        }
      ]
    }
  };

  const mockSurveyRecordsResponse = {
    success: true,
    data: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        status: 'Completed'
      }
    ]
  };

  const mockUser = {
    data: {
      role: [
        {
          roleName: 'Admin',
          userPageList: [
            { moduleName: 'Survey' }
          ]
        }
      ]
    }
  };

  beforeEach(async () => {
    // Create mock services
    mockDashboardService = jasmine.createSpyObj('DashboardService', ['GetDashboardData', 'GetActiveUserPercentage']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSpinner = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    mockAiApiService = jasmine.createSpyObj('AiApiService', ['getSurveyDashBoardDetails', 'getSurveyRecordsById']);

    // Configure mock service responses
    mockAiApiService.getSurveyDashBoardDetails.and.returnValue(of(mockSurveyDashboardResponse));
    mockAiApiService.getSurveyRecordsById.and.returnValue(of(mockSurveyRecordsResponse));

    await TestBed.configureTestingModule({
      declarations: [SurveyDashboardComponent],
      imports: [
        NoopAnimationsModule,
        SharedMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: NgxSpinnerService, useValue: mockSpinner },
        { provide: AiApiService, useValue: mockAiApiService }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    // Setup localStorage mock for user data
    spyOn(localStorage, 'getItem').and.callFake((key) => {
      if (key === 'currentUser') {
        return JSON.stringify(mockUser);
      }
      if (key === 'LoggedUserType') {
        return '1'; // Admin
      }
      return null;
    });

    fixture = TestBed.createComponent(SurveyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load survey dashboard data on init', () => {
    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockAiApiService.getSurveyDashBoardDetails).toHaveBeenCalled();
    expect(component.dashBoardPercentage.activePercent).toBe(mockSurveyDashboardResponse.data.activeSurveyPercentage);
    expect(component.dashBoardPercentage.completePercent).toBe(mockSurveyDashboardResponse.data.closedSurveyPercentage);
    expect(component.dataSource.data.length).toBe(1);
    expect(mockSpinner.hide).toHaveBeenCalled();
  });

  it('should handle error when loading dashboard data', fakeAsync(() => {
    mockAiApiService.getSurveyDashBoardDetails.and.returnValue(throwError(() => new Error('Server error')));
    
    component.loadData();
    tick();
    
    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockSpinner.hide).toHaveBeenCalled();
    // Error should be handled and not crash the component
  }));

  it('should switch to active surveys list', () => {
    spyOn(component, 'loadData');
    component.isActive = false;
    
    component.ActiveList();
    
    expect(component.isActive).toBeTrue();
    expect(component.loadData).toHaveBeenCalled();
  });

  it('should switch to closed surveys list', () => {
    spyOn(component, 'loadData');
    component.isActive = true;
    
    component.CompletedList();
    
    expect(component.isActive).toBeFalse();
    expect(component.loadData).toHaveBeenCalled();
  });

  it('should apply filter to data source', () => {
    const event = { target: { value: 'test' } } as unknown as Event;
    component.applyFilter(event);
    expect(component.dataSource.filter).toBe('test');
  });

  it('should navigate to initiate survey page', () => {
    component.sendSurvey();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/main/initiatesurvey'], { queryParams: { module: 'Survey' } });
  });

  it('should navigate to survey response page', () => {
    const mockSurvey = { portalId: 1, title: 'Test Survey' };
    component.viewResponce(mockSurvey);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/main/survey/survey-response'], { queryParams: { id: 1, title: 'Test Survey' } });
  });

  it('should open new tab with AI URL when creating survey', () => {
    spyOn(window, 'open');
    component.createSurvey();
    expect(window.open).toHaveBeenCalledWith(environment.AI_UIENDPOINT, '_blank');
  });

  it('should toggle row expansion and load detailed data', fakeAsync(() => {
    const mockElement: any = { 
      portalId: 1, 
      title: 'Test Survey 1',
      location: 'New York',
      date: '2023-05-15',
      submitted_By: 'John Doe',
      availableAdjuster: 5,
      unavailableAdjuster: 2,
      notResponded: 3,
      requestStatus: 'Active',
      client: 'Insurance Co',
      assignmentType: 'Survey',
      requestDate: '2023-05-10',
      isSingleClaim: true,
      description: 'Test description'
    };
    
    // Initial state: no expanded element
    expect(component.expandedElement).toBeUndefined();
    
    // Expand row
    component.toggleRowExpansion(mockElement);
    expect(component.expandedElement).toBe(mockElement);
    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockAiApiService.getSurveyRecordsById).toHaveBeenCalledWith(1, 'Name', 'asc');
    
    tick();
    expect(mockElement.expandedData).toBeDefined();
    expect(mockSpinner.hide).toHaveBeenCalled();
    
    // Collapse row
    component.toggleRowExpansion(mockElement);
    expect(component.expandedElement).toBeNull();
  }));

  it('should handle error when expanding row', fakeAsync(() => {
    const mockElement: any = { 
      portalId: 1, 
      title: 'Test Survey 1',
      location: 'New York',
      date: '2023-05-15',
      submitted_By: 'John Doe',
      availableAdjuster: 5,
      unavailableAdjuster: 2,
      notResponded: 3,
      requestStatus: 'Active',
      client: 'Insurance Co',
      assignmentType: 'Survey',
      requestDate: '2023-05-10',
      isSingleClaim: true,
      description: 'Test description'
    };
    
    mockAiApiService.getSurveyRecordsById.and.returnValue(throwError(() => new Error('Server error')));
    
    component.toggleRowExpansion(mockElement);
    tick();
    
    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockSpinner.hide).toHaveBeenCalled();
    // Should handle error without crashing
  }));

  it('should open dialog with survey sent list', fakeAsync(() => {
    const mockElement: any = { 
      portalId: 1, 
      title: 'Test Survey 1',
      location: 'New York',
      date: '2023-05-15',
      submitted_By: 'John Doe',
      availableAdjuster: 5,
      unavailableAdjuster: 2,
      notResponded: 3,
      requestStatus: 'Active',
      client: 'Insurance Co',
      assignmentType: 'Survey',
      requestDate: '2023-05-10',
      isSingleClaim: true,
      description: 'Test description'
    };
    
    component.viewSurveyList(mockElement);
    tick();
    
    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockAiApiService.getSurveyRecordsById).toHaveBeenCalledWith(1, 'Name', 'asc');
    expect(mockElement.expandedData).toBeDefined();
    expect(mockDialog.open).toHaveBeenCalledWith(SurveySentListComponent, {
      data: { element: mockElement },
      panelClass: 'survey_list_form',
    });
    expect(mockSpinner.hide).toHaveBeenCalled();
  }));

  it('should handle error when viewing survey list', fakeAsync(() => {
    const mockElement: any = { 
      portalId: 1, 
      title: 'Test Survey 1',
      location: 'New York',
      date: '2023-05-15',
      submitted_By: 'John Doe',
      availableAdjuster: 5,
      unavailableAdjuster: 2,
      notResponded: 3,
      requestStatus: 'Active',
      client: 'Insurance Co',
      assignmentType: 'Survey',
      requestDate: '2023-05-10',
      isSingleClaim: true,
      description: 'Test description'
    };
    
    mockAiApiService.getSurveyRecordsById.and.returnValue(throwError(() => new Error('Server error')));
    
    component.viewSurveyList(mockElement);
    tick();
    
    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockSpinner.hide).toHaveBeenCalled();
    expect(mockDialog.open).not.toHaveBeenCalled();
    // Should handle error without crashing
  }));



  it('should refresh data when assignToUser is called with true', () => {
    spyOn(component, 'loadData');
    component.assignToUser(true);
    expect(component.loadData).toHaveBeenCalled();
    
    component.assignToUser(false);
    expect(component.loadData).toHaveBeenCalledTimes(1); // Not called again
  });

  it('should refresh data when refreshData is called with true', () => {
    spyOn(component, 'loadData');
    component.refreshData(true);
    expect(component.loadData).toHaveBeenCalled();
    
    component.refreshData(false);
    expect(component.loadData).toHaveBeenCalledTimes(1); // Not called again
  });

  it('should initialize sort after view init', fakeAsync(() => {
    const sortSpy = spyOn(component.sort.sortChange, 'emit');
    component.ngAfterViewInit();
    tick();
    
    expect(component.sort.active).toBe('createOn');
    expect(component.sort.direction).toBe('desc');
    expect(sortSpy).toHaveBeenCalled();
  }));

  it('should show createSurvey button only for admin users', () => {
    // Admin user - button should be visible
    fixture.detectChanges();
    const createSurveyBtn = fixture.debugElement.query(By.css('button[mat-raised-button][class*="bg-greendark"]'));
    expect(createSurveyBtn).toBeTruthy();
    
    // Change user type to non-admin
    spyOn(component, 'isadmin').and.returnValue(false);
    fixture.detectChanges();
    
    // Button should be hidden for non-admin users due to *ngIf="isadmin()"
    const buttons = fixture.debugElement.queryAll(By.css('button[mat-raised-button][class*="bg-greendark"]'));
    const createBtn = buttons.find(btn => btn.nativeElement.textContent.includes('Create Survey'));
    expect(createBtn).toBeFalsy();
  });
});
