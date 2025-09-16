import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SharedMaterialModule } from '../../shared-material/shared-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let spinnerService: jasmine.SpyObj<NgxSpinnerService>;

  const mockAuthService = {
    forgotPasswordSendLink: jasmine.createSpy('forgotPasswordSendLink')
  };

  const mockSpinnerService = {
    show: jasmine.createSpy('show'),
    hide: jasmine.createSpy('hide')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotPasswordComponent ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        SharedMaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: NgxSpinnerService, useValue: mockSpinnerService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    spinnerService = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    
    // Reset spies before each test
    mockAuthService.forgotPasswordSendLink.calls.reset();
    mockSpinnerService.show.calls.reset();
    mockSpinnerService.hide.calls.reset();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty email', () => {
    expect(component.PasswordResetForm.get('email')?.value).toBe('');
  });

  it('should set current year on init', () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYear).toBe(currentYear);
  });

  it('should validate required email', () => {
    const emailControl = component.PasswordResetForm.get('email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.PasswordResetForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['pattern']).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors).toBeNull();
  });

  describe('sendLink', () => {
    it('should not call service if form is invalid', () => {
      component.sendLink({});
      expect(component.submit).toBeTrue();
      expect(mockAuthService.forgotPasswordSendLink).not.toHaveBeenCalled();
    });

    it('should call service and handle success response', fakeAsync(() => {
      const successResponse = { success: true, message: 'Link sent successfully' };
      mockAuthService.forgotPasswordSendLink.and.returnValue(of(successResponse));
      spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

      component.PasswordResetForm.get('email')?.setValue('test@email.com');
      component.sendLink({});
      
      tick(); // Handle the API call
      tick(); // Handle the router navigation
      tick(); // Handle any remaining async operations

      expect(mockSpinnerService.show).toHaveBeenCalled();
      expect(mockAuthService.forgotPasswordSendLink).toHaveBeenCalledWith({
        emailAddress: 'test@email.com'
      });
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(mockSpinnerService.hide).toHaveBeenCalled();

      // Flush any remaining timers
      fixture.detectChanges();
      flush();
    }));

  

    it('should handle false success response', fakeAsync(() => {
      const failureResponse = { success: false, message: 'Operation failed' };
      mockAuthService.forgotPasswordSendLink.and.returnValue(of(failureResponse));

      component.PasswordResetForm.get('email')?.setValue('test@email.com');
      component.sendLink({});
      
      tick(); // Handle the API call
      tick(); // Handle the response processing
      
      expect(mockSpinnerService.show).toHaveBeenCalled();
      expect(mockSpinnerService.hide).toHaveBeenCalled();

      // Flush any remaining timers
      fixture.detectChanges();
      flush();
    }));
  });
});
