import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SysdashboardComponent } from './sysdashboard.component';

describe('SysdashboardComponent', () => {
  let component: SysdashboardComponent;
  let fixture: ComponentFixture<SysdashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SysdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
