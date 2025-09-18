import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AqchatboardComponent } from './aqchatboard.component';

describe('AqchatboardComponent', () => {
  let component: AqchatboardComponent;
  let fixture: ComponentFixture<AqchatboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AqchatboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AqchatboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
