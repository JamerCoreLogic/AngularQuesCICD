import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuotesviewComponent } from './quotesview.component';

describe('QuotesviewComponent', () => {
  let component: QuotesviewComponent;
  let fixture: ComponentFixture<QuotesviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotesviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
