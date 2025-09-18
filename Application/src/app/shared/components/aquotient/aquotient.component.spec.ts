import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AQuotientComponent } from './aquotient.component';

describe('AQuotientComponent', () => {
  let component: AQuotientComponent;
  let fixture: ComponentFixture<AQuotientComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AQuotientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AQuotientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
