import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteListViewComponent } from './quote-list-view.component';

describe('QuoteListViewComponent', () => {
  let component: QuoteListViewComponent;
  let fixture: ComponentFixture<QuoteListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
