import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GuestuserMasterComponent } from './guestuser-master.component';

describe('GuestuserMasterComponent', () => {
  let component: GuestuserMasterComponent;
  let fixture: ComponentFixture<GuestuserMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestuserMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestuserMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
