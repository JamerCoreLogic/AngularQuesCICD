import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AQDialogComponent } from './aqdialog.component';

describe('AQDialogComponent', () => {
  let component: AQDialogComponent;
  let fixture: ComponentFixture<AQDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AQDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AQDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
