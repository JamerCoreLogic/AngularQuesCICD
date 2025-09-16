import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterTabsComponent } from './register-tabs.component';
import { AuthService } from '../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs';
import { RouterTestingModule } from '@angular/router/testing';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import Swal from 'sweetalert2';
import { Overlay } from '@angular/cdk/overlay';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { HistoryInfoComponent } from './history-info/history-info.component';
import { CertificateInfoComponent } from './certificate-info/certificate-info.component';
import { CoreValuesComponent } from './core-values/core-values.component';

// Define interfaces for form types
interface BasicInfoForm {
  userId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  phone: string;
  mobile: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  assignments: string[];
  what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned: string;
  i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In: boolean;
  i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In: boolean;
}

// ---- Child Component Stubs ----
@Component({
  selector: 'app-contact-info',
  template: ''
})
class ContactInfoStubComponent {
  reset() {}
  isBasicInfoFormValid() { 
    return { 
      basicInfoForm: { 
        userId: null,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        confirmEmail: 'john@example.com',
        phone: '(123) 456-7890',
        mobile: '(098) 765-4321',
        address1: '123 Main St',
        city: 'Test City',
        state: 'TS',
        zip: '12345',
        country: 'USA',
        assignments: ['Assignment1', 'Assignment2'],
        what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned: 'Type1',
        i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In: true,
        i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In: true
      } as BasicInfoForm
    }; 
  }
  isBasicInfoFormDirty() { return false; }
  isContactInfoformDirty() { return false; }
  saveUserId(id: string) {}
}

@Component({
  selector: 'app-history-info',
  template: ''
})
class HistoryInfoStubComponent {
  reset() {}
  isAdditionalInfoFormValid() { 
    return { 
      additionalInfoForm: {
        approximate_Date_I_Began_Adjusting: '2023-01-01',
        location_Preference: ['Location1', 'Location2']
      } 
    }; 
  }
  isAdditionalInfoFormDirty() { return false; }
  ishistoryInfoFormDirty() { return false; }
}

@Component({
  selector: 'app-certificate-info',
  template: ''
})
class CertificateInfoStubComponent {
  reset() {}
  iscertificateInfoFormValid() { 
    return { 
      certificateInfoForm: {
        qB_Line_Of_Business_Internal: ['Line1', 'Line2'],
        certifications: ['Cert1', 'Cert2'],
        insurance_Designations: ['Des1', 'Des2'],
        adjuster_Licenses: ['Lic1', 'Lic2']
      } 
    }; 
  }
  isCertificateFormDirty() { return false; }
}

@Component({
  selector: 'app-core-values',
  template: ''
})
class CoreValuesStubComponent {
  reset() {}
  isCoreValuesFormValid() { 
    return { 
      coreValuesForm: [
        { questionId: 1, answer: 'Yes' },
        { questionId: 2, answer: 'No' }
      ] 
    }; 
  }
  isCoreValuesFormDirty() { return false; }
}

@Component({
  selector: 'app-welcome-fpd',
  template: ''
})
class WelcomeFPDStubComponent {}

// ---- Mock Services ----
class MockAuthService {
  addUserRegistration(data: any) {
    return of({ success: true, message: 'USER123' });
  }
}

describe('RegisterTabsComponent', () => {
  let component: RegisterTabsComponent;
  let fixture: ComponentFixture<RegisterTabsComponent>;
  let authService: MockAuthService;
  let spinner: NgxSpinnerService;
  let router: Router;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    authService = new MockAuthService();
    spinner = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    (dialog.open as jasmine.Spy).and.returnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<any>);

    await TestBed.configureTestingModule({
      declarations: [
        RegisterTabsComponent,
        ContactInfoStubComponent,
        HistoryInfoStubComponent,
        CertificateInfoStubComponent,
        CoreValuesStubComponent,
        WelcomeFPDStubComponent
      ],
      imports: [
        RouterTestingModule,
        SharedMaterialModule,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: NgxSpinnerService, useValue: spinner },
        { provide: MatDialog, useValue: dialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterTabsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isFirstTab).toBeTrue();
    expect(component.isLastTab).toBeFalse();
    expect(component.activeTabIndex).toBe(0);
    expect(component.tabCount).toBe(4);
    expect(component.isSubmitEnable).toBeTrue();
    expect(component.saveAllowed).toBeFalse();
  });

  it('should handle tab change and validate current tab', fakeAsync(() => {
    const contactInfoComp = fixture.debugElement.query(By.directive(ContactInfoStubComponent)).componentInstance;
    spyOn(contactInfoComp, 'isBasicInfoFormValid').and.callThrough();

    component.tabChanged({ index: 1, tab: null } as any);
    tick();

    expect(contactInfoComp.isBasicInfoFormValid).toHaveBeenCalled();
    expect(component.activeTabIndex).toBe(1);
  }));

  it('should convert form data to proper format in convertToString', () => {
    component.basicInfoForm = {
      basicInfoForm: {
        phone: '(123) 456-7890',
        mobile: '(098) 765-4321',
        assignments: ['Assignment1', 'Assignment2']
      }
    };

    component.additionalInfoForm = {
      additionalInfoForm: {
        approximate_Date_I_Began_Adjusting: new Date('2023-01-01'),
        location_Preference: ['Location1', 'Location2']
      }
    };

    component.certificateInfoForm = {
      certificateInfoForm: {
        qB_Line_Of_Business_Internal: ['Line1', 'Line2'],
        certifications: ['Cert1', 'Cert2'],
        insurance_Designations: ['Des1', 'Des2'],
        adjuster_Licenses: ['Lic1', 'Lic2']
      }
    };

    component.activeTabIndex = 2;
    component.convertToString();

    expect(component.basicInfoForm.basicInfoForm.phone).toBe('1234567890');
    expect(component.basicInfoForm.basicInfoForm.mobile).toBe('0987654321');
    expect(component.basicInfoForm.basicInfoForm.assignments).toBe('Assignment1,Assignment2');
    expect(component.additionalInfoForm.additionalInfoForm.location_Preference).toBe('Location1,Location2');
    expect(component.certificateInfoForm.certificateInfoForm.certifications).toBe('Cert1,Cert2');
  });

  it('should save and submit form data successfully', fakeAsync(() => {
    spyOn(authService, 'addUserRegistration').and.callThrough();
    spyOn(component, 'welcomefpd');

    // Create child component instances and cast them to their respective types
    component.contactInfoComponent = new ContactInfoStubComponent() as unknown as ContactInfoComponent;
    component.historyInfoComponent = new HistoryInfoStubComponent() as unknown as HistoryInfoComponent;
    component.certificateInfoComponent = new CertificateInfoStubComponent() as unknown as CertificateInfoComponent;
    component.coreValuesComponent = new CoreValuesStubComponent() as unknown as CoreValuesComponent;

    // Set active tab to last tab (core values)
    component.activeTabIndex = 3;
    
    // Trigger form submission
    component.saveAndSubmit('submit');
    tick();

    expect(authService.addUserRegistration).toHaveBeenCalled();
    expect(component.welcomefpd).toHaveBeenCalled();
  }));

 
});
