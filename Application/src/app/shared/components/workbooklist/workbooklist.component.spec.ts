import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkbooklistComponent } from './workbooklist.component';

describe('WorkbooklistComponent', () => {
  let component: WorkbooklistComponent;
  let fixture: ComponentFixture<WorkbooklistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkbooklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkbooklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
