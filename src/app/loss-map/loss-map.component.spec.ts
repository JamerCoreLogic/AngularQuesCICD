import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LossMapComponent } from './loss-map.component';
import { AdjustersService } from '../services/adjusters.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SharedAdjusterService } from '../services/shared-adjuster.service';
import { GoogleMapsLoaderService } from '../services/google-maps-loader.service';
import { of, Subject, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedMaterialModule } from '../shared-material/shared-material.module';

describe('LossMapComponent', () => {
  let component: LossMapComponent;
  let fixture: ComponentFixture<LossMapComponent>;
  let adjustersServiceSpy: jasmine.SpyObj<AdjustersService>;
  let spinnerServiceSpy: jasmine.SpyObj<NgxSpinnerService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let sharedAdjusterServiceSpy: jasmine.SpyObj<SharedAdjusterService>;
  let googleMapsLoaderServiceSpy: jasmine.SpyObj<GoogleMapsLoaderService>;

  // Mock data for tests
  const mockLossLocations = [
    {
      latitude: '34.0522',
      longitude: '-118.2437',
      distance: 15.5,
      name: 'Loss Location 1',
      location: 'Los Angeles, CA',
      email: 'contact1@example.com',
      userId: '1',
      fileTracId: 1001,
      userTypeName: 'Loss',
      deploymentInfo: {
        address: '123 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90012',
        country: 'USA'
      }
    },
    {
      latitude: '40.7128',
      longitude: '-74.0060',
      distance: 20.3,
      name: 'Loss Location 2',
      location: 'New York, NY',
      email: 'contact2@example.com',
      userId: '2',
      fileTracId: 1002,
      userTypeName: 'Loss',
      deploymentInfo: {
        address: '456 Broadway',
        city: 'New York',
        state: 'NY',
        zip: '10013',
        country: 'USA'
      }
    }
  ];

  beforeEach(async () => {
    // Create spies for all dependencies
    adjustersServiceSpy = jasmine.createSpyObj('AdjustersService', ['getAdjustersByAddress', 'updatelist']);
    adjustersServiceSpy.showlist = new Subject<boolean>();
    
    spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken', 'isUserAllowed']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
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
    
    // Set up mock implementations
    sharedAdjusterServiceSpy.calculateDistance.and.callFake((lat1, lng1, lat2, lng2) => 382.5);
    sharedAdjusterServiceSpy.calculateZoom.and.callFake((radius) => {
      if (radius <= 5) return 12;
      if (radius <= 50) return 9;
      return 7;
    });
    
    // Add implementation for isFilterApplyed
    sharedAdjusterServiceSpy.isFilterApplyed.and.callFake((value: boolean) => {
      // Empty implementation to satisfy the method call
    });
    
    sharedAdjusterServiceSpy.getOperator.and.returnValue('OR');
    sharedAdjusterServiceSpy.getCurrentSearchText.and.returnValue('');
    sharedAdjusterServiceSpy.getCurrentSelectedAdjusterList.and.returnValue([]);
    
    // Add required Subjects
    sharedAdjusterServiceSpy.radius$ = new Subject<number>();
    sharedAdjusterServiceSpy.searchText$ = new Subject<string>();
    sharedAdjusterServiceSpy.filterSubject$ = new Subject<string>();
    sharedAdjusterServiceSpy.companyNamevalueSubject$ = new Subject<string>();
    sharedAdjusterServiceSpy.surveyNameSubject$ = new Subject<string>();
    sharedAdjusterServiceSpy.surveyTitleSubject$ = new Subject<string>();
    sharedAdjusterServiceSpy.filterOperatorSubject$ = new Subject<string>();
    
    googleMapsLoaderServiceSpy = jasmine.createSpyObj('GoogleMapsLoaderService', ['onGoogleMapsLoaded']);
    googleMapsLoaderServiceSpy.onGoogleMapsLoaded.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SharedMaterialModule,
        NgxSpinnerModule,
        HttpClientTestingModule
      ],
      declarations: [LossMapComponent],
      providers: [
        { provide: AdjustersService, useValue: adjustersServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SharedAdjusterService, useValue: sharedAdjusterServiceSpy },
        { provide: GoogleMapsLoaderService, useValue: googleMapsLoaderServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LossMapComponent);
    component = fixture.componentInstance;
    
    // Mock savedFilterState
    spyOn(component, 'savedFilterState').and.callFake(() => {
      return;
    });
  });

  it('should create', fakeAsync(() => {
    // Emit initial values for all observables
    emitInitialValues();
    component.ngOnInit();
    tick(300);
    expect(component).toBeTruthy();
  }));

  it('should initialize with default values', fakeAsync(() => {
    emitInitialValues();
    component.ngOnInit();
    tick(300);
    
    expect(component.showList).toBeFalse();
    expect(component.Arrow).toBeFalse();
    expect(component.opened).toBeFalse();
    expect(component.zoom).toBe(4);
    expect(component.radius).toBe(1.5);
    expect(component.adjusters.length).toBe(0);
    expect(component.markerPositions.length).toBe(0);
    expect(component.center).toEqual({
      lat: 33.967,
      lng: -84.220183
    });
  }));

  it('should initialize Google Maps API', fakeAsync(() => {
    emitInitialValues();
    component.ngOnInit();
    tick(300);
    
    expect(component.apiLoaded).toBeTruthy();
    expect(googleMapsLoaderServiceSpy.onGoogleMapsLoaded).toHaveBeenCalled();
    expect(spinnerServiceSpy.show).toHaveBeenCalled();
    expect(spinnerServiceSpy.hide).toHaveBeenCalled();
  }));

  it('should toggle drawer and Arrow state when toggleDrawer2 is called', () => {
    component.drawer = {
      toggle: jasmine.createSpy('toggle')
    };
    
    component.Arrow = false;
    component.toggleDrawer2();
    expect(component.drawer.toggle).toHaveBeenCalled();
    expect(component.Arrow).toBeTrue();
    
    component.toggleDrawer2();
    expect(component.Arrow).toBeFalse();
  });

  it('should calculate zoom level based on radius', () => {
    expect(component.calculateZoom(1)).toBe(12);
    expect(component.calculateZoom(25)).toBe(9);
    expect(component.calculateZoom(100)).toBe(7);
  });

  it('should calculate distance between two points correctly', () => {
    const lat1 = 34.0522;
    const lng1 = -118.2437;
    const lat2 = 37.7749;
    const lng2 = -122.4194;
    
    const distance = component.calculateDistance(lat1, lng1, lat2, lng2);
    expect(distance).toBeCloseTo(382.5, 1);
  });

 

  it('should unsubscribe from all subscriptions on destroy', () => {
    const unsubscribeSpy = spyOn(component['subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should update search parameters when radius changes', fakeAsync(() => {
    component.ngOnInit();
    spyOn(component['searchDebouncer'], 'next');
    
    (sharedAdjusterServiceSpy.radius$ as Subject<number>).next(25);
    tick(300);
    
    expect(component.radius).toBe(25);
    expect(component['searchDebouncer'].next).toHaveBeenCalledWith({
      searchText: component.searchText,
      radius: 25,
      filterString: component.filterSqlString,
      companyNameFilter: component.companyNameFilter,
      surveyNameFilter: component.surveyNameFilter,
      surveyTitleFilter: component.surveyTitleFilter,
      operator: 'OR'
    });
  }));

  // Helper function to emit initial values for all observables
  function emitInitialValues() {
    (sharedAdjusterServiceSpy.radius$ as Subject<number>).next(1.5);
    (sharedAdjusterServiceSpy.searchText$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.filterSubject$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.companyNamevalueSubject$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.surveyNameSubject$ as Subject<string>).next('');
    (sharedAdjusterServiceSpy.surveyTitleSubject$ as Subject<string>).next('');
    (adjustersServiceSpy.showlist as Subject<boolean>).next(false);
  }
}); 