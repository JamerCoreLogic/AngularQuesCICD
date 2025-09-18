import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AQFormsListComponent } from './aqformslist.component';

describe('AqformComponent', () => {
  let component: AQFormsListComponent;
  let fixture: ComponentFixture<AQFormsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AQFormsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AQFormsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
