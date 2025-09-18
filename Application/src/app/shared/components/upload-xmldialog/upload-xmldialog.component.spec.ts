import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadXMLDialogComponent } from './upload-xmldialog.component';

describe('UploadXMLDialogComponent', () => {
  let component: UploadXMLDialogComponent;
  let fixture: ComponentFixture<UploadXMLDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadXMLDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadXMLDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
