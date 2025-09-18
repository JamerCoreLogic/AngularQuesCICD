import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuotesChartComponent } from './quotes-chart.component';

describe('QuotesChartComponent', () => {
  let component: QuotesChartComponent;
  let fixture: ComponentFixture<QuotesChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotesChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
