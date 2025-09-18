import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AqformtypeComponent } from './aqformtype.component';

describe('AqformtypeComponent', () => {
  let component: AqformtypeComponent;
  let fixture: ComponentFixture<AqformtypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AqformtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AqformtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
