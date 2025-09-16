import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { MatLegacyDialog as MatDialog, MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { LoginInfoComponent } from 'src/app/auth/login/login-info/login-info.component';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Mock LoginInfoComponent to avoid dependency issues
@Component({
  selector: 'app-login-info',
  template: ''
})
class MockLoginInfoComponent {}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockUserData = {
    data: {
      profilePic: 'test-profile-pic',
      role: [
        {
          roleName: 'Admin',
          userPageList: [
            {
              moduleName: 'Test Module',
              pageDetailsData: [{ pageName: 'Test Page' }]
            }
          ]
        }
      ]
    }
  };

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
    
    dialogSpyObj.open.and.returnValue({
      afterClosed: () => of('result')
    } as any);

    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatMenuModule,
        MatIconModule,
        BrowserAnimationsModule
      ],
      declarations: [
        HeaderComponent,
        MockLoginInfoComponent
      ],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: MatDialog, useValue: dialogSpyObj }
      ],
      schemas: [NO_ERRORS_SCHEMA] // To ignore unknown elements like mat-icon
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  beforeEach(() => {
    // Mock localStorage before each test
    spyOn(localStorage, 'getItem').and.callFake((key) => {
      if (key === 'currentUser') {
        return JSON.stringify(mockUserData);
      } else if (key === 'LoggedUserType') {
        return '1';
      } else if (key === 'LoggedUserName') {
        return 'Test User';
      } else if (key === 'LoggedUserRole') {
        return 'Admin';
      } else if (key === 'LoggeduserEmail') {
        return 'test@example.com';
      }
      return null;
    });
    
    spyOn(localStorage, 'clear');
    
    // Initialize the component's data without triggering detectChanges() 
    // which would render the template
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user data on ngOnInit', () => {
    expect(component.loggedUserRes).toEqual(mockUserData);
    expect(component.userName).toBe('Test User');
    expect(component.userType).toBe('Admin');
    expect(component.userEmail).toBe('test@example.com');
    expect(component.userProfilePic).toBe('test-profile-pic');
  });

  it('should check if user has specific role', () => {
    const result = component.hasUserRole('Test Module');
    expect(result).toBeTrue();
    
    const negativeResult = component.hasUserRole('Non-existent Module');
    expect(negativeResult).toBeFalse();
  });

  it('should check if user has access to specific page', () => {
    const result = component.hasPage('Test Page');
    expect(result).toBeTrue();
    
    const negativeResult = component.hasPage('Non-existent Page');
    expect(negativeResult).toBeFalse();
  });

  it('should correctly determine if reports should be shown', () => {
    // Override the roles for this specific test
    component.loggedUserRes = {
      data: {
        role: [{ roleName: 'Adjuster' }]
      }
    };
    component.loggedUserTypeCheck = 1;
    
    const result = component.shouldShowReports();
    expect(result).toBeTrue();
    
    // Test with multiple roles (should return false)
    component.loggedUserRes = {
      data: {
        role: [{ roleName: 'Adjuster' }, { roleName: 'Admin' }]
      }
    };
    
    const negativeResult = component.shouldShowReports();
    expect(negativeResult).toBeFalse();
  });

  it('should correctly determine if view user should be shown', () => {
    // Override the roles for this specific test
    component.loggedUserRes = {
      data: {
        role: [{ roleName: 'Employee' }]
      }
    };
    
    const result = component.shouldShowViewUser();
    expect(result).toBeTrue();
    
    // Test with multiple roles (should return false)
    component.loggedUserRes = {
      data: {
        role: [{ roleName: 'Employee' }, { roleName: 'Admin' }]
      }
    };
    
    const negativeResult = component.shouldShowViewUser();
    expect(negativeResult).toBeFalse();
  });

  it('should transform image correctly', () => {
    component.userProfilePic = 'longBase64StringThatIsLongerThan50Characters123456789012345678901234567890';
    const result = component.imageTransform();
    expect(result).toBe('longBase64StringThatIsLongerThan50Characters123456789012345678901234567890');
    
    // Test with short or null profile pic
    component.userProfilePic = 'short';
    const nullResult = component.imageTransform();
    expect(nullResult).toBeUndefined();
  });

  it('should validate base64 strings correctly', () => {
    const validBase64 = 'SGVsbG8gV29ybGQ='; // "Hello World" in base64
    expect(component.checkBase64Validity(validBase64)).toBeTrue();
    
    const invalidBase64 = 'not a valid base64 string';
    expect(component.checkBase64Validity(invalidBase64)).toBeFalse();
  });

  it('should logout and navigate to login page', () => {
    component.logout();
    
    expect(localStorage.clear).toHaveBeenCalledTimes(2);
    expect(component.userEmail).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should open login info dialog', () => {
    component.afterlogin();
    
    expect(dialogSpy.open).toHaveBeenCalledWith(LoginInfoComponent, {
      data: {},
      panelClass: 'afterlogin_info'
    });
  });

 


});
