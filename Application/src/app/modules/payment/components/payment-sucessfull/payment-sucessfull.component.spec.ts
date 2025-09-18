import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentSucessfullComponent } from './payment-sucessfull.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('PaymentSucessfullComponent', () => {
  let component: PaymentSucessfullComponent;
  let fixture: ComponentFixture<PaymentSucessfullComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [PaymentSucessfullComponent]
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

  it('should call window.close when close() is invoked', () => {
    spyOn(window, 'close');
    component.close();
    expect(window.close).toHaveBeenCalled();
  });
});
