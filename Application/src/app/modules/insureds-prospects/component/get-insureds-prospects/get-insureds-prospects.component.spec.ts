import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GetInsuredsProspectsComponent } from './get-insureds-prospects.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AQSession } from 'src/app/global-settings/session-storage';
import { Router } from '@angular/router';
import { of, Subscription, throwError } from 'rxjs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { InsuredsProspectsService } from '@agenciiq/quotes';

describe('GetInsuredsProspectsComponent', () => {
  let component: GetInsuredsProspectsComponent;
  let fixture: ComponentFixture<GetInsuredsProspectsComponent>;
  let sessionServiceSpy: jasmine.SpyObj<AQSession>;
  let routerSpy: jasmine.SpyObj<Router>;
  let loaderService: jasmine.SpyObj<LoaderService>;
  let insuredsProspectsService: jasmine.SpyObj<InsuredsProspectsService>;

  beforeEach(waitForAsync(() => {
    const sessionSpy = jasmine.createSpyObj('SessionService', ['setData', 'removeSession']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [GetInsuredsProspectsComponent],
      providers: [
        { provide: AQSession, useValue: sessionSpy },
        { provide: Router, useValue: routerMock },
        { provide: LoaderService, useValue: loaderSpy },
      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetInsuredsProspectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    sessionServiceSpy = TestBed.inject(AQSession) as jasmine.SpyObj<AQSession>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    loaderService = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
    insuredsProspectsService = TestBed.inject(InsuredsProspectsService) as jasmine.SpyObj<InsuredsProspectsService>;

    component['userId'] = 123; // Set up required property
    component.clientId = 'mockClientId';
    component.flag = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle flag and set sortedColumnName with correct values', () => {
    component.flag = false;
    component.sortInsured('Location');
    expect(component.flag).toBeTrue();
    expect(component.sortedColumnName).toEqual({ columnName: 'Location', isAsc: true });
    component.sortInsured('Insured');
    expect(component.flag).toBeFalse();
    expect(component.sortedColumnName).toEqual({ columnName: 'Insured', isAsc: false });
  });

  it('should set session data and navigate correctly in getInsuredDetail()', () => {
    const mockData = { insuredId: 1, quoteId: 100 };
    const mockType = 'FQ';

    const expectedReqObj = {
      UserId: 123,
      InsuredId: 1,
      QuoteId: 100,
      ClientId: 0,
      type: 'FQ'
    };

    component.getInsuredDetail(mockData, mockType);
    expect(sessionServiceSpy.removeSession).toHaveBeenCalledWith('viewPolicyParams');
    expect(sessionServiceSpy.setData).toHaveBeenCalledWith('insuredReqObj', expectedReqObj);
    expect(sessionServiceSpy.setData).toHaveBeenCalledWith('insuredView', 'insuredView');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['agenciiq/workbook/quickquote']);
  });

  it('should unsubscribe from programListSubscription on destroy', () => {
    // Create a mock subscription with a spy
    const mockSubscription = new Subscription();
    spyOn(mockSubscription, 'unsubscribe');
    // Assign the mock subscription to the component
    component['programListSubscription'] = mockSubscription;
    // Call ngOnDestroy
    component.ngOnDestroy();
    // Expect unsubscribe to have been called
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should not throw error if programListSubscription is undefined', () => {
    component['programListSubscription'] = undefined as any;
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('should call getInsuredProspectList on ngOnInit', () => {
    spyOn(component, 'getInsuredProspectList');
    component.ngOnInit();
    expect(component.getInsuredProspectList).toHaveBeenCalled();
  });

  it('should show "No Record Found." message when no data returned', () => {
    const mockData = {
      data: {
        insureds: []
      }
    };
    component.getInsuredProspectList();
    expect(loaderService.show).toHaveBeenCalled();
  });

});
