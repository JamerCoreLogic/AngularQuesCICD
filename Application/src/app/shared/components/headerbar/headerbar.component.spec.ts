import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderbarComponent } from './headerbar.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { KpiService } from '@agenciiq/aqkpi';
import { PeriodSettings } from 'src/app/global-settings/periodSetting';
import { workboardSettings } from 'src/app/global-settings/workboardSetting';
import { AQAgentInfo, AQUserInfo } from '@agenciiq/login';
import { PeriodOption } from './period-options';
import { AqworkboardServiceService } from '@agenciiq/aqworkboard';
import { AQSession } from 'src/app/global-settings/session-storage';

describe('HeaderbarComponent', () => {
  let component: HeaderbarComponent;
  let fixture: ComponentFixture<HeaderbarComponent>;
  let mockPeriod: jasmine.SpyObj<PeriodSettings>;
  let router: Router;
  let apkiService: jasmine.SpyObj<KpiService>;
  let userService: jasmine.SpyObj<AQUserInfo>;
  let agentService: jasmine.SpyObj<AQAgentInfo>;

  // Mock dependencies
  const mockRouter = {
    navigateByUrl: jasmine.createSpy('navigateByUrl'),
    navigate: jasmine.createSpy('navigate')
  };

  const mockKpiService = {
    AqkpiList: jasmine.createSpy('AqkpiList').and.returnValue(of({ data: { kpiResponses: [] } }))
  };

  const mockPeriodSettings = {
    period: of('Month'),
    SetPeriod: ''
  };

  const mockWorkboardSettings = {};

  const mockAgentInfo = {
    Agent: () => ({ agentId: 16 })
  };

  const mockUserInfo = {
    UserId: () => 42
  };

  const mockPeriodOption = {
    getQuarterName: jasmine.createSpy('getQuarterName').and.returnValue('Q1'),
    QuarterOptions: jasmine.createSpy('QuarterOptions').and.returnValue({ DisplayText: 'Q1 2024' }),
    getMonthName: jasmine.createSpy('getMonthName').and.returnValue('January'),
    YearOptions: jasmine.createSpy('YearOptions').and.returnValue('2024')
  };

  const mockWorkboardService = {
    workboardPeriodList: jasmine.createSpy('workboardPeriodList').and.returnValue(of({
      data: {
        workboardResponse: [
          { periodType: 'Month', retSeq: 1, startDate: '2024-01-01', endDate: '2024-01-31' },
          { periodType: 'Quarter', retSeq: 2, startDate: '2024-01-01', endDate: '2024-03-31' },
          { periodType: 'Year', retSeq: 3, startDate: '2024-01-01', endDate: '2024-12-31' }
        ]
      }
    }))
  };

  const mockSession = {
    setData: jasmine.createSpy('setData')
  };

  beforeEach(async () => {

    apkiService = jasmine.createSpyObj('KpiService', ['AqkpiList']);
    userService = jasmine.createSpyObj('AQUserInfo', ['UserId']);
    agentService = jasmine.createSpyObj('AQAgentInfo', ['Agent']);
    await TestBed.configureTestingModule({
      declarations: [HeaderbarComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: KpiService, useValue: mockKpiService },
        { provide: PeriodSettings, useValue: mockPeriodSettings },
        { provide: workboardSettings, useValue: mockWorkboardSettings },
        { provide: AQAgentInfo, useValue: mockAgentInfo },
        { provide: AQUserInfo, useValue: mockUserInfo },
        { provide: PeriodOption, useValue: mockPeriodOption },
        { provide: AqworkboardServiceService, useValue: mockWorkboardService },
        { provide: AQSession, useValue: mockSession },
      ]
    }).compileComponents();

    // Create and add the mock DOM element
    const scrollingDiv = document.createElement('div');
    scrollingDiv.id = 'ScrollingDiv';
    document.body.appendChild(scrollingDiv);
    fixture = TestBed.createComponent(HeaderbarComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    const el = document.getElementById('ScrollingDiv');
    if (el) {
      el.remove();
    }
  });


  it('should navigate to agent/quotes when navigate() is called', () => {
    component.navigate();
    expect(router.navigateByUrl).toHaveBeenCalledWith('agent/quotes');
  });

  it('should move header to left', () => {
    component.MoveHeader('left');
    const el = document.getElementById('ScrollingDiv');
    expect(el.style.marginLeft).toBe('0px');
  });

  it('should move header to right', () => {
    component.MoveHeader('right');
    const el = document.getElementById('ScrollingDiv');
    expect(el.style.marginLeft).toBe('-190px');
  });

  it('should not change margin for unknown direction', () => {
    const el = document.getElementById('ScrollingDiv');
    el.style.marginLeft = 'initial'; // default value
    component.MoveHeader('up');
    expect(el.style.marginLeft).toBe('initial');
  });

  it('should initialize and call getPeriodType', () => {
    spyOn(component, 'getPeriodType');
    component.ngOnInit();
    expect(component.getPeriodType).toHaveBeenCalled();
  });

  it('should toggle ChartsStatus correctly', () => {
    component.ChartsStatus = false;
    component.ChartsToggle();
    expect(component.ChartsStatus).toBeTrue();

    component.ChartsToggle();
    expect(component.ChartsStatus).toBeFalse();
  });

  it('should call workboardService and populate monthList, quarterList, yearList', () => {
    component.getPeriodType();
    expect(mockWorkboardService.workboardPeriodList).toHaveBeenCalled();
    expect(component.monthList.length).toBeGreaterThan(0);
    expect(component.quarterList.length).toBeGreaterThan(0);
    expect(component.yearList.length).toBeGreaterThan(0);
  });

  it('should update selectedPeriodText and call filterData and getkpi on showPeriodData', () => {
    spyOn(component, 'getkpi');
    spyOn(component, 'filterData');
    component.monthList = [{ startDate: '2024-01-01', endDate: '2024-01-31' }];
    component.quarterList = [{ startDate: '2024-01-01', endDate: '2024-03-31' }];
    component.yearList = [{ startDate: '2024-01-01', endDate: '2024-12-31' }];

    component.showPeriodData('Month');
    expect(component.selectedPeriod).toBe('Month');
    expect(mockSession.setData).toHaveBeenCalledWith('periodStartDate', '2024-01-01');
    expect(component.getkpi).toHaveBeenCalledWith('Month');
    expect(component.filterData).toHaveBeenCalledWith('Month');
  });

  it('should call showPeriodData when period is Month', () => {
    spyOn(component, 'showPeriodData');
    component.PeriodSettingService('Month');
    expect(component.showPeriodData).toHaveBeenCalledWith('Month');
  });

  it('should set quarter and display text when period is Quarter', () => {
    const mockMonth = 5;
    const mockQuarter = 'Q2';
    const mockDisplayText = 'Quarter 2';

    spyOn(Date.prototype, 'getMonth').and.returnValue(mockMonth);
    mockPeriodOption.getQuarterName.and.returnValue(mockQuarter);
    mockPeriodOption.QuarterOptions.and.returnValue({ DisplayText: mockDisplayText });

    component.PeriodSettingService('Quarter');

    expect(component.selectedMonth).toBe(mockMonth);
    expect(component.selectedPeriodText).toBe(mockDisplayText);
  });

  it('should set selectedYear when period is Year', () => {
    const mockYear = 0;
    spyOn(Date.prototype, 'getFullYear').and.returnValue(mockYear);
    component.PeriodSettingService('Year');
    expect(component.selectedYear).toBe(mockYear);
  });

  it('should call OpenSidebarFilter if clicked on element with id periodFilterMenu', () => {
    spyOn(component, 'OpenSidebarFilter');
    const mockElement = document.createElement('div');
    mockElement.id = 'periodFilterMenu';
    component.onClick(mockElement);
    expect(component.OpenSidebarFilter).toHaveBeenCalled();
  });

  it('should set sidebarfiltermodal to false if clicked outside periodFilterMenu', () => {
    component.sidebarfiltermodal = true;
    const mockElement = document.createElement('div');
    mockElement.id = 'otherElement';
    component.onClick(mockElement);
    expect(component.sidebarfiltermodal).toBeFalse();
  });
});
