import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgencyDashboardComponent } from './agency-dashboard.component';

describe('AgencyDashboardComponent', () => {
  let component: AgencyDashboardComponent;
  let fixture: ComponentFixture<AgencyDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
