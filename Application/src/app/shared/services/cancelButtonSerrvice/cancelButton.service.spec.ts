import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CheckRoleService } from '../check-role/check-role.service';
import { AQRoleInfo } from '@agenciiq/login';
import { AQSession } from 'src/app/global-settings/session-storage';
import { Roles } from 'src/app/global-settings/roles';
import { CancelButtonService } from './cancelButton.service';

describe('CancelButtonService', () => {
    let service: CancelButtonService;
    let routerSpy: jasmine.SpyObj<Router>;
    let checkRoleServiceSpy: jasmine.SpyObj<CheckRoleService>;
    let roleInfoMock: jasmine.SpyObj<AQRoleInfo>;
    let sessionServiceMock: jasmine.SpyObj<AQSession>;

    beforeEach(() => {
        routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
        checkRoleServiceSpy = jasmine.createSpyObj('CheckRoleService', ['isRoleCodeAvailable']);
        roleInfoMock = jasmine.createSpyObj('AQRoleInfo', ['Roles']);
        sessionServiceMock = jasmine.createSpyObj('AQSession', ['get']); // extend if needed

        TestBed.configureTestingModule({
            providers: [
                CancelButtonService,
                { provide: Router, useValue: routerSpy },
                { provide: CheckRoleService, useValue: checkRoleServiceSpy },
                { provide: AQRoleInfo, useValue: roleInfoMock },
                { provide: AQSession, useValue: sessionServiceMock },
            ]
        });

        service = TestBed.inject(CancelButtonService);
    });

    function setupRolesReturn(roles: any, roleChecks: { [key: string]: boolean }) {
        roleInfoMock.Roles.and.returnValue(roles);
        checkRoleServiceSpy.isRoleCodeAvailable.and.callFake((roleCode: string) => roleChecks[roleCode] || false);
    }

    it('should navigate to /agenciiq for Agent role', () => {
        setupRolesReturn([Roles.Agent.roleCode], { [Roles.Agent.roleCode]: true });
        service.NavigateToHome();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/agenciiq');
    });

    it('should navigate to /agenciiq/users for AgencyAdmin role', () => {
        setupRolesReturn([Roles.AgencyAdmin.roleCode], { [Roles.AgencyAdmin.roleCode]: true });
        service.NavigateToHome();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/agenciiq/users');
    });

    it('should navigate to /agenciiq/users for SystemAdmin role', () => {
        setupRolesReturn([Roles.SystemAdmin.roleCode], { [Roles.SystemAdmin.roleCode]: true });
        service.NavigateToHome();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/agenciiq/users');
    });

    it('should navigate to /agenciiq/agencies for MGAAdmin role', () => {
        setupRolesReturn([Roles.MGAAdmin.roleCode], { [Roles.MGAAdmin.roleCode]: true });
        service.NavigateToHome();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/agenciiq/agencies');
    });

    it('should navigate to /agenciiq for UW roles (Underwriter, Assistant, Manager, Supervisor)', () => {
        const uwRoles = [
            Roles.Underwriter.roleCode,
            Roles.UnderwriterAssistant.roleCode,
            Roles.UWManager.roleCode,
            Roles.UWSupervisior.roleCode,
        ];
        for (const role of uwRoles) {
            setupRolesReturn([role], { [role]: true });
            service.NavigateToHome();
            expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/agenciiq');
            routerSpy.navigateByUrl.calls.reset();
        }
    });

    it('should not navigate if no roles match', () => {
        setupRolesReturn(['OtherRole'], {});
        service.NavigateToHome();
        expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });
});
