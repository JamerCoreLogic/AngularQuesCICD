import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ContactInfoComponent } from './contact-info.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedMaterialModule } from '../../shared-material/shared-material.module';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

describe('ContactInfoComponent', () => {
  let component: ContactInfoComponent;
  let fixture: ComponentFixture<ContactInfoComponent>;
  let formBuilder: FormBuilder;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getStates']);
    authServiceSpy.getStates.and.returnValue(of({
      data: [
        { name: 'Alabama', abbreviation: 'AL' },
        { name: 'Alaska', abbreviation: 'AK' }
      ]
    }));

    await TestBed.configureTestingModule({
      declarations: [ContactInfoComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SharedMaterialModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: ElementRef,
          useValue: {
            nativeElement: document.createElement('div')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactInfoComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.addUserForm).toBeDefined();
    expect(component.addUserForm.get('firstName')).toBeDefined();
    expect(component.addUserForm.get('lastName')).toBeDefined();
    expect(component.addUserForm.get('email')).toBeDefined();
    expect(component.addUserForm.get('phone')).toBeDefined();
    expect(component.addUserForm.get('mobile')).toBeDefined();
    expect(component.addUserForm.get('country')?.value).toBe('United States');
  });

  it('should validate required fields', () => {
    const form = component.addUserForm;
    expect(form.valid).toBeFalsy();
    
    // Test firstName validation
    const firstNameControl = form.get('firstName');
    expect(firstNameControl?.errors?.['required']).toBeTruthy();
    firstNameControl?.setValue('John');
    expect(firstNameControl?.valid).toBeTruthy();
    
    // Test lastName validation
    const lastNameControl = form.get('lastName');
    expect(lastNameControl?.errors?.['required']).toBeTruthy();
    lastNameControl?.setValue('Doe');
    expect(lastNameControl?.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.addUserForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['pattern']).toBeTruthy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should validate email confirmation match', () => {
    const form = component.addUserForm;
    
    form.patchValue({
      email: 'test@email.com',
      confirmEmail: 'different@email.com'
    });
    
    expect(form.get('confirmEmail')?.errors?.['emailMismatch']).toBeTruthy();
    
    form.patchValue({
      confirmEmail: 'test@email.com'
    });
    
    expect(form.get('confirmEmail')?.errors).toBeNull();
  });

  it('should handle phone number formatting', () => {
    const phoneControl = component.addUserForm.get('phone');
    
    phoneControl?.setValue('1234567890');
    component.transformPhoneNumber('phone');
    expect(phoneControl?.value).toBe('(123) 456-7890');
    
    phoneControl?.setValue('123');
    component.transformPhoneNumber('phone');
    expect(phoneControl?.value).toBe('');
  });

  it('should validate mobile and phone requirements', fakeAsync(() => {
    const form = component.addUserForm;
    const mobileControl = form.get('mobile');
    const phoneControl = form.get('phone');
    
    // Both empty
    mobileControl?.setValue('');
    phoneControl?.setValue('');
    component.validateMobileOrPhone();
    tick();
    expect(mobileControl?.errors?.['required']).toBeTruthy();
    expect(phoneControl?.errors?.['required']).toBeTruthy();
    
    // Mobile valid
    mobileControl?.setValue('(123) 456-7890');
    component.validateMobileOrPhone();
    tick();
    expect(mobileControl?.valid).toBeTruthy();
    expect(phoneControl?.errors).toBeNull();
  }));

  it('should handle assignments checkbox changes', () => {
    const assignment = 'Claims Supervisor';
    component.onCheckboxChangeforAssignments({ 
      checked: true, 
      source: { value: assignment }
    });
    
    const formArray = component.addUserForm.get('assignments');
    expect(formArray?.value).toContain(assignment);
    
    component.onCheckboxChangeforAssignments({ 
      checked: false, 
      source: { value: assignment }
    });
    expect(formArray?.value).not.toContain(assignment);
  });





  it('should update state and zip labels based on country', () => {
    component.addUserForm.get('country')?.setValue('Canada');
    component.getStateZipLabel();
    
    expect(component.zipLabel).toBe('Postal Code');
    expect(component.stateLabel).toBe('Province');
    
    component.addUserForm.get('country')?.setValue('United States');
    component.getStateZipLabel();
    
    expect(component.zipLabel).toBe('Zip');
    expect(component.stateLabel).toBe('State');
  });

  it('should fetch states when country changes', () => {
    component.addUserForm.get('country')?.setValue('Canada');
    expect(authService.getStates).toHaveBeenCalledWith(2);
    
    component.addUserForm.get('country')?.setValue('United States');
    expect(authService.getStates).toHaveBeenCalledWith(1);
  });

  it('should convert email to lowercase', () => {
    const event = {
      target: { value: 'TEST@EMAIL.COM' },
      currentTarget: {
        attributes: {
          formcontrolname: { nodeValue: 'email' }
        }
      }
    };
    
    component.toLower(event);
    expect(component.addUserForm.get('email')?.value).toBe('test@email.com');
  });

  it('should check if form is dirty', () => {
    expect(component.isContactInfoformDirty()).toBeFalse();
    component.addUserForm.markAsDirty();
    expect(component.isContactInfoformDirty()).toBeTrue();
  });

  it('should reset form', () => {
    // Set some values first
    component.onCheckboxChangeforAssignments({ checked: true, source: { value: 'Claims Supervisor' }});
    component.addUserForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@email.com',
      phone: '(123) 456-7890'
    });
    component.submit = true;

    // Reset form
    component.reset();

    // Check if everything is reset
    expect(component.submit).toBeFalse();
    expect(component.addUserForm.get('firstName')?.value).toBeNull();
    expect(component.addUserForm.get('lastName')?.value).toBeNull();
    expect(component.addUserForm.get('email')?.value).toBeNull();
    expect(component.addUserForm.get('phone')?.value).toBeNull();
    expect(component.addUserForm.get('assignments')?.value).toEqual([]);
  });

  it('should check if assignment is checked on edit', () => {
    const assignment = 'Claims Supervisor';
    expect(component.isAssignmentCheckedOnEdit(assignment)).toBeFalse();
    
    component.onCheckboxChangeforAssignments({ 
      checked: true, 
      source: { value: assignment }
    });
    expect(component.isAssignmentCheckedOnEdit(assignment)).toBeTrue();
  });
});
