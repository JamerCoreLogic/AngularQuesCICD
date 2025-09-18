import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AqMultiselectComponent } from './aq-multiselect.component';

describe('AqMultiselectComponent', () => {
  let component: AqMultiselectComponent;
  let fixture: ComponentFixture<AqMultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AqMultiselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AqMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
