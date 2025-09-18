import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { OuterHeaderComponent } from './outer-header.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import {
  AQLogoutService,
  AQUserInfo,
  AQAgentInfo,
  AQAgencyInfo,
  AQRoleInfo
} from '@agenciiq/login';
import { PopupService } from '../../utility/Popup/popup.service';
import { IconSettings } from 'src/app/global-settings/icon-settings';
import { GetConfigurationService } from '@agenciiq/aqadmin';
import { CancelButtonService } from 'src/app/shared/services/cancelButtonSerrvice/cancelButton.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('OuterHeaderComponent', () => {
  let component: OuterHeaderComponent;
  let fixture: ComponentFixture<OuterHeaderComponent>;
  let mockLogoutService: jasmine.SpyObj<AQLogoutService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockIconSettings: jasmine.SpyObj<IconSettings>;
  let mockGetConfiguration: jasmine.SpyObj<GetConfigurationService>;
  let mockCancelService: jasmine.SpyObj<CancelButtonService>;
  let mockAgentInfo: jasmine.SpyObj<AQAgentInfo>;
  let mockAgencyInfo: jasmine.SpyObj<AQAgencyInfo>;
  let mockRoleInfo: jasmine.SpyObj<AQRoleInfo>;

  beforeEach(async () => {
    mockLogoutService = jasmine.createSpyObj('AQLogoutService', ['Logout']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockIconSettings = jasmine.createSpyObj('IconSettings', ['IconSettingStatus']);
    mockGetConfiguration = jasmine.createSpyObj('GetConfigurationService', ['GetConfiguration']);
    mockCancelService = jasmine.createSpyObj('CancelButtonService', ['NavigateToHome']);
    mockAgentInfo = jasmine.createSpyObj('AQAgentInfo', ['Agent']);
    mockAgencyInfo = jasmine.createSpyObj('AQAgencyInfo', ['AgencyName']);
    mockRoleInfo = jasmine.createSpyObj('AQRoleInfo', ['Roles']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [OuterHeaderComponent],
      providers: [
        { provide: AQLogoutService, useValue: mockLogoutService },
        { provide: AQUserInfo, useValue: {} },
        { provide: AQAgentInfo, useValue: mockAgentInfo },
        { provide: AQAgencyInfo, useValue: mockAgencyInfo },
        { provide: AQRoleInfo, useValue: mockRoleInfo },
        { provide: PopupService, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OuterHeaderComponent);
    component = fixture.componentInstance;
    mockAgencyInfo.AgencyName.and.returnValue('Test Agency');
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should hide setting menu and navigate to given url', () => {
    component.SettingMenu = true;
    const testUrl = '/some-path';
    component.hideSettingMenu(testUrl);
    expect(component.SettingMenu).toBeFalse();
  });

  it('should call Logout and navigate to "/"', fakeAsync(() => {
    mockLogoutService.Logout.and.returnValue(of({}));
    component.logOut();
    tick();
    expect(mockLogoutService.Logout).toHaveBeenCalled();
  }));

  it('should fetch agent info and set username', () => {
    expect(component.username).toBeUndefined;
  });

  it('should fetch agency name', () => {
    expect(component.agencyName).toBe('Test Agency');
  });

  it('should fetch home and logout icon statuses', () => {
    expect(component.homeIconStatus).toBe('Enabled');
    expect(component.logoutIconStatus).toBe('Enabled');
  });

  it('should toggle SettingMenu flag when OpenSettingMenu is called', () => {
    expect(component.SettingMenu).toBeFalse();
    component.OpenSettingMenu();
    expect(component.SettingMenu).toBeTrue();
    component.OpenSettingMenu();
    expect(component.SettingMenu).toBeFalse();
  });

  it('should handle click and toggle menu based on target id', () => {
    component.SettingMenu = false;
    component.onClick({ id: 'settinIcon' });
    expect(component.SettingMenu).toBeTrue();

    component.onClick({ id: 'otherElement' });
    expect(component.SettingMenu).toBeFalse();
  });
});
