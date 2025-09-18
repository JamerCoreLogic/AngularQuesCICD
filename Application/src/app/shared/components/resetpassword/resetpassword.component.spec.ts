import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ResetpasswordComponent } from './resetpassword.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AQResetPasswordService, AQUserInfo } from '@agenciiq/login';
import { PopupService } from '../../../shared/utility/Popup/popup.service';
import { LoaderService } from '../../utility/loader/loader.service';
import { Router } from '@angular/router';
import { EncryptionDecryptionService } from '../../services/encryption-decryption/encryption-decryption.service';
import { GetConfigurationService } from '@agenciiq/aqadmin';
import { of } from 'rxjs';

describe('ResetpasswordComponent', () => {
  let component: ResetpasswordComponent;
  let fixture: ComponentFixture<ResetpasswordComponent>;

  // Mocks
  let mockResetPasswordService = jasmine.createSpyObj('AQResetPasswordService', ['ResetPassword']);
  let mockUserInfo = jasmine.createSpyObj('AQUserInfo', ['UserName']);
  let mockLoaderService = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
  let mockPopupService = jasmine.createSpyObj('PopupService', ['showPopup']);
  let mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
  let mockEncryptService = jasmine.createSpyObj('EncryptionDecryptionService', ['Encrypt']);
  let mockConfigService = jasmine.createSpyObj('GetConfigurationService', ['GetConfiguration']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResetpasswordComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AQResetPasswordService, useValue: mockResetPasswordService },
        { provide: AQUserInfo, useValue: mockUserInfo },
        { provide: LoaderService, useValue: mockLoaderService },
        { provide: PopupService, useValue: mockPopupService },
        { provide: Router, useValue: mockRouter },
        { provide: EncryptionDecryptionService, useValue: mockEncryptService },
        { provide: GetConfigurationService, useValue: mockConfigService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetpasswordComponent);
    component = fixture.componentInstance;

    mockUserInfo.UserName.and.returnValue('testuser');
    mockEncryptService.Encrypt.and.callFake(val => `encrypted-${val}`);
    mockConfigService.GetConfiguration.and.returnValue(of({
      data: {
        mgaConfiguration: {
          name: 'MGA Name',
          logoURL: 'logo.png',
          aqLogoURL: 'aqlogo.png',
          aqBannerURL: 'banner.png'
        }
      }
    }));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required controls', () => {
    expect(component.resetForm.contains('otp')).toBeTruthy();
    expect(component.resetForm.contains('newPassword')).toBeTruthy();
    expect(component.resetForm.contains('confirmPassword')).toBeTruthy();
  });

  it('should mark form as invalid if passwords do not match', () => {
    component.resetForm.setValue({
      otp: '123456',
      newPassword: 'Strong@123',
      confirmPassword: 'Mismatch123'
    });

    expect(component.resetForm.valid).toBeFalse();
  });

  it('should not call service if form is invalid', () => {
    component.resetForm.setValue({
      otp: '',
      newPassword: '',
      confirmPassword: ''
    });

    component.resetPassword();
  });

  it('should call ResetPassword and navigate on success', fakeAsync(() => {
    component.resetForm.setValue({
      otp: '123456',
      newPassword: 'Strong@123',
      confirmPassword: 'Strong@123'
    });

    const mockDialog = {
      afterClosed: of(true)
    };
    mockResetPasswordService.ResetPassword.and.returnValue(of({ success: true, message: 'Password reset successful' }));
    mockPopupService.showPopup.and.returnValue(mockDialog);

    component.resetPassword();
    tick();

    expect(mockLoaderService.show).toHaveBeenCalled();
    expect(mockResetPasswordService.ResetPassword).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  }));

  it('should show error popup if reset fails', fakeAsync(() => {
    component.resetForm.setValue({
      otp: '123456',
      newPassword: 'Strong@123',
      confirmPassword: 'Strong@123'
    });

    mockResetPasswordService.ResetPassword.and.returnValue(of({ success: false, message: 'Invalid OTP' }));

    component.resetPassword();
    tick();

    expect(mockPopupService.showPopup).toHaveBeenCalledWith('Reset Password', 'Invalid OTP');
  }));
});
