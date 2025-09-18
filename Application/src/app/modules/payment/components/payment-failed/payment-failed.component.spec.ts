import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentFailedComponent } from './payment-failed.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { StripePaymentService } from '@agenciiq/payment-gateway';
import { of } from 'rxjs';

describe('PaymentFailedComponent', () => {
  let component: PaymentFailedComponent;
  let fixture: ComponentFixture<PaymentFailedComponent>;
  let paymentService: jasmine.SpyObj<StripePaymentService>;

  beforeEach(waitForAsync(() => {
    const paymentServiceSpy = jasmine.createSpyObj('StripePaymentService', ['updatePayment']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [PaymentFailedComponent],
      providers: [
        // { provide: StripePaymentService, useValue: paymentServiceSpy }
        StripePaymentService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentFailedComponent);
    component = fixture.componentInstance;
    paymentService = TestBed.inject(StripePaymentService) as jasmine.SpyObj<StripePaymentService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.close when close() is invoked', () => {
    spyOn(window, 'close');
    component.close();
    expect(window.close).toHaveBeenCalled();
  });

});
