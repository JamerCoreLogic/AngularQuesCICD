import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentSucessfullComponent } from './payment-sucessfull.component';

describe('PaymentSucessfullComponent', () => {
  let component: PaymentSucessfullComponent;
  let fixture: ComponentFixture<PaymentSucessfullComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSucessfullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSucessfullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
