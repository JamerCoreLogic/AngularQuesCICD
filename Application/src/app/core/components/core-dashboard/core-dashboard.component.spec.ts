import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreDashboardComponent } from './core-dashboard.component';
import { Router } from '@angular/router';
import { AQRoleInfo } from '@agenciiq/login';
import { Roles } from '../../../global-settings/roles';
import { of } from 'rxjs';

describe('CoreDashboardComponent', () => {
  let component: CoreDashboardComponent;
  let fixture: ComponentFixture<CoreDashboardComponent>;
  let mockRoleInfo: jasmine.SpyObj<AQRoleInfo>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockRoleInfo = jasmine.createSpyObj('AQRoleInfo', ['Roles']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [CoreDashboardComponent],
      providers: [
        { provide: AQRoleInfo, useValue: mockRoleInfo },
        { provide: Router, useValue: mockRouter }
      ]
    });

    fixture = TestBed.createComponent(CoreDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set role from _roleInfo on init', () => {
    const testRole: any = { roleCode: 'AGENCY_ADMIN' };
    mockRoleInfo.Roles.and.returnValue([testRole]);
    component.ngOnInit();
    expect(component.roles).toEqual(testRole.roleCode);
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should navigate to "/" if no role is found', () => {
    mockRoleInfo.Roles.and.returnValue([]);
    component.ngOnInit();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });
});

