import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InsuredDetailComponent } from './insured-detail.component';

describe('InsuredDetailComponent', () => {
  let component: InsuredDetailComponent;
  let fixture: ComponentFixture<InsuredDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuredDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuredDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
