import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MgaMasterComponent } from './mga-master.component';

describe('MgaMasterComponent', () => {
  let component: MgaMasterComponent;
  let fixture: ComponentFixture<MgaMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MgaMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgaMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
