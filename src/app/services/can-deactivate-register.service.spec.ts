import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanDeactivateRegisterService } from './can-deactivate-register.service';
import { RegisterTabsComponent } from '../register-tabs/register-tabs.component';
import { Observable } from 'rxjs';

describe('CanDeactivateRegisterService', () => {
  let service: CanDeactivateRegisterService;
  let mockRegisterTabsComponent: jasmine.SpyObj<RegisterTabsComponent>;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let mockRouterStateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    mockRegisterTabsComponent = jasmine.createSpyObj('RegisterTabsComponent', ['canDeactivate']);
    mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    mockRouterStateSnapshot = {
      url: '/test-url'
    } as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        CanDeactivateRegisterService,
        { provide: RegisterTabsComponent, useValue: mockRegisterTabsComponent }
      ]
    });
    
    service = TestBed.inject(CanDeactivateRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('canDeactivate', () => {
    it('should return true when component does not have canDeactivate method', () => {
      // Arrange
      mockRegisterTabsComponent.canDeactivate = undefined as any;

      // Act
      const result = service.canDeactivate(
        mockRegisterTabsComponent,
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when component canDeactivate returns true', () => {
      // Arrange
      mockRegisterTabsComponent.canDeactivate.and.returnValue(true);

      // Act
      const result = service.canDeactivate(
        mockRegisterTabsComponent,
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      // Assert
      expect(result).toBe(true);
      expect(mockRegisterTabsComponent.canDeactivate).toHaveBeenCalled();
    });

    it('should handle boolean return type from component canDeactivate', () => {
      // Arrange
      mockRegisterTabsComponent.canDeactivate.and.returnValue(true);

      // Act
      const result = service.canDeactivate(
        mockRegisterTabsComponent,
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      // Assert
      expect(result).toBe(true);
      expect(mockRegisterTabsComponent.canDeactivate).toHaveBeenCalled();
    });

    it('should handle Promise return type from component canDeactivate when confirmed', async () => {
      // Arrange
      const promise = Promise.resolve(true);
      mockRegisterTabsComponent.canDeactivate.and.returnValue(promise);

      // Act
      const result = service.canDeactivate(
        mockRegisterTabsComponent,
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      // Assert
      expect(result).toEqual(promise);
      expect(mockRegisterTabsComponent.canDeactivate).toHaveBeenCalled();
      const value = await result;
      expect(value).toBe(true);
    });

    it('should handle Promise return type from component canDeactivate when cancelled', async () => {
      // Arrange
      const promise = Promise.resolve(false);
      mockRegisterTabsComponent.canDeactivate.and.returnValue(promise);

      // Act
      const result = service.canDeactivate(
        mockRegisterTabsComponent,
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      // Assert
      expect(result).toEqual(promise);
      expect(mockRegisterTabsComponent.canDeactivate).toHaveBeenCalled();
      const value = await result;
      expect(value).toBe(false);
    });
  });
}); 