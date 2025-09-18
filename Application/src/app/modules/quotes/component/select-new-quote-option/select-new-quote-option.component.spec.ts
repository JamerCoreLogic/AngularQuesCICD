import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectNewQuoteOptionComponent } from './select-new-quote-option.component';

describe('SelectNewQuoteOptionComponent', () => {
  let component: SelectNewQuoteOptionComponent;
  let fixture: ComponentFixture<SelectNewQuoteOptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectNewQuoteOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectNewQuoteOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
