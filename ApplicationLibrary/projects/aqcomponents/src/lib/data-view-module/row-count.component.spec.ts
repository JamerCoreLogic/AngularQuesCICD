import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowCountComponent } from './row-count.component';

describe('RowCountComponent', () => {
  let component: RowCountComponent;
  let fixture: ComponentFixture<RowCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
