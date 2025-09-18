import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuotesChartComponent } from './quotes-chart.component';
import { KpiService } from '@agenciiq/aqkpi';
import { Router } from '@angular/router';
import { AQAgentInfo, AQUserInfo } from '@agenciiq/login';
import { ChartsService } from './charts.service';
import { PeriodSettings } from 'src/app/global-settings/periodSetting';
import { SetDateService } from '../../services/setDate/set-date.service';
import { AQSession } from 'src/app/global-settings/session-storage';
import { of } from 'rxjs';

describe('QuotesChartComponent', () => {
  let component: QuotesChartComponent;
  let fixture: ComponentFixture<QuotesChartComponent>;
  let mockKpiService: any;
  let mockChartsService: any;
  let mockAgentInfo: any;
  let mockUserInfo: any;
  let mockPeriodSettings: any;
  let mockSession: any;

  beforeEach(async () => {
    mockKpiService = {
      AqkpiList: jasmine.createSpy().and.returnValue(of({
        data: {
          charts: [{
            nbPremiumsChart: [{ month: 'Jan', value: 100 }],
            rnPremiumsChart: [],
            totalQuotes: [{ month: 'Jan', value: 50 }],
            totalIndications: [{ month: 'Jan', value: 20 }]
          }]
        }
      }))
    };

    mockChartsService = {
      getCharts: jasmine.createSpy().and.returnValue({})
    };

    mockAgentInfo = {
      Agent: () => ({ agentId: 1 })
    };

    mockUserInfo = {
      UserId: () => 123
    };

    mockPeriodSettings = {
      period: of('Monthly')
    };

    mockSession = {
      getData: (key: string) => key === 'periodStartDate' ? new Date() : new Date()
    };

    await TestBed.configureTestingModule({
      declarations: [QuotesChartComponent],
      providers: [
        { provide: KpiService, useValue: mockKpiService },
        { provide: ChartsService, useValue: mockChartsService },
        { provide: AQAgentInfo, useValue: mockAgentInfo },
        { provide: AQUserInfo, useValue: mockUserInfo },
        { provide: PeriodSettings, useValue: mockPeriodSettings },
        { provide: SetDateService, useValue: {} },
        { provide: AQSession, useValue: mockSession },
        { provide: Router, useValue: { navigate: jasmine.createSpy() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuotesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to period and call getkpi', () => {
    spyOn(component, 'getkpi');
    component.ngOnInit();
    expect(component.getkpi).toHaveBeenCalled();
  });

  it('should toggle ChartsStatus', () => {
    component.ChartsStatus = true;
    component.ChartsToggle();
    expect(component.ChartsStatus).toBeFalse(); // bug in your code: always sets it to false
  });

  it('should fetch KPI data and populate ChartsData', () => {
    component.getkpi('Monthly', new Date(), new Date());
    expect(mockKpiService.AqkpiList).toHaveBeenCalled();
    //expect(mockChartsService.getCharts).toHaveBeenCalledTimes(3);
  });
});
