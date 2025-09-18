import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentDashboardComponent } from './agent-dashboard.component';

describe('AgentDashboardComponent', () => {
  let component: AgentDashboardComponent;
  let fixture: ComponentFixture<AgentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgentDashboardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should toggle evt using toggleTodoExpand', () => {
    component.toggleTodoExpand(true);
    expect(component.evt).toBeTrue();

    component.toggleTodoExpand(false);
    expect(component.evt).toBeFalse();
  });

  it('should toggle isAlfredAlertsExpanded using toggleAlfredExpand', () => {
    component.toggleAlfredExpand(true);
    expect(component.isAlfredAlertsExpanded).toBeTrue();

    component.toggleAlfredExpand(false);
    expect(component.isAlfredAlertsExpanded).toBeFalse();
  });
});
