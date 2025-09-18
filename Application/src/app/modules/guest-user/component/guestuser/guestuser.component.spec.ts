import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GuestuserComponent } from './guestuser.component';

describe('GuestuserComponent', () => {
  let component: GuestuserComponent;
  let fixture: ComponentFixture<GuestuserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
