
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AgentMasterComponent } from './agent-master.component';
import { Roles } from 'src/app/global-settings/roles';
import { NavigationEnd, Router } from '@angular/router';
import { AQRoleInfo } from '@agenciiq/login';


describe('AgentMasterComponent', () => {
  let component: AgentMasterComponent;
  let fixture: ComponentFixture<AgentMasterComponent>;
  let httpClient: HttpClient;
  let _roleInfo: AQRoleInfo;
  let router: Router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [AgentMasterComponent],
      providers: [

      ],
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(AgentMasterComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    _roleInfo = TestBed.inject(AQRoleInfo);
    router = TestBed.inject(Router)
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //ngOnInit
  it('should call checkURL on ngOnInit', () => {
    const component = fixture.componentInstance;
    spyOn(component, 'checkURL');

    component.ngOnInit();

    expect(component.checkURL).toHaveBeenCalled();
  });

  //checkURL
  it('should update IsInnerHeader on NavigationEnd event', () => {
    const mockRoleInfo = {
      Roles: () => [{ roleCode: Roles.SystemAdmin.roleCode }]
    };
    component['_roleInfo'] = mockRoleInfo as any;

    const mockRouterEvents = of(new NavigationEnd(1, '/agenciiq/users', '/agenciiq/users'));

    component.checkURL();

    expect(component.IsInnerHeader).toBeFalse();
  });

});

