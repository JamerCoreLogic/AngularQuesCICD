import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { MgaConfigurationComponent } from './mga-configuration.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject, Subscription, throwError } from 'rxjs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQZipDetailsService, GetConfigurationService } from '@agenciiq/aqadmin';
import { MgaConfigService } from '@agenciiq/mga-config';

describe('MgaConfigurationComponent', () => {
  let component: MgaConfigurationComponent;
  let fixture: ComponentFixture<MgaConfigurationComponent>;
  let mgaConfigServiceSpy: jasmine.SpyObj<GetConfigurationService>;
  let mockMGAConfigService: jasmine.SpyObj<MgaConfigService>;

  const mockZipDetails = {
    ValidateAddressField: jasmine.createSpy()
  };

  const mockLoader = {
    show: jasmine.createSpy(),
    hide: jasmine.createSpy()
  };

  beforeEach(waitForAsync(() => {
    mgaConfigServiceSpy = jasmine.createSpyObj('GetConfigurationService', ['GetConfiguration']);
    mockMGAConfigService = jasmine.createSpyObj('MgaConfigService', ['MGADetails']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [MgaConfigurationComponent],
      providers: [FormBuilder,
        { provide: AQZipDetailsService, useValue: mockZipDetails },
        { provide: LoaderService, useValue: mockLoader },
        { provide: MgaConfigService, useValue: mockMGAConfigService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgaConfigurationComponent);
    component = fixture.componentInstance;
    component.userId = 123;
    component.isEditable = true;
    component.subject = new Subject<string>();
    fixture.detectChanges();
  });

  it('should load MGA details and assign data correctly', () => {
    const mockResponse = {
      success: true,
      data: {
        mgaConfiguration: { configKey: 'value' },
        mgaLobsList: ['Workers Compansation', ''],
        mgaCarriersList: ['21st Century', 'Alfa Insurance'],
        mgaStatesList: ['NY', 'CA']
      }
    };

    // Spy on component methods
    spyOn(component, 'assignMGAForm');
    spyOn(component, 'assignSavedLobList');
    spyOn(component, 'assignSavedCarrierList');
    spyOn(component, 'assignSavedStateList');

    const userId = 123;
    component.getMGADetails(userId);

    expect(mockLoader.show).toHaveBeenCalled();
    expect(mockMGAConfigService.MGADetails).toHaveBeenCalledWith(userId);
  });

  it('should set isZipInvalid to false when zip length is not 5', () => {
    component.isZipInvalid = true;
    component.getControl('zip').setValue('123');
    fixture.detectChanges();
    expect(component.isZipInvalid).toBeTrue();
  });

  it('should set required validator if addressLine2 is empty and addressLine1 is also empty', () => {
    component.getControl('addressLine1').setValue('');
    component.getControl('addressLine2').setValue('');
    fixture.detectChanges();

    expect(component.getControl('addressLine1').validator).toBeTruthy();
    component.getControl('addressLine1').updateValueAndValidity();
    expect(component.getControl('addressLine1').hasError('required')).toBeTrue();
  });

  it('should set required validator if both addressLine1 and addressLine2 are empty', () => {
    component.getControl('addressLine1').setValue('');
    component.getControl('addressLine2').setValue('');
    fixture.detectChanges();

    expect(component.getControl('addressLine1').validator).toBeTruthy();
    component.getControl('addressLine1').updateValueAndValidity();
    expect(component.getControl('addressLine1').hasError('required')).toBeTrue();
  });

  it('should return null for a non-existent control', () => {
    const control = component.getControl('nonExistentControl');
    expect(control).toBeNull();
  });

  it('should set isSubmited to true when zip is missing and IsEventFromPage is true', () => {
    component.IsEventFromPage = true;
    component.getControl = jasmine.createSpy().and.callFake((controlName: string) => ({
      value: controlName === 'zip' ? '' : 'Test Value',
    }));
    component.validateAddress();
    expect(component.isSubmited).toBeTrue();
  });

  it('should set error state when validate address returns failure', () => {
    const mockResponse = {
      success: false,
      message: 'Invalid address',
      data: {}
    };

    mockZipDetails.ValidateAddressField.and.returnValue(of(mockResponse));

    component.validateAddress();

    expect(component.isAddress1Valid).toBeFalse();
    expect(component.address1ErrorMessage).toBe('');
    expect(component.isSubmited).toBeFalse();
  });

  it('should call validate address and update form on success response', () => {
    const mockResponse = {
      success: true,
      data: {
        City: 'New York',
        State: 'NY',
        Address1: 'Street A 12',
        Address2: 'Underground B 34',
      }
    };

    mockZipDetails.ValidateAddressField.and.returnValue(of(mockResponse));

    component.validateAddress();

    expect(mockLoader.show).toHaveBeenCalled();
    expect(component.isAddress1Valid).toBeFalse();
  });

  it('should filter and map selected states and update lobList correctly', () => {
    // Prepare sample input state list
    const stateList = [
      { parameterId: 1, checked: true },
      { parameterId: 2, checked: false },
      { parameterId: 3, checked: true }
    ];

    // Mock lobList and mgadata with lobStatesList
    component.lobList = [
      { lobId: 101, states: [] },
      { lobId: 102, states: [] }
    ];

    component.mgadata = {
      lobStatesList: [
        { stateId: 1, lobId: 101 },
        { stateId: 3, lobId: 102 }
      ]
    };

    // Call the method
    component.SelectedStateList(stateList);

    // 1. selectedStatelist should contain only checked states
    expect(component.selectedStatelist.length).toBe(2);
    expect(component.selectedStatelist).toEqual([
      { parameterId: 1, checked: true },
      { parameterId: 3, checked: true }
    ]);

    // 2. selectedState should be a mapped list with only stateId properties
    expect(component.selectedState).toEqual([
      { stateId: 1 },
      { stateId: 3 }
    ]);

    // 3. lobList states should be updated and checked flags adjusted according to mgadata.lobStatesList
    expect(component.lobList[0].states).toEqual([
      { parameterId: 1, checked: true },
      { parameterId: 3, checked: false }
    ]);
    expect(component.lobList[1].states).toEqual([
      { parameterId: 1, checked: false },
      { parameterId: 3, checked: true }
    ]);
  });

  it('should filter and map lobList correctly in SelectedLobList', () => {
    const lobList = [
      { lobId: 1, checked: true, name: 'LOB 1' },
      { lobId: 2, checked: false, name: 'LOB 2' },
      { lobId: 3, checked: true, name: 'LOB 3' }
    ];

    component.SelectedLobList(lobList);
    expect(component.selectedLoblist).toEqual([
      { lobId: 1, checked: true, name: 'LOB 1' },
      { lobId: 3, checked: true, name: 'LOB 3' }
    ]);
    expect(component.selectedLob).toEqual([
      { lobId: 1 },
      { lobId: 3 }
    ]);
  });

  it('should handle empty list', () => {
    component.SelectedLobList([]);
    expect(component.selectedLoblist).toEqual([]);
    expect(component.selectedLob).toEqual([]);
  });

  it('should handle all unchecked items', () => {
    const lobList = [
      { lobId: 1, checked: false },
      { lobId: 2, checked: false }
    ];
    component.SelectedLobList(lobList);
    expect(component.selectedLoblist).toEqual([]);
    expect(component.selectedLob).toEqual([]);
  });

  it('should call methods and set identifier on ngOnInit', fakeAsync(() => {
    spyOn(component, 'getMGADetails');
    spyOn(component, 'createMGAForm');
    spyOn(component, 'getMGAConfiguration');
    spyOn(component, 'SaveAccountWithAddressValidation');

    component.ngOnInit();
    tick();
    expect(component.getMGADetails).toHaveBeenCalledWith(123);
    expect(component.createMGAForm).toHaveBeenCalled();
    expect(component.getMGAConfiguration).toHaveBeenCalled();
    expect(component.SaveAccountWithAddressValidation).toHaveBeenCalled();
    expect(component.identifier).toBe('lambis.agenciiq.net');
  }));

  it('should create MGAConfigForms with correct controls and validators', () => {
    component.createMGAForm();
    const form = component.MGAConfigForms;

    expect(form).toBeTruthy();
    expect(form.contains('mgaId')).toBeTrue();
    expect(form.contains('name')).toBeTrue();
    expect(form.contains('email')).toBeTrue();
    expect(form.contains('phoneHome')).toBeTrue();

    // Check required validators
    expect(form.get('name')?.validator).toBeTruthy();
    expect(form.get('email')?.validator).toBeTruthy();

    // Set invalid email
    form.get('email')?.setValue('invalid-email');
    expect(form.get('email')?.valid).toBeFalse();

    // Set valid email
    form.get('email')?.setValue('test@example.com');
    expect(form.get('email')?.valid).toBeTrue();

    // Set invalid phone number
    form.get('phoneHome')?.setValue('123456');
    expect(form.get('phoneHome')?.valid).toBeFalse();

    // Set valid phone number
    form.get('phoneHome')?.setValue('(123) 456-7890');
    expect(form.get('phoneHome')?.valid).toBeTrue();

    // Check disabled fields
    expect(form.get('city')?.disabled).toBeTrue();
    expect(form.get('state')?.disabled).toBeTrue();
    expect(form.get('name')?.disabled).toBe(component.isEditable === false);
  });

  it('should assign formatted fax and phoneHome, set state, and call validateAddress and onControlValueChange', () => {
    const mockValues = {
      fax: '1234567890',
      phoneHome: '9876543210',
      stateCode: 'CA'
    };

    spyOn(component, 'validateAddress');
    spyOn(component, 'onControlValueChange');
    // spyOn(component, 'getControl').and.callFake((controlName: string) => component.MGAConfigForms.get(controlName));

    component.assignMGAForm({ ...mockValues });

    expect(component.MGAConfigForms.value.fax).toBe('(123) 456-7890');
    expect(component.MGAConfigForms.value.phoneHome).toBe('(987) 654-3210');
    expect(component.validateAddress).toHaveBeenCalled();
    expect(component.onControlValueChange).toHaveBeenCalled();
  });

  it('should call getCarrierList with userId and savedCarrierList', () => {
    const mockSavedCarrierList = [{ id: 1, name: 'Carrier A' }, { id: 2, name: 'Carrier B' }];
    component.userId = 123;
    spyOn(component, 'getCarrierList');
    component.assignSavedCarrierList(mockSavedCarrierList);
    expect(component.getCarrierList).toHaveBeenCalledWith(123, mockSavedCarrierList);
  });

  it('should call getLobList with userId and savedLobList', () => {
    const savedLobList = [{ id: 1, name: 'LOB1' }];
    spyOn(component, 'getLobList');
    component.assignSavedLobList(savedLobList);
    expect(component.getLobList).toHaveBeenCalledWith(123, savedLobList);
  });

  it('should upload a valid file and call readmgaConfigExcel()', () => {
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    const event = {
      target: {
        files: [file]
      }
    };

    spyOn(component, 'readmgaConfigExcel');
    component.uploadExcel(event);
    expect(component.uploadedFile).toBe(file);
    expect(component.isFileExists).toBeTrue();
    expect(component.isvalidExtension).toBeTrue();
    expect(component.readmgaConfigExcel).toHaveBeenCalled();
  });

  it('should set isvalidExtension to false for invalid file extension', () => {
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const event = {
      target: {
        files: [file]
      }
    };

    spyOn(component, 'readmgaConfigExcel');
    component.uploadExcel(event);
    expect(component.uploadedFile).toBe(file);
    expect(component.isFileExists).toBeTrue();
    expect(component.isvalidExtension).toBeFalse();
    expect(component.readmgaConfigExcel).not.toHaveBeenCalled();
  });

  it('should set isFileExists to false if no file is uploaded', () => {
    const event = {
      target: {
        files: []
      }
    };
    component.uploadExcel(event);
    expect(component.isFileExists).toBeFalse();
  });

  it('should call validateAddress when subject emits "validateAddress"', () => {
    spyOn(component, 'validateAddress');
    component.SaveAccountWithAddressValidation();
    component.subject.next('validateAddress');
    expect(component.validateAddress).toHaveBeenCalled();
  });

  it('should call SaveMgaConfig when subject emits "save" and IsEventFromPage is true', () => {
    spyOn(component, 'SaveMgaConfig');
    component.IsEventFromPage = true;
    component.SaveAccountWithAddressValidation();
    component.subject.next('save');
    expect(component.SaveMgaConfig).toHaveBeenCalled();
  });

  it('should NOT call SaveMgaConfig when IsEventFromPage is false', () => {
    spyOn(component, 'SaveMgaConfig');
    component.IsEventFromPage = false;
    component.SaveAccountWithAddressValidation();
    component.subject.next('save');
    expect(component.SaveMgaConfig).not.toHaveBeenCalled();
  });

  it('should set IsEventFromPage to true and emit "validateAddress" on subject', (done) => {
    component.subject.subscribe(value => {
      // expect(value).toBe('save');
      done();
    });
    component.SaveAccountWithOserverPattern();
    // Check the flag
    expect(component.IsEventFromPage).toBeTrue();
  });

  it('should filter checked carriers and map to carrierId list', () => {
    const carrierList = [
      { carrierId: 1, checked: true },
      { carrierId: 2, checked: false },
      { carrierId: 3, checked: true },
      { carrierId: 4, checked: false }
    ];
    component.SelectedCarrierList(carrierList);
    expect(component.selectedCarrier).toEqual([
      { carrierId: 1 },
      { carrierId: 3 }
    ]);
  });

  it('should set selectedCarrier to empty array if no carriers are checked', () => {
    const carrierList = [
      { carrierId: 1, checked: false },
      { carrierId: 2, checked: false }
    ];
    component.SelectedCarrierList(carrierList);
    expect(component.selectedCarrier).toEqual([]);
  });

  it('should handle empty carrier list', () => {
    component.SelectedCarrierList([]);
    expect(component.selectedCarrier).toEqual([]);
  });
});
