import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgencyComponent } from './agency.component';

describe('AgencyComponent', () => {
  let component: AgencyComponent;
  let fixture: ComponentFixture<AgencyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
