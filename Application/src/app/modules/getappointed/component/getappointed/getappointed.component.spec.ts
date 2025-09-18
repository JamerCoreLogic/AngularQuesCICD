import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GetappointedComponent } from './getappointed.component';

describe('GetappointedComponent', () => {
  let component: GetappointedComponent;
  let fixture: ComponentFixture<GetappointedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GetappointedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetappointedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
