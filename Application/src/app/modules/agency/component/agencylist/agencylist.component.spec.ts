import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgencylistComponent } from './agencylist.component';
import { AQAgencyService } from '@agenciiq/agency';
import { AQUserInfo, AQAgencyInfo, AQRoleInfo, AQAgentInfo } from '@agenciiq/login';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { AQSession } from 'src/app/global-settings/session-storage';
import { of, Subscription, throwError } from 'rxjs';
import { Roles } from 'src/app/global-settings/roles';

describe('AgencylistComponent', () => {
  let component: AgencylistComponent;
  let fixture: ComponentFixture<AgencylistComponent>;
  let mockAgencyService: jasmine.SpyObj<AQAgencyService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLoader: jasmine.SpyObj<LoaderService>;
  let mockSession: jasmine.SpyObj<AQSession>;
  let mockCheckRoleService: jasmine.SpyObj<CheckRoleService>;
  let mockUser: jasmine.SpyObj<AQUserInfo>;
  let mockAgencyInfo: jasmine.SpyObj<AQAgencyInfo>;
  let mockAgentInfo: jasmine.SpyObj<AQAgentInfo>;
  let mockRoleInfo: jasmine.SpyObj<AQRoleInfo>;

  beforeEach(() => {
    mockAgencyService = jasmine.createSpyObj('AQAgencyService', ['NewAgencyList']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockLoader = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    mockSession = jasmine.createSpyObj('AQSession', ['setData', 'getData', 'removeSession']);
    mockCheckRoleService = jasmine.createSpyObj('CheckRoleService', ['isRoleCodeAvailable']);
    mockUser = jasmine.createSpyObj('AQUserInfo', ['UserId']);
    mockAgencyInfo = jasmine.createSpyObj('AQAgencyInfo', ['Agency']);
    mockAgentInfo = jasmine.createSpyObj('AQAgentInfo', ['AgentId']);
    mockRoleInfo = jasmine.createSpyObj('AQRoleInfo', ['Roles']);

    TestBed.configureTestingModule({
      declarations: [AgencylistComponent],
      providers: [
        { provide: AQAgencyService, useValue: mockAgencyService },
        { provide: Router, useValue: mockRouter },
        { provide: LoaderService, useValue: mockLoader },
        { provide: AQSession, useValue: mockSession },
        { provide: CheckRoleService, useValue: mockCheckRoleService },
        { provide: AQUserInfo, useValue: mockUser },
        { provide: AQAgencyInfo, useValue: mockAgencyInfo },
        { provide: AQAgentInfo, useValue: mockAgentInfo },
        { provide: AQRoleInfo, useValue: mockRoleInfo },
      ]
    });

    fixture = TestBed.createComponent(AgencylistComponent);
    component = fixture.componentInstance;

    // Default mock values
    mockUser.UserId.and.returnValue(1);
    mockAgentInfo.AgentId.and.returnValue(1);
    mockRoleInfo.Roles.and.returnValue([{ roleCode: Roles.MGAAdmin.roleCode, roleId: 1, roleName: 'MGA Admin' }]);
    mockCheckRoleService.isRoleCodeAvailable.and.returnValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error in getAgencyList gracefully', () => {
    mockAgencyService.NewAgencyList.and.returnValue(throwError(() => new Error('API failure')));

    component.getAgencyList('Yes');

    expect(mockLoader.show).toHaveBeenCalled();
    expect(mockLoader.hide).toHaveBeenCalled();
  });

  it('should update sorting flag on sortAgents()', () => {
    const initialFlag = component.flag;
    component.sortAgents('agencyName');
    expect(component.sortedColumnName?.columnName).toBe('agencyName');
    expect(component.flag).toBe(!initialFlag);
  });

  it('should navigate to edit agency', () => {
    component.agencyType = 'register';
    component.registerType = 'Yes';
    component.EditAgency('123');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('agenciiq/agencies/addagency');
  });

  it('should navigate to add agency', () => {
    component.AddAgency();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('agenciiq/agencies/addagency');
  });

  it('should switch viewMode on Events()', () => {
    component.Events('edit');
    expect(component.viewMode).toBe('edit');
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = jasmine.createSpy();
    component['agencyListSubscription'] = { unsubscribe: unsubscribeSpy } as any;
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should check permission in initializePermissions()', () => {
    mockCheckRoleService.isRoleCodeAvailable.and.returnValue(true);
    component['initializePermissions']();
    expect(component.isAddAgency).toBeTrue();
  });

  it('should unsubscribe on destroy', () => {
    const subscription = new Subscription();
    const unsubscribeSpy = spyOn(subscription, 'unsubscribe');
    component['agencyListSubscription'] = subscription;

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});