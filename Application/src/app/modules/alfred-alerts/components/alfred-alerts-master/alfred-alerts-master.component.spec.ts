import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlfredAlertsMasterComponent } from './alfred-alerts-master.component';

describe('AlfredAlertsMasterComponent', () => {
  let component: AlfredAlertsMasterComponent;
  let fixture: ComponentFixture<AlfredAlertsMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlfredAlertsMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlfredAlertsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
