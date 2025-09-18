import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OuterHeaderComponent } from './outer-header.component';

describe('OuterHeaderComponent', () => {
  let component: OuterHeaderComponent;
  let fixture: ComponentFixture<OuterHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OuterHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OuterHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
