import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { of, throwError } from 'rxjs';
import { DescriptionComponent } from './description/description.component';
import { GraphComponent } from './graph/graph.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockDashboardService: jasmine.SpyObj<DashboardService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSpinner: jasmine.SpyObj<NgxSpinnerService>;

  const mockDashboardData = {
    activeDetails: [
      {
        commRequestId: 1,
        title: 'Test Request',
        location: 'Test Location',
        date: '2024-03-20',
        submitted_By: 'Test User',
        availableAdjuster: 2,
        unavailableAdjuster: 1,
        notResponded: 1
      }
    ],
    completeDetails: [] as any[]
  };

  const mockPercentageData = {
    activePercent: 60,
    completePercent: 40
  };

  beforeEach(async () => {
    mockDashboardService = jasmine.createSpyObj('DashboardService', ['GetDashboardData', 'GetActiveUserPercentage', 'GetCommunicationResponse']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isUserAllowed']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSpinner = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      declarations: [ 
        DashboardComponent,
        DescriptionComponent,
        GraphComponent 
      ],
      imports: [
        BrowserAnimationsModule,
        SharedMaterialModule
      ],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },
        { provide: NgxSpinnerService, useValue: mockSpinner }
      ]
    }).compileComponents();

    mockDashboardService.GetDashboardData.and.returnValue(of(mockDashboardData));
    mockDashboardService.GetActiveUserPercentage.and.returnValue(of(mockPercentageData));
    mockAuthService.isUserAllowed.and.returnValue({ isAllow: true, allowedPath: '/dashboard' });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should redirect when user is not allowed', () => {
    mockAuthService.isUserAllowed.and.returnValue({ isAllow: false, allowedPath: '/login' });
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle error in loading data', fakeAsync(() => {
    const consoleErrorSpy = spyOn(console, 'error');
    mockDashboardService.GetDashboardData.and.returnValue(throwError(() => new Error('Test error')));
    
    component.ngOnInit();
    tick();

    expect(mockSpinner.hide).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
    // Check for error UI state if applicable
  }));

  it('should switch to active list', fakeAsync(() => {
    component.ActiveList();
    tick();

    expect(component.isActive).toBeTrue();
    expect(mockDashboardService.GetDashboardData).toHaveBeenCalled();
    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockSpinner.hide).toHaveBeenCalled();
  }));

  it('should switch to completed list', fakeAsync(() => {
    component.CompletedList();
    tick();

    expect(component.isActive).toBeFalse();
    expect(mockDashboardService.GetDashboardData).toHaveBeenCalled();
    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockSpinner.hide).toHaveBeenCalled();
  }));

  it('should apply filter to data source', () => {
    const event = { target: { value: 'test' } } as unknown as Event;
    component.applyFilter(event);
    expect(component.dataSource.filter).toBe('test');
  });



  it('should transform data correctly', () => {
    const inputData = [{
      commRequestId: 1,
      title: 'Test',
      location: 'Test Location'
    }];
    
    const result = component.transformData(inputData);
    expect(result[0].commRequestId).toBe(1);
    expect(result[0].title).toBe('Test');
  });

  // it('should handle error in fetching communication response', fakeAsync(() => {
  //   mockDashboardService.GetCommunicationResponse.and.returnValue(throwError(() => new Error('Test error')));
    
  //   component.ngOnInit();
  //   tick();

  //   expect(mockSpinner.show).toHaveBeenCalled();
  //   expect(mockSpinner.hide).toHaveBeenCalled();
  // }));

  afterEach(() => {
    mockSpinner.show.calls.reset();
    mockSpinner.hide.calls.reset();
  });
}); 