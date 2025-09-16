import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;

  const mockAuthService = {
    logout: jasmine.createSpy('logout'),
    login: jasmine.createSpy('login'),
    compressProfilePic: jasmine.createSpy('compressProfilePic'),
    postUserAllowedUrls: jasmine.createSpy('postUserAllowedUrls'),
    getHeartbeat: jasmine.createSpy('getHeartbeat')
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        SharedMaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockAuthService.getHeartbeat.and.returnValue(of(['', '', '', '', '', '', '', '', '', '', '', 'v1.0.0']));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form', () => {
    expect(component.LoginForm).toBeDefined();
    expect(component.LoginForm.get('email')).toBeDefined();
    expect(component.LoginForm.get('password')).toBeDefined();
  });

  it('should validate email format', () => {
    const emailControl = component.LoginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.hide).toBeTruthy();
    component.hide = !component.hide;
    expect(component.hide).toBeFalsy();
  });

  it('should navigate to forgot password page', () => {
    component.route();
    expect(router.navigate).toHaveBeenCalledWith(['forgot-password']);
  });

  it('should navigate to register page', () => {
    component.routeToRegister();
    expect(router.navigate).toHaveBeenCalledWith(['register']);
  });

  it('should show spinner and validate form on login attempt', () => {
    component.login();
    expect(spinner.show).toHaveBeenCalled();
    expect(component.submit).toBeTrue();
  });

  it('should handle successful login for existing user', fakeAsync(() => {
    const mockResponse = {
      success: true,
      data: {
        isFirstTimeLogin: false,
        userName: 'Test User',
        role: [{ roleId: 1, userPageList: [{ isSingle: true, pageURL: 'http://test.com/dashboard' }] }],
        userTypeId: 1,
        emailAddress: 'test@test.com',
        userId: '123',
        token: 'test-token',
        profilePic: 'test-pic'
      }
    };

    component.LoginForm.setValue({
      email: 'test@test.com',
      password: 'password123'
    });

    mockAuthService.login.and.returnValue(of(mockResponse));
    mockAuthService.compressProfilePic.and.returnValue(Promise.resolve('compressed-pic'));
    mockAuthService.postUserAllowedUrls.and.returnValue(true);

    component.login();
    tick();

    expect(localStorage.getItem('currentUser')).toBeTruthy();
    expect(localStorage.getItem('LoggedUserName')).toBe('Test User');
    expect(router.navigate).toHaveBeenCalled();
  }));

 

  it('should get version details on init', () => {
    component.versionDetails();
    expect(mockAuthService.getHeartbeat).toHaveBeenCalled();
    expect(component.versionData).toBe('v1.0.0');
  });

  it('should set current year on init', () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYear).toBe(currentYear);
  });
});
