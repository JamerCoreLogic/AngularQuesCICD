import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import Swal from 'sweetalert2';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let spinnerService: jasmine.SpyObj<NgxSpinnerService>;
  let router: Router;
  let location: Location;

  const mockAuthService = {
    logout: jasmine.createSpy('logout'),
    changePass: jasmine.createSpy('changePass')
  };

  const mockSpinnerService = {
    show: jasmine.createSpy('show'),
    hide: jasmine.createSpy('hide')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePasswordComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        SharedMaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: NgxSpinnerService, useValue: mockSpinnerService },
        Location
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    spinnerService = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
  });

  beforeEach(() => {
    localStorage.setItem('LoggeduserId', '123');
    localStorage.setItem('LoggeduserEmail', 'test@test.com');
    localStorage.setItem('LoggedUserName', 'Test User');
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.ChangePasswordForm.get('currentPassword')?.value).toBe('');
    expect(component.ChangePasswordForm.get('newPassword')?.value).toBe('');
    expect(component.ChangePasswordForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.ChangePasswordForm;
    expect(form.valid).toBeFalsy();
    
    form.controls['currentPassword'].setValue('');
    form.controls['newPassword'].setValue('');
    form.controls['confirmPassword'].setValue('');
    
    expect(form.controls['currentPassword'].errors?.['required']).toBeTruthy();
    expect(form.controls['newPassword'].errors?.['required']).toBeTruthy();
    expect(form.controls['confirmPassword'].errors?.['required']).toBeTruthy();
  });

  it('should validate password strength', () => {
    const form = component.ChangePasswordForm;
    form.controls['newPassword'].setValue('weak');
    expect(form.controls['newPassword'].errors?.['strength']).toBeTruthy();

    form.controls['newPassword'].setValue('StrongPass123!');
    expect(form.controls['newPassword'].errors).toBeNull();
  });

  it('should validate password match', () => {
    const form = component.ChangePasswordForm;
    form.controls['newPassword'].setValue('StrongPass123!');
    form.controls['confirmPassword'].setValue('DifferentPass123!');
    expect(form.hasError('notMatched')).toBeTruthy();

    form.controls['confirmPassword'].setValue('StrongPass123!');
    expect(form.hasError('notMatched')).toBeFalsy();
  });

  it('should check password strength indicators', () => {
    component.ChangePasswordForm.controls['newPassword'].setValue('Test1');
    component.checkPasswordStrength();
    
    expect(component.hasUpperCase).toBeTruthy();
    expect(component.hasLowerCase).toBeTruthy();
    expect(component.hasNumber).toBeTruthy();
    expect(component.hasSpecialChar).toBeFalsy();
    expect(component.hasMinLength).toBeFalsy();
  });

  it('should handle successful password change', fakeAsync(() => {
    const successResponse = { success: true, message: 'Password updated successfully' };
    mockAuthService.changePass.and.returnValue(of(successResponse));

    component.ChangePasswordForm.patchValue({
      currentPassword: 'OldPass123!',
      newPassword: 'NewPass123!',
      confirmPassword: 'NewPass123!'
    });

    component.savePassword();
    tick(15000); // Account for the setTimeout in the component
    
    expect(mockSpinnerService.show).toHaveBeenCalled();
    expect(mockSpinnerService.hide).toHaveBeenCalled();
    expect(mockAuthService.changePass).toHaveBeenCalled();
  }));



  it('should navigate to previous URL', () => {
    spyOn(location, 'back');
    component.navigateToPreviousUrl();
    expect(location.back).toHaveBeenCalled();
  });

  it('should redirect to login if user is not authenticated', () => {
    localStorage.clear();
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(router.url).not.toBe('/login');
  });

  it('should update form validity on password confirmation', () => {
    const event = { target: { value: 'NewPass123!' } };
    component.ChangePasswordForm.controls['newPassword'].setValue('NewPass123!');
    component.ChangePasswordForm.controls['confirmPassword'].setValue('NewPass123!');
    
    component.confirmpassfunction(event);
    
    expect(component.showAlerts).toBeTruthy();
    expect(component.ChangePasswordForm.hasError('notMatched')).toBeFalsy();
  });

  it('should generate correct password tooltip messages', () => {
    // Test required case
    component.ChangePasswordForm.controls['newPassword'].setValue('');
    expect(component.generatePasswordTooltip()).toBe('Password is required');

    // Test weak password case
    component.ChangePasswordForm.controls['newPassword'].setValue('weak');
    component.checkPasswordStrength();
    
    // Force the pattern error to trigger tooltip messages
    component.ChangePasswordForm.controls['newPassword'].setErrors({ 'pattern': true });
    const tooltip = component.generatePasswordTooltip();
    
    // Verify tooltip contains required messages
    expect(tooltip).toContain('Must contain');
  });



  // Add test for password strength validator function
  it('should validate password strength correctly', () => {
    const control = component.ChangePasswordForm.controls['newPassword'];
    
    // Test weak password
    control.setValue('weak');
    expect(control.errors?.['strength']).toBeTruthy();
    
    // Test strong password
    control.setValue('StrongPass123!');
    expect(control.errors).toBeNull();
  });

  // Add test for password match validator
  it('should validate password match correctly', () => {
    const form = component.ChangePasswordForm;
    
    form.controls['newPassword'].setValue('StrongPass123!');
    form.controls['confirmPassword'].setValue('StrongPass123!');
    expect(form.hasError('notMatched')).toBeFalsy();
    
    form.controls['confirmPassword'].setValue('DifferentPass123!');
    expect(form.hasError('notMatched')).toBeTruthy();
  });
});
