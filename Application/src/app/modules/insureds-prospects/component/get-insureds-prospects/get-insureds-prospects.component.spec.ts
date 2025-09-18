import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GetInsuredsProspectsComponent } from './get-insureds-prospects.component';

describe('GetInsuredsProspectsComponent', () => {
  let component: GetInsuredsProspectsComponent;
  let fixture: ComponentFixture<GetInsuredsProspectsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GetInsuredsProspectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetInsuredsProspectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
