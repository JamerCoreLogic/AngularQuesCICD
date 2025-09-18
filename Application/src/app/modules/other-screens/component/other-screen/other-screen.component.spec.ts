import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OtherScreenComponent } from './other-screen.component';

describe('OtherScreenComponent', () => {
  let component: OtherScreenComponent;
  let fixture: ComponentFixture<OtherScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
