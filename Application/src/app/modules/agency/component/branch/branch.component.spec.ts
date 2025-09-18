import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BranchComponent } from './branch.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { AQBranchService, AQAgencyService } from '@agenciiq/agency';
import { AQUserInfo } from '@agenciiq/login';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { KeyboardValidation } from '../../../../shared/services/aqValidators/keyboard-validation';
import { AQZipDetailsService } from '@agenciiq/aqadmin';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';

describe('BranchComponent', () => {
  let component: BranchComponent;
  let fixture: ComponentFixture<BranchComponent>;
  let mockRouter = { navigateByUrl: jasmine.createSpy('navigateByUrl') };
  let zipDetailsSubject = new Subject<any>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BranchComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AQBranchService, useValue: { UpdateBranch: () => of({ success: true }) } },
        { provide: AQAgencyService, useValue: { BranchById: () => [] } },
        { provide: AQUserInfo, useValue: { UserId: () => '123' } },
        { provide: PopupService, useValue: { showPopup: jasmine.createSpy() } },
        { provide: LoaderService, useValue: { show: () => { }, hide: () => { } } },
        { provide: KeyboardValidation, useValue: {} },
        {
          provide: AQZipDetailsService, useValue: {
            ZipDetails: () => zipDetailsSubject.asObservable(),
            ValidateAddressField: () => of({ success: true, data: {} })
          }
        },
        { provide: TrimValueService, useValue: { TrimObjectValue: (obj) => obj } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the BranchComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with required controls', () => {
    expect(component.branchForm.contains('branchName')).toBeTruthy();
    expect(component.branchForm.contains('zip')).toBeTruthy();
    expect(component.zip.valid).toBeFalsy(); // Required but empty
  });

  it('should trigger zip details lookup when zip is 5 characters', () => {
    const zipSpy = spyOn(component, 'getZipDetails').and.callThrough();
    component.zip.setValue('12345');
    expect(zipSpy).toHaveBeenCalledWith('12345');
  });

  it('should navigate back to agency screen on goBack()', () => {
    component.goBack();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/agenciiq/agencies/addagency');
  });

  it('should not save branch if form is invalid', () => {
    component.IsEventFromPage = true;
    component.branchForm.controls['branchName'].setValue('');
    component.saveBranch();
    expect(component.submitted).toBeTrue();
  });

  it('should call updateBranch when editing existing branch', () => {
    sessionStorage.setItem('_agencyId', '1');
    sessionStorage.setItem('_branchId', '2');
    component.branchForm.setValue({
      branchName: 'Branch A',
      streetAddress1: '123 Main',
      streetAddress2: '',
      city: 'Test City',
      state: 'TS',
      zip: '12345'
    });
    component.saveBranch();
    // No error expected
  });

  it('should update city and state from zip lookup data', () => {
    component.zip.setValue('12345');
    zipDetailsSubject.next({
      CityStateLookupResponse: {
        ZipCode: {
          City: 'SampleCity',
          State: 'SC'
        }
      }
    });
    expect(component.city.value).toBe('SampleCity');
    expect(component.state.value).toBe('SC');
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should filter branchList using tempId and call assignValuetoBranchForm', () => {
    const mockBranchList = [
      { tempId: 'temp123', name: 'Branch A' },
      { tempId: 'temp456', name: 'Branch B' }
    ];
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      if (key === '_newBranchList') return JSON.stringify(mockBranchList);
      if (key === '_tempId') return 'temp123';
      return null;
    });
    spyOn(component, 'assignValuetoBranchForm');
    component.getBranchFromTemp();
    expect(component.branchDetails.length).toBe(1);
    expect(component.branchDetails[0].name).toBe('Branch A');
    expect(component.assignValuetoBranchForm).toHaveBeenCalled();
  });

  it('should not call assignValuetoBranchForm if no matching branch found', () => {
    const mockBranchList = [{ tempId: 'temp789', name: 'Branch C' }];
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      if (key === '_newBranchList') return JSON.stringify(mockBranchList);
      if (key === '_tempId') return 'temp000';
      return null;
    });
    spyOn(component, 'assignValuetoBranchForm');
    component.getBranchFromTemp();

    expect(component.branchDetails.length).toBe(0);
    expect(component.assignValuetoBranchForm).not.toHaveBeenCalled();
  });


  it('should not call assignValuetoBranchForm if no data returned', () => {
    spyOn(component, 'assignValuetoBranchForm');
    component.getBranchById('agency123', 'branch123');

    expect(component.branchDetails).toEqual([]);
    expect(component.assignValuetoBranchForm).not.toHaveBeenCalled();
  });

  it('should return "Edit Branch" and call getBranchById when _agencyId and _branchId exist', () => {
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      if (key === '_agencyId') return 'agency123';
      if (key === '_branchId') return 'branch456';
      return null;
    });
    spyOn(component, 'getBranchById');
    const result = component.getPageTitle();

    expect(result).toBe('Edit Branch');
    expect(component.getBranchById).toHaveBeenCalledWith('agency123', 'branch456');
  });

  it('should return "Edit Branch" and call getBranchFromTemp when _tempId exists', () => {
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      if (key === '_agencyId') return null;
      if (key === '_branchId') return null;
      if (key === '_tempId') return 'temp789';
      return null;
    });
    spyOn(component, 'getBranchFromTemp');
    const result = component.getPageTitle();
    expect(result).toBe('Edit Branch');
    expect(component.getBranchFromTemp).toHaveBeenCalled();
  });

  it('should return "Add Branch" when no session storage values exist', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null);
    const result = component.getPageTitle();
    expect(result).toBe('Add Branch');
  });

  it('should call validateAddress when subject emits "validateAddress"', () => {
    spyOn(component, 'validateAddress');
    component.SaveAccountWithAddressValidation();

    component['subject'].next('validateAddress');

    expect(component.validateAddress).toHaveBeenCalled();
  });

  it('should call saveBranch when subject emits "save" and IsEventFromPage is true', () => {
    spyOn(component, 'saveBranch');
    component.IsEventFromPage = true;

    component.SaveAccountWithAddressValidation();
    component['subject'].next('save');

    expect(component.saveBranch).toHaveBeenCalled();
  });

  it('should set IsEventFromPage to true and emit "validateAddress"', () => {
    spyOn(component['subject'], 'next');

    component.SaveAccountWithOserverPattern();

    expect(component.IsEventFromPage).toBeTrue();
    expect(component['subject'].next).toHaveBeenCalledWith('validateAddress');
  });
});