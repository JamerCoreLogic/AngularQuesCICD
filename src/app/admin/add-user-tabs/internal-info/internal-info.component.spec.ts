import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalInfoComponent } from './internal-info.component';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ElementRef } from '@angular/core';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FileTracService } from 'src/app/services/file-trac.service';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

declare global {
  interface Window {
    Swal: any;
  }
}

describe('InternalInfoComponent', () => {
  let component: InternalInfoComponent;
  let fixture: ComponentFixture<InternalInfoComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let mockElementRef: ElementRef;
  let fileTracService: jasmine.SpyObj<FileTracService>;

  const mockClients = [
    { clientId: 1, fName: 'Client 1' },
    { clientId: 2, fName: 'Client 2' }
  ];

  beforeEach(async () => {
    // Create spy objects for services
    authService = jasmine.createSpyObj('AuthService', ['getClients']);
    fileTracService = jasmine.createSpyObj('FileTracService', ['GetFileTracActiveCompanies']);

    // Setup default spy behavior
    authService.getClients.and.returnValue(of({ success: true, data: mockClients }));
    fileTracService.GetFileTracActiveCompanies.and.returnValue(of({ data: ['Company1', 'Company2'] }));

    // Mock ElementRef
    mockElementRef = new ElementRef(document.createElement('div'));
    spyOn(mockElementRef.nativeElement, 'querySelector').and.returnValue({
      focus: jasmine.createSpy('focus')
    });

    await TestBed.configureTestingModule({
      declarations: [InternalInfoComponent],
      imports: [
        ReactiveFormsModule,
        SharedMaterialModule,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authService },
        { provide: ElementRef, useValue: mockElementRef },
        { provide: FileTracService, useValue: fileTracService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InternalInfoComponent);
    component = fixture.componentInstance;
    component.editUserDataFromParent = {};
    
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue('1');
  });

  it('should create the InternalInfoComponent', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize internalInfoForm on creation', () => {
    fixture.detectChanges();
    expect(component.internalInfoForm).toBeDefined();
    expect(component.internalInfoForm instanceof FormGroup).toBeTrue();
  });

  it('should call isInternalInfoFormView on ngOnInit', () => {
    spyOn(component, 'isInternalInfoFormView');
    fixture.detectChanges();
    expect(component.isInternalInfoFormView).toHaveBeenCalled();
  });

  it('should set data and call FetchUser in PostUserData', () => {
    spyOn(component, 'FetchUser');
    const mockData = { 
      prevetting: ['A'],
      headLineOverview: 'Test headline',
      internalNotes: 'Test notes',
      goodCandidateFor: ['1', '2']
    };
    
    fixture.detectChanges();
    component.PostUserData(mockData);
    
    expect(component.data).toEqual(mockData);
    expect(component.FetchUser).toHaveBeenCalled();
  });

  it('should patch form values in FetchUser', () => {
    const mockData = {
      prevetting: ['A'],
      headLineOverview: 'Test headline',
      internalNotes: 'Test notes',
      goodCandidateFor: ['1', '2']
    };
    
    fixture.detectChanges();
    component.data = mockData;
    spyOn(component.internalInfoForm, 'patchValue');
    
    component.FetchUser();
    
    expect(component.internalInfoForm.patchValue).toHaveBeenCalled();
  });

  it('should load client list on init', () => {
    fixture.detectChanges();
    expect(authService.getClients).toHaveBeenCalled();
    expect(component.goodcandidatelistdata).toEqual(mockClients);
  });

  it('should format label correctly', () => {
    fixture.detectChanges();
    // Test with underscore case
    expect(component.formatLabel('test_field_name')).toBe('Test Field Name');
    // Test with camel case
    expect(component.formatLabel('testFieldName')).toBe('Test Field Name');
    // Test with single word
    expect(component.formatLabel('test')).toBe('Test');
  });

  it('should handle form validation', () => {
    fixture.detectChanges();
    component.userType = 1;
    const formValue = component.isInternalInfoFormValid();
    expect(formValue).toEqual({
      internalInfoForm: component.internalInfoForm.getRawValue()
    });
  });

  it('should handle form validation for invalid form', () => {
    fixture.detectChanges();
    component.userType = 2; // Non-admin user
    component.submit = false;
    
    // Mock Swal.fire directly
    const mockSwalFire = jasmine.createSpy().and.returnValue(Promise.resolve({ isConfirmed: true }));
    spyOn(Swal, 'fire').and.callFake(mockSwalFire);
    
    // Make form invalid
    component.internalInfoForm.controls['goodCandidateFor'].setErrors({ required: true });
    
    const result = component.isInternalInfoFormValid();
    expect(result).toBeFalse();
    expect(component.submit).toBeTrue();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      title: '',
      text: 'Please fill all the required fields (marked with *)',
      icon: 'warning',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#ffa022',
    }));
  });

  afterEach(() => {
    localStorage.clear();
  });
});
