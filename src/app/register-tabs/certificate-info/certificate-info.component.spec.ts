import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CertificateInfoComponent } from './certificate-info.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedMaterialModule } from '../../shared-material/shared-material.module';
import Swal from 'sweetalert2';

describe('CertificateInfoComponent', () => {
  let component: CertificateInfoComponent;
  let fixture: ComponentFixture<CertificateInfoComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificateInfoComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SharedMaterialModule
      ],
      providers: [
        FormBuilder,
        {
          provide: ElementRef,
          useValue: {
            nativeElement: document.createElement('div')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateInfoComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.certificateInfoForm).toBeDefined();
    expect(component.certificateInfoForm.get('insurance_Designations')).toBeDefined();
    expect(component.certificateInfoForm.get('certifications')).toBeDefined();
    expect(component.certificateInfoForm.get('adjuster_Licenses')).toBeDefined();
    expect(component.certificateInfoForm.get('national_Producer_Number')).toBeDefined();
    expect(component.certificateInfoForm.get('how_Did_You_Hear_About_Us')).toBeDefined();
  });

  it('should validate required fields', () => {
    const form = component.certificateInfoForm;
    expect(form.valid).toBeFalsy();
    
    // Test national_Producer_Number validation
    const npnControl = form.get('national_Producer_Number');
    expect(npnControl?.errors?.['required']).toBeTruthy();
    npnControl?.setValue('12345678');
    expect(npnControl?.valid).toBeTruthy();
    
    // Test adjuster_Licenses validation
    const licensesArray = form.get('adjuster_Licenses');
    expect(licensesArray?.errors?.['required']).toBeTruthy();
    component.onCheckboxChangeforAdjuster_Licenses({ checked: true, source: { value: 'AL' }});
    expect(licensesArray?.valid).toBeTruthy();
  });

  it('should handle insurance designations checkbox changes', () => {
    const designation = 'American Family';
    component.onCheckboxChangeforInsurance_Designations({ 
      checked: true, 
      source: { value: designation }
    });
    
    const formArray = component.certificateInfoForm.get('insurance_Designations');
    expect(formArray?.value).toContain(designation);
    
    component.onCheckboxChangeforInsurance_Designations({ 
      checked: false, 
      source: { value: designation }
    });
    expect(formArray?.value).not.toContain(designation);
  });

  it('should handle certifications checkbox changes', () => {
    const certification = 'AIC';
    component.onCheckboxChangeforCertifications({ 
      checked: true, 
      source: { value: certification }
    });
    
    const formArray = component.certificateInfoForm.get('certifications');
    expect(formArray?.value).toContain(certification);
    
    component.onCheckboxChangeforCertifications({ 
      checked: false, 
      source: { value: certification }
    });
    expect(formArray?.value).not.toContain(certification);
  });

  it('should handle adjuster licenses checkbox changes', () => {
    const license = 'AL';
    component.onCheckboxChangeforAdjuster_Licenses({ 
      checked: true, 
      source: { value: license }
    });
    
    const formArray = component.certificateInfoForm.get('adjuster_Licenses');
    expect(formArray?.value).toContain(license);
    
    component.onCheckboxChangeforAdjuster_Licenses({ 
      checked: false, 
      source: { value: license }
    });
    expect(formArray?.value).not.toContain(license);
  });

  it('should show/hide insurance designations other field', () => {
    component.onCheckboxChangeforInsurance_Designations({ 
      checked: true, 
      source: { value: 'Other' }
    });
    expect(component.isinsurance_Designations_Other).toBeTrue();
    
    component.onCheckboxChangeforInsurance_Designations({ 
      checked: false, 
      source: { value: 'Other' }
    });
    expect(component.isinsurance_Designations_Other).toBeFalse();
    expect(component.certificateInfoForm.get('insurance_Designations_Other')?.value).toBe('');
  });

  it('should show/hide certifications other field and FCN', () => {
    // Test Other certification
    component.onCheckboxChangeforCertifications({ 
      checked: true, 
      source: { value: 'Other' }
    });
    expect(component.iscertifications_Other).toBeTrue();
    
    component.onCheckboxChangeforCertifications({ 
      checked: false, 
      source: { value: 'Other' }
    });
    expect(component.iscertifications_Other).toBeFalse();
    expect(component.certificateInfoForm.get('certifications_Other')?.value).toBe('');

    // Test NFIP/Flood certification
    component.onCheckboxChangeforCertifications({ 
      checked: true, 
      source: { value: 'NFIP/Flood' }
    });
    expect(component.isfcn).toBeTrue();
    
    component.onCheckboxChangeforCertifications({ 
      checked: false, 
      source: { value: 'NFIP/Flood' }
    });
    expect(component.isfcn).toBeFalse();
    expect(component.certificateInfoForm.get('fcn')?.value).toBe('');
  });

  it('should show/hide how did you hear about us other field', () => {
    const control = component.certificateInfoForm.get('how_Did_You_Hear_About_Us');
    control?.setValue('Other');
    expect(component.ishow_Did_You_Hear_About_Us_Other).toBeTrue();
    expect(component.certificateInfoForm.get('how_Did_You_Hear_About_Us_Other')?.hasValidator(Validators.required)).toBeTrue();
    
    control?.setValue('Something else');
    expect(component.ishow_Did_You_Hear_About_Us_Other).toBeFalse();
    expect(component.certificateInfoForm.get('how_Did_You_Hear_About_Us_Other')?.value).toBe('');
    expect(component.certificateInfoForm.get('how_Did_You_Hear_About_Us_Other')?.hasValidator(Validators.required)).toBeFalse();
  });

 

  it('should validate form and show error message when invalid', fakeAsync(() => {
    const sweetAlertSpy = spyOn(Swal, 'fire');
    component.submit = false;
    const result = component.iscertificateInfoFormValid();
    tick();
    
    expect(result).toBeFalse();
    expect(component.submit).toBeTrue();
    expect(sweetAlertSpy).toHaveBeenCalled();
  }));

  it('should return form data when valid', () => {
    // Fill required fields
    component.certificateInfoForm.patchValue({
      national_Producer_Number: '12345678',
      how_Did_You_Hear_About_Us: 'Friend'
    });
    component.onCheckboxChangeforAdjuster_Licenses({ 
      checked: true, 
      source: { value: 'AL' }
    });

    const result = component.iscertificateInfoFormValid();
    expect(result).toEqual({
      certificateInfoForm: component.certificateInfoForm.getRawValue()
    });
  });

  it('should check if form is dirty', () => {
    expect(component.isCertificateFormDirty()).toBeFalse();
    component.certificateInfoForm.markAsDirty();
    expect(component.isCertificateFormDirty()).toBeTrue();
  });

  it('should reset form', () => {
    // Set some values first
    component.onCheckboxChangeforInsurance_Designations({ checked: true, source: { value: 'American Family' }});
    component.onCheckboxChangeforCertifications({ checked: true, source: { value: 'AIC' }});
    component.onCheckboxChangeforAdjuster_Licenses({ checked: true, source: { value: 'AL' }});
    component.certificateInfoForm.patchValue({
      national_Producer_Number: '12345678',
      how_Did_You_Hear_About_Us: 'Friend'
    });
    component.submit = true;

    // Reset form
    component.reset();

    // Check if everything is reset
    expect(component.submit).toBeFalse();
    expect(component.certificateInfoForm.get('national_Producer_Number')?.value).toBeNull();
    expect(component.certificateInfoForm.get('how_Did_You_Hear_About_Us')?.value).toBeNull();
    expect(component.certificateInfoForm.get('insurance_Designations')?.value).toEqual([]);
    expect(component.certificateInfoForm.get('certifications')?.value).toEqual([]);
    expect(component.certificateInfoForm.get('adjuster_Licenses')?.value).toEqual([]);
  });

  it('should check if checkbox is selected on edit', () => {
    const designation = 'American Family';
    expect(component.isinsurance_DesignationsOnEdit(designation)).toBeFalse();
    
    component.onCheckboxChangeforInsurance_Designations({ 
      checked: true, 
      source: { value: designation }
    });
    expect(component.isinsurance_DesignationsOnEdit(designation)).toBeTrue();
  });

  it('should scroll to paragraph', () => {
    const scrollIntoViewMock = jasmine.createSpy('scrollIntoView');
    spyOn(document, 'getElementById').and.returnValue({ 
      scrollIntoView: scrollIntoViewMock 
    } as any);

    component.scrollToParagraph('testId');
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
});
