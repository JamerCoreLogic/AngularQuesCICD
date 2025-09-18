import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuotesMasterComponent } from './quotes-master.component';

describe('QuotesMasterComponent', () => {
  let component: QuotesMasterComponent;
  let fixture: ComponentFixture<QuotesMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotesMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
