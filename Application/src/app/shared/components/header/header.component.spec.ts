import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import {
  AQLogoutService, AQUserInfo, AQAgentInfo, AQAgencyInfo,
  AQRightsInfo, AQRoleInfo
} from '@agenciiq/login';
import { PopupService } from '../../utility/Popup/popup.service';
import { GetConfigurationService } from '@agenciiq/aqadmin';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  // Mocks
  const mockRouter = { navigateByUrl: jasmine.createSpy('navigateByUrl') };
  const mockLogoutService = { Logout: jasmine.createSpy('Logout').and.returnValue(of({})) };
  const mockUserInfo = {};
  const mockAgentInfo = { Agent: () => ({ firstName: 'John', middleName: 'A', lastName: 'Doe' }) };
  const mockAgencyInfo = { AgencyName: () => 'Test Agency' };
  const mockPopupService = {};
  const mockRoleInfo = { Roles: () => [{ roleCode: 'ADMIN' }] };
  const mockRightsInfo = { Rights: () => ['RIGHT_1'] };
  const mockConfigurationService = {
    GetConfiguration: () => of({
      data: {
        mgaConfiguration: {
          name: 'MGA Name',
          logoURL: 'logo.png',
          aqLogoURL: 'aqlogo.png'
        }
      }
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: AQLogoutService, useValue: mockLogoutService },
        { provide: AQUserInfo, useValue: mockUserInfo },
        { provide: AQAgentInfo, useValue: mockAgentInfo },
        { provide: AQAgencyInfo, useValue: mockAgencyInfo },
        { provide: PopupService, useValue: mockPopupService },
        { provide: Router, useValue: mockRouter },
        { provide: AQRoleInfo, useValue: mockRoleInfo },
        { provide: AQRightsInfo, useValue: mockRightsInfo },
        { provide: GetConfigurationService, useValue: mockConfigurationService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit runs here
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize agent info and username', () => {
    expect(component.username).toBe('John A Doe');
  });

  it('should initialize agency name', () => {
    expect(component.agencyName).toBe('Test Agency');
  });

  it('should fetch and set MGA configuration', () => {
    component.getMGAConfiguration();
    expect(component.mgaName).toBe('MGA Name');
    expect(component.mgaLogo).toBe('logo.png');
    expect(component.aqLogo).toBe('aqlogo.png');
  });

  it('should call logout and handle success', () => {
    component.logOut();
    expect(mockLogoutService.Logout).toHaveBeenCalled();
  });

  it('should handle logout error', () => {
    mockLogoutService.Logout = jasmine.createSpy().and.returnValue(throwError(() => 'Logout Error'));
    component.logOut();
    expect(mockLogoutService.Logout).toHaveBeenCalled();
  });

  it('should toggle SettingMenu with OpenSettingMenu', () => {
    component.SettingMenu = false;
    component.OpenSettingMenu();
    expect(component.SettingMenu).toBeTrue();

    component.OpenSettingMenu();
    expect(component.SettingMenu).toBeFalse();
  });

  it('should hide setting menu and navigate', () => {
    spyOn(localStorage, 'removeItem');
    component.hideSettingMenu('agenciiq/workbook');
    expect(component.SettingMenu).toBeFalse();
    expect(localStorage.removeItem).toHaveBeenCalledWith('period');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('agenciiq/workbook');
  });

  it('should get filtered menu list', () => {
    const mockMenuList = [{
      roles: ['ADMIN']
    }];
    const menu = component.getMenuList();
    expect(menu.length).toBe(0);
  });

  it('should toggle SettingMenu from onClick', () => {
    const mockEvent = { id: 'settinIcon' };
    component.SettingMenu = false;
    component.onClick(mockEvent);
    expect(component.SettingMenu).toBeTrue();

    const mockEvent2 = { id: 'somethingElse' };
    component.onClick(mockEvent2);
    expect(component.SettingMenu).toBeFalse();
  });
});

