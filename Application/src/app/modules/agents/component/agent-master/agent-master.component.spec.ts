import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgentMasterComponent } from './agent-master.component';

describe('AgentMasterComponent', () => {
  let component: AgentMasterComponent;
  let fixture: ComponentFixture<AgentMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
