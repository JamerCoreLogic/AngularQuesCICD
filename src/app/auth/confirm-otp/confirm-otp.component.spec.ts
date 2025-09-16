import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ConfirmOtpComponent } from './confirm-otp.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import Swal from 'sweetalert2';

describe('ConfirmOtpComponent', () => {
  let component: ConfirmOtpComponent;
  let fixture: ComponentFixture<ConfirmOtpComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let spinnerService: jasmine.SpyObj<NgxSpinnerService>;

  const mockActivatedRoute = {
    queryParams: of({ token: 'test+token' })
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['saveForgotPassword']);
    const spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      declarations: [ ConfirmOtpComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        SharedMaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    spinnerService = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.SavePasswordForm.get('otp')?.value).toBe('');
    expect(component.SavePasswordForm.get('newPassword')?.value).toBe('');
    expect(component.SavePasswordForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.SavePasswordForm;
    expect(form.valid).toBeFalsy();
    
    const otp = form.get('otp');
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    expect(otp?.errors?.['required']).toBeTruthy();
    expect(newPassword?.errors?.['required']).toBeTruthy();
    expect(confirmPassword?.errors?.['required']).toBeTruthy();
  });

  it('should validate password strength', () => {
    const newPassword = component.SavePasswordForm.get('newPassword');
    
    newPassword?.setValue('weak');
    expect(newPassword?.errors?.['strength']).toBeTruthy();

    newPassword?.setValue('StrongPass123!');
    expect(newPassword?.errors).toBeNull();
  });

  it('should validate password match', () => {
    const form = component.SavePasswordForm;
    
    form.get('newPassword')?.setValue('StrongPass123!');
    form.get('confirmPassword')?.setValue('DifferentPass123!');
    expect(form.hasError('notMatched')).toBeTruthy();

    form.get('confirmPassword')?.setValue('StrongPass123!');
    expect(form.hasError('notMatched')).toBeFalsy();
  });

  it('should check password strength indicators', () => {
    const newPassword = component.SavePasswordForm.get('newPassword');
    newPassword?.setValue('Test123!@');
    
    // Force the error state to trigger strength check
    newPassword?.setErrors({ 'strength': true });
    component.checkPasswordStrength();

    expect(component.hasUpperCase).toBeTrue();
    expect(component.hasLowerCase).toBeTrue();
    expect(component.hasNumber).toBeTrue();
    expect(component.hasSpecialChar).toBeTrue();
    expect(component.hasMinLength).toBeTrue();
  });

  it('should generate correct password tooltip', () => {
    const newPassword = component.SavePasswordForm.get('newPassword');
    newPassword?.setValue('');
    expect(component.generatePasswordTooltip()).toBe('Password is required');

    newPassword?.setValue('StrongPass123!');
    expect(component.generatePasswordTooltip()).toBe('Password is valid');
  });

  it('should handle successful password save', fakeAsync(() => {
    const successResponse = { success: true };
    authService.saveForgotPassword.and.returnValue(of(successResponse));

    component.SavePasswordForm.patchValue({
      otp: '123456',
      newPassword: 'StrongPass123!',
      confirmPassword: 'StrongPass123!'
    });

    component.savePassword();
    tick(); // Handle initial async operation
    tick(15000); // Handle setTimeout
    
    expect(spinnerService.show).toHaveBeenCalled();
    expect(spinnerService.hide).toHaveBeenCalled();
    expect(component.isOtpValid).toBeTruthy();
  }));

  

  

  // Add test for confirmpassfunction
  it('should handle password confirmation', () => {
    const form = component.SavePasswordForm;
    const event = { target: { value: 'StrongPass123!' } };

    form.get('newPassword')?.setValue('StrongPass123!');
    form.get('confirmPassword')?.setValue('StrongPass123!');
    
    component.confirmpassfunction(event);
    
    expect(form.get('confirmPassword')?.errors).toBeNull();
    expect(component.showAlerts).toBeTrue();
  });

  // Add test for generatePasswordTooltip with pattern error
  it('should generate password tooltip with pattern errors', () => {
    const newPassword = component.SavePasswordForm.get('newPassword');
    newPassword?.setValue('weak');
    newPassword?.setErrors({ 'pattern': true });
    
    component.hasUpperCase = false;
    component.hasLowerCase = true;
    component.hasNumber = false;
    component.hasSpecialChar = false;
    component.hasMinLength = false;

    const tooltip = component.generatePasswordTooltip();
    expect(tooltip).toContain('Must contain at least one uppercase letter');
    expect(tooltip).toContain('Must contain at least one number');
  });
});
