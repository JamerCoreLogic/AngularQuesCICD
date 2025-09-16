import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewComponent } from './preview.component';
import { MatLegacyDialogRef, MAT_LEGACY_DIALOG_DATA, MatLegacyDialog } from '@angular/material/legacy-dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';

// Create a test host component to avoid the iframe rendering
@Component({
  template: `<div id="preview-container"></div>`
})
class TestHostComponent {}

describe('PreviewComponent', () => {
  let component: PreviewComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let dialogRefMock: jasmine.SpyObj<MatLegacyDialogRef<PreviewComponent>>;
  let matDialogMock: jasmine.SpyObj<MatLegacyDialog>;
  let sanitizerMock: jasmine.SpyObj<DomSanitizer>;
  let mockData: any;
  let mockSafeUrl: SafeResourceUrl;

  beforeEach(() => {
    // Create mock for dialog ref
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);
    
    // Create mock for MatDialog
    matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    
    // Create mock for DomSanitizer
    mockSafeUrl = {} as SafeResourceUrl;
    sanitizerMock = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    sanitizerMock.bypassSecurityTrustResourceUrl.and.returnValue(mockSafeUrl);
    
    // Set up mock data
    mockData = {
      previewData: {
        aiInspectionSurveyId: 123,
        emailId: 'test@example.com'
      }
    };

    TestBed.configureTestingModule({
      declarations: [TestHostComponent, PreviewComponent],
      imports: [
        SharedMaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatLegacyDialogRef, useValue: dialogRefMock },
        { provide: MAT_LEGACY_DIALOG_DATA, useValue: mockData },
        { provide: MatLegacyDialog, useValue: matDialogMock },
        { provide: DomSanitizer, useValue: sanitizerMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    
    fixture = TestBed.createComponent(TestHostComponent);
    
    // Create component instance directly without rendering the template
    component = TestBed.createComponent(PreviewComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sanitize the URL using DomSanitizer', () => {
    // Expected URL
    const expectedUnsafeUrl = `${environment.AI_UIENDPOINT}aiinspection/insured/qustionnairepreview?aiInspectionSurveyId=123&emailId=test@example.com`;
    
    // Check if sanitizer was called with the expected URL
    expect(sanitizerMock.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(expectedUnsafeUrl);
    
    // Check if URL was set correctly
    expect(component.URL).toBe(mockSafeUrl);
  });

  it('should handle URL construction correctly with different data', () => {
    // Create a new instance with different data
    const differentMockData = {
      previewData: {
        aiInspectionSurveyId: 456,
        emailId: 'another@example.com'
      }
    };
    
    // Reset the spy
    sanitizerMock.bypassSecurityTrustResourceUrl.calls.reset();
    
    // Manually create a new instance of the component
    const newComponent = new PreviewComponent(
      dialogRefMock,
      differentMockData,
      matDialogMock,
      sanitizerMock
    );
    
    // Expected URL with different data
    const expectedUnsafeUrl = `${environment.AI_UIENDPOINT}aiinspection/insured/qustionnairepreview?aiInspectionSurveyId=456&emailId=another@example.com`;
    
    // Check if sanitizer was called with the expected URL
    expect(sanitizerMock.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(expectedUnsafeUrl);
  });
});
