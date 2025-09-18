import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgentdashboardComponent } from './agentdashboard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AQSession } from 'src/app/global-settings/session-storage';
import { Router } from '@angular/router';
import { SessionIdList } from 'src/app/global-settings/session-id-constraint';
import { of, throwError } from 'rxjs';

describe('AgentdashboardComponent', () => {
  let component: AgentdashboardComponent;
  let fixture: ComponentFixture<AgentdashboardComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let sessionSpy: jasmine.SpyObj<AQSession>;
  let todolistService: any;
  let loaderService: any;
  let userInfo: any;
  let agentInfo: any;
  let agencyInfo: any;

  beforeEach(waitForAsync(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    sessionSpy = jasmine.createSpyObj('AQSession', ['setData']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [AgentdashboardComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AQSession, useValue: sessionSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set evt property when onResize is called', () => {
    const mockEvent: any = { target: { innerWidth: 500, innerHeight: 400 } };
    component.onResize(mockEvent);
    expect(component.evt).toBe(mockEvent);
  });

  it('should set session data and navigate when reference is provided', () => {
    const ref = 'test-reference';
    component.todoView(ref);

    expect(sessionSpy.setData).toHaveBeenCalledWith(SessionIdList.AlfredAlertsRefenceId, ref);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/agent/workbook']);
  });

  it('should do nothing when reference is falsy', () => {
    component.todoView(null);

    expect(sessionSpy.setData).not.toHaveBeenCalled();
  });

  it('should set isAlfredAlertsExpanded to true when toggleAlfredExpand(true) is called', () => {
    component.toggleAlfredExpand(true);
    expect(component.isAlfredAlertsExpanded).toBeTrue();
  });

  it('should set isAlfredAlertsExpanded to false when toggleAlfredExpand(false) is called', () => {
    component.toggleAlfredExpand(false);
    expect(component.isAlfredAlertsExpanded).toBeFalse();
  });

  it('should navigate to root when userId is missing', () => {
    (component as any).userInfo.UserId = jasmine.createSpy().and.returnValue(null);

    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to root when agentId is missing', () => {
    (component as any).agentInfo.Agent = jasmine.createSpy().and.returnValue({ agentId: null });

    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to root when agencyId is missing', () => {
    (component as any).agencyInfo.Agency = jasmine.createSpy().and.returnValue({ agencyId: null });
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
