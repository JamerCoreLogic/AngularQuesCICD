import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MgaDashboardComponent } from './mga-dashboard.component';

describe('MgaDashboardComponent', () => {
  let component: MgaDashboardComponent;
  let fixture: ComponentFixture<MgaDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MgaDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
