import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AqformlistDialogComponent } from './aqformlist-dialog.component';

describe('AqformlistDialogComponent', () => {
  let component: AqformlistDialogComponent;
  let fixture: ComponentFixture<AqformlistDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AqformlistDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AqformlistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
