import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GoogleMapsLoaderService } from './google-maps-loader.service';
import { AuthService } from './auth.service';
import { of, BehaviorSubject } from 'rxjs';

describe('GoogleMapsLoaderService', () => {
  let service: GoogleMapsLoaderService;
  let authService: jasmine.SpyObj<AuthService>;
  let mockHeartbeatResponse: BehaviorSubject<any[]>;
  let originalWindow: any;

  beforeEach(() => {
    // Store original window properties
    originalWindow = { ...window };

    // Mock window properties
    Object.defineProperty(window, 'google', {
      writable: true,
      value: undefined
    });

    Object.defineProperty(window, 'initMap', {
      writable: true,
      value: undefined
    });

    mockHeartbeatResponse = new BehaviorSubject<any[]>(
      [null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'apiKey:test-api-key']
    );

    authService = jasmine.createSpyObj('AuthService', ['getHeartbeat']);
    authService.getHeartbeat.and.returnValue(mockHeartbeatResponse.asObservable());

    TestBed.configureTestingModule({
      providers: [
        GoogleMapsLoaderService,
        { provide: AuthService, useValue: authService }
      ]
    });
  });

  afterEach(() => {
    // Restore original window properties
    Object.defineProperty(window, 'google', {
      writable: true,
      value: originalWindow.google
    });

    Object.defineProperty(window, 'initMap', {
      writable: true,
      value: originalWindow.initMap
    });

    // Clean up scripts
    const scripts = document.getElementsByTagName('script');
    Array.from(scripts).forEach(script => {
      if (script.src && script.src.includes('maps.googleapis.com')) {
        script.remove();
      }
    });
  });

  it('should be created', () => {
    service = TestBed.inject(GoogleMapsLoaderService);
    expect(service).toBeTruthy();
  });

  it('should initialize Google Maps when API key is present in heartbeat', fakeAsync(() => {
    const mockScript = document.createElement('script');
    const scriptSpy = spyOn(document, 'createElement').and.returnValue(mockScript);
    const appendChildSpy = spyOn(document.head, 'appendChild').and.callThrough();

    service = TestBed.inject(GoogleMapsLoaderService);
    tick();

    expect(scriptSpy).toHaveBeenCalledWith('script');
    expect(appendChildSpy).toHaveBeenCalledWith(mockScript);
    expect(mockScript.async).toBe(true);
    expect(mockScript.defer).toBe(true);
    expect(mockScript.src).toContain('test-api-key');
  }));

  it('should handle missing API key in heartbeat response', fakeAsync(() => {
    const consoleSpy = spyOn(console, 'error');
    mockHeartbeatResponse.next([null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
    
    service = TestBed.inject(GoogleMapsLoaderService);
    tick();

    expect(consoleSpy).toHaveBeenCalledWith('Google Maps API key not found in heartbeat response');
  }));

  it('should not load Google Maps script if already loaded', fakeAsync(() => {
    // Mock Google Maps with minimal required interface
    (window as any).google = {
      maps: {
        importLibrary: () => {},
        Animation: {},
        BicyclingLayer: {},
        Circle: {},
        // Add other required properties as needed
      }
    };
    const scriptSpy = spyOn(document, 'createElement');
    
    service = TestBed.inject(GoogleMapsLoaderService);
    tick();

    expect(scriptSpy).not.toHaveBeenCalled();
  }));

  it('should emit true when Google Maps is loaded', fakeAsync(() => {
    let loadedValue: boolean | undefined;
    service = TestBed.inject(GoogleMapsLoaderService);
    
    service.onGoogleMapsLoaded().subscribe(value => {
      loadedValue = value;
    });

    // Simulate Google Maps loading by calling initMap
    window.initMap?.();
    tick();

    expect(loadedValue).toBe(true);
  }));

  it('should log API URL when configured', fakeAsync(() => {
    const consoleSpy = spyOn(console, 'log');
    
    service = TestBed.inject(GoogleMapsLoaderService);
    tick();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Google Maps API URL configured:',
      jasmine.stringMatching(/.*test-api-key.*/)
    );
  }));

  it('should properly handle AuthService errors', fakeAsync(() => {
    const consoleSpy = spyOn(console, 'error');
    authService.getHeartbeat.and.returnValue(of([null]));
    
    service = TestBed.inject(GoogleMapsLoaderService);
    tick();

    expect(consoleSpy).toHaveBeenCalledWith('Google Maps API key not found in heartbeat response');
  }));
}); 