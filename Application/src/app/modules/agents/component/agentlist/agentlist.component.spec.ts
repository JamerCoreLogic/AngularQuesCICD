import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgentlistComponent } from './agentlist.component';

describe('AgentlistComponent', () => {
  let component: AgentlistComponent;
  let fixture: ComponentFixture<AgentlistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
