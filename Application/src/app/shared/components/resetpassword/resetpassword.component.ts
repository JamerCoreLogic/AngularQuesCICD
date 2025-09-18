import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MustMatch } from '../../../shared/services/aqValidators/mustMatch';
import { AQUserInfo, AQResetPasswordService } from '@agenciiq/login';
import { PopupService } from '../../../shared/utility/Popup/popup.service';
import { IPopup } from '../../../shared/utility/Popup/popup';
import { Subscription } from 'rxjs';
import { NoWhiteSpace } from '../../../shared/services/aqValidators/noWhiteSpace';
import { LoaderService } from '../../utility/loader/loader.service';
import { Router } from '@angular/router';
import { EncryptionDecryptionService } from '../../services/encryption-decryption/encryption-decryption.service';
import { ResetPasswordScreen } from 'src/app/global-settings/error-message/reset-password-screen';
import { GetConfigurationService } from '@agenciiq/aqadmin';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'],
  standalone: false
})
export class ResetpasswordComponent implements OnInit, OnDestroy {
  _ResetPasswordScreen: ResetPasswordScreen = null;
  _resetSubscription: Subscription;

  resetForm: FormGroup;
  submitted = false;
  mgaName: string;
  mgaLogo: any;
  aqLogo: any;
  bannerUrl: any;

  constructor(
    private fb: FormBuilder,
    private _resetPasswordService: AQResetPasswordService,
    private _user: AQUserInfo,
    private _loader: LoaderService,
    private _popup: PopupService,
    private _router: Router,
    private _encryptionService: EncryptionDecryptionService,
    private _mgaConfiguration: GetConfigurationService
  ) {
    this._ResetPasswordScreen = new ResetPasswordScreen();
  }

  ngOnInit() {
    this.createResetForm();
    this.getMGAConfiguration();
  }


  getMGAConfiguration() {
    this._mgaConfiguration.GetConfiguration().subscribe(mgaConfig => {
      const config = mgaConfig?.data?.mgaConfiguration;
      this.mgaName = config?.name;
      this.mgaLogo = config?.logoURL;
      this.aqLogo = config?.aqLogoURL;
      this.bannerUrl = config?.aqBannerURL;
    })
  }
  ngOnDestroy() {
    if (this._resetSubscription) {
      this._resetSubscription.unsubscribe();
    }
  }

  createResetForm() {
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\(\)_+])(?=.{8,})");
    this.resetForm = this.fb.group({
      otp: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(strongRegex)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
  }


  get otp() {
    return this.resetForm.get('otp');
  }


  get new() {
    return this.resetForm.get('newPassword');
  }

  get confirm() {
    return this.resetForm.get('confirmPassword');
  }

  resetPassword() {
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    }
    const { otp, newPassword, confirmPassword } = this.resetForm.value;
    this._loader.show();
    this._resetPasswordService.ResetPassword(
      this._user.UserName(),
      otp,
      this._encryptionService.Encrypt(newPassword),
      this._encryptionService.Encrypt(confirmPassword)).subscribe(data => {
        this._loader.hide();
        this.resetForms();
        if (data && data.success) {
          let dialog = this._popup.showPopup('Reset Password', data.message);
          dialog.afterClosed.subscribe(status => {
            if (status) {

              this._router.navigateByUrl('/');
            }
          })
        } else {
          this._popup.showPopup('Reset Password', data.message);
        }

      }, (err) => {
        this._loader.hide();
      }, () => {
        this._loader.hide();
      })
  }


  resetForms() {
    this.resetForm.reset();
    this.submitted = false;
  }



}


