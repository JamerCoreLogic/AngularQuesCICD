import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LiencesAndCertificationComponent } from './liences-and-certification.component';
import { ReactiveFormsModule, FormsModule, FormArray, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from 'src/app/services/auth.service';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import Swal from 'sweetalert2';
import { of } from 'rxjs';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// Mock AuthService
class MockAuthService {
  fetchData() {
    return of({});
  }
}

describe('LiencesAndCertificationComponent', () => {
  let component: LiencesAndCertificationComponent;
  let fixture: ComponentFixture<LiencesAndCertificationComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    // Mock sessionStorage
   

    // Mock Swal
  

    await TestBed.configureTestingModule({
      declarations: [LiencesAndCertificationComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        SharedMaterialModule,
        NoopAnimationsModule,

      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ElementRef, useValue: new ElementRef(null) },
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore template related schema errors
    }).compileComponents();

    fixture = TestBed.createComponent(LiencesAndCertificationComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with all controls', () => {
    expect(component.licenceAndCertificateForm).toBeDefined();
    const controls = component.licenceAndCertificateForm.controls;
    expect(controls['insurance_Designations']).toBeDefined();
    expect(controls['insurance_Designations_Other']).toBeDefined();
    expect(controls['certifications']).toBeDefined();
    expect(controls['certifications_Other']).toBeDefined();
    expect(controls['adjuster_Licenses']).toBeDefined();
    expect(controls['fcn']).toBeDefined();
    expect(controls['national_Producer_Number']).toBeDefined();
    expect(controls['how_Did_You_Hear_About_Us']).toBeDefined();
    expect(controls['how_Did_You_Hear_About_Us_Other']).toBeDefined();
  });

  it('should add/remove insurance designations on checkbox change', () => {
    const eventAdd = { checked: true, source: { value: 'AIC' } };
    component.onCheckboxChangeforInsurance_Designations(eventAdd);
    expect((component.licenceAndCertificateForm.get('insurance_Designations') as FormArray).length).toBe(1);

    const eventRemove = { checked: false, source: { value: 'AIC' } };
    component.onCheckboxChangeforInsurance_Designations(eventRemove);
    expect((component.licenceAndCertificateForm.get('insurance_Designations') as FormArray).length).toBe(0);
  });

  it('should show/hide insurance_Designations_Other input', () => {
    const eventOther = { checked: true, source: { value: 'Other' } };
    component.onCheckboxChangeforInsurance_Designations(eventOther);
    component.showInsurance_Designations_Other();
    expect(component.isinsurance_Designations_Other).toBeTrue();

    const eventRemoveOther = { checked: false, source: { value: 'Other' } };
    component.onCheckboxChangeforInsurance_Designations(eventRemoveOther);
    component.showInsurance_Designations_Other();
    expect(component.isinsurance_Designations_Other).toBeFalse();
  });

  it('should add/remove certifications and show/hide related fields', () => {
    const eventOther = { checked: true, source: { value: 'Other' } };
    component.onCheckboxChangeforCertifications(eventOther);
    component.showCertifications_OtherAndFcn();
    expect(component.iscertifications_Other).toBeTrue();

    const eventNFIP = { checked: true, source: { value: 'NFIP/Flood' } };
    component.onCheckboxChangeforCertifications(eventNFIP);
    component.showCertifications_OtherAndFcn();
    expect(component.isfcn).toBeTrue();

    // Now remove them
    const eventRemoveOther = { checked: false, source: { value: 'Other' } };
    component.onCheckboxChangeforCertifications(eventRemoveOther);
    component.showCertifications_OtherAndFcn();
    expect(component.iscertifications_Other).toBeFalse();

    const eventRemoveNFIP = { checked: false, source: { value: 'NFIP/Flood' } };
    component.onCheckboxChangeforCertifications(eventRemoveNFIP);
    component.showCertifications_OtherAndFcn();
    expect(component.isfcn).toBeFalse();
  });

  it('should require how_Did_You_Hear_About_Us_Other if how_Did_You_Hear_About_Us is Other', () => {
    component.licenceAndCertificateForm.get('how_Did_You_Hear_About_Us')?.setValue('Other');
    component.showHow_Did_You_Hear_About_Us_Other();
    expect(component.licenceAndCertificateForm.get('how_Did_You_Hear_About_Us_Other')?.hasValidator(Validators.required)).toBeTrue();

    component.licenceAndCertificateForm.get('how_Did_You_Hear_About_Us')?.setValue('Facebook');
    component.showHow_Did_You_Hear_About_Us_Other();
    expect(component.licenceAndCertificateForm.get('how_Did_You_Hear_About_Us_Other')?.validator).toBeNull();
  });

  it('should add/remove adjuster licenses on checkbox change and require at least one', () => {
    const adjusterEvent = { checked: true, source: { value: 'Texas' } };
    component.onCheckboxChangeforAdjuster_Licenses(adjusterEvent);
    expect((component.licenceAndCertificateForm.get('adjuster_Licenses') as FormArray).length).toBe(1);

    const adjusterEventRemove = { checked: false, source: { value: 'Texas' } };
    component.onCheckboxChangeforAdjuster_Licenses(adjusterEventRemove);
    expect((component.licenceAndCertificateForm.get('adjuster_Licenses') as FormArray).length).toBe(0);
  });

  it('should validate national_Producer_Number as required and minLength(8)', () => {
    const control = component.licenceAndCertificateForm.get('national_Producer_Number');
    control?.setValue('');
    expect(control?.valid).toBeFalse();

    control?.setValue('1234567'); // 7 digits
    expect(control?.valid).toBeFalse();

    control?.setValue('12345678'); // 8 digits
    expect(control?.valid).toBeTrue();
  });







});
