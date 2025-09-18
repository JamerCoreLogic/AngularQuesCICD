import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuotesDialogComponent } from './quotes-dialog.component';

describe('QuotesDialogComponent', () => {
  let component: QuotesDialogComponent;
  let fixture: ComponentFixture<QuotesDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
