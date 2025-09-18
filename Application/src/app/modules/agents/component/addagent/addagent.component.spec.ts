import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddagentComponent } from './addagent.component';

describe('AddagentComponent', () => {
  let component: AddagentComponent;
  let fixture: ComponentFixture<AddagentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddagentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
