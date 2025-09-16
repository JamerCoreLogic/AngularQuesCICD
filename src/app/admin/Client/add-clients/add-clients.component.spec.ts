// add-clients.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { AddClientsComponent } from './add-clients.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { of, share, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';

describe('AddClientsComponent', () => {
  let component: AddClientsComponent;
  let fixture: ComponentFixture<AddClientsComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create spies for AuthService, SpinnerService, MatDialog, and Router
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['addClient', 'editClient']);
    spinnerSpy = jasmine.createSpyObj<NgxSpinnerService>('NgxSpinnerService', ['show', 'hide']);
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['closeAll']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    // Mock sessionStorage
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'currentPage') return 'addClientPage'; // Default to 'addClientPage'; can override in specific tests
      if (key === 'LoggeduserId') return '123';
      return null;
    });

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        SharedMaterialModule
      ],
      declarations: [AddClientsComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} } // Default mock data; override as needed
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Helper to set form values
  const setValidForm = () => {
    component.addClientForm.controls['firstName'].setValue('John Doe');
    component.addClientForm.controls['email'].setValue('john.doe@example.com');
    component.addClientForm.controls['phone'].setValue('(123) 456-7890');
    component.addClientForm.controls['isActive'].setValue(true);
    // Optionally set other fields as needed
  };

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with default values and validators', () => {
      expect(component.addClientForm).toBeDefined();
      const form = component.addClientForm;
      expect(form.get('firstName')).toBeDefined();
      expect(form.get('email')).toBeDefined();
      expect(form.get('phone')).toBeDefined();
      expect(form.get('isActive')).toBeDefined();

      // Check initial form validity
      expect(form.valid).toBeFalse();
    });


  });

  describe('Form Validation', () => {
    it('should invalidate the form when required fields are empty', () => {
      // Arrange: Ensure required fields are empty
      component.addClientForm.controls['firstName'].setValue('');
      component.addClientForm.controls['email'].setValue('');
      component.addClientForm.controls['phone'].setValue('');
      component.addClientForm.controls['isActive'].setValue(null);

      // Act: Check form validity
      fixture.detectChanges();

      // Assert
      expect(component.addClientForm.valid).toBeFalse();
      expect(component.addClientForm.controls['firstName'].hasError('required')).toBeTrue();
      expect(component.addClientForm.controls['email'].hasError('required')).toBeTrue();
      expect(component.addClientForm.controls['phone'].hasError('required')).toBeTrue();
      expect(component.addClientForm.controls['isActive'].hasError('required')).toBeTrue();
    });

    it('should validate the email field correctly', () => {
      const emailControl = component.addClientForm.controls['email'];

      emailControl.setValue('invalid-email');
      expect(emailControl.invalid).toBeTrue();
      expect(emailControl.hasError('pattern')).toBeTrue();

      emailControl.setValue('valid.email@example.com');
      expect(emailControl.valid).toBeTrue();
    });

    it('should validate the phone field correctly', () => {
      const phoneControl = component.addClientForm.controls['phone'];

      phoneControl.setValue('123456789'); // Less than required length
      expect(phoneControl.invalid).toBeTrue();
      expect(phoneControl.hasError('minlength')).toBeTrue();

      phoneControl.setValue('(123) 456-7890'); // Valid format
      expect(phoneControl.valid).toBeTrue();
    });
  });






  describe('Form Reset Functionality', () => {
    it('should reset the form and set isActive to true when reset is called', () => {
      // Arrange: Set some form values
      component.addClientForm.controls['firstName'].setValue('John Doe');
      component.addClientForm.controls['email'].setValue('john.doe@example.com');
      component.addClientForm.controls['phone'].setValue('(123) 456-7890');
      component.addClientForm.controls['isActive'].setValue(false);
      component.submit = true;

      // Act: Reset the form
      component.reset();
      fixture.detectChanges();

      // Assert
      expect(component.submit).toBeFalse();
      expect(component.addClientForm.controls['firstName'].value).toBeNull();
      expect(component.addClientForm.controls['email'].value).toBeNull();
      expect(component.addClientForm.controls['phone'].value).toBeNull();
      expect(component.addClientForm.controls['isActive'].value).toBeTrue();
    });
  });

  describe('Utility Methods', () => {
    it('should convert email to lowercase on focus out', () => {
      // Arrange: Create a fake event
      const event: any = {
        target: {
          value: 'John.DOE@Example.COM'
        }
      };

      // Act: Call toLower
      component.toLower(event);

      // Assert
      expect(event.target.value).toBe('john.doe@example.com');
    });

    it('should transform phone number correctly in transformToPhonePipe', () => {
      // Arrange: Set phone number without formatting
      component.addClientForm.controls['phone'].setValue('1234567890');

      // Act: Call transformToPhonePipe
      component.transformToPhonePipe();

      // Assert
      expect(component.addClientForm.controls['phone'].value).toBe('(123) 456-7890');
      expect(component.addClientForm.controls['phone'].hasError('minlength')).toBeFalse();
    });

    it('should transform phone number correctly in transFormPhone', () => {
      // Arrange: Set formatted phone number
      component.addClientForm.controls['phone'].setValue('(123) 456-7890');

      // Act: Call transFormPhone
      component.transFormPhone();

      // Assert
      expect(component.addClientForm.controls['phone'].value).toBe('1234567890');
      expect(component.addClientForm.controls['phone'].hasError('minlength')).toBeFalse();
    });
  });
});
