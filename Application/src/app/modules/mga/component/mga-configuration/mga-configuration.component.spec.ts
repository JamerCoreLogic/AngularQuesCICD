import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MgaConfigurationComponent } from './mga-configuration.component';

describe('MgaConfigurationComponent', () => {
  let component: MgaConfigurationComponent;
  let fixture: ComponentFixture<MgaConfigurationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MgaConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgaConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
