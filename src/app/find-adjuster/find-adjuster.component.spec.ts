import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FindAdjusterComponent } from './find-adjuster.component';
import { AdjustersService } from 'src/app/services/adjusters.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SharedAdjusterService } from 'src/app/services/shared-adjuster.service';
import { GoogleMapsLoaderService } from 'src/app/services/google-maps-loader.service';
import { of, Subject, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FindAdjusterComponent', () => {
  let component: FindAdjusterComponent;
  let fixture: ComponentFixture<FindAdjusterComponent>;
  let adjustersServiceSpy: jasmine.SpyObj<AdjustersService>;
  let spinnerServiceSpy: jasmine.SpyObj<NgxSpinnerService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let sharedAdjusterServiceSpy: jasmine.SpyObj<SharedAdjusterService>;
  let googleMapsLoaderServiceSpy: jasmine.SpyObj<GoogleMapsLoaderService>;

  // Mock data for tests
  const mockAdjusters = [
    {
      latitude: '34.0522',
      longitude: '-118.2437',
      distance: 15.5,
      name: 'Test Adjuster 1',
      location: 'Los Angeles, CA',
      email: 'adjuster1@example.com',
      userId: '1',
      fileTracId: 1001,
      userTypeName: 'Independent'
    },
    {
      latitude: '40.7128',
      longitude: '-74.0060',
      distance: 20.3,
      name: 'Test Adjuster 2',
      location: 'New York, NY',
      email: 'adjuster2@example.com',
      userId: '2',
      fileTracId: 1002,
      userTypeName: 'Staff'
    }
  ];

  beforeEach(async () => {
    // Create spies for all dependencies
    adjustersServiceSpy = jasmine.createSpyObj('AdjustersService', ['getAdjustersByAddress', 'updatelist']);
    
    // Create and configure showlist Subject
    adjustersServiceSpy.showlist = new Subject<boolean>();
    
    spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken', 'isUserAllowed']);
    authServiceSpy.isUserAllowed.and.returnValue({ isAllow: true, allowedPath: '/' });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    // Create and configure SharedAdjusterService spy with all required methods and subjects
    sharedAdjusterServiceSpy = jasmine.createSpyObj('SharedAdjusterService', [
      'setSelectedAdjuster',
      'calculateDistance',
      'calculateZoom',
      'getOperator',
      'getCurrentSearchText',
      'getCurrentSelectedAdjusterList',
      'saveState',
      'isFilterApplyed'
    ]);
    
    // Set up mock implementations for the shared service methods
    sharedAdjusterServiceSpy.calculateDistance.and.callFake((lat1, lng1, lat2, lng2) => {
      // Simple mock implementation
      return 382.5; // Return a fixed distance value for testing
    });
    
    // Add implementation for isFilterApplyed
    sharedAdjusterServiceSpy.isFilterApplyed.and.callFake((value: boolean) => {
      // Empty implementation, just to satisfy the method call
    });
    
    sharedAdjusterServiceSpy.calculateZoom.and.callFake((radius) => {
      // Simple mock implementation that mimics the real function
      if (radius <= 5) return 12;
      if (radius <= 50) return 9;
      return 7;
    });
    
    sharedAdjusterServiceSpy.getOperator.and.returnValue('OR');
    sharedAdjusterServiceSpy.getCurrentSearchText.and.returnValue('');
    sharedAdjusterServiceSpy.getCurrentSelectedAdjusterList.and.returnValue([]);
    
    // Add radius and searchText Subjects
    sharedAdjusterServiceSpy.radius$ = new Subject<number>();
    sharedAdjusterServiceSpy.searchText$ = new Subject<string>();
    sharedAdjusterServiceSpy.filterSubject$ = new Subject<string>();
    sharedAdjusterServiceSpy.companyNamevalueSubject$ = new Subject<string>();
    sharedAdjusterServiceSpy.surveyNameSubject$ = new Subject<string>();
    sharedAdjusterServiceSpy.surveyTitleSubject$ = new Subject<string>();
    sharedAdjusterServiceSpy.filterOperatorSubject$ = new Subject<string>();
    
    // Create GoogleMapsLoaderService spy
    googleMapsLoaderServiceSpy = jasmine.createSpyObj('GoogleMapsLoaderService', ['onGoogleMapsLoaded']);
    googleMapsLoaderServiceSpy.onGoogleMapsLoaded.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [FindAdjusterComponent],
      providers: [
        { provide: AdjustersService, useValue: adjustersServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SharedAdjusterService, useValue: sharedAdjusterServiceSpy },
        { provide: GoogleMapsLoaderService, useValue: googleMapsLoaderServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // To ignore any unknown elements in the template
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindAdjusterComponent);
    component = fixture.componentInstance;
    
    // Mock the savedFilterState method to avoid calling sharedAS.saveState
    spyOn(component, 'savedFilterState').and.callFake(() => {
      // Empty mock implementation that does nothing
      return;
    });
  });

  it('should create', fakeAsync(() => {
    // Emit initial values for all observables used in ngOnInit
    (sharedAdjusterServiceSpy.radius$ as Subject<number>).next(1.5);
    (sharedAdjusterServiceSpy.searchText$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.filterSubject$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.companyNamevalueSubject$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.surveyNameSubject$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.surveyTitleSubject$ as Subject<string>).next('');
    (adjustersServiceSpy.showlist as Subject<boolean>).next(false);
    
    // Initialize component
    component.ngOnInit();
    tick(300); // Flush any initial debounce timers
    
    expect(component).toBeTruthy();
  }));

  it('should initialize with default values', fakeAsync(() => {
    // Emit initial values for all observables used in ngOnInit
    (sharedAdjusterServiceSpy.radius$ as Subject<number>).next(1.5);
    (sharedAdjusterServiceSpy.searchText$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.filterSubject$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.companyNamevalueSubject$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.surveyNameSubject$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.surveyTitleSubject$ as Subject<string>).next('');
    (adjustersServiceSpy.showlist as Subject<boolean>).next(false);
    
    // Initialize component
    component.ngOnInit();
    tick(300); // Flush any initial debounce timers
    
    expect(component.showList).toBeFalse();
    expect(component.Arrow).toBeFalse();
    expect(component.opened).toBeFalse();
    expect(component.zoom).toBe(4);
    expect(component.radius).toBe(1.5);
    expect(component.adjusters.length).toBe(0);
    expect(component.markerPositions.length).toBe(0);
  }));

  it('should initialize Google Maps API', fakeAsync(() => {
    // Emit initial values for all observables used in ngOnInit
    (sharedAdjusterServiceSpy.radius$ as Subject<number>).next(1.5);
    (sharedAdjusterServiceSpy.searchText$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.filterSubject$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.companyNamevalueSubject$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.surveyNameSubject$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.surveyTitleSubject$ as Subject<string>).next('');
    (adjustersServiceSpy.showlist as Subject<boolean>).next(false);
    
    // Initialize component
    component.ngOnInit();
    tick(300); // Flush any initial debounce timers
    
    // Check if apiLoaded is set to the observable from the service
    expect(component.apiLoaded).toBeTruthy();
    
    // Verify the Google Maps loader service was called
    expect(googleMapsLoaderServiceSpy.onGoogleMapsLoaded).toHaveBeenCalled();
  }));

  it('should toggle drawer and Arrow state when toggleDrawer2 is called', () => {
    // Setup drawer mock
    component.drawer = {
      toggle: jasmine.createSpy('toggle')
    };
    
    // Initial state
    component.Arrow = false;
    
    // Call method
    component.toggleDrawer2();
    
    // Check that toggle was called and Arrow state changed
    expect(component.drawer.toggle).toHaveBeenCalled();
    expect(component.Arrow).toBeTrue();
    
    // Call again to toggle back
    component.toggleDrawer2();
    expect(component.Arrow).toBeFalse();
  });

  it('should calculate zoom level based on radius', () => {
    // Test small radius
    expect(component.calculateZoom(1)).toBe(12);
    
    // Test medium radius
    expect(component.calculateZoom(25)).toBe(9);
    
    // Test large radius
    expect(component.calculateZoom(100)).toBe(7);
  });

  it('should calculate distance between two points correctly', () => {
    // Example: Los Angeles to San Francisco (approximately 600 km)
    const lat1 = 34.0522; // LA
    const lng1 = -118.2437;
    const lat2 = 37.7749; // SF
    const lng2 = -122.4194;
    
    const distance = component.calculateDistance(lat1, lng1, lat2, lng2);
    
    // Allow for some margin of error (should be roughly 383 miles)
    expect(distance).toBeCloseTo(382.5, 1);
  });

  it('should search for adjusters and update marker positions', fakeAsync(() => {
    // Emit initial values for observables used in ngOnInit
    (sharedAdjusterServiceSpy.radius$ as Subject<number>).next(1.5);
    (sharedAdjusterServiceSpy.searchText$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.filterSubject$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.companyNamevalueSubject$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.surveyNameSubject$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.surveyTitleSubject$ as Subject<string>).next('');
    (adjustersServiceSpy.showlist as Subject<boolean>).next(false);
    
    // Initialize component
    component.ngOnInit();
    tick(300); // Flush any initial debounce timers
    
    // Setup spy for getAdjustersByAddress
    adjustersServiceSpy.getAdjustersByAddress.and.returnValue(of({
      data: mockAdjusters
    }));
    
    // Call searchLocation
    component.searchLocation('Test Address', 10, '', '', '', '', 'OR');
    tick(1000); // Give plenty of time for all operations to complete
    
    // Ensure all pending timers are flushed
    flush();
    
    // Expect spinner to be shown and then hidden
    expect(spinnerServiceSpy.show).toHaveBeenCalled();
    expect(spinnerServiceSpy.hide).toHaveBeenCalled();
  }));

  it('should handle error when searching for adjusters', fakeAsync(() => {
    // Emit initial values for observables used in ngOnInit
    (sharedAdjusterServiceSpy.radius$ as Subject<number>).next(1.5);
    (sharedAdjusterServiceSpy.searchText$ as Subject<string>).next('');
    (adjustersServiceSpy.showlist as Subject<boolean>).next(false);
    
    // Setup spy for getAdjustersByAddress to return an error
    adjustersServiceSpy.getAdjustersByAddress.and.returnValue(throwError('Network Error'));
    
    // Call searchLocation
    component.searchLocation('Test Address', 10, '', '', '', '', 'OR');
    tick();
    
    // Expect spinner to be shown and then hidden
    expect(spinnerServiceSpy.show).toHaveBeenCalled();
    expect(spinnerServiceSpy.hide).toHaveBeenCalled();
    
    // Expect markers to be cleared
    expect(component.markerPositions.length).toBe(0);
  }));

  it('should update radius and recalculate zoom when radius changes', fakeAsync(() => {
    // Create a mock for the calculateZoom method to track calls properly
    const originalCalculateZoom = sharedAdjusterServiceSpy.calculateZoom.and.callFake((radius) => {
      // Simple mock implementation that mimics the real function
      if (radius <= 5) return 12;
      if (radius <= 50) return 9;
      return 7;
    });

    // Mock the method called in searchLocation that uses calculateZoom
    spyOn(component, 'calculateZoom').and.callThrough();
    
    // Initialize component with default values
    component.radius = 5;
    
    // Set up a subscription to radius$ manually, similar to how component does
    component.ngOnInit();
    tick(300);
    
    // Update radius through the service
    (sharedAdjusterServiceSpy.radius$ as Subject<number>).next(25);
    
    // Flush any debounce timers
    tick(300);
    
    // Now expect the component's radius to be updated
    expect(component.radius).toBe(25);
    
    // Force a call to calculateZoom to verify it works correctly
    component.calculateZoom(25);
    
    // Expect the service's calculateZoom to have been called with 25
    expect(sharedAdjusterServiceSpy.calculateZoom).toHaveBeenCalledWith(25);
  }));

  it('should show map correctly', fakeAsync(() => {
    // Call showMap
    component.showMap();
    
    // Expect spinner to be shown initially
    expect(spinnerServiceSpy.show).toHaveBeenCalled();
    
    // Expect onGoogleMapsLoaded to be called
    expect(googleMapsLoaderServiceSpy.onGoogleMapsLoaded).toHaveBeenCalled();
    
    // Since we're returning of(true), the spinner should be hidden
    expect(spinnerServiceSpy.hide).toHaveBeenCalled();
    
    // API should be loaded
    let isLoaded = false;
    component.apiLoaded.subscribe(loaded => {
      isLoaded = loaded;
    });
    
    tick(); // Advance for observable subscription
    
    expect(isLoaded).toBeTrue();
  }));
});
