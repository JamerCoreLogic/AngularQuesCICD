import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuoteListLinkComponent } from './quote-list-link.component';

describe('QuoteListLinkComponent', () => {
  let component: QuoteListLinkComponent;
  let fixture: ComponentFixture<QuoteListLinkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteListLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteListLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
