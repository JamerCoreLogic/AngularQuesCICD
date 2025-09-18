import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InsuredsProspectsMasterComponent } from './insureds-prospects-master.component';

describe('InsuredsProspectsMasterComponent', () => {
  let component: InsuredsProspectsMasterComponent;
  let fixture: ComponentFixture<InsuredsProspectsMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuredsProspectsMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuredsProspectsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
