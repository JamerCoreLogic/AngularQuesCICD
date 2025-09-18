import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AQFormsMasterComponent } from './aqforms-master.component';

describe('AqformMasterComponent', () => {
  let component: AQFormsMasterComponent;
  let fixture: ComponentFixture<AQFormsMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AQFormsMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AQFormsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
