import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailInfoComponent } from './audit-trail-info.component';

describe('AuditTrailInfoComponent', () => {
  let component: AuditTrailInfoComponent;
  let fixture: ComponentFixture<AuditTrailInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuditTrailInfoComponent]
    });
    fixture = TestBed.createComponent(AuditTrailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
