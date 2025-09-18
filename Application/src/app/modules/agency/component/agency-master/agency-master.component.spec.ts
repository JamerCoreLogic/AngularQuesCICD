import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgencyMasterComponent } from './agency-master.component';

describe('AgencyMasterComponent', () => {
  let component: AgencyMasterComponent;
  let fixture: ComponentFixture<AgencyMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
