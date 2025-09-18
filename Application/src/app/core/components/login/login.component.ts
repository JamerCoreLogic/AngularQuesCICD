import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AQLoginService, AQForgotPasswordService, AQUserInfo, AQRememberPassword, AQLogoutService, AQRoleInfo } from '@agenciiq/login'
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { NoWhiteSpace } from 'src/app/shared/services/aqValidators/noWhiteSpace';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { environment } from '../../../../environments/environment';
import { Roles } from 'src/app/global-settings/roles';
import { EncryptionDecryptionService } from 'src/app/shared/services/encryption-decryption/encryption-decryption.service';
import { LoginScreen } from '../../../global-settings/error-message/login-screen';
import { GetConfigurationService } from '@agenciiq/aqadmin';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { ThemeService } from 'src/app/global-settings/theme.service';
import { AQSession } from 'src/app/global-settings/session-storage';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
  standalone: false
})

export class LoginComponent implements OnInit, OnDestroy {

  env = environment;
  _LoginScreen: LoginScreen = null;
  loginForm: FormGroup;
  submitted = false;
  forgot = false;
  appVersion: string;
  savedUserName = "";
  savedPassword = "";
  savedRemember: boolean = false;
  mgaName: string;
  identifier: string;
  mgaLogo: any;
  aqLogo: any;
  bannerUrl: any;
  /* Subscriptions Variables */
  _loginSubscription: Subscription;
  _formSubscription: Subscription;
  favIcon: any;
  alreadyLogin: boolean = false;

  constructor(
    private _router: Router,
    private login: AQLoginService,
    private user: AQUserInfo,
    private _forgotService: AQForgotPasswordService,
    private _rememberPassword: AQRememberPassword,
    private _popup: PopupService,
    private _logoutService: AQLogoutService,
    private _loaderService: LoaderService,
    private _encryptionService: EncryptionDecryptionService,
    private _mgaConfiguration: GetConfigurationService,
    private _role: AQRoleInfo,
    private _checkRoleService: CheckRoleService,
    private _activatedRoute: ActivatedRoute,
    private themeService: ThemeService,
    private _session: AQSession,
    private fb: FormBuilder,
  ) {
    this.appVersion = environment.AppVersion;
    this._LoginScreen = new LoginScreen();
  }

  ngOnInit() {
    this.identifier = window.location.host;
    this._logoutService.Logout();
    const savedUser = this._rememberPassword.getLastSavedUser();
    if (savedUser) {
      this.savedUserName = this._rememberPassword.getLastSavedUser().userName;
      this.savedPassword = this._encryptionService.Decrypt(this._rememberPassword.getLastSavedUser().password);
      this.savedRemember = true;
    }
    this.createLoginForm();

    this.resolveRoute();
    setTimeout(() => {
      console.clear();
    }, 1000);
  }

  resolveRoute() {
    this._activatedRoute.data.subscribe((response: any) => {
      if (response?.mgaConfigResolver) {
        let mgaConfig = response.mgaConfigResolver;
        this.mgaName = mgaConfig.data.mgaConfiguration.name;
        this.mgaLogo = mgaConfig.data.mgaConfiguration.logoURL;
        this.aqLogo = mgaConfig.data.mgaConfiguration.aqLogoURL;
        this.bannerUrl = mgaConfig.data.mgaConfiguration.aqBannerURL;
        this.favIcon = mgaConfig.data.mgaConfiguration.aqFavIconURL
        if (this.favIcon) {
          this.themeService.loadStyle('favicon', 'icon', this.favIcon);
        }
      }
    })
  }

  getMGAConfiguration() {
    this._loaderService.show();
    this._mgaConfiguration.GetConfiguration().subscribe(mgaConfig => {
      this._loaderService.hide();
      this.mgaName = mgaConfig.data.mgaConfiguration.name;
      this.mgaLogo = mgaConfig.data.mgaConfiguration.logoURL;
      this.aqLogo = mgaConfig.data.mgaConfiguration.aqLogoURL;
      this.bannerUrl = mgaConfig.data.mgaConfiguration.aqBannerURL;
    })
  }

  setLogo() {
    if (this.env.ClientName == 'acme') {
      this.mgaLogo = "assets/acme.agenciiq.net/images/login/mgaLogo.png"
      this.aqLogo = "assets/acme.agenciiq.net/images/login/poweredBy.png"
    }
    else if (this.env.ClientName == 'insured') {
      this.mgaLogo = "assets/insured.agenciiq.net/images/login/mgaLogo.png"
      this.aqLogo = "assets/insured.agenciiq.net/images/login/poweredBy.png"
    }
    else {
      this.mgaLogo = "assets/united.agenciiq.net/images/login/mgaLogo.png"
      this.aqLogo = "assets/united.agenciiq.net/images/login/poweredBy.png"
    }

  }

