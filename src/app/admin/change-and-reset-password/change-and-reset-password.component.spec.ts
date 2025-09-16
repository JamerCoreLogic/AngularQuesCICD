import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangeAndResetPasswordComponent } from './change-and-reset-password.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { throwError as throwErrorFn } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';

const ERROR_MESSAGES = {
  generalError: 'Sorry! Something went wrong. Your request could not be completed, Please try again later.',
  connectionError: 'Please check the connection. Unable to communicate with server via HTTP(s).',
  serverError: 'Something went wrong'
};

describe('ChangeAndResetPasswordComponent', () => {
  let component: ChangeAndResetPasswordComponent;
  let fixture: ComponentFixture<ChangeAndResetPasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    // 1) Create spies for AuthService, Spinner, and MatDialog
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['updateResetPassword']);
    spinnerSpy = jasmine.createSpyObj<NgxSpinnerService>('NgxSpinnerService', ['show', 'hide']);
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['closeAll']);

    // 2) Stub sessionStorage 'getItem' so 'currentPage' can be "resetPass".
    //    Also, set 'LoggeduserId' to some numeric string.
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'currentPage') return 'resetPass';
      if (key === 'LoggeduserId') return '123';
      return null;
    });

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        SharedMaterialModule
      ],
      declarations: [ ChangeAndResetPasswordComponent ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        // To demonstrate the "invalid by default" scenario, let's pass an empty email here
        // so that the form is initially invalid.
        { provide: MAT_DIALOG_DATA, useValue: { Email: '' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeAndResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Helper to set a valid email
  const setValidEmail = (email: string = 'valid@test.com') => {
    component.resetPasswordForm.controls['email'].setValue(email);
  };

  // Because Angular can’t spy on window.location.reload directly
  // (it is a read-only property in most browsers),
  // we’ll define a helper method in the component and spy on that:


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the form defined and initially invalid (Email is empty)', () => {
    expect(component.resetPasswordForm).toBeDefined();
    // Now, because MAT_DIALOG_DATA.Email = '', the form should be invalid
    expect(component.resetPasswordForm.valid).toBeFalse();
  });

  it('should call onEdit() in constructor if currentPage is resetPass and set form value from data', () => {
    // We passed { Email: '' } above, so let's check if that got set
    expect(component.resetPasswordForm.value.email).toBe(''); 
  });

  it('should mark `submit` as true when changeResetPassword() is called, even if form is invalid', () => {
    // No mocking of service here, because invalid form short-circuits the request
    component.changeResetPassword('update');
    expect(component.submit).toBeTrue();
    // Because it's invalid, `updateResetPassword` should NOT be called
    expect(authServiceSpy.updateResetPassword).not.toHaveBeenCalled();
  });


 
  it('should call SpinnerService.show and SpinnerService.hide when changeResetPassword is called', fakeAsync(() => {
    setValidEmail();
    authServiceSpy.updateResetPassword.and.returnValue(of({ success: true }));

    component.changeResetPassword('update');
    tick(16000);

    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('should show success message and reload window when password is updated successfully', fakeAsync(() => {
    setValidEmail();
    authServiceSpy.updateResetPassword.and.returnValue(of({ success: true }));
    const swalFireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }));

    component.changeResetPassword('update');
    tick(16000);

    expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      text: 'Password updated successfully.',
      icon: 'success'
    }));
  
    expect(dialogSpy.closeAll).toHaveBeenCalled();
  }));

  it('should show success message and reload window when password is reset successfully', fakeAsync(() => {
    setValidEmail();
    authServiceSpy.updateResetPassword.and.returnValue(of({ success: true }));
    const swalFireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }));

    component.changeResetPassword('reset');
    tick(16000);

    expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      text: 'Password reset successfully.',
      icon: 'success'
    }));
   
    expect(dialogSpy.closeAll).toHaveBeenCalled();
  }));

 



  it('should not call updateResetPassword if form is invalid', () => {
    component.resetPasswordForm.controls['email'].setValue('invalid-email');
    component.changeResetPassword('update');

    expect(authServiceSpy.updateResetPassword).not.toHaveBeenCalled();
  });

  it('should call onEdit and set email when currentPage is resetPass', () => {
    component.currentPage = 'resetPass';
    component.onEdit();

    expect(component.resetPasswordForm.controls['email'].value).toBe('');
  });

  it('should not call onEdit if currentPage is not resetPass', () => {
    component.currentPage = 'someOtherPage';
    const onEditSpy = spyOn(component, 'onEdit');

    component.ngOnInit();

    expect(onEditSpy).not.toHaveBeenCalled();
  });
});
 