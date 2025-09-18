import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MyaccountChangePasswordComponent } from './myaccount-change-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AQChangePasswordService, AQUserInfo } from '@agenciiq/login';
import { PopupService } from '../../../shared/utility/Popup/popup.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../utility/loader/loader.service';
import { EncryptionDecryptionService } from '../../services/encryption-decryption/encryption-decryption.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MyaccountChangePasswordComponent', () => {
  let component: MyaccountChangePasswordComponent;
  let fixture: ComponentFixture<MyaccountChangePasswordComponent>;

  let mockChangePasswordService: jasmine.SpyObj<AQChangePasswordService>;
  let mockUserInfo: jasmine.SpyObj<AQUserInfo>;
  let mockPopupService: jasmine.SpyObj<PopupService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLoaderService: jasmine.SpyObj<LoaderService>;
  let mockEncryptionService: jasmine.SpyObj<EncryptionDecryptionService>;

  beforeEach(async () => {
    mockChangePasswordService = jasmine.createSpyObj('AQChangePasswordService', ['ChangePassword']);
    mockUserInfo = jasmine.createSpyObj('AQUserInfo', ['UserName']);
    mockPopupService = jasmine.createSpyObj('PopupService', ['showPopup']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLoaderService = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    mockEncryptionService = jasmine.createSpyObj('EncryptionDecryptionService', ['Encrypt']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule],
      declarations: [MyaccountChangePasswordComponent],
      providers: [
        { provide: AQChangePasswordService, useValue: mockChangePasswordService },
        { provide: AQUserInfo, useValue: mockUserInfo },
        { provide: PopupService, useValue: mockPopupService },
        { provide: Router, useValue: mockRouter },
        { provide: LoaderService, useValue: mockLoaderService },
        { provide: EncryptionDecryptionService, useValue: mockEncryptionService },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyaccountChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize form', () => {
    expect(component).toBeTruthy();
    expect(component.changeForm).toBeDefined();
  });

  it('should invalidate the form if required fields are empty', () => {
    component.changeForm.setValue({
      currentPass: '',
      newPass: '',
      retypePass: ''
    });
    expect(component.changeForm.invalid).toBeTrue();
  });

  it('should invalidate the form if newPass and retypePass do not match', () => {
    component.changeForm.setValue({
      currentPass: 'Current@123',
      newPass: 'NewPass@123',
      retypePass: 'Mismatch@123'
    });
    expect(component.changeForm.invalid).toBeTrue();
  });

  it('should call ChangePassword and emit event on success', fakeAsync(() => {
    const dialogMock = {
      afterClosed: of(true)
    };

    mockUserInfo.UserName.and.returnValue('testUser');
    mockEncryptionService.Encrypt.and.returnValue('encrypted');
    mockChangePasswordService.ChangePassword.and.returnValue(of({ success: true, message: 'Password Changed' }));
    mockPopupService.showPopup.and.returnValue(dialogMock as any);

    spyOn(component.passwordChanged, 'emit');

    component.changeForm.setValue({
      currentPass: 'Current@123',
      newPass: 'NewPass@123',
      retypePass: 'NewPass@123'
    });

    component.changePassword();
    tick();

    expect(mockLoaderService.show).toHaveBeenCalled();
    expect(mockChangePasswordService.ChangePassword).toHaveBeenCalledWith('testUser', 'encrypted', 'encrypted');
    expect(mockPopupService.showPopup).toHaveBeenCalledWith('Change Password', 'Password Changed');
    expect(component.passwordChanged.emit).toHaveBeenCalledWith(true);
    expect(mockLoaderService.hide).toHaveBeenCalled();
  }));

  it('should handle API error gracefully', fakeAsync(() => {
    mockUserInfo.UserName.and.returnValue('testUser');
    mockEncryptionService.Encrypt.and.returnValue('encrypted');
    mockChangePasswordService.ChangePassword.and.returnValue(throwError(() => new Error('Server error')));

    component.changeForm.setValue({
      currentPass: 'Current@123',
      newPass: 'NewPass@123',
      retypePass: 'NewPass@123'
    });

    component.changePassword();
    tick();

    expect(mockLoaderService.show).toHaveBeenCalled();
    expect(mockLoaderService.hide).toHaveBeenCalled();
  }));

  it('should unsubscribe on destroy', () => {
    const subscription = of().subscribe();
    component['_changePassSubscription'] = subscription;
    spyOn(subscription, 'unsubscribe');

    component.ngOnDestroy();

    expect(subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should reset form correctly', () => {
    component.changeForm.setValue({
      currentPass: 'Current@123',
      newPass: 'NewPass@123',
      retypePass: 'NewPass@123'
    });
    component.submitted = true;

    component.resetForm();

    expect(component.changeForm.value).toEqual({
      currentPass: null,
      newPass: null,
      retypePass: null
    });
    expect(component.submitted).toBeFalse();
  });
});

