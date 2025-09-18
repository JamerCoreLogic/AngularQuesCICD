import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvanceFilterComponent } from './advance-filter.component';

describe('AdvanceFilterComponent', () => {
  let component: AdvanceFilterComponent;
  let fixture: ComponentFixture<AdvanceFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
