import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MaintenanceComponent } from './maintenance.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MaintenanceComponent', () => {
  let component: MaintenanceComponent;
  let fixture: ComponentFixture<MaintenanceComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getHeartbeat'], {
      maintenanceHandled: false
    });
    authServiceSpy.getHeartbeat.and.returnValue(of(['', '', '', '', '', '', '', '', '', '', '', '', '', 'UnderMaintenace: True']));
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MaintenanceComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceComponent);
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

  describe('Initialization', () => {
    it('should call checkMaintenance and startMaintenanceCheck on init', () => {
      const checkMaintenanceSpy = spyOn(component, 'checkMaintenance');
      const startMaintenanceCheckSpy = spyOn(component, 'startMaintenanceCheck');

      component.ngOnInit();

      expect(checkMaintenanceSpy).toHaveBeenCalled();
      expect(startMaintenanceCheckSpy).toHaveBeenCalled();
    });

    it('should clear interval on destroy', () => {
      const clearIntervalSpy = spyOn(window, 'clearInterval');
      component['maintenanceInterval'] = setInterval(() => {}, 1000);

      component.ngOnDestroy();

      expect(clearIntervalSpy).toHaveBeenCalledWith(component['maintenanceInterval']);
    });
  });

  describe('checkMaintenance', () => {
    it('should navigate to login when maintenance is false', fakeAsync(() => {
      authServiceSpy.getHeartbeat.and.returnValue(of(['', '', '', '', '', '', '', '', '', '', '', '', '', 'UnderMaintenace: False']));

      component.checkMaintenance();
      tick();

      expect(authServiceSpy.maintenanceHandled).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should not navigate when maintenance is true', fakeAsync(() => {
      authServiceSpy.getHeartbeat.and.returnValue(of(['', '', '', '', '', '', '', '', '', '', '', '', '', 'UnderMaintenace: True']));

      component.checkMaintenance();
      tick();

      expect(routerSpy.navigate).not.toHaveBeenCalled();
    }));

   
  });

  describe('startMaintenanceCheck', () => {
    it('should set up maintenance interval', fakeAsync(() => {
      const checkMaintenanceSpy = spyOn(component, 'checkMaintenance');

      component.startMaintenanceCheck();
      tick(9000); // Wait for one interval

      expect(checkMaintenanceSpy).toHaveBeenCalled();
      clearInterval(component['maintenanceInterval']);
    }));

    it('should continue checking maintenance at regular intervals', fakeAsync(() => {
      const checkMaintenanceSpy = spyOn(component, 'checkMaintenance');

      component.startMaintenanceCheck();
      tick(27000); // Wait for three intervals

      expect(checkMaintenanceSpy).toHaveBeenCalledTimes(3);
      clearInterval(component['maintenanceInterval']);
    }));
  });

  describe('Template Tests', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render maintenance page title', () => {
      const titleElements = fixture.nativeElement.querySelectorAll('.title');
      expect(titleElements[0].textContent).toBe('Application Under');
      expect(titleElements[1].textContent).toBe(' Maintenance');
    });

    it('should render maintenance message', () => {
      const subtitle = fixture.nativeElement.querySelector('.subtitle');
      expect(subtitle.textContent).toBe("We're improving your experience! Please check back shortly.");
    });

    it('should render logo image', () => {
      const logo = fixture.nativeElement.querySelector('.logo');
      expect(logo).toBeTruthy();
      expect(logo.getAttribute('src')).toContain('FPD Solutions Logo.png');
      expect(logo.getAttribute('alt')).toBe('MyFPD Portal Logo');
    });

    it('should render maintenance illustration', () => {
      const illustration = fixture.nativeElement.querySelector('.illustration');
      expect(illustration).toBeTruthy();
      expect(illustration.getAttribute('src')).toContain('Illustration.svg');
      expect(illustration.getAttribute('alt')).toBe('Maintenance Illustration');
    });
  });
});
