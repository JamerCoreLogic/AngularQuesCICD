import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import Swal from 'sweetalert2';
import { SweetAlertResult } from 'sweetalert2';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let swalSpy: jasmine.Spy;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getHeartbeat']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as SweetAlertResult<any>));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxSpinnerModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Clear intervals after each test
    if (component['maintenanceInterval']) {
      clearInterval(component['maintenanceInterval']);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    expect(component.title).toBe('Adjuster locator');
  });

  it('should initialize maintenance check on init', () => {
    const startMaintenanceCheckSpy = spyOn(component, 'startMaintenanceCheck');
    component.ngOnInit();
    expect(startMaintenanceCheckSpy).toHaveBeenCalled();
  });

  it('should clear maintenance interval on destroy', () => {
    const clearIntervalSpy = spyOn(window, 'clearInterval');
    component['maintenanceInterval'] = setInterval(() => {}, 1000);
    
    component.ngOnDestroy();
    
    expect(clearIntervalSpy).toHaveBeenCalledWith(component['maintenanceInterval']);
  });

  describe('checkMaintenance', () => {
    it('should handle maintenance mode when true', fakeAsync(() => {
      authServiceSpy.getHeartbeat.and.returnValue(of(['', '', '', '', '', '', '', '', '', '', '', '', '', 'UnderMaintenace: True']));
      
      component.checkMaintenance();
      tick();

      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Maintenance',
        text: 'The application is currently under maintenance. Please try again later.',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ffa022'
      }));

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/maintenance']);
    }));

    it('should not show maintenance alert when maintenance is false', fakeAsync(() => {
      authServiceSpy.getHeartbeat.and.returnValue(of(['', '', '', '', '', '', '', '', '', '', '', '', '', 'UnderMaintenace: False']));
      
      component.checkMaintenance();
      tick();

      expect(Swal.fire).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    }));

  
  });

  describe('startMaintenanceCheck', () => {
    it('should set up maintenance interval', fakeAsync(() => {
      const checkMaintenanceSpy = spyOn(component, 'checkMaintenance');
      
      component.startMaintenanceCheck();
      tick(60000); // Fast-forward 1 minute

      expect(checkMaintenanceSpy).toHaveBeenCalled();
      
      // Clean up interval
      clearInterval(component['maintenanceInterval']);
    }));

    it('should continue checking maintenance at regular intervals', fakeAsync(() => {
      const checkMaintenanceSpy = spyOn(component, 'checkMaintenance');
      
      component.startMaintenanceCheck();
      tick(180000); // Fast-forward 3 minutes

      // Should be called 3 times (at 0, 1, and 2 minutes)
      expect(checkMaintenanceSpy).toHaveBeenCalledTimes(3);
      
      // Clean up interval
      clearInterval(component['maintenanceInterval']);
    }));
  });

  describe('Template Tests', () => {
    it('should render router-outlet', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('router-outlet')).toBeTruthy();
    });

    it('should render ngx-spinner with correct properties', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const spinner = compiled.querySelector('ngx-spinner');
      
      expect(spinner).toBeTruthy();
      expect(spinner?.getAttribute('bdColor')).toBe('rgba(0, 0, 0, 0.8)');
      expect(spinner?.getAttribute('size')).toBe('large');
      expect(spinner?.getAttribute('color')).toBe('#00b1c3');
      expect(spinner?.getAttribute('type')).toBe('ball-scale-multiple');
    });

   
  });
});
