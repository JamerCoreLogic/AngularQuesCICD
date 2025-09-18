import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InnerHeaderComponent } from './inner-header.component';

describe('InnerHeaderComponent', () => {
  let component: InnerHeaderComponent;
  let fixture: ComponentFixture<InnerHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InnerHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
