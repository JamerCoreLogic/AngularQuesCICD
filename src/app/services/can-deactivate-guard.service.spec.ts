import { TestBed } from '@angular/core/testing';
import { CanDeactivateGuardService } from './can-deactivate-guard.service';
import { AddUserTabsComponent } from '../admin/add-user-tabs/add-user-tabs.component';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

describe('CanDeactivateGuardService', () => {
  let service: CanDeactivateGuardService;
  let mockComponent: Partial<AddUserTabsComponent>;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let mockRouterStateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    mockComponent = {
      canDeactivate: jasmine.createSpy('canDeactivate').and.callFake(() => true)
    };

    mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    mockRouterStateSnapshot = {
      url: '/test-url'
    } as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [CanDeactivateGuardService]
    });
    service = TestBed.inject(CanDeactivateGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('canDeactivate', () => {
    it('should return true when component does not have canDeactivate method', () => {
      const componentWithoutDeactivate = {} as AddUserTabsComponent;
      
      const result = service.canDeactivate(
        componentWithoutDeactivate,
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      expect(result).toBe(true);
    });

    it('should return true when component canDeactivate returns true', () => {
      (mockComponent.canDeactivate as jasmine.Spy).and.returnValue(true);
      
      const result = service.canDeactivate(
        mockComponent as AddUserTabsComponent,
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      expect(result).toBe(true);
      expect(mockComponent.canDeactivate).toHaveBeenCalled();
    });

    it('should return false when component canDeactivate returns false', () => {
      (mockComponent.canDeactivate as jasmine.Spy).and.returnValue(false);
      
      const result = service.canDeactivate(
        mockComponent as AddUserTabsComponent,
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      expect(result).toBe(false);
      expect(mockComponent.canDeactivate).toHaveBeenCalled();
    });

    it('should handle Observable return type from component canDeactivate', (done) => {
      (mockComponent.canDeactivate as jasmine.Spy).and.returnValue(of(true));
      
      const result = service.canDeactivate(
        mockComponent as AddUserTabsComponent,
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      if (result instanceof Observable) {
        result.subscribe((value: boolean) => {
          expect(value).toBe(true);
          expect(mockComponent.canDeactivate).toHaveBeenCalled();
          done();
        });
      }
    });

    it('should handle Promise return type from component canDeactivate', async () => {
      (mockComponent.canDeactivate as jasmine.Spy).and.returnValue(Promise.resolve(true));
      
      const result = service.canDeactivate(
        mockComponent as AddUserTabsComponent,
        mockActivatedRouteSnapshot,
        mockRouterStateSnapshot
      );

      if (result instanceof Promise) {
        const value = await result;
        expect(value).toBe(true);
        expect(mockComponent.canDeactivate).toHaveBeenCalled();
      }
    });
  });
}); 