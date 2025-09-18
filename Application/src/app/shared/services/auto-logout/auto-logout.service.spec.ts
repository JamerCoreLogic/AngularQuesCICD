import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AutoLogoutService } from './auto-logout.service';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NgZone, NO_ERRORS_SCHEMA } from '@angular/core';
import { AQLogoutService, AQUserInfo } from '@agenciiq/login';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('AutoLogoutService', () => {
    let service: AutoLogoutService;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockLogoutService: jasmine.SpyObj<AQLogoutService>;
    let mockUserInfo: jasmine.SpyObj<AQUserInfo>;
    let ngZone: NgZone;

    beforeEach(() => {
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);
        mockLogoutService = jasmine.createSpyObj('AQLogoutService', ['Logout']);
        mockUserInfo = jasmine.createSpyObj('AQUserInfo', ['UserId']);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule,
                HttpClientModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                AutoLogoutService,
                { provide: Router, useValue: mockRouter },
                { provide: AQLogoutService, useValue: mockLogoutService },
                { provide: AQUserInfo, useValue: mockUserInfo }
            ]
        });

        service = TestBed.inject(AutoLogoutService);
        ngZone = TestBed.inject(NgZone);
    });

    afterEach(() => {
        localStorage.removeItem('lastAction');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set and get lastAction in localStorage', () => {
        const now = Date.now();
        service.lastAction = now;
        expect(service.lastAction).toBe(now);
    });

    it('should reset lastAction to current timestamp', () => {
        const before = Date.now();
        service.reset();
        const after = service.lastAction;
        expect(after).toBeGreaterThanOrEqual(before);
    });

    it('should call logout and navigate to "/" when timed out', fakeAsync(() => {
        const pastTime = Date.now() - (31 * 60 * 1000); // 31 mins ago
        localStorage.setItem('lastAction', pastTime.toString());
        mockUserInfo.UserId.and.returnValue(123);

        ngZone.run(() => {
            service.check();
        });

        expect(mockLogoutService.Logout).toHaveBeenCalled();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    }));

    it('should NOT logout if not timed out', fakeAsync(() => {
        const recentTime = Date.now(); // just now
        localStorage.setItem('lastAction', recentTime.toString());
        mockUserInfo.UserId.and.returnValue(123);

        ngZone.run(() => {
            service.check();
        });

        expect(mockLogoutService.Logout).not.toHaveBeenCalled();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));

    it('should NOT logout if UserId is not present', fakeAsync(() => {
        const pastTime = Date.now() - (31 * 60 * 1000); // 31 mins ago
        localStorage.setItem('lastAction', pastTime.toString());
        mockUserInfo.UserId.and.returnValue(null);

        ngZone.run(() => {
            service.check();
        });

        expect(mockLogoutService.Logout).not.toHaveBeenCalled();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));
});
