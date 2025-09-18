import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardMasterComponent } from './dashboard-master.component';
import { Router } from '@angular/router';
import { AQRoleInfo, AQAgentInfo, AQUserInfo } from '@agenciiq/login';
import { AQSession } from 'src/app/global-settings/session-storage';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { Roles } from 'src/app/global-settings/roles';

describe('DashboardMasterComponent', () => {
  let component: DashboardMasterComponent;
  let fixture: ComponentFixture<DashboardMasterComponent>;

  let mockRouter = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };

  let mockSession = {
    removeSession: jasmine.createSpy('removeSession')
  };

  let mockRoleInfo = {
    Roles: jasmine.createSpy('Roles').and.returnValue([Roles.Agent.roleCode])
  };

  let mockCheckRoleService = {
    isRoleCodeAvailable: jasmine.createSpy('isRoleCodeAvailable').and.returnValue(true)
  };

  let mockUserInfo = {
    UserId: jasmine.createSpy('UserId').and.returnValue('user123')
  };

  let mockAgentInfo = {
    Agent: jasmine.createSpy('Agent').and.returnValue({
      firstName: 'John',
      middleName: 'K',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardMasterComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AQRoleInfo, useValue: mockRoleInfo },
        { provide: AQUserInfo, useValue: mockUserInfo },
        { provide: AQAgentInfo, useValue: mockAgentInfo },
        { provide: AQSession, useValue: mockSession },
        { provide: CheckRoleService, useValue: mockCheckRoleService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user and agent info correctly in constructor', () => {
    expect(component.isAgent).toBeTrue();
    expect(component.userid).toBe('user123');
    expect(component.name).toBe('John K Doe');
    expect(component.email).toBe('john.doe@example.com');
    expect(mockRoleInfo.Roles).toHaveBeenCalled();
    expect(mockUserInfo.UserId).toHaveBeenCalled();
    expect(mockAgentInfo.Agent).toHaveBeenCalled();
  });

  it('should call navigateByUrl and remove sessions in NavigateToPortal', () => {
    component.NavigateToPortal({});
    expect(mockSession.removeSession).toHaveBeenCalledWith('viewPolicyParams');
    expect(mockSession.removeSession).toHaveBeenCalledWith('insuredReqObj');
    expect(mockSession.removeSession).toHaveBeenCalledWith('IsNavigationFromFQ');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('agenciiq/workbook/quickquote');
    expect(sessionStorage.getItem('IsNavigationFrom')).toBe('true');
  });

  it('should call navigateByUrl and remove sessions in NavigateToPortalFQ', () => {
    component.NavigateToPortalFQ({});
    expect(mockSession.removeSession).toHaveBeenCalledWith('viewPolicyParams');
    expect(mockSession.removeSession).toHaveBeenCalledWith('insuredReqObj');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('agenciiq/workbook/quickquote');
    expect(sessionStorage.getItem('IsNavigationFromFQ')).toBe('true');
    expect(sessionStorage.getItem('IsNavigationFrom')).toBe('true');
  });
});

