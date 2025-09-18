import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlfredAlertsComponent } from './alfred-alerts.component';

describe('AlfredAlertsComponent', () => {
  let component: AlfredAlertsComponent;
  let fixture: ComponentFixture<AlfredAlertsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlfredAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlfredAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
