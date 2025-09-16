import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicInfoComponent } from './basic-info.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { noop, of } from 'rxjs';
import { ElementRef } from '@angular/core';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import Swal from 'sweetalert2';

// Mock AuthService
class MockAuthService {
  getStates() {
    return of({ data: ['Alabama', 'Alaska', 'Arizona'] });
  }
  getUserRoles() {
    return of({ data: [{ roleId: 1, role: 'Admin' }, { roleId: 2, role: 'User' }] });
  }
  getUserType() {
    return of({ data: [{ userTypeId: 1, type: 'Internal' }, { userTypeId: 2, type: 'External' }] });
  }
}

// Mock SpinnerService
class MockNgxSpinnerService {
  show() {}
  hide() {}
}

// Test component class that extends BasicInfoComponent to access protected methods
class TestBasicInfoComponent extends BasicInfoComponent {
  public enableFormControls() {
    this.setFormPermissions(true);
  }
}

describe('BasicInfoComponent', () => {
  let component: TestBasicInfoComponent;
  let fixture: ComponentFixture<TestBasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestBasicInfoComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        SharedMaterialModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: NgxSpinnerService, useClass: MockNgxSpinnerService },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: ElementRef, useValue: new ElementRef(null) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Base Test
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test Cases for Form Initialization
  it('should initialize the form with default values', () => {
    expect(component.addUserForm).toBeDefined();
    expect(component.addUserForm.controls['firstName'].value).toBe('');
    expect(component.addUserForm.controls['country'].value).toBe('United States');
  });

  it('should mark the form as invalid when required fields are empty', () => {
    component.addUserForm.patchValue({
      firstName: '',
      lastName: '',
      email: '',
      userRole: '',
      userType: '',
    });
    expect(component.addUserForm.valid).toBeFalse();
  });


  // Test Cases for Fetching States
  it('should fetch states based on country', () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'getStates').and.callThrough();
    component.getStates('United States');
    expect(authService.getStates).toHaveBeenCalledWith(1);
    expect(component.StatesList).toEqual(['Alabama', 'Alaska', 'Arizona']);
  });

  // Test Cases for Form Validation
  it('should validate email and confirmEmail fields', () => {
    component.addUserForm.patchValue({
      email: 'john.doe@example.com',
      confirmEmail: 'wrong.email@example.com',
    });
    component.emailValidator(component.addUserForm);
    expect(component.addUserForm.controls['confirmEmail'].errors).toEqual({ emailMismatch: true });

    component.addUserForm.patchValue({
      confirmEmail: 'john.doe@example.com',
    });
    component.emailValidator(component.addUserForm);
    expect(component.addUserForm.controls['confirmEmail'].errors).toBeNull();
  });

  // Test Cases for Phone and Mobile
  it('should validate phone and mobile fields', () => {
    component.addUserForm.patchValue({ phone: '', mobile: '' });
    component.validateMobileOrPhone();
    expect(component.addUserForm.get('phone')?.errors).toEqual({ required: true });
    expect(component.addUserForm.get('mobile')?.errors).toEqual({ required: true });
  });

  // Test Cases for Role and Type Change
  it('should emit role and type change event', () => {
    spyOn(component.dataEvent, 'emit');
    component.addUserForm.patchValue({ userRole: [1], userType: [1] });
    component.sendRoleAndTypeToParent();
    expect(component.dataEvent.emit).toHaveBeenCalledWith({ role: [1], type: [1] });
  });

  // Test Cases for File Selection and Compression
  it('should handle file selection and compression', async () => {
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const event = { target: { files: [file] } };

    spyOn(component, 'compressAndHandleFile').and.callThrough();
    spyOn(component, 'compressFile').and.returnValue(Promise.resolve(file));
    spyOn(component, '_handleReaderLoaded').and.callThrough();

    component.onFileSelected(event);
    await fixture.whenStable();

    expect(component.compressAndHandleFile).toHaveBeenCalledWith(file, event.target as unknown as HTMLInputElement);
    expect(component.compressFile).toHaveBeenCalledWith(file);
    expect(component.fileName).toBe('example.png');
  });

  it('should show error if file size exceeds limit', () => {
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });
    const event = { target: { files: [file] } };

    spyOn(Swal, 'fire');

    component.onFileSelected(event);

     expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      title: '',
      text: 'File size exceeds the 5MB limit.',
      icon: 'error',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#ffa022',
    }));
  });

  it('should show warning if file type is not JPG or PNG', () => {
    const file = new File(['dummy content'], 'example.gif', { type: 'image/gif' });
    const event = { target: { files: [file] } };

    spyOn(Swal, 'fire');

    component.onFileSelected(event);

  expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      title: '',
      text: 'Please select either JPG or PNG format!',
      icon: 'warning',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#ffa022',
    }));
  });

  // Test Cases for FetchUser
  it('should fetch user data and patch the form', () => {
    // Initialize form and enable controls
    component.createAddUser();
    component.enableFormControls();

    // Mock the data
    component.data = {
      userId: 1,
      fName: 'John',
      mName: 'Doe',
      lName: 'Smith',
      emailAddress: 'john.doe@example.com',
      mobile: '1234567890',
      standby: true,
      userRoleData: [{ roleId: 1, role: 'Admin' }],
      userTypeId: 1,
      address1: '123 Main St',
      address2: 'Apt 4',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
      isActive: true,
      isLocked: false,
      confirmEmail: 'john.doe@example.com',
      what_Type_Of_Phone_Do_You_Use: 'iPhone',
      mobileNumber: '1234567890',
      companyName: 'Company',
      profilePic: 'base64string',
      i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In: true,
      i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In: true,
    };

    spyOn(component, 'getStateZipLabel');
    spyOn(component, 'transformToPhonePipe');
    spyOn(component, 'sendRoleAndTypeToParent');

    // Call FetchUser
    component.FetchUser();

    // Verify form values
    const formValue = component.addUserForm.getRawValue();
    expect(formValue).toEqual(jasmine.objectContaining({
      userId: 1,
      firstName: 'John',
      middleName: 'Doe',
      lastName: 'Smith',
      email: 'john.doe@example.com',
      phone: '1234567890',
      standby: true,
      userRole: [1],
      userType: 1,
      address1: '123 Main St',
      address2: 'Apt 4',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
      isActive: true,
      isLocked: false,
      confirmEmail: 'john.doe@example.com',
      typeOfPhone: 'iPhone',
      mobile: '1234567890',
      companyName: 'Company',
      profilePic: 'base64string',
      i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In: true,
      i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In: true,
    }));

    expect(component.getStateZipLabel).toHaveBeenCalled();
    expect(component.transformToPhonePipe).toHaveBeenCalled();
    expect(component.sendRoleAndTypeToParent).toHaveBeenCalled();
  });

  // Test Cases for onLock
  it('should set isActive to the value of isLocked', () => {
    component.addUserForm.patchValue({ isLocked: true });
    component.onLock();
    expect(component.addUserForm.controls['isActive'].value).toBe(true);

    component.addUserForm.patchValue({ isLocked: false });
    component.onLock();
    expect(component.addUserForm.controls['isActive'].value).toBe(false);
  });

  // Test Cases for reset
  
 
});
