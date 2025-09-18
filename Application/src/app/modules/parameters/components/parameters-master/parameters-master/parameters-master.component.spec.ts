import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParametersMasterComponent } from './parameters-master.component';

describe('ParametersMasterComponent', () => {
  let component: ParametersMasterComponent;
  let fixture: ComponentFixture<ParametersMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametersMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametersMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
