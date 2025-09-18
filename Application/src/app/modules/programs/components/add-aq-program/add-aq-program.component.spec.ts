import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAqProgramComponent } from './add-aq-program.component';

describe('AddAqProgramComponent', () => {
  let component: AddAqProgramComponent;
  let fixture: ComponentFixture<AddAqProgramComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAqProgramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAqProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
