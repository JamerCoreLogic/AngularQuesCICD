import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuotelistComponent } from './quotelist.component';

describe('QuotelistComponent', () => {
  let component: QuotelistComponent;
  let fixture: ComponentFixture<QuotelistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
