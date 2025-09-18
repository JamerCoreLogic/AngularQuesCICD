import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OtherScreenMasterComponent } from './other-screen-master.component';

describe('OtherScreenMasterComponent', () => {
  let component: OtherScreenMasterComponent;
  let fixture: ComponentFixture<OtherScreenMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherScreenMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherScreenMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
