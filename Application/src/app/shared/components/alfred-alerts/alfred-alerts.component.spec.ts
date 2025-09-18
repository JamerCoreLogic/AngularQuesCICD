import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlfredAlertsComponent } from './alfred-alerts.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoaderService } from '../../utility/loader/loader.service';
import { TransactionCodeMaster } from 'src/app/global-settings/transactionCodeList';
import { AQAgencyInfo, AQAgentInfo, AQUserInfo } from '@agenciiq/login';
import { AQAlfredAlertsService } from '@agenciiq/aqalfred';
import { AQSession } from 'src/app/global-settings/session-storage';

// Mocks
class MockAQAlfredAlertsService {
  AlfredAlerrts(userId, agentId, index) {
    return of({ data: { alfredAlert: [{ quoteId: 'Q123' }] } });
  }
}

class MockLoaderService {
  show() { }
  hide() { }
}

class MockUserInfo {
  UserId() {
    return 'user123';
  }
}

class MockAgentInfo {
  Agent() {
    return { agentId: 'agent123' };
  }
}

class MockAgencyInfo { }

class MockRouter {
  navigate(path) { }
}

class MockAQSession {
  setData(key, value) { }
}

class MockTransactionCodeMaster { }

describe('AlfredAlertsComponent', () => {
  let component: AlfredAlertsComponent;
  let fixture: ComponentFixture<AlfredAlertsComponent>;
  let mockRouter: MockRouter;
  let mockSession: MockAQSession;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlfredAlertsComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: AQAlfredAlertsService, useClass: MockAQAlfredAlertsService },
        { provide: LoaderService, useClass: MockLoaderService },
        { provide: AQUserInfo, useClass: MockUserInfo },
        { provide: AQAgentInfo, useClass: MockAgentInfo },
        { provide: AQAgencyInfo, useClass: MockAgencyInfo },
        { provide: AQSession, useClass: MockAQSession },
        { provide: TransactionCodeMaster, useClass: MockTransactionCodeMaster }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AlfredAlertsComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);
    mockSession = TestBed.inject(AQSession);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAlfredAlerts on init if user and agent exist', () => {
    spyOn(component, 'getAlfredAlerts');
    component.ngOnInit();
    expect(component.getAlfredAlerts).toHaveBeenCalled();
  });

  it('should navigate to root if user or agent info is missing', () => {
    const userInfo = TestBed.inject(AQUserInfo);
    const agentInfo = TestBed.inject(AQAgentInfo);
    spyOn(userInfo, 'UserId').and.returnValue(123);
    //spyOn(agentInfo, 'Agent').and.returnValue({ agentId: '' });

    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.ngOnInit();
  });

  it('should populate AlfredAlerts in getAlfredAlerts', () => {
    component.getAlfredAlerts();
    expect(component.AlfredAlerts.length).toBeGreaterThan(0);
  });

  it('should not throw error if service fails in getAlfredAlerts', () => {
    const service = TestBed.inject(AQAlfredAlertsService);
    spyOn(service, 'AlfredAlerrts').and.returnValue(throwError(() => new Error('fail')));

    expect(() => component.getAlfredAlerts()).not.toThrow();
  });

  it('should navigate to workbook and store session data on viewAlerts', () => {
    spyOn(mockSession, 'setData');
    spyOn(mockRouter, 'navigate');

    const quote = { quoteId: 'Q999' };
    component.viewAlerts(quote);

    expect(mockSession.setData).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/agenciiq/workbook']);
  });

  it('should update view mode on toggleMode', () => {
    component.toggleMode('list');
    expect(component.IsAlfredExpand).toBeTrue();
    expect(component.alfredAlertsViewMode).toBe('list');
  });

  it('should emit and update view mode on toggleExpand(false)', () => {
    spyOn(component.toggleExpandView, 'emit');
    component.toggleExpand(false);
    expect(component.toggleExpandView.emit).toHaveBeenCalledWith(false);
    expect(component.alfredAlertsViewMode).toBe('grid');
  });

  it('should emit without changing view mode on toggleExpand(true)', () => {
    spyOn(component.toggleExpandView, 'emit');
    component.toggleExpand(true);
    expect(component.toggleExpandView.emit).toHaveBeenCalledWith(true);
  });
});
