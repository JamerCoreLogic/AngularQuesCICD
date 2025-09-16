import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MaintenanceGuard } from './maintenance.guard';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('MaintenanceGuard', () => {
  let guard: MaintenanceGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create spies for AuthService and Router
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getHeartbeat']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        MaintenanceGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(MaintenanceGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when maintenance is on', (done) => {
    // Arrange
    const mockResponse = ['', '', '', '', '', '', '', '', '', '', '', '', '', 'UnderMaintenance: True'];
    authService.getHeartbeat.and.returnValue(of(mockResponse));

    // Act
    guard.canActivate().subscribe(result => {
      // Assert
      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should redirect to login and return false when maintenance is off', (done) => {
    // Arrange
    const mockResponse = ['', '', '', '', '', '', '', '', '', '', '', '', '', 'UnderMaintenance: False'];
    authService.getHeartbeat.and.returnValue(of(mockResponse));

    // Act
    guard.canActivate().subscribe(result => {
      // Assert
      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });

  it('should handle different maintenance status formats', (done) => {
    // Arrange
    const mockResponse = ['', '', '', '', '', '', '', '', '', '', '', '', '', 'Something else'];
    authService.getHeartbeat.and.returnValue(of(mockResponse));

    // Act
    guard.canActivate().subscribe(result => {
      // Assert
      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });
});
