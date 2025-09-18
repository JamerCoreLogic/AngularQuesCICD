import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountsMasterComponent } from './accounts-master.component';

describe('AccountsMasterComponent', () => {
  let component: AccountsMasterComponent;
  let fixture: ComponentFixture<AccountsMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
