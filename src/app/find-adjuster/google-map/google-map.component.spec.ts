import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GoogleMapComponent } from './google-map.component';
import { GoogleMapsModule, MapCircle, MapInfoWindow } from '@angular/google-maps';
import { SharedAdjusterService } from 'src/app/services/shared-adjuster.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ViewProfileComponent } from '../view-profile/view-profile.component';
import { BehaviorSubject, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

describe('GoogleMapComponent', () => {
  let component: GoogleMapComponent;
  let fixture: ComponentFixture<GoogleMapComponent>;
  let sharedAdjusterService: jasmine.SpyObj<SharedAdjusterService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  // Mock data
  const mockCenter = { lat: 0, lng: 0 };
  const mockMarker: any = {
    lat: 1,
    lng: 1,
    name: 'Test Adjuster',
    location: 'Test Location',
    email: 'test@test.com',
    distance: 10,
    userId: '123',
    fileTracId: 1,
    userTypeName: 'Internal user',
    mobile: '1234567890'
  };

  beforeAll(() => {
    // Setup global Google Maps mock
    (window as any).google = {
      maps: {
        Map: class {
          constructor() {
            return {};
          }
        },
        Marker: class {
          constructor() {
            return {
              setMap: jasmine.createSpy('setMap')
            };
          }
        },
        Circle: class {
          constructor() {
            return {
              setMap: jasmine.createSpy('setMap'),
              setRadius: jasmine.createSpy('setRadius'),
              getRadius: () => 1000
            };
          }
        },
        SymbolPath: {
          BACKWARD_CLOSED_ARROW: 1
        },
        Size: class {
          constructor(width: number, height: number) {
            return { width, height };
          }
        },
        ControlPosition: {
          RIGHT_BOTTOM: 'RIGHT_BOTTOM'
        },
        Icon: class {
          constructor(options: any) {
            return options;
          }
        },
        event: {
          addListener: jasmine.createSpy('addListener')
        }
      }
    };
  });

  beforeEach(async () => {
    const sharedAdjusterServiceSpy = jasmine.createSpyObj('SharedAdjusterService', ['setRadius'], {
      radius$: new BehaviorSubject<number>(1000),
      adjusterHovered$: new BehaviorSubject<any>(null),
      adjusterSelected$: new BehaviorSubject<any>(null)
    });

    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue({ afterClosed: () => of(null) });

    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck', 'detectChanges']);

    await TestBed.configureTestingModule({
      declarations: [GoogleMapComponent],
      imports: [GoogleMapsModule],
      providers: [
        { provide: SharedAdjusterService, useValue: sharedAdjusterServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();

    sharedAdjusterService = TestBed.inject(SharedAdjusterService) as jasmine.SpyObj<SharedAdjusterService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    cdr = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapComponent);
    component = fixture.componentInstance;

    // Reset spies
    cdr.markForCheck.calls.reset();
    cdr.detectChanges.calls.reset();

    // Setup required inputs
    component.center = mockCenter;
    component.circleCenter = mockCenter;
    component.radius = 1000;
    component.zoom = 10;
    component.options = {};

    // Mock map instance with controls
    component.map = {
      googleMap: {
        controls: {
          [google.maps.ControlPosition.RIGHT_BOTTOM]: {
            push: jasmine.createSpy('push')
          }
        }
      }
    } as any;

    // Mock circle instance
    const radiusChanged = new BehaviorSubject<void>(undefined);
    component.circle = {
      circle: {
        setRadius: jasmine.createSpy('setRadius'),
        getRadius: () => 2000,
        setOptions: jasmine.createSpy('setOptions')
      },
      radiusChanged: radiusChanged.asObservable(),
      setOptions: jasmine.createSpy('setOptions')
    } as any;

    // Create legend element
    const legendElement = document.createElement('div');
    legendElement.id = 'legend';
    document.body.appendChild(legendElement);

    // Call lifecycle hooks manually
    component.ngOnInit();
    fixture.detectChanges();
  });

  afterEach(() => {
    const legend = document.getElementById('legend');
    if (legend && legend.parentNode) {
      legend.parentNode.removeChild(legend);
    }
  });

  afterAll(() => {
    delete (window as any).google;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.center).toEqual(mockCenter);
    expect(component.radius).toBe(1000);
    expect(component.zoom).toBe(10);
    expect(component.markerPositions).toEqual([]);
  });



  it('should generate marker icon based on user type', () => {
    const internalIcon = component.getMarkerIcon({
      ...mockMarker,
      userTypeName: 'Internal user'
    });
    expect(internalIcon.url).toContain('internal-user.png');
    expect(internalIcon.scaledSize).toBeDefined();
    expect((internalIcon.scaledSize as any).width).toBe(28);
    expect((internalIcon.scaledSize as any).height).toBe(28);

    const externalIcon = component.getMarkerIcon({
      ...mockMarker,
      userTypeName: 'External User'
    });
    expect(externalIcon.url).toContain('external-user.png');
    expect(externalIcon.scaledSize).toBeDefined();
  });

 

  it('should open info window with correct data', () => {
    const marker = {} as any;
    component.openInfoWindow(marker, mockMarker, false);
    expect(dialog.open).toHaveBeenCalledWith(ViewProfileComponent, {
      data: { adjuster: mockMarker, width: '41vw' },
      panelClass: 'custom-modalbox'
    });
  });



  it('should subscribe to shared service observables', () => {
    const mockHoverEvent = { id: '123', action: 'hover' };
    (sharedAdjusterService as any).adjusterHovered$.next(mockHoverEvent);
    expect(component.markerPositions).toBeDefined();

    const mockSelectEvent = { userId: '123', isSelected: true };
    (sharedAdjusterService as any).adjusterSelected$.next(mockSelectEvent);
    expect(component.markerPositions).toBeDefined();
  });

  it('should generate and add legend', () => {
    component.generateLegend();
    expect(component.legends.length).toBe(4);
    expect(component.legends[0]).toEqual({
      name: 'Internal',
      icon: './assets/assets/image/internal-user.png'
    });
  });

  it('should handle home location markers with correct icon sizes', () => {
    const markerWithHome = {
      ...mockMarker,
      homeLat: 2,
      homeLng: 2,
      deploymentInfo: {
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        zip: '12345',
        country: 'Test Country'
      }
    };
    component.markerPositions = [markerWithHome];
    expect(component.markerPositions[0].homeIcon).toBeDefined();
    expect((component.markerPositions[0].homeIcon.scaledSize as any).width).toBe(24);
    expect((component.markerPositions[0].homeIcon.scaledSize as any).height).toBe(24);
    expect(component.markerPositions[0].deploymentInfo).toBeDefined();
  });

  it('should add legend to map', () => {
    const pushSpy = jasmine.createSpy('push');
    component.map = {
      googleMap: {
        controls: {
          'RIGHT_BOTTOM': {
            push: pushSpy
          }
        }
      }
    } as any;

    component.generateLegend();
    component.addLegendToMap();
    expect(pushSpy).toHaveBeenCalled();
  });

  it('should emit radius value when circle is updated', fakeAsync(() => {
    spyOn(component.radiusValue, 'emit');
    
    // Mock circle instance with all required methods
    const radiusChanged = new BehaviorSubject<void>(undefined);
    component.circle = {
      circle: {
        setRadius: jasmine.createSpy('setRadius'),
        getRadius: () => 2000
      },
      radiusChanged: radiusChanged,
      setOptions: jasmine.createSpy('setOptions')
    } as any;

    // Call ngAfterViewInit and trigger radius change
    component.ngAfterViewInit();
    tick();
    radiusChanged.next();
    tick();

    // Verify
    expect(component.radiusValue.emit).toHaveBeenCalledWith(2000);
  }));
});
