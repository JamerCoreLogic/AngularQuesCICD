import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { GuestuserComponent } from './guestuser.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AQLoginService, AQUserInfo } from '@agenciiq/login';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQZipDetailsService } from '@agenciiq/aqadmin';
import { KeyboardValidation } from 'src/app/shared/services/aqValidators/keyboard-validation';
import { SortingService } from 'src/app/shared/services/sorting-service/sorting.service';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { of } from 'rxjs';

describe('GuestuserComponent', () => {
  let component: GuestuserComponent;
  let fixture: ComponentFixture<GuestuserComponent>;
  let mockRouter = { navigateByUrl: jasmine.createSpy('navigateByUrl') };
  let mockLoaderService = { show: jasmine.createSpy('show'), hide: jasmine.createSpy('hide') };
  let mockLoginService = {
    CreateGuest: jasmine.createSpy('CreateGuest').and.returnValue(of({ success: true }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestuserComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AQLoginService, useValue: mockLoginService },
        { provide: LoaderService, useValue: mockLoaderService },
        { provide: AQUserInfo, useValue: { UserId: () => 1 } },
        {
          provide: AQZipDetailsService, useValue: {
            ZipDetails: jasmine.createSpy('ZipDetails').and.returnValue(of({
              ZipCode: '12345',
              City: 'Test City',
              State: 'CA'
            }))
          }
        },
        { provide: KeyboardValidation, useValue: {} },
        { provide: SortingService, useValue: {} },
        { provide: TrimValueService, useValue: { TrimObjectValue: (x: any) => x } },
        { provide: PopupService, useValue: { show: jasmine.createSpy('show') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GuestuserComponent);
    component = fixture.componentInstance;

    // Setup the form
    component.addagent = new FormBuilder().group({
      FirstName: [''],
      Middlename: [''],
      LastName: [''],
      Email: [''],
      Zip: [''],
      City: [''],
      State: [''],
      AddressLine1: [''],
      AddressLine2: [''],
      PhoneCell: [''],
      PhoneOffice: [''],
      PhoneHome: [''],
      Fax: [''],
      AgencyName: ['']
    });

    // Stub method
    spyOn(component, 'validateAddress');

    // Mock agent data
    component.agentlist = {
      firstName: 'John',
      middleName: 'M',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      zip: '12345',
      city: 'Metropolis',
      state: 'NY',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      phoneCell: '1234567890',
      phoneOffice: '9876543210',
      phoneHome: '5551234567',
      fax: '1112223333',
      agencyName: 'Best Agency',
    };
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form with default values', () => {
    expect(component.addagent).toBeTruthy();
    expect(component.addagent.get('FirstName')).toBeTruthy();
    expect(component.addagent.get('Email')).toBeTruthy();
  });

  it('should validate the form as invalid if required fields are missing', () => {
    component.addagent.patchValue({
      FirstName: '',
      LastName: '',
      Email: '',
      Zip: '',
      AddressLine1: '',
      PhoneCell: '',
      AgencyName: ''
    });
    expect(component.addagent.valid).toBeFalsy();
  });

  it('should submit the form when valid and call CreateGuest', () => {
    component.addagent.patchValue({
      FirstName: 'John',
      Middlename: '',
      LastName: 'Doe',
      Email: 'john.doe@example.com',
      Zip: '12345',
      City: 'SampleCity',
      State: 'CA',
      AddressLine1: '123 Main St',
      AddressLine2: '',
      PhoneCell: '(123) 456-7890',
      PhoneHome: '',
      PhoneOffice: '',
      Fax: '',
      AgencyName: 'Test Agency'
    });

    component.isAddress1Valid = false;
    component.validateField = false;

    component.addAgent();

    expect(mockLoaderService.show).toHaveBeenCalled();
    expect(mockLoginService.CreateGuest).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/agenciiq');
  });

  it('should assign values to the form controls and format phone numbers', () => {
    component.assignvalue();

    expect(component.addagent.get('FirstName').value).toBe('John');
    expect(component.addagent.get('Middlename').value).toBe('M');
    expect(component.addagent.get('LastName').value).toBe('Doe');
    expect(component.addagent.get('Email').value).toBe('john.doe@example.com');
    expect(component.addagent.get('Zip').value).toBe('12345');
    expect(component.addagent.get('City').value).toBe('Metropolis');
    expect(component.addagent.get('State').value).toBe('NY');
    expect(component.addagent.get('AddressLine1').value).toBe('123 Main St');
    expect(component.addagent.get('AddressLine2').value).toBe('Apt 4B');
    expect(component.addagent.get('PhoneCell').value).toBe('(123) 456-7890');
    expect(component.addagent.get('PhoneOffice').value).toBe('(987) 654-3210');
    expect(component.addagent.get('PhoneHome').value).toBe('(555) 123-4567');
    expect(component.addagent.get('Fax').value).toBe('(111) 222-3333');
    expect(component.addagent.get('AgencyName').value).toBe('Best Agency');

    expect(component.email.disabled).toBeTrue();
    expect(component.validateAddress).toHaveBeenCalled();
  });

});
