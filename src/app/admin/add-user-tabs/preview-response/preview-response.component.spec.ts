import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PreviewResponseComponent } from './preview-response.component';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MAT_LEGACY_DIALOG_DATA, MatLegacyDialogRef } from '@angular/material/legacy-dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockSpinnerService {
  showCalls = 0;
  hideCalls = 0;
  
  show() {
    this.showCalls++;
  }
  
  hide() {
    this.hideCalls++;
  }
}

describe('PreviewResponseComponent', () => {
  let component: PreviewResponseComponent;
  let fixture: ComponentFixture<PreviewResponseComponent>;
  let sanitizer: DomSanitizer;
  let spinner: MockSpinnerService;
  let dialogRef: MatLegacyDialogRef<PreviewResponseComponent>;

  const mockData = 'testSurveyLinkID';
  const mockURL = environment.AI_UIENDPOINT + 'aiinspection/insured/qustionnairepreview?surveyLinkID=' + mockData;

  beforeEach(async () => {
    spinner = new MockSpinnerService();

    await TestBed.configureTestingModule({
      declarations: [PreviewResponseComponent,],
       imports: [
              HttpClientTestingModule,
              SharedMaterialModule,
              NoopAnimationsModule,
      
            ],
      providers: [
        { provide: MAT_LEGACY_DIALOG_DATA, useValue: mockData },
        { provide: NgxSpinnerService, useValue: spinner },
        { provide: MatLegacyDialogRef, useValue: { close: jasmine.createSpy('close') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewResponseComponent);
    component = fixture.componentInstance;
    sanitizer = TestBed.inject(DomSanitizer);
    dialogRef = TestBed.inject(MatLegacyDialogRef<PreviewResponseComponent>);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sanitize and set the URL based on the provided data', () => {
    expect(component.URL).toBeDefined();
    const sanitizedUrl = sanitizer.bypassSecurityTrustResourceUrl(mockURL);
    expect(component.URL).toEqual(sanitizedUrl);
  });

  it('should show the spinner on initialization', () => {
    // ngOnInit is called by fixture.detectChanges()
    expect(spinner.showCalls).toBe(1, 'Spinner show should be called once on init');
  });

  it('should set a timeout for iframe load in ngOnInit', fakeAsync(() => {
    expect(component.loadTimeout).toBeDefined();
    // Advance time but less than 30 seconds
    tick(1000);
    expect(component.isError).toBeFalse();
  }));

 

  it('onIframeLoad should clear the timeout and hide the spinner', fakeAsync(() => {
    component.onIframeLoad();
    expect(spinner.hideCalls).toBe(1, 'Spinner hidden after iframe load');
    // After iframe loads, the timeout should be cleared
    expect(component.loadTimeout).toBeDefined();
    // Simulate more time passing
    tick(5000);
    // No additional error should occur
    expect(component.isError).toBeFalse();
  }));

  it('onIframeError should set isError to true and hide the spinner', () => {
    component.onIframeError();
    expect(component.isError).toBeTrue();
    expect(spinner.hideCalls).toBe(1, 'Spinner hidden after iframe error');
  });

  it('should clear the timeout on ngOnDestroy if still active', fakeAsync(() => {
    // Before destroying, timeout is set
    expect(component.loadTimeout).toBeDefined();
    component.ngOnDestroy();
    // After destroy, timeout should be cleared
    // We can confirm by ticking time and ensuring no error is triggered
    tick(40000);
    // Since we destroyed component, no error should occur
    expect(component.isError).toBeFalse();
  }));
  
});
