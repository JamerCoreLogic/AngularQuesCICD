import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadXMLDialogComponent } from './upload-xmldialog.component';
import { AQParameterService } from '@agenciiq/aqadmin';
import { DialogConfig } from '../../utility/aq-dialog/dialog-config';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { DialogRef } from '../../utility/aq-dialog/dialog-ref';
import { of } from 'rxjs';

describe('UploadXMLDialogComponent', () => {
  let component: UploadXMLDialogComponent;
  let fixture: ComponentFixture<UploadXMLDialogComponent>;
  let parameterServiceSpy: jasmine.SpyObj<AQParameterService>;
  let dialogRefSpy: jasmine.SpyObj<DialogRef>;
  let config: DialogConfig;

  beforeEach(async () => {
    parameterServiceSpy = jasmine.createSpyObj('AQParameterService', ['SaveParameter']);
    dialogRefSpy = jasmine.createSpyObj('DialogRef', ['close']);
    config = new DialogConfig();
    config.data = {
      UserId: 1,
      ParameterKey: { parameterAlias: 'SampleAlias' }
    };

    await TestBed.configureTestingModule({
      declarations: [UploadXMLDialogComponent],
      providers: [
        { provide: AQParameterService, useValue: parameterServiceSpy },
        { provide: DialogConfig, useValue: config },
        { provide: DialogRef, useValue: dialogRefSpy },
        { provide: PopupService, useValue: {} },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadXMLDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize modal title to "Upload"', () => {
    component.ngOnInit();
    expect(component.modalTitle).toBe('Upload');
  });

  it('should validate and accept a correct XML file', () => {
    const mockFile = new File(['<xml>data</xml>'], 'test.xml', { type: 'text/xml' });
    const event = { target: { files: [mockFile] } };

    spyOn(component, 'readAQFormExcel');
    component.uploadExcel(event);

    expect(component.uploadedFile).toBe(mockFile);
    expect(component.isFileExists).toBeTrue();
    expect(component.isvalidExtension).toBeTrue();
    expect(component.readAQFormExcel).toHaveBeenCalled();
  });

  it('should invalidate an incorrect file extension', () => {
    const mockFile = new File(['{ "data": 1 }'], 'test.json', { type: 'application/json' });
    const event = { target: { files: [mockFile] } };

    component.uploadExcel(event);

    expect(component.uploadedFile).toBe(mockFile);
    expect(component.isFileExists).toBeTrue();
    expect(component.isvalidExtension).toBeFalse();
  });

  it('should set isFileExists to false if no file is selected', () => {
    const event = { target: { files: [] } };
    component.uploadExcel(event);
    expect(component.isFileExists).toBeFalse();
  });

  it('should upload XML and close the dialog on success', () => {
    component.base64EncodedExcel = 'encodedData';
    parameterServiceSpy.SaveParameter.and.returnValue(of({ success: true, data: {} }));

    component.uploadXML();

    expect(parameterServiceSpy.SaveParameter).toHaveBeenCalledWith(1, 'encodedData', 'SampleAlias');
    expect(dialogRefSpy.close).toHaveBeenCalledWith({ success: true, data: {} });
  });

  it('should show error message if upload fails', () => {
    parameterServiceSpy.SaveParameter.and.returnValue(of({ success: false, message: 'Upload failed' }));

    component.uploadXML();

    expect(component.uploadXml).toBeFalse();
    expect(component.uploadXmlMsg).toBe('Upload failed');
  });

  it('should close dialog on cancel', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should read uploaded Excel file and convert it to base64', () => {
    const component = fixture.componentInstance;

    // Prepare a dummy file and expected base64
    const dummyContent = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
    const dummyFile = new File([dummyContent], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    component.uploadedFile = dummyFile;

    // Create a mock FileReader
    const mockFileReader: Partial<FileReader> = {
      readAsArrayBuffer: jasmine.createSpy('readAsArrayBuffer').and.callFake(function () {
        this.result = dummyContent.buffer;
        setTimeout(() => {
          this.onload!({} as ProgressEvent<FileReader>);
        }, 0);
      })
    };

    spyOn(window as any, 'FileReader').and.returnValue(mockFileReader as FileReader);

    component.readAQFormExcel();

    // Wait for async event
    setTimeout(() => {
      expect(component.excelData).toEqual(dummyContent.buffer);
      expect(component.base64EncodedExcel).toEqual(btoa('Hello'));
    }, 10);
  });

});

