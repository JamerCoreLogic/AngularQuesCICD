import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgencyMasterComponent } from './agency-master.component';
import { Router, NavigationEnd } from '@angular/router';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQRoleInfo } from '@agenciiq/login';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { of, Subject } from 'rxjs';
import { Roles } from 'src/app/global-settings/roles';

describe('AgencyMasterComponent', () => {
  let component: AgencyMasterComponent;
  let fixture: ComponentFixture<AgencyMasterComponent>;
  let mockLoaderService: jasmine.SpyObj<LoaderService>;
  let mockRouter: any;
  let mockRoleInfo: any;
  let mockCheckRoleService: any;
  let routerEventsSubject: Subject<any>;

  beforeEach(async () => {
    mockLoaderService = jasmine.createSpyObj('LoaderService', ['hide']);
    routerEventsSubject = new Subject<any>();
    mockRouter = {
      url: '/agenciiq/agencies',
      events: routerEventsSubject.asObservable(),
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };
    mockRoleInfo = {
      Roles: jasmine.createSpy('Roles')
    };
    mockCheckRoleService = jasmine.createSpyObj('CheckRoleService', ['isRoleCodeAvailable']);

    await TestBed.configureTestingModule({
      declarations: [AgencyMasterComponent],
      providers: [
        { provide: LoaderService, useValue: mockLoaderService },
        { provide: Router, useValue: mockRouter },
        { provide: AQRoleInfo, useValue: mockRoleInfo },
        { provide: CheckRoleService, useValue: mockCheckRoleService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgencyMasterComponent);
    component = fixture.componentInstance;
  });

  it('should create the component and call loaderService.hide()', () => {
    expect(component).toBeTruthy();
    expect(mockLoaderService.hide).toHaveBeenCalled();
  });

  it('should set IsInnerHeader to false for Underwriter roles', () => {
    const roles = [{ roleCode: Roles.Underwriter.roleCode }];
    mockRoleInfo.Roles.and.returnValue(roles);
    mockCheckRoleService.isRoleCodeAvailable.and.callFake((code: string) => code === Roles.Underwriter.roleCode);

    component.checkURL();

    expect(component.IsInnerHeader).toBeFalse();
  });

  it('should set IsInnerHeader to true for MGAAdmin role', () => {
    const roles = [{ roleCode: Roles.MGAAdmin.roleCode }];
    mockRoleInfo.Roles.and.returnValue(roles);
    mockCheckRoleService.isRoleCodeAvailable.and.callFake((code: string) => code === Roles.MGAAdmin.roleCode);

    component.checkURL();

    expect(component.IsInnerHeader).toBeTrue();
  });

  it('should update IsInnerHeader on NavigationEnd event for MGAAdmin', () => {
    const roles = [{ roleCode: Roles.MGAAdmin.roleCode }];
    mockRoleInfo.Roles.and.returnValue(roles);
    mockCheckRoleService.isRoleCodeAvailable.and.callFake((code: string) => code === Roles.MGAAdmin.roleCode);
    component.checkURL();
    routerEventsSubject.next(new NavigationEnd(1, '/previous', '/agenciiq/agencies'));
  });

  it('should update IsInnerHeader on NavigationEnd event for Underwriter', () => {
    const roles = [{ roleCode: Roles.Underwriter.roleCode }];
    mockRoleInfo.Roles.and.returnValue(roles);
    mockCheckRoleService.isRoleCodeAvailable.and.callFake((code: string) => code === Roles.Underwriter.roleCode);

    component.checkURL();

    routerEventsSubject.next(new NavigationEnd(1, '/previous', '/agenciiq/agencies'));

    expect(component.IsInnerHeader).toBeFalse();
  });
});
