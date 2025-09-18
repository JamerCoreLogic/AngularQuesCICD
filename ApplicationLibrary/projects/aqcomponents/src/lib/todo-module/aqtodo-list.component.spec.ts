import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AQTodoListComponent } from './aqtodo-list.component';

describe('AQTodoListComponent', () => {
  let component: AQTodoListComponent;
  let fixture: ComponentFixture<AQTodoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AQTodoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AQTodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
