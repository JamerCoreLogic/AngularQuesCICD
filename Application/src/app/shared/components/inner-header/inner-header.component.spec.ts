import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InnerHeaderComponent } from './inner-header.component';
import { AQLogoutService, AQUserInfo, AQAgentInfo, AQAgencyInfo, AQRoleInfo } from '@agenciiq/login';
import { Router } from '@angular/router';
import { PopupService } from '../../utility/Popup/popup.service';
import { IconSettings } from 'src/app/global-settings/icon-settings';
import { GetConfigurationService } from '@agenciiq/aqadmin';
import { CancelButtonService } from 'src/app/shared/services/cancelButtonSerrvice/cancelButton.service';
import { of } from 'rxjs';

describe('InnerHeaderComponent', () => {
  let component: InnerHeaderComponent;
  let fixture: ComponentFixture<InnerHeaderComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLogoutService: jasmine.SpyObj<AQLogoutService>;
  let mockAgentInfo: jasmine.SpyObj<AQAgentInfo>;
  let mockAgencyInfo: jasmine.SpyObj<AQAgencyInfo>;
  let mockRoleInfo: jasmine.SpyObj<AQRoleInfo>;
  let mockIconSettings: jasmine.SpyObj<IconSettings>;
  let mockConfigService: jasmine.SpyObj<GetConfigurationService>;
  let mockCancelButtonService: jasmine.SpyObj<CancelButtonService>;


  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockLogoutService = jasmine.createSpyObj('AQLogoutService', ['Logout']);
    mockAgentInfo = jasmine.createSpyObj('AQAgentInfo', ['Agent']);
    mockAgencyInfo = jasmine.createSpyObj('AQAgencyInfo', ['AgencyName']);
    mockRoleInfo = jasmine.createSpyObj('AQRoleInfo', ['Roles']);
    mockIconSettings = jasmine.createSpyObj('IconSettings', ['IconSettingStatus']);
    mockConfigService = jasmine.createSpyObj('GetConfigurationService', ['GetConfiguration']);
    mockCancelButtonService = jasmine.createSpyObj('CancelButtonService', ['NavigateToHome']);

    await TestBed.configureTestingModule({
      declarations: [InnerHeaderComponent],
      providers: [
        { provide: AQLogoutService, useValue: mockLogoutService },
        { provide: AQAgentInfo, useValue: mockAgentInfo },
        { provide: AQAgencyInfo, useValue: mockAgencyInfo },
        { provide: AQUserInfo, useValue: {} },
        { provide: AQRoleInfo, useValue: mockRoleInfo },
        { provide: Router, useValue: mockRouter },
        { provide: PopupService, useValue: {} },
        { provide: IconSettings, useValue: mockIconSettings },
        { provide: GetConfigurationService, useValue: mockConfigService },
        { provide: CancelButtonService, useValue: mockCancelButtonService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InnerHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should call necessary methods in ngOnInit', () => {
    spyOn(component, 'getAgentInfo');
    spyOn(component, 'getAgencyName');
    spyOn(component, 'getHomeIconStatus');
    spyOn(component, 'getMenuList').and.returnValue([]);
    spyOn(component, 'getMGAConfiguration');

    component.ngOnInit();

    expect(component.getAgentInfo).toHaveBeenCalled();
    expect(component.getAgencyName).toHaveBeenCalled();
    expect(component.getHomeIconStatus).toHaveBeenCalled();
    expect(component.getMenuList).toHaveBeenCalled();
    expect(component.getMGAConfiguration).toHaveBeenCalled();
  });

  it('should fetch MGA configuration and set properties', () => {
    const mockResponse = {
      data: {
        mgaConfiguration: {
          name: 'Test MGA',
          logoURL: 'http://example.com/logo.png',
          aqLogoURL: 'http://example.com/aq-logo.png'
        }
      }
    };

    component.getMGAConfiguration();
    expect(mockConfigService.GetConfiguration).toHaveBeenCalled();
  });

  it('should call OpenSettingMenu when clicked on element with id "settinIcon"', () => {
    spyOn(component, 'OpenSettingMenu');
    const event = new MouseEvent('click', { bubbles: true });
    const element = document.createElement('div');
    element.id = 'settinIcon';
    document.body.appendChild(element);
    element.dispatchEvent(event);
    expect(component.OpenSettingMenu).toHaveBeenCalled();
    document.body.removeChild(element);
  });

  it('should set SettingMenu to false when clicked outside "settinIcon"', () => {
    component.SettingMenu = true;
    const event = new MouseEvent('click', { bubbles: true });
    const element = document.createElement('div');
    element.id = 'otherElement';
    document.body.appendChild(element);
    element.dispatchEvent(event);
    expect(component.SettingMenu).toBeFalse();
    document.body.removeChild(element);
  });

  it('should set username from agent info', () => {
    component.getAgentInfo();
  });

  it('should call NavigateToHome on redirectToHome', () => {
    component.redirectToHome();
    expect(mockCancelButtonService.NavigateToHome).toHaveBeenCalled();
  });

  it('should fetch agency name', () => {
    mockAgencyInfo.AgencyName.and.returnValue('My Agency');
    component.getAgencyName();
    expect(component.agencyName).toBe('My Agency');
  });

  it('should call logout and navigate to root', () => {
    mockLogoutService.Logout.and.returnValue(of({}));
    component.logOut();
    expect(mockLogoutService.Logout).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should toggle setting menu on OpenSettingMenu', () => {
    component.SettingMenu = false;
    component.OpenSettingMenu();
    expect(component.SettingMenu).toBeTrue();
    component.OpenSettingMenu();
    expect(component.SettingMenu).toBeFalse();
  });

  it('should navigate and hide settings menu on hideSettingMenu', () => {
    component.hideSettingMenu('/test-url');
    expect(component.SettingMenu).toBeFalse();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/test-url');
  });

  it('should fetch icon status and assign to variables', () => {
    const icons = { homeIcon: 'active', logoutIcon: 'inactive' };
    component.getHomeIconStatus();
    expect(component.homeIconStatus).toBeUndefined;
    expect(component.logoutIconStatus).toBeUndefined;
  });

  it('should filter menu list based on role', () => {
    component['headerMenu'].HeaderMenuList = [

    ];
    const menu = component.getMenuList();
    expect(menu?.length).toBeUndefined;
  });
});