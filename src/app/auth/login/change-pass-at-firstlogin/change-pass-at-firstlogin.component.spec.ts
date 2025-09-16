import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePassAtFirstloginComponent, TooltipListPipe } from './change-pass-at-firstlogin.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { MatLegacyDialog } from '@angular/material/legacy-dialog';
import { fakeAsync } from '@angular/core/testing';
import { Component } from '@angular/core';

@Component({
  template: ''
})
class DummyComponent {}

describe('ChangePassAtFirstloginComponent', () => {
  let component: ChangePassAtFirstloginComponent;
  let fixture: ComponentFixture<ChangePassAtFirstloginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let spinnerService: jasmine.SpyObj<NgxSpinnerService>;
  let dialog: jasmine.SpyObj<MatLegacyDialog>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['saveForgotPassword']);
    const spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);

    await TestBed.configureTestingModule({
      declarations: [ 
        ChangePassAtFirstloginComponent,
        TooltipListPipe,
        DummyComponent
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatTooltipModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerServiceSpy },
        { provide: MatLegacyDialog, useValue: dialogSpy }
      ]
    })
    .compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    spinnerService = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    dialog = TestBed.inject(MatLegacyDialog) as jasmine.SpyObj<MatLegacyDialog>;
  });

  beforeEach(() => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
    fixture = TestBed.createComponent(ChangePassAtFirstloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.SavePasswordForm.get('newPassword')?.value).toBe('');
    expect(component.SavePasswordForm.get('confirmPassword')?.value).toBe('');
  });

  describe('Password Validation', () => {
    it('should validate password strength - invalid cases', () => {
      const testCases = [
        { password: 'short', description: 'too short' },
        { password: 'nouppercase123!', description: 'no uppercase' },
        { password: 'NOLOWERCASE123!', description: 'no lowercase' },
        { password: 'NoSpecialChar123', description: 'no special character' },
        { password: 'NoNumber@abc', description: 'no number' }
      ];

      testCases.forEach(test => {
        component.SavePasswordForm.get('newPassword')?.setValue(test.password);
        expect(component.SavePasswordForm.get('newPassword')?.errors).toBeTruthy();
      });
    });

    it('should validate password strength - valid case', () => {
      const validPassword = 'Test@123456';
      component.SavePasswordForm.get('newPassword')?.setValue(validPassword);
      expect(component.SavePasswordForm.get('newPassword')?.errors).toBeNull();
    });

    it('should check password match', () => {
      component.SavePasswordForm.patchValue({
        newPassword: 'Test@123456',
        confirmPassword: 'Test@123456'
      });
      expect(component.SavePasswordForm.errors).toBeNull();

      component.SavePasswordForm.patchValue({
        newPassword: 'Test@123456',
        confirmPassword: 'Different@123'
      });
      expect(component.SavePasswordForm.errors?.['notMatched']).toBeTruthy();
    });
  });





  describe('TooltipListPipe', () => {
    it('should transform array to bulleted list', () => {
      const pipe = new TooltipListPipe();
      const input = ['Line 1', 'Line 2', 'Line 3'];
      const result = pipe.transform(input);
      expect(result).toBe('• Line 1\n• Line 2\n• Line 3\n');
    });
  });
});
