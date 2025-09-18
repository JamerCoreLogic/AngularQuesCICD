import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgentdashboardComponent } from './agentdashboard.component';

describe('AgentdashboardComponent', () => {
  let component: AgentdashboardComponent;
  let fixture: ComponentFixture<AgentdashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
