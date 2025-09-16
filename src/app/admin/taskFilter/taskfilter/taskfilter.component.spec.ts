import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskfilterComponent } from './taskfilter.component';

describe('TaskfilterComponent', () => {
  let component: TaskfilterComponent;
  let fixture: ComponentFixture<TaskfilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskfilterComponent]
    });
    fixture = TestBed.createComponent(TaskfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
