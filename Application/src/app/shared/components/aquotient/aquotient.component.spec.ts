
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AQuotientComponent } from './aquotient.component';
import { AQQuotient, KpiService } from '@agenciiq/aqkpi';
import { PeriodSettings } from 'src/app/global-settings/periodSetting';
import { Router } from '@angular/router';
import { AQAgentInfo, AQUserInfo } from '@agenciiq/login';



describe('AQuotientComponent', () => {
  let component: AQuotientComponent;
  let fixture: ComponentFixture<AQuotientComponent>;
  let httpClient: HttpClient

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [AQuotientComponent],
      providers: [

      ],
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(AQuotientComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient)
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //ngOnInit
  it('should call subscribePeriod and set quotientData on ngOnInit', () => {
    spyOn(component, 'subscribePeriod');
    component.ngOnInit();
    expect(component.subscribePeriod).toHaveBeenCalled();
    expect(component.quotientData).toEqual(JSON.parse(component.tempData));
  });

  //subscribePeriod
  it('should subscribe to period and call getkpi with the correct period', () => {
    const mockPeriod = 'mockPeriod';
    const periodSubject = new Subject<string>();
    spyOn(component, 'getkpi');
    component['periodSetting'].period = periodSubject as unknown as BehaviorSubject<string>;

    component.subscribePeriod();
    periodSubject.next(mockPeriod);

    expect(component.getkpi).toHaveBeenCalledWith(mockPeriod);
  });

  //generateArray
  it('should return an array of length equal to the rounded value of num, sliced to a maximum of 5 elements', () => {
    const result = component.generateArray(4.7);
    expect(result.length).toBe(5);
  });
  it('should return an array of length equal to the rounded value of num if it is less than or equal to 5', () => {
    const result = component.generateArray(3.2);
    expect(result.length).toBe(3);
  });
  it('should return an array of length 5 if the rounded value of num is greater than 5', () => {
    const result = component.generateArray(6.8);
    expect(result.length).toBe(5);
  });

  //getkpi
  it('should set quotientData when agent is available and getQuotionData is called', () => {
    const mockResponse = { data: 'mockData' };
    spyOn(component['_apki'], 'getQuotionData').and.returnValue(of(mockResponse) as any);
    spyOn(component['_router'], 'navigate');
    spyOn(component['agent'], 'Agent').and.returnValue({ agentId: '123' } as any);

    component.getkpi('mockPeriod');

    expect(component['_apki'].getQuotionData).toHaveBeenCalled();
    expect(component.quotientData).toEqual(mockResponse);
    expect(component['_router'].navigate).not.toHaveBeenCalled();
  });
});

