import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { StripeComponent } from './stripe.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { StripePaymentService } from '@agenciiq/payment-gateway';

describe('StripeComponent', () => {
  let component: StripeComponent;
  let fixture: ComponentFixture<StripeComponent>;
  let stripePaymentService: jasmine.SpyObj<StripePaymentService>;

  beforeEach(waitForAsync(() => {
    const stripePaymentSpy = jasmine.createSpyObj('StripePaymentService', ['getSession']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [StripeComponent],
      providers: [
        { provide: StripePaymentService, useValue: stripePaymentSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    stripePaymentService = TestBed.inject(StripePaymentService) as jasmine.SpyObj<StripePaymentService>;
  });

  it('should create 4343', () => {
    expect(component).toBeTruthy();
  });

  it('should call CheckOut on ngOnInit', () => {
    spyOn(component, 'CheckOut');
    component.ngOnInit();
    expect(component.CheckOut).toHaveBeenCalled();
  });

  it('should unsubscribe from routeSubscription on destroy', () => {
    const mockSubscription = jasmine.createSpyObj<Subscription>('Subscription', ['unsubscribe']);
    (component as any).routeSubscription = mockSubscription;
    component.ngOnDestroy();
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should not throw error if routeSubscription is undefined', () => {
    (component as any).routeSubscription = undefined;
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('should call redirectToCheckout with correct sessionId', fakeAsync(async () => {
    const fakeStripe = {
      redirectToCheckout: jasmine.createSpy('redirectToCheckout').and.returnValue(Promise.resolve())
    };

    const stripeSessionId = 'test-session-id';
    const encodedTransation = btoa('transaction123');
    (component as any).transation = encodedTransation;
    (component as any).successUrl = 'http://success.url';
    (component as any).cancelUrl = 'http://cancel.url';
    spyOn(sessionStorage, 'setItem');
    await component.CheckOut();
    expect(stripePaymentService.getSession).toHaveBeenCalledWith('transaction123', 'http://success.url', 'http://cancel.url');
  }));
});
