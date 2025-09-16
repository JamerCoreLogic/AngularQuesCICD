import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SecureViewerComponent } from './secure-viewer.component';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { ConcreteDataService } from '../../services/concrete-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SecureViewerComponent', () => {
  let component: SecureViewerComponent;
  let fixture: ComponentFixture<SecureViewerComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<SecureViewerComponent>>;
  let sanitizer: jasmine.SpyObj<DomSanitizer>;
  let authService: jasmine.SpyObj<AuthService>;
  let dataService: jasmine.SpyObj<ConcreteDataService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;

  const mockDialogData = {
    type: 'pdf',
    url: 'data:application/pdf;base64,test123',
    name: 'test.pdf',
    isDownloadable: true,
    path: '/test/test.pdf'
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const sanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['']);
    const dataServiceSpy = jasmine.createSpyObj('ConcreteDataService', ['downloadVideoFile']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      declarations: [SecureViewerComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: DomSanitizer, useValue: sanitizerSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ConcreteDataService, useValue: dataServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<SecureViewerComponent>>;
    sanitizer = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    dataService = TestBed.inject(ConcreteDataService) as jasmine.SpyObj<ConcreteDataService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecureViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should set isDownloadable from dialog data', () => {
      expect(component.isDownloadable).toBe(mockDialogData.isDownloadable);
    });

    it('should create safe URL for text files', () => {
      const textData = { ...mockDialogData, type: 'txt' };
      const safeUrl = 'safe-url';
      sanitizer.bypassSecurityTrustResourceUrl.and.returnValue(safeUrl as any);

      component.data = textData;
      component.ngOnInit();

      expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(textData.url);
      expect(component.safeUrl).toBe(safeUrl);
    });
  });

  describe('Rotation Controls', () => {
    it('should rotate left', () => {
      component.rotation = 0;
      component.rotateLeft();
      expect(component.rotation).toBe(270);
    });

    it('should rotate right', () => {
      component.rotation = 0;
      component.rotateRight();
      expect(component.rotation).toBe(90);
    });

    it('should handle multiple rotations', () => {
      component.rotation = 0;
      component.rotateRight();
      component.rotateRight();
      component.rotateRight();
      component.rotateRight();
      expect(component.rotation).toBe(0);
    });
  });

  describe('File Download', () => {
    let createObjectURLSpy: jasmine.Spy;
    let revokeObjectURLSpy: jasmine.Spy;
    let createElementSpy: jasmine.Spy;
    let linkClickSpy: jasmine.Spy;

    beforeEach(() => {
      createObjectURLSpy = spyOn(window.URL, 'createObjectURL').and.returnValue('blob-url');
      revokeObjectURLSpy = spyOn(window.URL, 'revokeObjectURL');
      linkClickSpy = jasmine.createSpy('click');
      createElementSpy = spyOn(document, 'createElement').and.returnValue({
        click: linkClickSpy
      } as any);
    });

    it('should download PDF file', () => {
      component.downloadFile();

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(linkClickSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalled();
    });

    it('should download video file', fakeAsync(() => {
      const videoBlob = new Blob(['test'], { type: 'video/mp4' });
      dataService.downloadVideoFile.and.returnValue(of(videoBlob));
      component.data = { ...mockDialogData, type: 'video' };

      component.downloadFile();
      tick();

      expect(spinner.show).toHaveBeenCalled();
      expect(dataService.downloadVideoFile).toHaveBeenCalledWith(mockDialogData.path);
      expect(spinner.hide).toHaveBeenCalled();
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(linkClickSpy).toHaveBeenCalled();
    }));

    it('should handle video download error', fakeAsync(() => {
      dataService.downloadVideoFile.and.returnValue(throwError(() => new Error('Download failed')));
      component.data = { ...mockDialogData, type: 'video' };

      component.downloadFile();
      tick();

      expect(spinner.show).toHaveBeenCalled();
      expect(spinner.hide).toHaveBeenCalled();
    }));
  });

  describe('User Permissions', () => {
    it('should enable downloads for admin users', () => {
      const mockUserData = {
        data: {
          role: [{ roleName: 'Admin' }]
        }
      };
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUserData));

      component.checkUserAllowed();

      expect(component.isDownloadable).toBeTrue();
    });

    it('should enable downloads for super admin users', () => {
      const mockUserData = {
        data: {
          role: [{ roleName: 'Super Admin' }]
        }
      };
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUserData));

      component.checkUserAllowed();

      expect(component.isDownloadable).toBeTrue();
    });

    it('should not enable downloads for other users', () => {
      const mockUserData = {
        data: {
          role: [{ roleName: 'User' }]
        }
      };
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUserData));
      component.isDownloadable = false;

      component.checkUserAllowed();

      expect(component.isDownloadable).toBeFalse();
    });
  });

  describe('Dialog Controls', () => {
    it('should close dialog', () => {
      component.onClose();
      expect(dialogRef.close).toHaveBeenCalled();
    });
  });

  describe('Event Prevention', () => {
    it('should prevent keyboard shortcuts', () => {
      const preventDefaultSpy = jasmine.createSpy('preventDefault');
      const event = new KeyboardEvent('keydown', { 
        key: 's', 
        ctrlKey: true 
      });
      Object.defineProperty(event, 'preventDefault', { value: preventDefaultSpy });

      component['preventShortcuts'](event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should prevent context menu for non-video/pdf elements', () => {
      const preventDefaultSpy = jasmine.createSpy('preventDefault');
      const event = new MouseEvent('contextmenu', { 
        bubbles: true,
        cancelable: true
      });
      Object.defineProperty(event, 'preventDefault', { value: preventDefaultSpy });
      Object.defineProperty(event, 'target', { value: { tagName: 'DIV' } });

      component['preventContextMenu'](event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should allow context menu for video elements', () => {
      const preventDefaultSpy = jasmine.createSpy('preventDefault');
      const event = new MouseEvent('contextmenu', { 
        bubbles: true,
        cancelable: true
      });
      Object.defineProperty(event, 'preventDefault', { value: preventDefaultSpy });
      Object.defineProperty(event, 'target', { value: { tagName: 'VIDEO' } });

      component['preventContextMenu'](event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('should remove event listeners on destroy', () => {
      const removeEventListenerSpy = spyOn(document, 'removeEventListener');

      component.ngOnDestroy();

      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', component['preventShortcuts']);
      expect(removeEventListenerSpy).toHaveBeenCalledWith('contextmenu', component['preventContextMenu']);
    });
  });
});
