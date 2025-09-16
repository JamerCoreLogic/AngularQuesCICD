import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';

import { Router } from '@angular/router';

import { AdjusterListComponent } from './adjuster-list.component';
import { SharedAdjusterService } from 'src/app/services/shared-adjuster.service';
import { ViewProfileComponent } from '../view-profile/view-profile.component';
import { NotificationComponent } from '../notification/notification.component';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { FilterListComponent } from '../filter-list/filter-list.component';

describe('AdjusterListComponent', () => {
  let component: AdjusterListComponent;
  let fixture: ComponentFixture<AdjusterListComponent>;
  let sharedAdjusterServiceSpy: jasmine.SpyObj<SharedAdjusterService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;
  
  const searchTextSubject = new BehaviorSubject<string>('');
  const radiusSubject = new BehaviorSubject<number>(0);
  const filterSubject = new BehaviorSubject<any>(null);
  const isFilterSubject = new BehaviorSubject<boolean>(false);
  const adjusterSelectedListSubject = new BehaviorSubject<string[]>([]);

  const mockAdjusters = [
    {
      userId: '1',
      name: 'John Doe',
      email: 'john@example.com',
      location: 'Atlanta, GA',
      distance: 5,
      userTypeName: 'Internal user'
    },
    {
      userId: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      location: 'New York, NY',
      distance: 10,
      userTypeName: 'External user'
    }
  ];

  beforeEach(async () => {
    sharedAdjusterServiceSpy = jasmine.createSpyObj('SharedAdjusterService', [
      'setSelectedAdjusterList', 'setSelectedAdjuster', 'setHoveredAdjuster', 'isFilterApplyed'
    ]);
    sharedAdjusterServiceSpy.searchText$ = searchTextSubject.asObservable();
    sharedAdjusterServiceSpy.radius$ = radiusSubject.asObservable();
    sharedAdjusterServiceSpy.filterSubject$ = filterSubject.asObservable();
    sharedAdjusterServiceSpy.isFilterSubject$ = isFilterSubject.asObservable();
    sharedAdjusterServiceSpy.adjusterSelectedList$ = adjusterSelectedListSubject.asObservable();
    
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(null)
    } as any);
    
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Add implementation for isFilterApplyed
    sharedAdjusterServiceSpy.isFilterApplyed.and.callFake((value: boolean) => {
      // Empty implementation, just to satisfy the method call
    });

    await TestBed.configureTestingModule({
      imports: [
        SharedMaterialModule,
        NoopAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [AdjusterListComponent, FilterListComponent],
      providers: [
        { provide: SharedAdjusterService, useValue: sharedAdjusterServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    // Reset subjects before each test
    searchTextSubject.next('');
    radiusSubject.next(0);
    filterSubject.next(null);
    isFilterSubject.next(false);
    adjusterSelectedListSubject.next([]);

    fixture = TestBed.createComponent(AdjusterListComponent);
    component = fixture.componentInstance;
    component.adjusters = [...mockAdjusters];
    component.circleCenter = { lat: 33.967, lng: -84.220183 };
    component.radius = 40233.6; // 25 miles in meters
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty selectedAdjusters array', () => {
    expect(component.selectedAdjusters.length).toBe(0);
    expect(component.isCheckboxSelected).toBeFalse();
  });

  it('should set originalAdjusters on init', () => {
    expect(component.originalAdjusters).toEqual(mockAdjusters);
  });

  it('should update selectedAdjusters when adjusterSelectedList$ emits', () => {
    adjusterSelectedListSubject.next(['1']);
    
    expect(component.selectedAdjusters.length).toBe(1);
    expect(component.selectedAdjusters[0].userId).toBe('1');
    expect(component.isCheckboxSelected).toBeTrue();
  });

  it('should update isFilterApplied when isFilterSubject$ emits', () => {
    isFilterSubject.next(true);
    
    expect(component.isFilterApplied).toBeTrue();
  });

  it('should open ViewProfileComponent dialog when viewProfile is called', () => {
    const adjuster = mockAdjusters[0];
    
    component.viewProfile(adjuster);
    
    expect(dialogSpy.open).toHaveBeenCalledWith(ViewProfileComponent, {
      data: { adjuster: adjuster, width: "41vw" },
      panelClass: 'custom-modalbox'
    });
    
    expect(localStorage.getItem('clickedAdjusterId')).toBe(adjuster.userId);
    expect(localStorage.getItem('editUser')).toBe(JSON.stringify(adjuster));
  });

  it('should open NotificationComponent dialog when viewNotification is called', () => {
    const adjuster = mockAdjusters[0];
    
    component.viewNotification(adjuster);
    
    expect(dialogSpy.open).toHaveBeenCalledWith(NotificationComponent, {
      data: { adjuster: adjuster },
      panelClass: 'view_adjuster_info'
    });
  });

  it('should navigate to initiatesurvey when initiateRequest is called', () => {
    component.selectedAdjusters = [mockAdjusters[0]];
    component.searchText = 'Atlanta';
    
    component.initiateRequest();
    
    expect(sharedAdjusterServiceSpy.setSelectedAdjusterList).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/main/initiatesurvey'], { 
      queryParams: { module: 'Adjuster' } 
    });
  });

  it('should add adjuster to selectedAdjusters when checkbox is checked', () => {
    const adjuster = mockAdjusters[0];
    const event = { checked: true };
    
    component.updateCheckboxSelection(adjuster, event);
    
    expect(component.selectedAdjusters).toContain(adjuster);
    expect(component.isCheckboxSelected).toBeTrue();
    expect(sharedAdjusterServiceSpy.setSelectedAdjuster).toHaveBeenCalledWith(adjuster.userId, true);
    expect(sharedAdjusterServiceSpy.setSelectedAdjusterList).toHaveBeenCalledWith([adjuster.userId]);
  });

  it('should remove adjuster from selectedAdjusters when checkbox is unchecked', () => {
    const adjuster = mockAdjusters[0];
    component.selectedAdjusters = [adjuster];
    component.isCheckboxSelected = true;
    
    const event = { checked: false };
    component.updateCheckboxSelection(adjuster, event);
    
    expect(component.selectedAdjusters).not.toContain(adjuster);
    expect(component.isCheckboxSelected).toBeFalse();
    expect(sharedAdjusterServiceSpy.setSelectedAdjuster).toHaveBeenCalledWith(adjuster.userId, false);
    expect(sharedAdjusterServiceSpy.setSelectedAdjusterList).toHaveBeenCalledWith([]);
  });

  it('should emit adjustersUpdated when updateFilterData is called', () => {
    spyOn(component.adjustersUpdated, 'emit');
    const filteredData = [mockAdjusters[0]];
    
    component.updateFilterData(filteredData);
    
    expect(component.adjustersUpdated.emit).toHaveBeenCalledWith(filteredData);
  });

  it('should call setHoveredAdjuster when hoverAdjuster is called', () => {
    const id = '1';
    
    component.hoverAdjuster(id);
    
    expect(sharedAdjusterServiceSpy.setHoveredAdjuster).toHaveBeenCalledWith(id, 'hover');
  });

  it('should call setHoveredAdjuster when unhoverAdjuster is called', () => {
    const id = '1';
    
    component.unhoverAdjuster(id);
    
    expect(sharedAdjusterServiceSpy.setHoveredAdjuster).toHaveBeenCalledWith(id, 'unhover');
  });

  it('should return userId in trackByFn', () => {
    const result = component.trackByFn(0, { userId: '123' });
    expect(result).toBe('123');
  });

  it('should check if adjuster is clicked', () => {
    spyOn(localStorage, 'getItem').and.returnValue('1');
    
    expect(component.isClickedAdjuster('1')).toBeTrue();
    expect(component.isClickedAdjuster('2')).toBeFalse();
  });

  it('should check if adjuster is selected', () => {
    component.selectedAdjusters = [mockAdjusters[0]];
    
    expect(component.checkSelectedAdjuster(mockAdjusters[0])).toBeTrue();
    expect(component.checkSelectedAdjuster(mockAdjusters[1])).toBeFalse();
  });

  it('should update selectedAdjusters when adjusters input changes', () => {
    // First, set up initial state
    component.selectedAdjusters = [mockAdjusters[0]];
    adjusterSelectedListSubject.next([mockAdjusters[0].userId]);
    fixture.detectChanges();
    
    // Then simulate changes to adjusters input
    const changes = {
      adjusters: {
        currentValue: [mockAdjusters[1]],
        previousValue: mockAdjusters,
        firstChange: false,
        isFirstChange: () => false
      }
    };
    
    // Clear the selected adjusters in the shared service
    adjusterSelectedListSubject.next([]);
    
    component.ngOnChanges(changes);
    fixture.detectChanges();
    
    expect(component.selectedAdjusters.length).toBe(0);
    expect(component.originalAdjusters).toEqual([mockAdjusters[1]]);
  });

  it('should unsubscribe from subscriptions on destroy', () => {
    spyOn(component['subscriptions'], 'unsubscribe');
    
    component.ngOnDestroy();
    
    expect(component['subscriptions'].unsubscribe).toHaveBeenCalled();
  });
});