  ngOnDestroy() {
    if (this._loginSubscription) {
      this._loginSubscription.unsubscribe();
    }
    if (this._formSubscription) {
      this._formSubscription.unsubscribe();
    }
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      userName: [this.savedUserName, [Validators.required, NoWhiteSpace]],
      password: [this.savedPassword, [Validators.required, NoWhiteSpace]],
      rememberMe: [this.savedRemember]
    });
  }

  mapLoginFormsValue() {
    this._formSubscription = this.username.valueChanges.subscribe(uName => {
      let user = this._rememberPassword.getSavedUserByUserName(uName)
      if (user) {
        this.password.setValue(user['password']);
        this.rememberMe.setValue(true);
      } else {
        this.password.setValue(null);
        this.rememberMe.setValue(false);
      }
    })
  }

  get username() {
    return this.loginForm.get('userName');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }

  getGuestUser() {
    this._router.navigateByUrl('guest-user');
  }

  getAppointed() {
    this._router.navigateByUrl('get-appointed');
  }
  getSubmitBusiness() {
    this._router.navigateByUrl('submit-business');
  }

  onSubmit() {
    setTimeout(() => {
      console.clear();
    }, 4000);
    this.submitted = true;
    this.forgot = true;
    if (this.loginForm.invalid) {
      return;
    }
    this._loaderService.show();
    this._loginSubscription = this.login.LoginAuthentication(this.loginForm.value.userName, this._encryptionService.Encrypt(this.loginForm.value.password), this.rememberMe.value).subscribe(data => {
      this._loaderService.hide();
      const resp: any = data;
      if (resp['success'] && resp['message'] === null) {
        this.alreadyLogin = true;
        this._session.setData('alreadyLogin', this.alreadyLogin);
        if (this.user.isResetPassword()) {
          this._router.navigateByUrl('agenciiq/changepassword');
        } else if (this.user.isNewUser()) {
          this._router.navigateByUrl('resetpassword');
        } else {
          let roles = this._role.Roles();
          if (this._checkRoleService.isRoleCodeAvailable(Roles.Agent.roleCode, roles)
            || this._checkRoleService.isRoleCodeAvailable(Roles.Supervisor.roleCode, roles)
            || this._checkRoleService.isRoleCodeAvailable(Roles.Manager.roleCode, roles)
            || this._checkRoleService.isRoleCodeAvailable(Roles.Underwriter.roleCode, roles)
            || this._checkRoleService.isRoleCodeAvailable(Roles.UnderwriterAssistant.roleCode, roles)
            || this._checkRoleService.isRoleCodeAvailable(Roles.UWManager.roleCode, roles)
            || this._checkRoleService.isRoleCodeAvailable(Roles.UWSupervisior.roleCode, roles)) {
            this._router.navigateByUrl('/agenciiq');
          } else if (this._checkRoleService.isRoleCodeAvailable(Roles.MGAAdmin.roleCode, roles)) {
            this._router.navigateByUrl('/agenciiq/agencies');
          } else if (this._checkRoleService.isRoleCodeAvailable(Roles.AgencyAdmin.roleCode, roles) || this._checkRoleService.isRoleCodeAvailable(Roles.SystemAdmin.roleCode, roles)) {
            this._router.navigateByUrl('/agenciiq/users');
          }
            // else if(this._checkRoleService.isRoleCodeAvailable(Roles.Underwriter.roleCode, roles)
            // || this._checkRoleService.isRoleCodeAvailable(Roles.UnderwriterAssistant.roleCode, roles)
            // || this._checkRoleService.isRoleCodeAvailable(Roles.UWManager.roleCode, roles)
            // || this._checkRoleService.isRoleCodeAvailable(Roles.UWSupervisior.roleCode, roles)){
            //   this._router.navigateByUrl('/agenciiq');
            // }
/* 
            if (roles[0].roleCode == "MGAAdmin") {
              
            } else if (roles[0].roleCode == Roles.AgencyAdmin.roleCode || roles[0].roleCode == Roles.SystemAdmin.roleCode) {
              
            } else {
              
            }
 */          }
      } else {
        this._popup.showPopup('Login', data.message);
      }
    }, err => {
      this._loaderService.hide();
      console.log("err", err);
    }, () => {
      this._loaderService.hide();
    })
  }

  forgotPassword() {
    this.forgot = true;
    if (this.loginForm.get('userName').valid) {
      this._loaderService.show();
      this._forgotService.ForgetPassword(this.loginForm.value.userName).subscribe(data => {
        this._loaderService.hide();
        if (data?.success) {
          let dailog = this._popup.showPopup('Forgot Password', data.message);
          dailog.afterClosed.subscribe(status => {
            if (status) {
              this._router.navigateByUrl('agenciiq');
            }
          });
        } else {
          this._popup.showPopup('Forgot Password', data.message);
        }
      }, (err) => {
        this._loaderService.hide();
        console.log("err", err);
      }, () => {
        this._loaderService.hide();
      })
    }
  }


  resetForm() {
    this.forgot = false;
    this.submitted = false;
  }
}
