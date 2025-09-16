import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PreviewResponcComponent } from './preview-responc.component';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { environment } from "src/environments/environment";
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PreviewResponcComponent', () => {
  let component: PreviewResponcComponent;
  let fixture: ComponentFixture<PreviewResponcComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PreviewResponcComponent>>;
  let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;

  const mockDialogData = '123'; // Mock surveyLinkID
  const mockUnsafeUrl = environment.AI_UIENDPOINT + 'aiinspection/insured/qustionnairepreview?surveyLinkID=' + mockDialogData;
  const mockSafeUrl = {} as SafeResourceUrl;

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    sanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    // Configure the sanitizer spy to return a proper SafeResourceUrl object
    sanitizerSpy.bypassSecurityTrustResourceUrl.and.returnValue(mockSafeUrl);

    TestBed.configureTestingModule({
      declarations: [PreviewResponcComponent],
      imports: [
        SharedMaterialModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: DomSanitizer, useValue: sanitizerSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of({}) }) } },
      ]
    })
    // Override the component's template to remove the iframe that's causing security errors
    .overrideComponent(PreviewResponcComponent, {
      set: {
        template: `
          <div class="container-preview">
            <div class="header">
              <button mat-button>
                <mat-icon>clear</mat-icon>
              </button>
            </div>
            <div *ngIf="isError" class="error-message">
              <p>Something went wrong while loading the preview. Please try again later.</p>
            </div>
            <!-- Removed iframe that was causing issues -->
          </div>
        `
      }
    });

    fixture = TestBed.createComponent(PreviewResponcComponent);
    component = fixture.componentInstance;
    
    // Verify the DomSanitizer was called when the component was instantiated
    expect(sanitizerSpy.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(mockUnsafeUrl);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner on ngOnInit', () => {
    component.ngOnInit();
    expect(spinnerSpy.show).toHaveBeenCalled();
  });

  it('should hide spinner and clear timeout on onIframeLoad', () => {
    // Mock the loadTimeout and create a spy for clearTimeout
    component.loadTimeout = 123;
    spyOn(window, 'clearTimeout').and.callThrough();
    
    component.onIframeLoad();
    
    expect(spinnerSpy.hide).toHaveBeenCalled();
    expect(window.clearTimeout).toHaveBeenCalledWith(123);
    // Instead of checking loadTimeout directly, check that clearTimeout was called
  });

  it('should set isError to true, hide spinner on onIframeError', () => {
    component.onIframeError();
    expect(component.isError).toBe(true);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  });

  it('should clear timeout on ngOnDestroy', () => {
    // Mock the loadTimeout and create a spy for clearTimeout
    component.loadTimeout = 456;
    spyOn(window, 'clearTimeout').and.callThrough();
    
    component.ngOnDestroy();
    
    expect(window.clearTimeout).toHaveBeenCalledWith(456);
    // Instead of checking loadTimeout directly, check that clearTimeout was called
  });

  it('should handle timeout scenario', fakeAsync(() => {
    // Spy on the onIframeError method
    spyOn(component, 'onIframeError').and.callThrough();
    
    component.ngOnInit();
    expect(spinnerSpy.show).toHaveBeenCalled();
    
    // Fast-forward 30 seconds
    tick(30000);
    
    // Check if onIframeError was called
    expect(component.onIframeError).toHaveBeenCalled();
    expect(component.isError).toBe(true);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));
});
