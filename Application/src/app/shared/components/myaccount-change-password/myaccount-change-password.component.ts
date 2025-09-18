import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MustMatch } from '../../../shared/services/aqValidators/mustMatch';
import { AQChangePasswordService, AQUserInfo } from '@agenciiq/login';
import { PopupService } from '../../../shared/utility/Popup/popup.service';
import { Router } from '@angular/router';
import { IPopup } from '../../../shared/utility/Popup/popup';
import { Subscription } from 'rxjs';
import { NoWhiteSpace } from '../../../shared/services/aqValidators/noWhiteSpace';
import { LoaderService } from '../../utility/loader/loader.service';
import { EncryptionDecryptionService } from '../../services/encryption-decryption/encryption-decryption.service';
import { MyAccountChangePasswordScreen } from 'src/app/global-settings/error-message/myaccount-changepass-screen';

@Component({
  selector: 'app-myaccount-change-password',
  templateUrl: './myaccount-change-password.component.html',
  styleUrls: ['./myaccount-change-password.component.sass'],
  standalone: false
})
export class MyaccountChangePasswordComponent implements OnInit {
  _MyAccountChangePasswordScreen: MyAccountChangePasswordScreen = null;
  changeForm: FormGroup;
  submitted = false;

  _changePassSubscription: Subscription;

  @Output()
  passwordChanged = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private _changePasswordService: AQChangePasswordService,
    private _user: AQUserInfo,
    private _popup: PopupService,
    private _router: Router,
    private _loader: LoaderService,
    private _encryptionService: EncryptionDecryptionService
  ) {
    this._MyAccountChangePasswordScreen = new MyAccountChangePasswordScreen();
  }

  ngOnInit() {
    this.createChangePasswordForm()
  }

  ngOnDestroy() {

    if (this._changePassSubscription) {
      this._changePassSubscription.unsubscribe();
    }
  }
  createChangePasswordForm() {
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\(\)_+])(?=.{8,})");

    this.changeForm = this.fb.group({
      currentPass: ['', Validators.required],
      newPass: ['', [Validators.required, Validators.pattern(strongRegex)]],
      retypePass: ['', Validators.required]
    }, {
      validator: MustMatch('newPass', 'retypePass')
    });
  }

  get current() {
    return this.changeForm.get('currentPass');
  }

  get new() {
    return this.changeForm.get('newPass');
  }

  get retype() {
    return this.changeForm.get('retypePass')
  }

  changePassword() {
    this.changeForm;
    this.submitted = true;
    if (this.changeForm.invalid) {
      return;
    }
    this._loader.show();
    this._changePasswordService.ChangePassword(
      this._user.UserName(),
      this._encryptionService.Encrypt(this.changeForm.value['currentPass']),
      this._encryptionService.Encrypt(this.changeForm.value['newPass']),
    ).subscribe(data => {
      this._loader.hide();
      this.resetForm();
      if (data && data.success) {

        let dialog = this._popup.showPopup('Change Password', data.message);
        dialog.afterClosed.subscribe(status => {
          if (status) {
            this.passwordChanged.emit(true);
          }
        })

      } else {
        let dialog = this._popup.showPopup('Change Password', data.message);
        dialog.afterClosed.subscribe(status => {
          if (status) {
            this.passwordChanged.emit(true);
          }
        })
      }
    }, (err) => {
      this._loader.hide();
    }, () => {
      this._loader.hide();
    })
  }

  resetForm() {
    this.changeForm.reset();
    this.submitted = false;
  }

}
