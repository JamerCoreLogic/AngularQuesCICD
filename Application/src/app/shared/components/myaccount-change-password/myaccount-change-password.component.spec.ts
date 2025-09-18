import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyaccountChangePasswordComponent } from './myaccount-change-password.component';

describe('MyaccountChangePasswordComponent', () => {
  let component: MyaccountChangePasswordComponent;
  let fixture: ComponentFixture<MyaccountChangePasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyaccountChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyaccountChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
