import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AQStateAutoCompleteComponent } from './aqstate-auto-complete.component';

describe('AQStateAutoCompleteComponent', () => {
  let component: AQStateAutoCompleteComponent;
  let fixture: ComponentFixture<AQStateAutoCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AQStateAutoCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AQStateAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
