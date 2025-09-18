import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AQManageFormsComponent } from './manage-forms.component';

describe('ManageFormsComponent', () => {
  let component: AQManageFormsComponent;
  let fixture: ComponentFixture<AQManageFormsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AQManageFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AQManageFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
