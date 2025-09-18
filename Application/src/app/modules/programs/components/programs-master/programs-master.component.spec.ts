import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProgramsMasterComponent } from './programs-master.component';

describe('ProgramsMasterComponent', () => {
  let component: ProgramsMasterComponent;
  let fixture: ComponentFixture<ProgramsMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramsMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
