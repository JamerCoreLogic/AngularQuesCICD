import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkboardComponent } from './workboard.component';

describe('WorkboardComponent', () => {
  let component: WorkboardComponent;
  let fixture: ComponentFixture<WorkboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
